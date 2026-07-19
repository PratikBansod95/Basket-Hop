import { createColliders, type HoopColliders } from './collision';
import {
  CLIMB_PER_BASKET,
  HOOP_CLEARANCE,
  INITIAL_CLIMB_OFFSET,
  isBallOffScreen,
  SCROLL_SPEED,
} from './constants';
import { createHoop, syncHoopToCamera, updateHoop } from './hoop';
import type { LaunchMechanic } from './mechanics/LaunchMechanic';
import { integrateBall } from './physics';
import { checkScore } from './scoring';
import { GamePhase, type Ball, type Hoop, type PauseSource, type RunStats, type StaminaIntroState, type TutorialState } from './types';
import type { SaveData } from '../platform/types';

const TUTORIAL_SIM_DT = 1 / 60;
const TUTORIAL_SIM_STEPS = 150;

export const TUTORIAL_PROMPT_FIRST = 'Tap again to steer the ball';
export const TUTORIAL_PROMPT_SECOND = 'Keep tapping to guide the ball';
export const TUTORIAL_MAX_STEPS = 2;
export const STAMINA_TUTORIAL_PROMPT = 'Mid-air taps use stamina — time your moves';

export interface TutorialProbeState {
  phase: GamePhase;
  ball: Ball;
  hoop: Hoop;
  stats: RunStats;
  climbOffset: number;
  targetClimbOffset: number;
  climbAnimating: boolean;
}

export function shouldRunTutorial(save: SaveData): boolean {
  void save;
  // Temporary testing override: show FTUE for all players.
  return true;
}

export function shouldRunStaminaTutorial(save: SaveData): boolean {
  return !save.staminaTutorialSeen;
}

export function createTutorialState(enabled: boolean): TutorialState {
  return {
    enabled,
    stepsCompleted: 0,
    maxSteps: TUTORIAL_MAX_STEPS,
    awaitingSuccess: false,
    prompt: null,
  };
}

export function createStaminaIntroState(enabled: boolean): StaminaIntroState {
  return {
    enabled,
    pending: false,
    prompt: null,
  };
}

export function isTutorialPauseSource(source: PauseSource): boolean {
  return source === 'tutorial';
}

export function getTutorialPrompt(stepCompleted: number): string {
  return stepCompleted === 0 ? TUTORIAL_PROMPT_FIRST : TUTORIAL_PROMPT_SECOND;
}

export function shouldPauseForTutorial(
  state: TutorialState,
  probe: TutorialProbeState,
  launchMechanic: LaunchMechanic,
): boolean {
  if (!state.enabled || state.prompt || state.awaitingSuccess) return false;
  if (state.stepsCompleted >= state.maxSteps) return false;
  if (probe.phase !== 'playing') return false;
  if (!probe.ball.hasLaunched) return false;
  if (state.stepsCompleted === 0) {
    return predictTutorialTapSuccess(probe, launchMechanic);
  }
  return predictTutorialTapKeepsRunAlive(probe, launchMechanic);
}

export function predictTutorialTapSuccess(
  probe: TutorialProbeState,
  launchMechanic: LaunchMechanic,
): boolean {
  return simulateProbe(probe, launchMechanic).scored;
}

export function predictTutorialTapKeepsRunAlive(
  probe: TutorialProbeState,
  launchMechanic: LaunchMechanic,
): boolean {
  if (probe.ball.vy < 0) return false;

  const withoutTap = simulateProbe(probe, null, 90);
  if (!withoutTap.gameOver) return false;

  const withTap = simulateProbe(probe, launchMechanic, 90);
  return !withTap.gameOver || withTap.framesSurvived > withoutTap.framesSurvived + 18;
}

export function createTutorialProbe(
  phase: GamePhase,
  ball: Ball,
  hoop: Hoop,
  stats: RunStats,
  climbOffset: number,
  targetClimbOffset: number,
  climbAnimating: boolean,
): TutorialProbeState {
  return {
    phase,
    ball: cloneBall(ball),
    hoop: cloneHoop(hoop),
    stats: { ...stats },
    climbOffset,
    targetClimbOffset,
    climbAnimating,
  };
}

