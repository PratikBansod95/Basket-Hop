import { CANVAS_WIDTH, COIN_RADIUS, COIN_VALUE, HOOP_CLEARANCE, HOOP_SCREEN_Y } from './constants';
import { HOOP_GEOMETRY } from './palette';
import type { Coin, Hoop } from './types';

export type CoinRandom = () => number;

/** Rim baseline relative to hoop anchor — coins below this are under the basket. */
export const COIN_RIM_Y_OFFSET =
  HOOP_GEOMETRY.rimLeft.offsetY + HOOP_GEOMETRY.rimLeft.thickness;

export function isBelowBasket(coinY: number, hoopY: number): boolean {
  return coinY > hoopY + COIN_RIM_Y_OFFSET + 20;
}

type PlacementZone = 'below_basket' | 'above_basket' | 'side_lane';

interface CoinPlacementTier {
  sideLaneXMin: number;
  sideLaneXMax: number;
  belowLaneXMin: number;
  belowLaneXMax: number;
  aboveYMin: number;
  aboveYMax: number;
  sideMinHoopDistance: number;
  belowMinHoopDistance: number;
}

function getPlacementTier(level: number): CoinPlacementTier {
  if (level <= 19) {
    return {
      sideLaneXMin: 250,
      sideLaneXMax: 500,
      belowLaneXMin: 270,
      belowLaneXMax: 580,
      aboveYMin: -240,
      aboveYMax: COIN_RIM_Y_OFFSET - 25,
      sideMinHoopDistance: 170,
      belowMinHoopDistance: 45,
    };
  }
  if (level <= 59) {
    return {
      sideLaneXMin: 210,
      sideLaneXMax: 530,
      belowLaneXMin: 240,
      belowLaneXMax: 600,
      aboveYMin: -300,
      aboveYMax: COIN_RIM_Y_OFFSET - 20,
      sideMinHoopDistance: 190,
      belowMinHoopDistance: 40,
    };
  }
  if (level <= 99) {
    return {
      sideLaneXMin: 170,
      sideLaneXMax: 560,
      belowLaneXMin: 210,
      belowLaneXMax: 620,
      aboveYMin: -360,
      aboveYMax: COIN_RIM_Y_OFFSET - 15,
      sideMinHoopDistance: 210,
      belowMinHoopDistance: 35,
    };
  }
  return {
    sideLaneXMin: 140,
    sideLaneXMax: 580,
    belowLaneXMin: 180,
    belowLaneXMax: 640,
    aboveYMin: -400,
    aboveYMax: COIN_RIM_Y_OFFSET - 10,
    sideMinHoopDistance: 230,
    belowMinHoopDistance: 30,
  };
}

function laneXToWorld(laneX: number, hoopSide: Hoop['side']): number {
  return hoopSide === 'right' ? laneX : CANVAS_WIDTH - laneX;
}

function randomInRange(random: CoinRandom, min: number, max: number): number {
  return min + random() * (max - min);
}

function pickZone(random: CoinRandom): PlacementZone {
  const roll = random();
  if (roll < 0.4) return 'below_basket';
  if (roll < 0.72) return 'above_basket';
  return 'side_lane';
}

