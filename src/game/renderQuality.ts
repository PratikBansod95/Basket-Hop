/**
 * Adaptive render quality for phones (fill-rate + particle cost).
 * Prefer fewer canvas effects over dropping simulation rate.
 *
 * Phones start on `medium` (light trails + aura). Auto-downgrade to `low`
 * if frames stay unhealthy; promote back when healthy.
 */

export type RenderQuality = 'high' | 'medium' | 'low';

let cached: RenderQuality | null = null;
let frameEmaMs = 16.7;
let healthyFrames = 0;
let stressedFrames = 0;

function detectBaseQuality(): RenderQuality {
  if (typeof window === 'undefined') return 'high';

  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const narrow = Math.min(window.innerWidth, window.innerHeight) < 520;

  // Touch / phone-class: start medium so trails + aura stay visible.
  if (coarse || narrow) {
    if (mem !== undefined && mem <= 2) return 'low';
    return 'medium';
  }

  if (mem !== undefined && mem <= 2) return 'low';
  if (dpr >= 3 && cores <= 6) return 'medium';
  return 'high';
}

export function getRenderQuality(): RenderQuality {
  if (!cached) cached = detectBaseQuality();
  return cached;
}

/** Feed display-frame duration so quality can adapt at runtime. */
export function noteFrameTime(dtMs: number): void {
  if (!Number.isFinite(dtMs) || dtMs <= 0) return;
  const sample = Math.min(dtMs, 50);
  frameEmaMs = frameEmaMs * 0.9 + sample * 0.1;

  const q = getRenderQuality();
  if (frameEmaMs > 22) {
    stressedFrames += 1;
    healthyFrames = 0;
    if (stressedFrames > 18 && q !== 'low') {
      cached = 'low';
      stressedFrames = 0;
    }
  } else if (frameEmaMs < 15) {
    healthyFrames += 1;
    stressedFrames = 0;
    // Promote low → medium on sustained good frames (never auto-jump to high).
    if (healthyFrames > 90 && q === 'low' && detectBaseQuality() !== 'low') {
      cached = 'medium';
      healthyFrames = 0;
    }
  } else {
    healthyFrames = 0;
    stressedFrames = 0;
  }
}

export function trailMaxForQuality(q: RenderQuality = getRenderQuality()): number {
  if (q === 'low') return 3;
  if (q === 'medium') return 6;
  return 8;
}

export function fxStrengthForQuality(q: RenderQuality = getRenderQuality()): number {
  if (q === 'low') return 0.4;
  if (q === 'medium') return 0.7;
  return 1;
}

export function allowOverlayFx(q: RenderQuality = getRenderQuality()): boolean {
  return q === 'medium' || q === 'high';
}

export function allowOrbitFx(q: RenderQuality = getRenderQuality()): boolean {
  return q === 'high';
}

export function allowTrailGlow(q: RenderQuality = getRenderQuality()): boolean {
  return q === 'high';
}

export function allowSkyAccents(q: RenderQuality = getRenderQuality()): boolean {
  return q === 'high';
}

export function allowDangerZoneExtras(q: RenderQuality = getRenderQuality()): boolean {
  return q !== 'low';
}

export function shakeScaleForQuality(q: RenderQuality = getRenderQuality()): number {
  if (q === 'low') return 0.35;
  if (q === 'medium') return 0.65;
  return 1;
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
  if (q === 'low') return Math.min(raw, 1.5);
  if (q === 'medium') return Math.min(raw, 1.85);
  return Math.min(raw, 2.25);
}
