import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../game/constants';
import { cappedDevicePixelRatio } from '../game/renderQuality';

export interface SafeInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface StageLayout {
  /** Scale factor from design canvas (720×1280) to on-screen stage CSS pixels. */
  scale: number;
  width: number;
  height: number;
  dpr: number;
  viewWidth: number;
  viewHeight: number;
  safe: SafeInsets;
}

const DESIGN_WIDTH = CANVAS_WIDTH;
const DESIGN_HEIGHT = CANVAS_HEIGHT;

/** Cap DPR to keep fill-rate reasonable on high-density phones. */
export function getDevicePixelRatio(): number {
  return cappedDevicePixelRatio();
}

export function readSafeInsets(): SafeInsets {
  const style = getComputedStyle(document.documentElement);
  const num = (prop: string) => {
    const raw = style.getPropertyValue(prop).trim();
    const v = Number.parseFloat(raw);
    return Number.isFinite(v) ? v : 0;
  };
  // Prefer CSS env() resolved on :root via custom props we set, else 0.
  return {
    top: num('--sat') || 0,
    right: num('--sar') || 0,
    bottom: num('--sab') || 0,
    left: num('--sal') || 0,
  };
}

/**
 * Publish safe-area env values onto :root so JS can read them.
 * Call once at boot (and after orientation change).
 */
export function syncSafeAreaCssVars(root: HTMLElement = document.documentElement): void {
  root.style.setProperty('--sat', 'env(safe-area-inset-top, 0px)');
  root.style.setProperty('--sar', 'env(safe-area-inset-right, 0px)');
  root.style.setProperty('--sab', 'env(safe-area-inset-bottom, 0px)');
  root.style.setProperty('--sal', 'env(safe-area-inset-left, 0px)');
}

/** Usable viewport — accounts for mobile browser chrome via visualViewport. */
export function getViewportSize(): { width: number; height: number } {
  const vv = window.visualViewport;
  if (vv) {
    return { width: vv.width, height: vv.height };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}

/**
 * Fit the full game canvas inside the safe viewport (contain).
 * Preserves 9:16 aspect; letterboxes empty space in #app.
 */
export function computeStageLayout(
  viewWidth: number,
  viewHeight: number,
  safe: SafeInsets = { top: 0, right: 0, bottom: 0, left: 0 },
): StageLayout {
  const padX = safe.left + safe.right;
  const padY = safe.top + safe.bottom;
  const availW = Math.max(1, viewWidth - padX);
  const availH = Math.max(1, viewHeight - padY);
  const dpr = getDevicePixelRatio();
  const scale = Math.min(availW / DESIGN_WIDTH, availH / DESIGN_HEIGHT);

  return {
    scale,
    width: DESIGN_WIDTH * scale,
    height: DESIGN_HEIGHT * scale,
    dpr,
    viewWidth,
    viewHeight,
    safe,
  };
}

export function layoutsEqual(a: StageLayout | null, b: StageLayout): boolean {
  if (!a) return false;
  return (
    Math.abs(a.width - b.width) < 0.5 &&
    Math.abs(a.height - b.height) < 0.5 &&
    Math.abs(a.dpr - b.dpr) < 0.01
  );
}

/**
 * Stage-relative UI scale (1 = design size on a tall phone).
 * Used by CSS custom properties for touch targets / type.
 */
export function computeUiScale(layout: StageLayout): number {
  return Math.max(0.62, Math.min(1.35, layout.scale));
}

/** Apply responsive CSS variables on the stage (and optionally app). */
export function applyResponsiveCssVars(
  stage: HTMLElement,
  layout: StageLayout,
  app?: HTMLElement | null,
): void {
  const ui = computeUiScale(layout);
  stage.style.setProperty('--stage-scale', String(layout.scale));
  stage.style.setProperty('--ui-scale', String(ui));
  stage.style.setProperty('--touch-min', `${Math.round(44 * ui)}px`);
  stage.style.setProperty('--stage-w', `${layout.width}px`);
  stage.style.setProperty('--stage-h', `${layout.height}px`);
  // Design-space helpers: 1% of design width/height mapped to CSS px on stage
  stage.style.setProperty('--dw', `${layout.width / 100}px`);
  stage.style.setProperty('--dh', `${layout.height / 100}px`);

  if (app) {
    app.style.setProperty('--stage-scale', String(layout.scale));
    app.style.setProperty('--ui-scale', String(ui));
    app.style.setProperty('--touch-min', `${Math.round(44 * ui)}px`);
  }
}

export function bindStageResize(onResize: () => void): () => void {
  let raf = 0;
  const schedule = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      onResize();
    });
  };

  window.addEventListener('resize', schedule);
  window.addEventListener('orientationchange', schedule);
  // Size changes only — ignore visualViewport scroll (browser chrome jitter).
  window.visualViewport?.addEventListener('resize', schedule);

  return () => {
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener('resize', schedule);
    window.removeEventListener('orientationchange', schedule);
    window.visualViewport?.removeEventListener('resize', schedule);
  };
}