export function createTutorialSuccessState(step: number): TutorialProbeState {
  const hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
  const ball: Ball = {
    x: 342,
    y: hoop.y + HOOP_CLEARANCE + 150 - step * CLIMB_PER_BASKET,
    vx: 280,
    vy: -120,
    radius: 30,
    hasLaunched: true,
    scoredThisShot: false,
    hitRimThisShot: false,
    fallingThrough: false,
    rotation: 0,
    frameStartX: 342,
    frameStartY: hoop.y + HOOP_CLEARANCE + 150,
    frameStartVelY: -120,
    comboAtShot: 0,
  };

  return {
    phase: GamePhase.Playing,
    ball,
    hoop,
    stats: {
      score: step,
      combo: 0,
      cleanShots: 0,
      rimHits: 0,
      totalShots: 0,
      hasScoredOnce: step > 0,
      level: step,
    },
    climbOffset: INITIAL_CLIMB_OFFSET + step * CLIMB_PER_BASKET,
    targetClimbOffset: INITIAL_CLIMB_OFFSET + step * CLIMB_PER_BASKET,
    climbAnimating: false,
  };
}

function stepClimb(
  climbOffset: number,
  targetClimbOffset: number,
  climbAnimating: boolean,
  dt: number,
): { climbOffset: number; climbAnimating: boolean } {
  const diff = targetClimbOffset - climbOffset;
  if (Math.abs(diff) < 0.5) {
    return { climbOffset: targetClimbOffset, climbAnimating: false };
  }

  const step = SCROLL_SPEED * dt;
  if (Math.abs(diff) <= step) {
    return { climbOffset: targetClimbOffset, climbAnimating: false };
  }

  return {
    climbOffset: climbOffset + Math.sign(diff) * step,
    climbAnimating,
  };
}

function simulateProbe(
  probe: TutorialProbeState,
  launchMechanic: LaunchMechanic | null,
  maxSteps = TUTORIAL_SIM_STEPS,
): { scored: boolean; framesSurvived: number; gameOver: boolean } {
  const ball = cloneBall(probe.ball);
  const hoop = cloneHoop(probe.hoop);
  const stats = { ...probe.stats };
  let climbOffset = probe.climbOffset;
  const targetClimbOffset = probe.targetClimbOffset;
  let climbAnimating = probe.climbAnimating;
  const colliders = cloneColliders(createColliders());

  if (launchMechanic) {
    launchMechanic.onTap({ ball, hoop, isFirstTap: false });
    if (ball.fallingThrough) {
      ball.fallingThrough = false;
      ball.scoredThisShot = false;
      ball.hitRimThisShot = false;
    }
    ball.comboAtShot = stats.combo;
  }

  for (let i = 0; i < maxSteps; i++) {
    ({ climbOffset, climbAnimating } = stepClimb(climbOffset, targetClimbOffset, climbAnimating, TUTORIAL_SIM_DT));

    integrateBall(ball, hoop, colliders, TUTORIAL_SIM_DT, () => {}, () => {}, false);
    updateHoop(hoop, TUTORIAL_SIM_DT);

    if (!hoop.animating && !climbAnimating) {
      syncHoopToCamera(hoop, climbOffset);
    }

    if (checkScore(ball, hoop)) {
      return { scored: true, framesSurvived: i + 1, gameOver: false };
    }

    if (ball.hasLaunched && isBallOffScreen(ball.y, ball.radius, climbOffset)) {
      return { scored: false, framesSurvived: i + 1, gameOver: true };
    }
  }

  return { scored: false, framesSurvived: maxSteps, gameOver: false };
}

function cloneBall(ball: Ball): Ball {
  return { ...ball };
}

function cloneHoop(hoop: Hoop): Hoop {
  return { ...hoop };
}

function cloneColliders(colliders: HoopColliders): HoopColliders {
  return {
    hoopSide: colliders.hoopSide,
    backboard: { ...colliders.backboard },
    rimLeft: { ...colliders.rimLeft },
    rimRight: { ...colliders.rimRight },
    corner: { ...colliders.corner },
  };
}
