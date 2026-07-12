/**
 * Adaptive render quality for phones (fill-rate + particle cost).
 * Prefer fewer canvas effects over dropping simulation rate.
 */

export type RenderQuality = 'high' | 'medium' | 'low';

let cached: RenderQuality | null = null;

export function getRenderQuality(): RenderQuality {
  if (cached) return cached;

  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const narrow = Math.min(window.innerWidth, window.innerHeight) < 480;

  if (mem !== undefined && mem <= 2) {
    cached = 'low';
  } else if (coarse && (dpr >= 2.5 || cores <= 4 || narrow || (mem !== undefined && mem <= 4))) {
    cached = 'medium';
  } else if (dpr >= 3 && cores <= 6) {
    cached = 'medium';
  } else {
    cached = 'high';
  }

  return cached;
}

export function trailMaxForQuality(q: RenderQuality = getRenderQuality()): number {
  if (q === 'low') return 3;
  if (q === 'medium') return 5;
  return 8;
}

export function fxStrengthForQuality(q: RenderQuality = getRenderQuality()): number {
  if (q === 'low') return 0.45;
  if (q === 'medium') return 0.7;
  return 1;
}

/** Cap DPR to protect fill-rate on high-density phones. */
export function cappedDevicePixelRatio(): number {
  const q = getRenderQuality();
  const raw = window.devicePixelRatio || 1;
  if (q === 'low') return Math.min(raw, 1.5);
  if (q === 'medium') return Math.min(raw, 2);
  return Math.min(raw, 2.5);
}
