import { describe, expect, it } from 'vitest';
import { INITIAL_CLIMB_OFFSET } from './constants';
import {
  createHoop,
  HOOP_MAX_SCREEN_Y,
  HOOP_MIN_SCREEN_Y,
  isHoopPatrolling,
  onBasket,
  syncHoopToCamera,
  updateHoop,
  updateHoopPatrol,
} from './hoop';

describe('hoop height variation', () => {
  it('can place baskets near the upper and lower play areas', () => {
    const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
    const climbOffset = INITIAL_CLIMB_OFFSET + 240;

    onBasket(hoop, climbOffset, 60, () => 0);
    expect(hoop.targetY + climbOffset).toBe(HOOP_MIN_SCREEN_Y + 58);

    onBasket(hoop, climbOffset + 240, 60, () => 1);
    onBasket(hoop, climbOffset + 480, 60, () => 1);
    expect(hoop.targetY + climbOffset + 480).toBe(HOOP_MAX_SCREEN_Y - 58);
  });

  it('keeps the chosen screen height while the camera moves', () => {
    const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
    const climbOffset = INITIAL_CLIMB_OFFSET + 240;

    onBasket(hoop, climbOffset, 10, () => 0.8);
    updateHoop(hoop, 1);
    const chosenScreenY = hoop.y + climbOffset;

    syncHoopToCamera(hoop, climbOffset + 120);
    expect(hoop.y + climbOffset + 120).toBe(chosenScreenY);
  });

  it('retains the fixed center height when randomization is not requested', () => {
    const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
    const climbOffset = INITIAL_CLIMB_OFFSET + 240;

    onBasket(hoop, climbOffset);
    expect(hoop.targetY + climbOffset).toBe(460);
  });

  it('starts deterministic patrol at level 15 and stays inside safe bounds', () => {
    const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
    const climbOffset = INITIAL_CLIMB_OFFSET + 240;

    onBasket(hoop, climbOffset, 14, () => 0.5);
    expect(isHoopPatrolling(hoop)).toBe(false);

    onBasket(hoop, climbOffset, 15, () => 0.5);
    updateHoop(hoop, 1);
    expect(isHoopPatrolling(hoop)).toBe(true);

    updateHoopPatrol(hoop, 0.65, climbOffset, true);
    const startY = hoop.y;
    updateHoopPatrol(hoop, 0.25, climbOffset, true);
    expect(hoop.y).toBeGreaterThan(startY);

    for (let i = 0; i < 600; i += 1) {
      updateHoopPatrol(hoop, 1 / 60, climbOffset, true);
      const screenY = hoop.y + climbOffset;
      expect(screenY).toBeGreaterThanOrEqual(320);
      expect(screenY).toBeLessThanOrEqual(800);
    }
  });
});
