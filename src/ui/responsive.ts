/**
 * Responsive helpers for stage-relative layout.
 * Prefer CSS `cqw`/`cqh` on `.canvas-stage` (container queries).
 * These JS helpers are for rare runtime measurements.
 */

import type { StageLayout } from './stageLayout';
import { computeUiScale } from './stageLayout';

export { computeStageLayout, computeUiScale, applyResponsiveCssVars, bindStageResize } from './stageLayout';
export type { StageLayout, SafeInsets } from './stageLayout';

/** Convert a design-canvas X (0–720) to CSS pixels on the current stage. */
export function designXToCss(x: number, layout: StageLayout): number {
  return (x / 720) * layout.width;
}

/** Convert a design-canvas Y (0–1280) to CSS pixels on the current stage. */
export function designYToCss(y: number, layout: StageLayout): number {
  return (y / 1280) * layout.height;
}

/** Fraction of stage width → CSS px. */
export function stagePctX(pct: number, layout: StageLayout): number {
  return (pct / 100) * layout.width;
}

/** Fraction of stage height → CSS px. */
export function stagePctY(pct: number, layout: StageLayout): number {
  return (pct / 100) * layout.height;
}

/** Minimum recommended touch target in CSS px for the current UI scale. */
export function minTouchTargetCss(layout: StageLayout): number {
  return Math.round(44 * computeUiScale(layout));
}

/** Clamp a CSS length for readable type on small stages. */
export function fluidTypeCss(minPx: number, preferredCqw: number, maxPx: number): string {
  return `clamp(${minPx}px, ${preferredCqw}cqw, ${maxPx}px)`;
}

/** Anchor a point inside the stage with optional inset from edges (0–1). */
export function anchorCss(
  x: number,
  y: number,
  layout: StageLayout,
  inset = { top: 0, right: 0, bottom: 0, left: 0 },
): { left: number; top: number } {
  const availW = Math.max(0, layout.width - inset.left - inset.right);
  const availH = Math.max(0, layout.height - inset.top - inset.bottom);
  return {
    left: inset.left + x * availW,
    top: inset.top + y * availH,
  };
}
