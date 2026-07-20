/**
 * Adaptive render quality for phones (fill-rate + particle cost).
 * Prefer fewer canvas effects over dropping simulation rate.
 *
 * Phones start on `low` for smooth motion. Promote to `medium` only when
 * frames stay healthy. Quality changes notify listeners so DPR can retarget.
 */

export type RenderQuality = 'high' | 'medium' | 'low';

let cached: RenderQuality | null = null;
let controller: AdaptiveQualityController | null = null;
let qualityFrozen = false;
const qualityListeners = new Set<(q: RenderQuality) => void>();

function isTouchClassDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const narrow = Math.min(window.innerWidth, window.innerHeight) < 520;
  return coarse || narrow;
}

export interface RenderDiagnostics {
  quality: RenderQuality;
  frameEmaMs: number;
  p95FrameMs: number;
  refreshIntervalMs: number;
  droppedFrameRatio: number;
  transitions: number;
}

export class AdaptiveQualityController {
  quality: RenderQuality;
  frameEmaMs = 16.7;
  refreshIntervalMs = 16.7;
  droppedFrameRatio = 0;
  transitions = 0;
  private frameSamples: number[] = [];
  private healthyMs = 0;
  private stressedMs = 0;
  private cooldownMs = 0;
  private fasterRefreshMs = 0;

  constructor(initial: RenderQuality) {
    this.quality = initial;
  }

  noteFrame(dtMs: number): RenderQuality {
    if (!Number.isFinite(dtMs) || dtMs <= 0) return this.quality;
    const sample = Math.min(dtMs, 50);
    this.frameSamples.push(sample);
    if (this.frameSamples.length > 180) this.frameSamples.shift();
    this.frameEmaMs = this.frameEmaMs * 0.9 + sample * 0.1;

    if (sample >= 4 && sample < this.refreshIntervalMs * 0.8) {
      this.fasterRefreshMs += sample;
      if (this.fasterRefreshMs >= 500) {
        this.refreshIntervalMs =
          this.refreshIntervalMs * 0.88 + sample * 0.12;
      }
    } else {
      this.fasterRefreshMs = 0;
      if (
        sample >= this.refreshIntervalMs * 0.8 &&
        sample <= this.refreshIntervalMs * 1.2
      ) {
        this.refreshIntervalMs =
          this.refreshIntervalMs * 0.98 + sample * 0.02;
      }
    }
    const dropped = sample > this.refreshIntervalMs * 1.5 ? 1 : 0;
    this.droppedFrameRatio = this.droppedFrameRatio * 0.96 + dropped * 0.04;
    this.cooldownMs = Math.max(0, this.cooldownMs - sample);

    const healthyLimit = this.refreshIntervalMs * 1.14;
    const stressedLimit = this.refreshIntervalMs * 1.3;
    if (this.frameEmaMs > stressedLimit) {
      this.stressedMs += sample;
      this.healthyMs = 0;
      const severe =
        this.frameEmaMs > this.refreshIntervalMs * 1.7 &&
        this.droppedFrameRatio > 0.35;
      if (
        this.stressedMs >= (severe ? 500 : 1200) &&
        this.quality !== 'low' &&
        (this.cooldownMs === 0 || severe)
      ) {
        this.changeQuality('low', 5000);
      }
    } else if (this.frameEmaMs <= healthyLimit && this.droppedFrameRatio < 0.08) {
      this.healthyMs += sample;
      this.stressedMs = 0;
      if (
        this.healthyMs >= 4000 &&
        this.quality === 'low' &&
        this.cooldownMs === 0 &&
        !qualityFrozen &&
        !isTouchClassDevice()
      ) {
        this.changeQuality('medium', 3000);
      }
    } else {
      this.healthyMs = 0;
      this.stressedMs = 0;
    }
    return this.quality;
  }

  get p95FrameMs(): number {
    if (this.frameSamples.length === 0) return this.frameEmaMs;
    const sorted = [...this.frameSamples].sort((a, b) => a - b);
    return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))];
  }

  private changeQuality(next: RenderQuality, cooldownMs: number): void {
    this.quality = next;
    this.transitions += 1;
    this.healthyMs = 0;
    this.stressedMs = 0;
    this.cooldownMs = cooldownMs;
  }
}

