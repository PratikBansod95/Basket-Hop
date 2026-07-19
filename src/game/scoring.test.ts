import { describe, expect, it } from 'vitest';
import { INITIAL_CLIMB_OFFSET } from './constants';
import { getRimPoints } from './collision';
import { createHoop } from './hoop';
import { HOOP_GEOMETRY } from './palette';
import { checkScore } from './scoring';
import type { Ball } from './types';

function createCrossingBall(hitRimThisShot = false): Ball {
  const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
  const rim = getRimPoints(hoop.x, hoop.y, hoop.side);
  const radius = 30;
  const rimLine =
    hoop.y + HOOP_GEOMETRY.rimLeft.offsetY + HOOP_GEOMETRY.rimLeft.thickness;
  const x = (rim.left + rim.right) / 2;

  return {
    x,
    y: rimLine + radius + 2,
    vx: 0,
    vy: 120,
    radius,
    hasLaunched: true,
    scoredThisShot: false,
    hitRimThisShot,
    fallingThrough: false,
    rotation: 0,
    frameStartX: x,
    frameStartY: rimLine + radius - 2,
    frameStartVelY: 120,
    comboAtShot: 2,
  };
}

describe('clean-shot scoring', () => {
  it('awards the next combo value when the whole ball clears without contact', () => {
    const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);

    expect(checkScore(createCrossingBall(), hoop)).toMatchObject({
      scored: true,
      isSwish: true,
      points: 3,
      displayText: 'Swish x3!',
    });
  });

  it('awards one point and no swish after hoop contact', () => {
    const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);

    expect(checkScore(createCrossingBall(true), hoop)).toMatchObject({
      scored: true,
      isSwish: false,
      points: 1,
      displayText: '+1',
    });
  });

  it('accepts a downward crossing that begins near the shot apex', () => {
    const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
    const ball = createCrossingBall();
    ball.frameStartVelY = -5;

    expect(checkScore(ball, hoop)?.scored).toBe(true);
  });
});
