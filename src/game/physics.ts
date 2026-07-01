import {
  BOUNCE_COEF,
  CANVAS_WIDTH,
  FLOOR_FRICTION,
  FLOOR_Y,
  GRAVITY,
  AIR_DRAG,
  MIN_H_SPEED,
  RIM_TILT_DAMPING,
  RIM_TILT_MAX,
  RIM_TILT_SPRING,
} from './constants';
import {
  type ColliderKey,
  type HoopColliders,
  resolveColliderHit,
  updateColliders,
} from './collision';
import { debugLog } from './debug';
import type { Ball, Hoop } from './types';

export function clampDt(dt: number, max = 0.1): number {
  return Math.min(dt, max);
}

export function integrateBall(
  ball: Ball,
  hoop: Hoop,
  colliders: HoopColliders,
  dt: number,
  onRimHit: () => void,
  onBounce: () => void,
  useFloor: boolean,
): void {
  ball.frameStartX = ball.x;
  ball.frameStartY = ball.y;
  ball.frameStartVelY = ball.vy;

  ball.vy += GRAVITY * dt;
  const drag = Math.pow(1 - AIR_DRAG, dt);
  ball.vx *= drag;
  ball.vy *= drag;

  if (useFloor && ball.y + ball.radius >= FLOOR_Y - 5) {
    ball.vx *= Math.pow(1 - FLOOR_FRICTION, dt);
  }

  if (Math.abs(ball.vx) > 10 && Math.abs(ball.vx) < MIN_H_SPEED) {
    ball.vx = ball.vx > 0 ? MIN_H_SPEED : -MIN_H_SPEED;
  }

  if (Math.abs(ball.vx) > 0.01) {
    ball.rotation += (ball.vx / ball.radius) * dt;
  }

  updateColliders(colliders, hoop.x, hoop.y, hoop.side);

  const speed = Math.hypot(ball.vx, ball.vy);
  const maxStep = ball.radius * 0.35;
  const steps = Math.max(1, Math.ceil((speed * dt) / maxStep));
  const stepDt = dt / steps;

  for (let i = 0; i < steps; i++) {
    const px = ball.x;
    const py = ball.y;
    ball.x += ball.vx * stepDt;
    ball.y += ball.vy * stepDt;

    resolveHoopHits(ball, px, py, colliders, hoop, onRimHit, onBounce);

    if (ball.x + ball.radius < 0) ball.x = CANVAS_WIDTH + ball.radius;
    if (ball.x - ball.radius > CANVAS_WIDTH) ball.x = -ball.radius;

    if (useFloor) {
      const prevBottom = py + ball.radius;
      const currBottom = ball.y + ball.radius;
      if (prevBottom < FLOOR_Y && currBottom >= FLOOR_Y) {
        const t = (FLOOR_Y - prevBottom) / (currBottom - prevBottom);
        ball.x = px + (ball.x - px) * t;
        ball.y = FLOOR_Y - ball.radius - 0.1;
        const impact = Math.abs(ball.vy);
        ball.vy = -Math.abs(ball.vy) * BOUNCE_COEF;
        if (impact > 150) onBounce();
      } else if (ball.y + ball.radius > FLOOR_Y && ball.vy > 0) {
        ball.y = FLOOR_Y - ball.radius;
        const impact = ball.vy;
        ball.vy = -ball.vy * BOUNCE_COEF;
        if (impact > 150) onBounce();
      }
    }
  }

  hoop.tiltVel += -hoop.tilt * RIM_TILT_SPRING;
  hoop.tiltVel *= RIM_TILT_DAMPING;
  hoop.tilt += hoop.tiltVel;
  hoop.tilt = Math.max(0, Math.min(RIM_TILT_MAX, hoop.tilt));
  if (hoop.tilt < 0.003 && Math.abs(hoop.tiltVel) < 0.003) {
    hoop.tilt = 0;
    hoop.tiltVel = 0;
  }
}

function resolveHoopHits(
  ball: Ball,
  px: number,
  py: number,
  colliders: HoopColliders,
  hoop: Hoop,
  onRimHit: () => void,
  onBounce: () => void,
): void {
  // After a score the ball falls through the rim, but the backboard must still bounce bank shots.
  const keys: ColliderKey[] = ball.fallingThrough
    ? ['backboard']
    : ['backboard', 'rimLeft', 'rimRight', 'corner'];
  for (const key of keys) {
    const hit = resolveColliderHit(px, py, ball.x, ball.y, ball.radius, colliders, key);
    if (!hit) continue;

    debugLog('hit', key, ball.fallingThrough ? '(fall-through)' : '', {
      face: hit.face,
      x: ball.x.toFixed(0),
      y: ball.y.toFixed(0),
    });

    ball.x = hit.x;
    ball.y = hit.y;

    if (key === 'rimLeft' || key === 'rimRight') {
      if (hit.face === 'top') {
        ball.vy = -Math.abs(ball.vy) * BOUNCE_COEF;
        ball.vx *= 0.9;
        if (Math.abs(ball.vx) < 100) {
          ball.vx = colliders.hoopSide === 'right' ? -100 : 100;
        }
        hoop.tiltVel += 0.05;
      } else if (hit.face === 'bottom') {
        ball.vy = Math.abs(ball.vy) * BOUNCE_COEF;
        hoop.tiltVel -= 0.03;
      } else {
        ball.vx = -ball.vx * BOUNCE_COEF;
        if (Math.abs(ball.vx) < 100) ball.vx = hit.normalX * 100;
        hoop.tiltVel += 0.03;
      }
      ball.hitRimThisShot = true;
      onRimHit();
    } else if (key === 'backboard') {
      if (hit.normalX !== 0) ball.vx = -ball.vx * BOUNCE_COEF;
      if (hit.normalY !== 0) ball.vy = -ball.vy * BOUNCE_COEF;
    } else {
      if (hit.normalX !== 0) ball.vx = -ball.vx * BOUNCE_COEF;
      if (hit.normalY !== 0) ball.vy = -ball.vy * BOUNCE_COEF;
      ball.hitRimThisShot = true;
    }
    onBounce();
  }
}
