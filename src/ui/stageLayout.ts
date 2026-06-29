import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../game/constants';

export interface StageLayout {
  scale: number;
  width: number;
  height: number;
  dpr: number;
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
 * Fit the full game canvas inside the viewport (contain).
 * Keeps the entire playable area visible on every screen size and orientation.
 */
export function computeStageLayout(viewWidth: number, viewHeight: number): StageLayout {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const scale = Math.min(viewWidth / CANVAS_WIDTH, viewHeight / CANVAS_HEIGHT);
  return {
    scale,
    width: CANVAS_WIDTH * scale,
    height: CANVAS_HEIGHT * scale,
    dpr,
  };
}

export function bindStageResize(onResize: () => void): () => void {
  const handler = () => onResize();
  window.addEventListener('resize', handler);
  window.addEventListener('orientationchange', handler);
  window.visualViewport?.addEventListener('resize', handler);
  window.visualViewport?.addEventListener('scroll', handler);
  return () => {
    window.removeEventListener('resize', handler);
    window.removeEventListener('orientationchange', handler);
    window.visualViewport?.removeEventListener('resize', handler);
    window.visualViewport?.removeEventListener('scroll', handler);
  };
}
