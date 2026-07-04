import { describe, expect, it } from 'vitest';
import {
  BALL_SPAWN_X,
  BALL_SPAWN_Y,
  INITIAL_CLIMB_OFFSET,
  STAMINA_BASKET_RESTORE,
  STAMINA_DRAIN_PER_TAP,
  STAMINA_REGEN_PER_SECOND,
  STAMINA_UNLOCK_BASKETS,
} from './constants';
import { Game } from './Game';
import type { LaunchMechanic, TapContext } from './mechanics/LaunchMechanic';
import { DefaultTapLaunch } from './mechanics/defaultTapLaunch';
import { createTutorialState } from './tutorial';
import { GamePhase } from './types';

class TrackingLaunchMechanic implements LaunchMechanic {
  firstTapCalls = 0;
  tapCalls = 0;
  lastStaminaStrength = 1;

  onFirstTap(ctx: TapContext): void {
    this.firstTapCalls += 1;
    ctx.ball.hasLaunched = true;
  }

  onTap(ctx: TapContext): void {
    this.tapCalls += 1;
    this.lastStaminaStrength = ctx.staminaStrength ?? 1;
    ctx.ball.hasLaunched = true;
  }

  reset(): void {}
}

function createGame(launchMechanic: LaunchMechanic = new DefaultTapLaunch()): Game {
  return new Game(
    launchMechanic,
    {
      onScore: () => {},
      onGameOver: () => {},
      onTap: () => {},
      onBounce: () => {},
      onSwoosh: () => {},
    },
    createTutorialState(false),
  );
}

function unlockStamina(game: Game): void {
  game.stats.level = STAMINA_UNLOCK_BASKETS;
  game.update(0);
}

describe('Game start spawn', () => {
  it('starts the ball at the tuned opening spawn position', () => {
    const game = createGame();
    game.reset();

    expect(game.hoop.side).toBe('right');
    expect(game.ball.x).toBe(BALL_SPAWN_X);
    expect(game.ball.y).toBe(BALL_SPAWN_Y);
    expect(game.ball.y + INITIAL_CLIMB_OFFSET).toBe(712);
  });

  it('counts the opening hoop as a shot attempt on first tap', () => {
    const game = createGame();
    game.reset();

    expect(game.stats.totalShots).toBe(0);

    game.handleTap();

    expect(game.stats.totalShots).toBe(1);
  });
});

describe('stamina system', () => {
  it('stays inactive before the fifth basket', () => {
    const game = createGame();
    game.reset();
    game.stats.level = STAMINA_UNLOCK_BASKETS - 1;

    game.update(0);

    expect(game.stamina.active).toBe(false);
  });

  it('activates after the fifth basket', () => {
    const game = createGame();
    game.reset();
    unlockStamina(game);

    expect(game.stamina.active).toBe(true);
  });

  it('does not consume stamina on the first launch tap', () => {
    const mechanic = new TrackingLaunchMechanic();
    const game = createGame(mechanic);
    game.reset();
    game.stats.level = STAMINA_UNLOCK_BASKETS;

    game.handleTap();

    expect(game.stamina.active).toBe(true);
    expect(game.stamina.current).toBe(game.stamina.max);
    expect(mechanic.firstTapCalls).toBe(1);
  });

  it('consumes stamina on a mid-air control tap once active', () => {
    const mechanic = new TrackingLaunchMechanic();
    const game = createGame(mechanic);
    game.reset();
    game.stats.level = STAMINA_UNLOCK_BASKETS;

    game.handleTap();
    game.handleTap();

    expect(game.stamina.current).toBe(game.stamina.max - STAMINA_DRAIN_PER_TAP);
    expect(mechanic.tapCalls).toBe(1);
    expect(mechanic.lastStaminaStrength).toBe(1);
  });

  it('allows a weaker mid-air control tap when stamina is low', () => {
    const mechanic = new TrackingLaunchMechanic();
    const game = createGame(mechanic);
    game.reset();
    game.stats.level = STAMINA_UNLOCK_BASKETS;

    game.handleTap();
    game.stamina.current = 10;

    game.handleTap();

    expect(mechanic.tapCalls).toBe(1);
    expect(mechanic.lastStaminaStrength).toBeCloseTo(10 / STAMINA_DRAIN_PER_TAP, 5);
    expect(game.stamina.current).toBe(0);
  });

  it('blocks mid-air control taps when stamina is empty', () => {
    const mechanic = new TrackingLaunchMechanic();
    const game = createGame(mechanic);
    game.reset();
    game.stats.level = STAMINA_UNLOCK_BASKETS;

    game.handleTap();
    game.stamina.current = 0;

    game.handleTap();

    expect(mechanic.tapCalls).toBe(0);
    expect(game.stamina.blockedFeedback).toBeGreaterThan(0);
  });

  it('regenerates stamina over time while playing', () => {
    const game = createGame();
    game.reset();
    game.phase = GamePhase.Playing;
    game.ball.hasLaunched = true;
    game.stats.level = STAMINA_UNLOCK_BASKETS;
    game.stamina.current = 40;

    game.update(0.1);

    expect(game.stamina.active).toBe(true);
    expect(game.stamina.current).toBeCloseTo(40 + STAMINA_REGEN_PER_SECOND * 0.1, 5);
  });

  it('restores stamina after a made basket', () => {
    const game = createGame();
    game.reset();
    unlockStamina(game);
    game.stamina.current = 20;

    (game as unknown as { restoreStaminaFromBasket: () => void }).restoreStaminaFromBasket();

    expect(game.stamina.current).toBe(20 + STAMINA_BASKET_RESTORE);
  });
});