function detectBaseQuality(): RenderQuality {
  if (typeof window === 'undefined') return 'high';

  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const narrow = Math.min(window.innerWidth, window.innerHeight) < 520;

  // Touch / phone-class: start low so fill-rate stays under control.
  if (coarse || narrow) {
    return 'low';
  }

  if (mem !== undefined && mem <= 2) return 'low';
  if (dpr >= 3 && cores <= 6) return 'medium';
  return 'high';
}

function setQuality(next: RenderQuality): void {
  if (cached === next) return;
  if (qualityFrozen && cached !== null && next !== 'low') return;
  cached = next;
  if (controller) controller.quality = next;
  for (const listener of qualityListeners) listener(next);
}

/** Lock quality while a run is active so canvas DPR does not resize mid-game. */
export function freezeRenderQuality(frozen: boolean): void {
  qualityFrozen = frozen;
}

export function getRenderQuality(): RenderQuality {
  if (!cached) {
    cached = detectBaseQuality();
    controller = new AdaptiveQualityController(cached);
  }
  return cached;
}

/** Re-apply canvas DPR / layout when quality changes mid-run. */
export function onRenderQualityChange(listener: (q: RenderQuality) => void): () => void {
  qualityListeners.add(listener);
  return () => qualityListeners.delete(listener);
}

/** Feed display-frame duration so quality can adapt at runtime. */
export function noteFrameTime(dtMs: number): void {
  getRenderQuality();
  if (qualityFrozen) return;
  const next = controller!.noteFrame(dtMs);
  setQuality(next);
}

export function getRenderDiagnostics(): RenderDiagnostics {
  const quality = getRenderQuality();
  return {
    quality,
    frameEmaMs: controller?.frameEmaMs ?? 16.7,
    p95FrameMs: controller?.p95FrameMs ?? 16.7,
    refreshIntervalMs: controller?.refreshIntervalMs ?? 16.7,
    droppedFrameRatio: controller?.droppedFrameRatio ?? 0,
    transitions: controller?.transitions ?? 0,
  };
}

export function fxStrengthForQuality(q: RenderQuality = getRenderQuality()): number {
  // Aura only above low — soft blobs are a major phone hitch source.
  if (q === 'low') return 0;
  if (q === 'medium') return 0.45;
  return 1;
}

export function allowAuraFx(q: RenderQuality = getRenderQuality()): boolean {
  return q !== 'low';
}

export function allowOverlayFx(q: RenderQuality = getRenderQuality()): boolean {
  return q === 'high';
}

export function allowOrbitFx(q: RenderQuality = getRenderQuality()): boolean {
  return q === 'high';
}

export function allowSkyAccents(q: RenderQuality = getRenderQuality()): boolean {
  return q === 'high';
}

export function allowSkyCrossfade(q: RenderQuality = getRenderQuality()): boolean {
  return q === 'high';
}

export function allowDangerZoneExtras(q: RenderQuality = getRenderQuality()): boolean {
  return q === 'high';
}

export function shakeScaleForQuality(q: RenderQuality = getRenderQuality()): number {
  if (q === 'low') return 0.15;
  if (q === 'medium') return 0.35;
  return 0.7;
}

/** Physics must stay independent of render quality. */
export function maxPhysicsStepsForFrame(rawDtSec: number): number {
  const needed = Math.ceil(clampPhysicsDt(rawDtSec) / (1 / 60));
  return Math.min(8, Math.max(4, needed + 1));
}

function clampPhysicsDt(dt: number): number {
  if (!Number.isFinite(dt) || dt < 0) return 0;
  return Math.min(dt, 0.1);
}

/** Cap DPR to protect fill-rate on high-density phones. */
export function targetCanvasScale(
  stageScale: number,
  rawDpr: number,
  quality: RenderQuality,
): number {
  const nativeScale = Math.max(1, stageScale * Math.max(1, rawDpr));
  if (quality === 'low') return Math.min(nativeScale, 1.22);
  if (quality === 'medium') return Math.min(nativeScale, 1.65);
  return Math.min(nativeScale, 2.25);
}

export function cappedDevicePixelRatio(stageScale = 1): number {
  if (typeof window === 'undefined') return 1;
  return targetCanvasScale(
    stageScale,
    window.devicePixelRatio || 1,
    getRenderQuality(),
  );
}
