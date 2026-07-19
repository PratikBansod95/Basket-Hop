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
const hoopPatrols = new WeakMap<Hoop, HoopPatrolState>();

interface HoopPatrolState {
  amplitude: number;
  frequencyHz: number;
  phase: number;
  offset: number;
  settleRemaining: number;
}

export interface HoopMotion {
  deltaY: number;
  velocityY: number;
}

function patrolForScore(score: number): Pick<HoopPatrolState, 'amplitude' | 'frequencyHz'> {
  if (score >= 60) return { amplitude: 42, frequencyHz: 0.18 };
  if (score >= 30) return { amplitude: 30, frequencyHz: 0.14 };
  if (score >= 15) return { amplitude: 18, frequencyHz: 0.1 };
  return { amplitude: 0, frequencyHz: 0 };
}

function resetPatrol(hoop: Hoop, score: number): void {
  const tuning = patrolForScore(score);
  hoopPatrols.set(hoop, {
    ...tuning,
    phase: 0,
    offset: 0,
    settleRemaining: tuning.amplitude > 0 ? 0.65 : 0,
  });
}

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
  resetPatrol(hoop, 0);
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
  const patrol = random ? patrolForScore(score) : { amplitude: 0, frequencyHz: 0 };
  const placementMin = tier.minY + patrol.amplitude + (patrol.amplitude > 0 ? 16 : 0);
  const placementMax = tier.maxY - patrol.amplitude - (patrol.amplitude > 0 ? 16 : 0);
  const sampledScreenY = random
    ? placementMin +
      Math.max(0, Math.min(1, random())) * (placementMax - placementMin)
    : HOOP_SCREEN_Y;
  const nextScreenY = random
    ? Math.round(
        Math.max(
          placementMin,
          Math.min(
            placementMax,
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
  resetPatrol(hoop, random ? score : 0);
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
  const offset = hoopPatrols.get(hoop)?.offset ?? 0;
  const y = (hoopScreenHeights.get(hoop) ?? HOOP_SCREEN_Y) + offset - climbOffset;
  hoop.y = y;
  hoop.targetY = y;
}

/** Advance solo-only patrol after slide/camera transitions settle. */
export function updateHoopPatrol(
  hoop: Hoop,
  dt: number,
  climbOffset: number,
  canMove: boolean,
): HoopMotion {
  const patrol = hoopPatrols.get(hoop);
  if (!patrol || patrol.amplitude <= 0 || hoop.animating || !canMove || dt <= 0) {
    return { deltaY: 0, velocityY: 0 };
  }

  if (patrol.settleRemaining > 0) {
    patrol.settleRemaining = Math.max(0, patrol.settleRemaining - dt);
    return { deltaY: 0, velocityY: 0 };
  }

  const previousY = hoop.y;
  const tier = tierForScore(
    patrol.amplitude >= 42 ? 60 : patrol.amplitude >= 30 ? 30 : 15,
  );
  const baseScreenY = hoopScreenHeights.get(hoop) ?? HOOP_SCREEN_Y;
  const maxAmplitude = Math.max(
    0,
    Math.min(baseScreenY - tier.minY - 16, tier.maxY - baseScreenY - 16),
  );
  const amplitude = Math.min(patrol.amplitude, maxAmplitude);

  patrol.phase += dt * Math.PI * 2 * patrol.frequencyHz;
  patrol.offset = Math.sin(patrol.phase) * amplitude;
  hoop.y = baseScreenY + patrol.offset - climbOffset;
  hoop.targetY = hoop.y;

  const deltaY = hoop.y - previousY;
  return { deltaY, velocityY: deltaY / dt };
}

export function isHoopPatrolling(hoop: Hoop): boolean {
  return (hoopPatrols.get(hoop)?.amplitude ?? 0) > 0;
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
