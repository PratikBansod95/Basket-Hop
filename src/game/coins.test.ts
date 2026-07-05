import { describe, expect, it } from 'vitest';
import { CANVAS_WIDTH, INITIAL_CLIMB_OFFSET } from './constants';
import {
  createDeterministicCoinRandom,
  generateCoinsForHoop,
  isBelowBasket,
} from './coins';
import { createHoop } from './hoop';

describe('coin placement', () => {
  it('does not spawn coins below level 1', () => {
    const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
    expect(generateCoinsForHoop(hoop, 0, INITIAL_CLIMB_OFFSET)).toHaveLength(0);
  });

  it('randomly spawns one or two coins', () => {
    const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);

    const counts = new Set<number>();
    for (let seed = 500; seed <= 900; seed += 1) {
      const coins = generateCoinsForHoop(
        hoop,
        5,
        INITIAL_CLIMB_OFFSET,
        createDeterministicCoinRandom(seed),
      );
      counts.add(coins.length);
    }

    expect(counts.has(1)).toBe(true);
    expect(counts.has(2)).toBe(true);
  });

  it('places coins in the open space below the basket rim', () => {
    const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
    let foundBelow = false;

    for (let seed = 1; seed <= 200; seed += 1) {
      const coins = generateCoinsForHoop(
        hoop,
        5,
        INITIAL_CLIMB_OFFSET,
        createDeterministicCoinRandom(seed),
      );
      if (coins.some((coin) => isBelowBasket(coin.y, hoop.y))) {
        foundBelow = true;
        break;
      }
    }

    expect(foundBelow).toBe(true);
  });

  it('often places below-basket coins near the approach lane under the rim', () => {
    const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
    let foundUnderRim = false;

    for (let seed = 1; seed <= 300; seed += 1) {
      const coins = generateCoinsForHoop(
        hoop,
        5,
        INITIAL_CLIMB_OFFSET,
        createDeterministicCoinRandom(seed),
      );
      if (
        coins.some(
          (coin) => isBelowBasket(coin.y, hoop.y) && Math.abs(coin.x - hoop.x) < 220,
        )
      ) {
        foundUnderRim = true;
        break;
      }
    }

    expect(foundUnderRim).toBe(true);
  });

  it('varies spacing between two coins', () => {
    const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
    let foundClose = false;
    let foundFar = false;

    for (let seed = 500; seed <= 1200; seed += 1) {
      const coins = generateCoinsForHoop(
        hoop,
        8,
        INITIAL_CLIMB_OFFSET,
        createDeterministicCoinRandom(seed),
      );
      if (coins.length !== 2) continue;
      const dx = Math.abs(coins[0].x - coins[1].x);
      if (dx <= 95) foundClose = true;
      if (dx >= 110) foundFar = true;
    }

    expect(foundClose).toBe(true);
    expect(foundFar).toBe(true);
  });

  it('mirrors side-lane coins by hoop side', () => {
    const rightHoop = createHoop('right', INITIAL_CLIMB_OFFSET);
    const leftHoop = createHoop('left', INITIAL_CLIMB_OFFSET);

    const rightCoins = generateCoinsForHoop(
      rightHoop,
      3,
      INITIAL_CLIMB_OFFSET,
      createDeterministicCoinRandom(42),
    );
    const leftCoins = generateCoinsForHoop(
      leftHoop,
      3,
      INITIAL_CLIMB_OFFSET,
      createDeterministicCoinRandom(42),
    );

    if (rightCoins.length > 0 && leftCoins.length > 0) {
      expect(leftCoins[0].x).toBe(CANVAS_WIDTH - rightCoins[0].x);
    }
  });

  it('uses riskier lanes on higher levels', () => {
    const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
    const random = createDeterministicCoinRandom(99);

    const lowRisk = generateCoinsForHoop(hoop, 3, INITIAL_CLIMB_OFFSET, random);
    const highRisk = generateCoinsForHoop(hoop, 120, INITIAL_CLIMB_OFFSET, random);

    const lowVertical = Math.max(...lowRisk.map((coin) => Math.abs(coin.y - hoop.y)));
    const highVertical = Math.max(...highRisk.map((coin) => Math.abs(coin.y - hoop.y)));

    expect(highVertical).toBeGreaterThan(lowVertical);
  });
});
