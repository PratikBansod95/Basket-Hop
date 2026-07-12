import { describe, expect, it } from 'vitest';
import { resolveBallBallCollision } from './ballBallCollision';
import { BALL_RADIUS } from './constants';
import type { Ball } from './types';

function makeBall(x: number, y: number, vx = 0, vy = 0): Ball {
  return {
    x,
    y,
    vx,
    vy,
    radius: BALL_RADIUS,
    hasLaunched: true,
    scoredThisShot: false,
    hitRimThisShot: false,
    fallingThrough: false,
    rotation: 0,
    frameStartX: x,
    frameStartY: y,
    frameStartVelY: vy,
    comboAtShot: 0,
  };
}

describe('ball-ball collision', () => {
  it('separates overlapping balls and exchanges velocity', () => {
    const a = makeBall(100, 100, 80, 0);
    const b = makeBall(100 + BALL_RADIUS * 1.5, 100, -40, 0);
    const hit = resolveBallBallCollision(a, b);
    expect(hit).toBe(true);
    expect(Math.hypot(b.x - a.x, b.y - a.y)).toBeGreaterThanOrEqual(BALL_RADIUS * 2 - 0.01);
    expect(a.vx).toBeLessThan(80);
    expect(b.vx).toBeGreaterThan(-40);
  });

  it('ignores non-overlapping balls', () => {
    const a = makeBall(0, 0, 10, 0);
    const b = makeBall(200, 0, -10, 0);
    expect(resolveBallBallCollision(a, b)).toBe(false);
    expect(a.vx).toBe(10);
    expect(b.vx).toBe(-10);
  });
});
