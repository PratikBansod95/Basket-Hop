import { describe, expect, it } from 'vitest';
import { INITIAL_CLIMB_OFFSET } from './constants';
import {
  createHoop,
  HOOP_MAX_SCREEN_Y,
  HOOP_MIN_SCREEN_Y,
  onBasket,
  syncHoopToCamera,
  updateHoop,
} from './hoop';

describe('hoop height variation', () => {
  it('can place baskets near the upper and lower play areas', () => {
    const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
    const climbOffset = INITIAL_CLIMB_OFFSET + 240;

    onBasket(hoop, climbOffset, () => 0);
    expect(hoop.targetY + climbOffset).toBe(HOOP_MIN_SCREEN_Y);

    onBasket(hoop, climbOffset + 240, () => 1);
    onBasket(hoop, climbOffset + 480, () => 1);
    expect(hoop.targetY + climbOffset + 480).toBe(HOOP_MAX_SCREEN_Y);
  });

  it('keeps the chosen screen height while the camera moves', () => {
    const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
    const climbOffset = INITIAL_CLIMB_OFFSET + 240;

    onBasket(hoop, climbOffset, () => 0.8);
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
});
