/**
 * Adaptive render quality for phones (fill-rate + particle cost).
 * Prefer fewer canvas effects over dropping simulation rate.
 *
 * Phones start on `low` for smooth motion. Promote to `medium` only when
 * frames stay healthy. Quality changes notify listeners so DPR can retarget.
 */

export type RenderQuality = 'high' | 'medium' | 'low';

let cached: RenderQuality | null = null;
let frameEmaMs = 16.7;
let healthyFrames = 0;
let stressedFrames = 0;
const qualityListeners = new Set<(q: RenderQuality) => void>();

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
  cached = next;
  for (const listener of qualityListeners) listener(next);
}

export function getRenderQuality(): RenderQuality {
  if (!cached) cached = detectBaseQuality();
  return cached;
}

/** Re-apply canvas DPR / layout when quality changes mid-run. */
export function onRenderQualityChange(listener: (q: RenderQuality) => void): () => void {
  qualityListeners.add(listener);
  return () => qualityListeners.delete(listener);
}

/** Feed display-frame duration so quality can adapt at runtime. */
export function noteFrameTime(dtMs: number): void {
  if (!Number.isFinite(dtMs) || dtMs <= 0) return;
  const sample = Math.min(dtMs, 50);
  frameEmaMs = frameEmaMs * 0.9 + sample * 0.1;

  const q = getRenderQuality();
  if (frameEmaMs > 20) {
    stressedFrames += 1;
    healthyFrames = 0;
    if (stressedFrames > 12 && q !== 'low') {
      setQuality('low');
      stressedFrames = 0;
    }
  } else if (frameEmaMs < 14.5) {
    healthyFrames += 1;
    stressedFrames = 0;
    // Promote low → medium on sustained good frames (never auto-jump to high on phones).
    if (healthyFrames > 120 && q === 'low') {
      setQuality('medium');
      healthyFrames = 0;
    }
  } else {
    healthyFrames = 0;
    stressedFrames = 0;
  }
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

export function maxPhysicsStepsForQuality(q: RenderQuality = getRenderQuality()): number {
  if (q === 'low') return 3;
  if (q === 'medium') return 4;
  return 5;
}

/** Cap DPR to protect fill-rate on high-density phones. */
export function cappedDevicePixelRatio(): number {
  if (typeof window === 'undefined') return 1;
  const q = getRenderQuality();
  const raw = window.devicePixelRatio || 1;
  // 1.35 was visibly under-resolved on common 2.5–3× phone displays,
  // especially around the rotating ball's clipped edge.
  if (q === 'low') return Math.min(raw, 1.5);
  if (q === 'medium') return Math.min(raw, 1.85);
  return Math.min(raw, 2.25);
}
