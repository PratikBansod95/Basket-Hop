import { describe, expect, it } from 'vitest';
import { DEFAULT_SAVE } from '../platform/types';
import { Game } from './Game';
import { DefaultTapLaunch } from './mechanics/defaultTapLaunch';
import { GamePhase } from './types';
import {
  createStaminaIntroState,
  createTutorialProbe,
  createTutorialState,
  shouldPauseForTutorial,
  shouldRunStaminaTutorial,
  shouldRunTutorial,
  TUTORIAL_PROMPT_FIRST,
  TUTORIAL_PROMPT_SECOND,
} from './tutorial';

function createGame(tutorialEnabled: boolean): { game: Game; tapCalls: () => number } {
  let taps = 0;
  const game = new Game(
    new DefaultTapLaunch(),
    {
      onScore: () => {},
      onGameOver: () => {},
      onTap: () => {
        taps += 1;
      },
      onBounce: () => {},
      onSwoosh: () => {},
    },
    createTutorialState(tutorialEnabled),
  );
  game.reset();
  return { game, tapCalls: () => taps };
}

function createProbe(game: Game) {
  return createTutorialProbe(
    game.phase,
    game.ball,
    game.hoop,
    game.stats,
    game.climbOffset,
    game.targetClimbOffset,
    game.climbAnimating,
  );
}

function stepUntil(game: Game, predicate: () => boolean, maxFrames = 600, dt = 1 / 60): boolean {
  for (let i = 0; i < maxFrames; i++) {
    game.update(dt);
    if (predicate()) return true;
  }
  return false;
}

function stepToTutorialPause(game: Game, maxFrames = 300): boolean {
  let previousPauseable = false;
  for (let i = 0; i < maxFrames; i++) {
    game.update(1 / 60);
    const currentPauseable = shouldPauseForTutorial(
      { ...game.tutorial, prompt: null },
      createProbe(game),
      new DefaultTapLaunch(),
    );
    if (game.pauseSource === 'tutorial') {
      expect(previousPauseable).toBe(false);
      expect(currentPauseable).toBe(true);
      return true;
    }
    previousPauseable = currentPauseable;
  }
  return false;
}

describe('FTUE tutorial', () => {
  it('temporarily enables for all player save states', () => {
    expect(shouldRunTutorial({
      ...DEFAULT_SAVE,
      best: 0,
      totalGames: 0,
      tutorialSeen: false,
    })).toBe(true);

    expect(shouldRunTutorial({
      ...DEFAULT_SAVE,
      best: 0,
      totalGames: 1,
      tutorialSeen: false,
    })).toBe(true);

    expect(shouldRunTutorial({
      ...DEFAULT_SAVE,
      best: 3,
      totalGames: 0,
      tutorialSeen: false,
    })).toBe(true);

    expect(shouldRunTutorial({
      ...DEFAULT_SAVE,
      tutorialSeen: true,
    })).toBe(true);
  });

  it('pauses at the first scoring action window', () => {
    const { game } = createGame(true);
    game.handleTap();

    const paused = stepToTutorialPause(game);
    expect(paused).toBe(true);
    expect(game.phase).toBe(GamePhase.Playing);
    expect(game.pauseSource).toBe('tutorial');
    expect(game.tutorialPrompt).toBe(TUTORIAL_PROMPT_FIRST);
  });

  it('tap resumes and performs the action in the same input', () => {
    const { game, tapCalls } = createGame(true);
    game.handleTap();
    expect(stepToTutorialPause(game)).toBe(true);

    const beforeVy = game.ball.vy;
    const beforeVx = game.ball.vx;
    const tapsBeforeResume = tapCalls();

    game.handleTap();

    expect(game.pauseSource).toBe('none');
    expect(game.tutorial.awaitingSuccess).toBe(true);
    expect(game.ball.vy).toBeLessThan(beforeVy);
    expect(game.ball.vx).not.toBe(beforeVx);
    expect(tapCalls()).toBe(tapsBeforeResume + 1);
  });

  it('only runs for the first two successful teaching beats', () => {
    const { game } = createGame(true);
    game.handleTap();

    expect(stepToTutorialPause(game)).toBe(true);
    game.handleTap();
    expect(game.tutorial.awaitingSuccess).toBe(true);
    expect(stepUntil(game, () => game.stats.score >= 1 || game.phase === GamePhase.GameOver)).toBe(true);
    expect(game.stats.score).toBeGreaterThanOrEqual(1);
    expect(game.phase).toBe(GamePhase.Playing);
    expect(game.tutorial.stepsCompleted).toBe(1);

    expect(stepToTutorialPause(game, 420)).toBe(true);
    expect(game.tutorialPrompt).toBe(TUTORIAL_PROMPT_SECOND);
    game.handleTap();
    expect(game.tutorial.stepsCompleted).toBe(2);
    expect(game.tutorial.enabled).toBe(false);

    const pausedAgain = stepUntil(game, () => game.pauseSource === 'tutorial', 420);
    expect(pausedAgain).toBe(false);
  });

  it('runtime-disabled tutorial still skips pauses', () => {
    const { game } = createGame(false);
    game.handleTap();

    const paused = stepUntil(game, () => game.pauseSource === 'tutorial', 420);
    expect(paused).toBe(false);
  });
});

describe('stamina tutorial gate', () => {
  it('runs only when the save has not seen it', () => {
    expect(shouldRunStaminaTutorial({
      ...DEFAULT_SAVE,
      staminaTutorialSeen: false,
    })).toBe(true);

    expect(shouldRunStaminaTutorial({
      ...DEFAULT_SAVE,
      best: 12,
      coins: 4,
      totalGames: 3,
      totalShots: 20,
      cleanShots: 5,
      tutorialSeen: true,
      staminaTutorialSeen: true,
    })).toBe(false);
  });

  it('creates an idle intro state from the factory', () => {
    expect(createStaminaIntroState(true)).toEqual({
      enabled: true,
      pending: false,
      prompt: null,
    });
  });
});