function pickLanePoint(
  tier: CoinPlacementTier,
  random: CoinRandom,
  hoopX: number,
  hoopSide: Hoop['side'],
  zone: PlacementZone,
  avoid?: { laneX: number; yOffset: number },
  spacing: 'free' | 'near' | 'far' = 'free',
): { laneX: number; yOffset: number } | null {
  const attempts = spacing === 'free' ? 20 : 36;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    let laneX: number;
    let yOffset: number;
    let minHoopDistance = tier.sideMinHoopDistance;

    if (zone === 'below_basket') {
      minHoopDistance = tier.belowMinHoopDistance;
      laneX = randomInRange(random, tier.belowLaneXMin, tier.belowLaneXMax);
      yOffset = randomInRange(
        random,
        COIN_RIM_Y_OFFSET + 30,
        COIN_RIM_Y_OFFSET + HOOP_CLEARANCE - 15,
      );
    } else if (zone === 'above_basket') {
      laneX = randomInRange(random, tier.sideLaneXMin, tier.sideLaneXMax);
      yOffset = randomInRange(random, tier.aboveYMin, tier.aboveYMax);
    } else {
      laneX = randomInRange(random, tier.sideLaneXMin, tier.sideLaneXMax);
      yOffset = randomInRange(random, tier.aboveYMin, COIN_RIM_Y_OFFSET + HOOP_CLEARANCE);
    }

    if (avoid) {
      if (spacing === 'near') {
        laneX = avoid.laneX + randomInRange(random, -70, 70);
        yOffset = avoid.yOffset + randomInRange(random, -80, 80);
      } else if (spacing === 'far') {
        const horizontalSign = random() < 0.5 ? -1 : 1;
        laneX = avoid.laneX + horizontalSign * randomInRange(random, 120, 210);
        if (random() < 0.55) {
          yOffset = avoid.yOffset > COIN_RIM_Y_OFFSET
            ? randomInRange(random, tier.aboveYMin, COIN_RIM_Y_OFFSET - 10)
            : randomInRange(random, COIN_RIM_Y_OFFSET + 25, COIN_RIM_Y_OFFSET + HOOP_CLEARANCE - 10);
        } else {
          yOffset = avoid.yOffset + randomInRange(random, -150, 150);
        }
      }
    }

    laneX = Math.max(80, Math.min(CANVAS_WIDTH - 80, laneX));
    yOffset = Math.max(tier.aboveYMin, Math.min(COIN_RIM_Y_OFFSET + HOOP_CLEARANCE, yOffset));

    const worldX = laneXToWorld(laneX, hoopSide);
    if (Math.abs(worldX - hoopX) < minHoopDistance) continue;

    if (avoid) {
      const avoidWorldX = laneXToWorld(avoid.laneX, hoopSide);
      const dx = Math.abs(worldX - avoidWorldX);
      const dy = Math.abs(yOffset - avoid.yOffset);
      if (spacing === 'near' && (dx > 90 || dy > 110)) continue;
      if (spacing === 'far' && dx < 100 && dy < 60) continue;
    }

    return { laneX, yOffset };
  }

  return null;
}

function pickSecondLanePoint(
  tier: CoinPlacementTier,
  random: CoinRandom,
  hoopX: number,
  hoopSide: Hoop['side'],
  first: { laneX: number; yOffset: number },
  spacingMode: 'near' | 'far',
): { laneX: number; yOffset: number } | null {
  const zone = pickZone(random);
  const modes: Array<'near' | 'far' | 'free'> = spacingMode === 'near'
    ? ['near', 'far', 'free']
    : ['far', 'near', 'free'];

  for (const spacing of modes) {
    const point = pickLanePoint(tier, random, hoopX, hoopSide, zone, first, spacing);
    if (point) return point;
  }

  return pickLanePoint(tier, random, hoopX, hoopSide, 'below_basket');
}

export function generateCoinsForHoop(
  hoop: Hoop,
  level: number,
  climbOffset: number,
  random: CoinRandom = Math.random,
): Coin[] {
  if (level < 1) return [];

  const hoopX = hoop.animating ? hoop.targetX : hoop.x;
  const tier = getPlacementTier(level);
  const coinCount = random() < 0.5 ? 1 : 2;

  const firstZone = pickZone(random);
  const first = pickLanePoint(tier, random, hoopX, hoop.side, firstZone);
  if (!first) return [];

  const points = [first];
  if (coinCount === 2) {
    const spacingMode = random() < 0.45 ? 'near' : 'far';
    const second = pickSecondLanePoint(tier, random, hoopX, hoop.side, first, spacingMode);
    if (second) points.push(second);
  }

  return points.map((point, index) => ({
    id: `coin-${level}-${hoop.side}-${index}-${Math.floor(random() * 1_000_000)}`,
    x: laneXToWorld(point.laneX, hoop.side),
    y: HOOP_SCREEN_Y + point.yOffset - climbOffset,
    radius: COIN_RADIUS,
    value: COIN_VALUE,
    collected: false,
    phase: random() * Math.PI * 2,
  }));
}

export function createDeterministicCoinRandom(seed: number): CoinRandom {
  let state = seed >>> 0;
  return () => {
    state = (state * 1_664_525 + 1_013_390_422) >>> 0;
    return state / 0x1_0000_0000;
  };
}
