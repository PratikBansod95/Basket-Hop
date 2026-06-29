import { CANVAS_WIDTH, hoopWorldY, HOOP_LEFT_X, HOOP_RIGHT_X, HOOP_SLIDE_DURATION } from './constants';
import { hoopXForSide } from './collision';
import type { Hoop, HoopSide } from './types';

export function createHoop(side: HoopSide = 'right', climbOffset: number): Hoop {
  const y = hoopWorldY(climbOffset);
  const x = hoopXForSide(side);
  return {
    side,
    x,
    y,
    targetX: x,
    targetY: y,
    slideFromX: x,
    slideFromY: y,
    slideT: 1,
    tilt: 0,
    tiltVel: 0,
    animating: false,
  };
}

export function flipHoopSide(side: HoopSide): HoopSide {
  return side === 'left' ? 'right' : 'left';
}

/** Next basket: opposite corner, fixed screen height via scroll. */
export function onBasket(hoop: Hoop, climbOffset: number): void {
  const newSide = flipHoopSide(hoop.side);
  const newY = hoopWorldY(climbOffset);
  const newX = newSide === 'left' ? HOOP_LEFT_X : HOOP_RIGHT_X;

  hoop.side = newSide;
  hoop.targetX = newX;
  hoop.targetY = newY;
  hoop.slideFromX = newSide === 'left' ? -150 : CANVAS_WIDTH + 150;
  hoop.slideFromY = newY;
  hoop.x = hoop.slideFromX;
  hoop.y = newY;
  hoop.slideT = 0;
  hoop.animating = true;
  hoop.tilt = 0;
  hoop.tiltVel = 0;
}

/** Keep hoop locked to screen height as camera scrolls. */
export function syncHoopToCamera(hoop: Hoop, climbOffset: number): void {
  if (hoop.animating) return;
  const y = hoopWorldY(climbOffset);
  hoop.y = y;
  hoop.targetY = y;
}

export function updateHoop(hoop: Hoop, dt: number): void {
  if (!hoop.animating) return;

  hoop.slideT = Math.min(1, hoop.slideT + dt / HOOP_SLIDE_DURATION);
  const t = easeOutCubic(hoop.slideT);
  hoop.x = hoop.slideFromX + (hoop.targetX - hoop.slideFromX) * t;
  hoop.y = hoop.slideFromY + (hoop.targetY - hoop.slideFromY) * t;

  if (hoop.slideT >= 1) {
    hoop.animating = false;
    hoop.x = hoop.targetX;
    hoop.y = hoop.targetY;
  }
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
