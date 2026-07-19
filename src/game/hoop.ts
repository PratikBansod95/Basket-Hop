import {
  CANVAS_WIDTH,
  hoopWorldY,
  HOOP_LEFT_X,
  HOOP_RIGHT_X,
  HOOP_SCREEN_Y,
  HOOP_SLIDE_DURATION,
} from './constants';
import { hoopXForSide } from './collision';
import { DIFFICULTY_TIERS, tierForScore } from './palette';
import type { Hoop, HoopSide } from './types';

export const HOOP_MIN_SCREEN_Y = DIFFICULTY_TIERS.at(-1)!.minY;
export const HOOP_MAX_SCREEN_Y = DIFFICULTY_TIERS.at(-1)!.maxY;
const MAX_HEIGHT_CHANGE = 340;
const hoopScreenHeights = new WeakMap<Hoop, number>();

export function createHoop(side: HoopSide = 'right', climbOffset: number): Hoop {
  const y = hoopWorldY(climbOffset);
  const x = hoopXForSide(side);
  const hoop: Hoop = {
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
  hoopScreenHeights.set(hoop, HOOP_SCREEN_Y);
  return hoop;
}

export function flipHoopSide(side: HoopSide): HoopSide {
  return side === 'left' ? 'right' : 'left';
}

/** Next basket: opposite side with progressively broader, reachable heights. */
export function onBasket(
  hoop: Hoop,
  climbOffset: number,
  score = 0,
  random?: () => number,
): void {
  const newSide = flipHoopSide(hoop.side);
  const previousScreenY = hoopScreenHeights.get(hoop) ?? HOOP_SCREEN_Y;
  const tier = tierForScore(score);
  const sampledScreenY = random
    ? tier.minY + Math.max(0, Math.min(1, random())) * (tier.maxY - tier.minY)
    : HOOP_SCREEN_Y;
  const nextScreenY = random
    ? Math.round(
        Math.max(
          tier.minY,
          Math.min(
            tier.maxY,
            Math.max(
              previousScreenY - MAX_HEIGHT_CHANGE,
              Math.min(previousScreenY + MAX_HEIGHT_CHANGE, sampledScreenY),
            ),
          ),
        ),
      )
    : HOOP_SCREEN_Y;
  const newY = nextScreenY - climbOffset;
  const newX = newSide === 'left' ? HOOP_LEFT_X : HOOP_RIGHT_X;

  hoopScreenHeights.set(hoop, nextScreenY);
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
  const y = (hoopScreenHeights.get(hoop) ?? HOOP_SCREEN_Y) - climbOffset;
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
