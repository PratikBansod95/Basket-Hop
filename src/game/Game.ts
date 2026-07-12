import {
  BALL_RADIUS,
  BALL_SPAWN_X,
  BALL_SPAWN_Y,
  CLIMB_PER_BASKET,
  HOOP_CLEARANCE,
  INITIAL_CLIMB_OFFSET,
  isBallOffScreen,
  SCROLL_SPEED,
  STAMINA_BASKET_RESTORE,
  STAMINA_BLOCKED_FEEDBACK_DURATION,
  STAMINA_DRAIN_PER_TAP,
  STAMINA_MAX,
  STAMINA_REGEN_PER_SECOND,
  STAMINA_UNLOCK_BASKETS,
} from './constants';
import { generateCoinsForHoop } from './coins';
import { createColliders } from './collision';
import { debugLog } from './debug';
import { createHoop, onBasket, syncHoopToCamera, updateHoop } from './hoop';
import { resetHoopNet, updateHoopNet } from './netPhysics';
import { getRenderQuality } from './renderQuality';
import type { LaunchMechanic } from './mechanics/LaunchMechanic';
import { clampDt, integrateBall } from './physics';
import { clearParticles, spawnBurst, spawnSwishFlash, updateParticles } from './particles';
import { resetBallTrail } from './ballRenderer';
import { applyScore, checkScore } from './scoring';
import { HOOP_GEOMETRY } from './palette';
import {
  createStaminaIntroState,
  createTutorialProbe,
  createTutorialState,
  getTutorialPrompt,
  shouldPauseForTutorial,
  STAMINA_TUTORIAL_PROMPT,
} from './tutorial';
import {
  GamePhase,
  type Ball,
  type Coin,
  type FloatingText,
  type Hoop,
  type PauseSource,
  type RunStats,
  type StaminaIntroState,
  type StaminaState,
  type TutorialState,
} from './types';

function rimLineY(hoopY: number): number {
  const { offsetY, thickness } = HOOP_GEOMETRY.rimLeft;
  return hoopY + offsetY + thickness;
}

export interface GameCallbacks {
  onScore(points: number, isSwish: boolean): void;
  onGameOver(stats: RunStats): void;
  onTap(): void;
  onBounce(): void;
  onSwoosh(): void;
  onStaminaTutorialComplete?(): void;
}

function createBall(): Ball {
  return {
    x: BALL_SPAWN_X,
    y: BALL_SPAWN_Y,
    vx: 0,
    vy: 0,
    radius: BALL_RADIUS,
    hasLaunched: false,
    scoredThisShot: false,
    hitRimThisShot: false,
    fallingThrough: false,
    rotation: 0,
    frameStartX: BALL_SPAWN_X,
    frameStartY: BALL_SPAWN_Y,
    frameStartVelY: 0,
    comboAtShot: 0,
  };
}

function createStats(): RunStats {
  return {
    score: 0,
    combo: 0,
    cleanShots: 0,
    rimHits: 0,
    totalShots: 0,
    hasScoredOnce: false,
    level: 0,
  };
}

function createStaminaState(): StaminaState {
  return {
    active: false,
    current: STAMINA_MAX,
    max: STAMINA_MAX,
    drainPerTap: STAMINA_DRAIN_PER_TAP,
    regenPerSecond: STAMINA_REGEN_PER_SECOND,
    basketRestore: STAMINA_BASKET_RESTORE,
    blockedFeedback: 0,
  };
}

export class Game {
  phase: GamePhase = GamePhase.Menu;
  hoop: Hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
  ball: Ball = createBall();
  coins: Coin[] = [];
  runCoins = 0;
  stats: RunStats = createStats();
  floatingTexts: FloatingText[] = [];
  shake = 0;
  shakeTimer = 0;
  colliders = createColliders();
  stamina: StaminaState = createStaminaState();
  tutorial: TutorialState;
  staminaIntro: StaminaIntroState;

  climbOffset = INITIAL_CLIMB_OFFSET;
  targetClimbOffset = INITIAL_CLIMB_OFFSET;
  climbAnimating = false;
  time = 0;

  /** Previous physics-step poses for display interpolation. */
  prevBallX = 0;
  prevBallY = 0;
  prevBallRot = 0;
  prevClimbOffset = INITIAL_CLIMB_OFFSET;
  private shakeDuration = 0.18;

  private platformPaused = false;
  private firstTapDone = false;
  private bounceCooldown = 0;
  private clearBelowY = 0;
  private pendingCoinRespawn = false;

  constructor(
    private launchMechanic: LaunchMechanic,
    private callbacks: GameCallbacks,
    tutorialState: TutorialState = createTutorialState(false),
    staminaIntroState: StaminaIntroState = createStaminaIntroState(false),
  ) {
    this.tutorial = tutorialState;
    this.staminaIntro = staminaIntroState;
  }

  set paused(value: boolean) {
    this.platformPaused = value;
  }

  get paused(): boolean {
    return this.pauseSource !== 'none';
  }

  get pauseSource(): PauseSource {
    if (this.platformPaused) return 'platform';
    if (this.tutorial.prompt) return 'tutorial';
    if (this.staminaIntro.prompt) return 'staminaTutorial';
    return 'none';
  }

  get tutorialPrompt(): string | null {
    return this.tutorial.prompt ?? this.staminaIntro.prompt;
  }

  get staminaIntroActive(): boolean {
    return this.staminaIntro.prompt !== null;
  }

  reset(): void {
    this.phase = GamePhase.Idle;
    this.hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
    this.ball = createBall();
    this.climbOffset = INITIAL_CLIMB_OFFSET;
    this.targetClimbOffset = INITIAL_CLIMB_OFFSET;
    this.climbAnimating = false;
    this.time = 0;
    resetHoopNet(this.hoop);
    this.stats = createStats();
    this.respawnCoinsForCurrentHoop();
    this.runCoins = 0;
    this.floatingTexts = [];
    this.shake = 0;
    this.shakeTimer = 0;
    this.shakeDuration = 0.18;
    this.stamina = createStaminaState();
    this.firstTapDone = false;
    this.bounceCooldown = 0;
    this.clearBelowY = 0;
    this.pendingCoinRespawn = false;
    clearParticles();
    resetBallTrail();
    this.launchMechanic.reset();
    this.resetTutorialRunState();
    this.syncRenderPrev();
  }

  /** Call once before each fixed physics step. */
  captureRenderPrev(): void {
    this.prevBallX = this.ball.x;
    this.prevBallY = this.ball.y;
    this.prevBallRot = this.ball.rotation;
    this.prevClimbOffset = this.climbOffset;
  }

  /** Keep prev == current (menu / after reset / pause). */
  syncRenderPrev(): void {
    this.captureRenderPrev();
  }

  getDisplayBall(alpha: number): { x: number; y: number; rotation: number } {
    const t = Math.max(0, Math.min(1, alpha));
    return {
      x: this.prevBallX + (this.ball.x - this.prevBallX) * t,
      y: this.prevBallY + (this.ball.y - this.prevBallY) * t,
      rotation: this.prevBallRot + (this.ball.rotation - this.prevBallRot) * t,
    };
  }

  getDisplayClimbOffset(alpha: number): number {
    const t = Math.max(0, Math.min(1, alpha));
    return this.prevClimbOffset + (this.climbOffset - this.prevClimbOffset) * t;
  }

  getDisplayShake(): number {
    if (this.shakeTimer <= 0 || this.shakeDuration <= 0) return 0;
    const fade = Math.max(0, Math.min(1, this.shakeTimer / this.shakeDuration));
    return this.shake * fade * fade;
  }

  returnToMenu(): void {
    this.reset();
    this.phase = GamePhase.Menu;
  }

  private resetTutorialRunState(): void {
    this.tutorial.prompt = null;
    this.tutorial.awaitingSuccess = false;
    this.staminaIntro.pending = false;
    this.staminaIntro.prompt = null;
  }

  private beginShotAttempt(): void {
    this.stats.totalShots += 1;
  }

  private respawnCoinsForCurrentHoop(): void {
    this.coins = generateCoinsForHoop(this.hoop, this.stats.level, this.climbOffset);
  }

  private tryRespawnCoinsAfterTransition(): void {
    if (!this.pendingCoinRespawn) return;
    if (this.hoop.animating || this.climbAnimating) return;
    this.pendingCoinRespawn = false;
    this.respawnCoinsForCurrentHoop();
  }

  private collectCoins(): void {
    for (const coin of this.coins) {
      if (coin.collected) continue;
      const dx = this.ball.x - coin.x;
      const dy = this.ball.y - coin.y;
      const touchRadius = this.ball.radius + coin.radius;
      if (dx * dx + dy * dy > touchRadius * touchRadius) continue;

      coin.collected = true;
      this.runCoins += coin.value;
      this.floatingTexts.push({
        x: coin.x,
        y: coin.y - 24,
        text: `+${coin.value} coin`,
        life: 0.95,
        vy: -42,
        color: '#ffd166',
      });
    }
  }

  private unlockStaminaIfNeeded(): void {
    if (this.stamina.active || this.stats.level < STAMINA_UNLOCK_BASKETS) return;
    this.stamina.active = true;
    if (this.staminaIntro.enabled && !this.staminaIntro.prompt) {
      this.staminaIntro.pending = true;
    }
  }

  private maybePauseForStaminaIntro(): void {
    if (!this.staminaIntro.enabled || !this.staminaIntro.pending) return;
    if (this.staminaIntro.prompt || this.tutorial.prompt) return;
    if (!this.stamina.active) return;
    if (this.climbAnimating || this.hoop.animating) return;
    if (this.phase !== GamePhase.Playing && this.phase !== GamePhase.Idle) return;

    this.staminaIntro.pending = false;
    this.staminaIntro.prompt = STAMINA_TUTORIAL_PROMPT;
  }

  private resumeFromStaminaIntro(): void {
    this.staminaIntro.prompt = null;
    this.staminaIntro.pending = false;
    this.staminaIntro.enabled = false;
    this.callbacks.onStaminaTutorialComplete?.();
  }

  private spendStaminaForTap(): number | null {
    if (!this.stamina.active) return 1;
    if (this.stamina.current <= 0) return null;
    const strength = Math.min(1, this.stamina.current / this.stamina.drainPerTap);
    this.stamina.current = Math.max(0, this.stamina.current - this.stamina.drainPerTap);
    this.stamina.blockedFeedback = 0;
    return strength;
  }

  private restoreStaminaFromBasket(): void {
    if (!this.stamina.active) return;
    this.stamina.current = Math.min(this.stamina.max, this.stamina.current + this.stamina.basketRestore);
    this.stamina.blockedFeedback = 0;
  }

  private triggerStaminaBlockedFeedback(): void {
    if (!this.stamina.active) return;
    this.stamina.blockedFeedback = STAMINA_BLOCKED_FEEDBACK_DURATION;
  }

  private updateStamina(dt: number): void {
    this.unlockStaminaIfNeeded();
    if (this.stamina.blockedFeedback > 0) {
      this.stamina.blockedFeedback = Math.max(0, this.stamina.blockedFeedback - dt);
    }
    if (!this.stamina.active || this.phase !== GamePhase.Playing) return;
    if (!this.ball.hasLaunched) return;
    if (this.stamina.current >= this.stamina.max) return;
    this.stamina.current = Math.min(this.stamina.max, this.stamina.current + this.stamina.regenPerSecond * dt);
  }

  private showStaminaEmptyFeedback(): void {
    this.triggerStaminaBlockedFeedback();
    this.floatingTexts.push({
      x: this.ball.x,
      y: this.ball.y - 55,
      text: 'STAMINA EMPTY',
      life: 0.9,
      vy: -35,
      color: '#94a3b8',
    });
  }

  private pauseForTutorial(): void {
    this.tutorial.prompt = getTutorialPrompt(this.tutorial.stepsCompleted);
  }

  private resumeFromTutorial(): void {
    this.tutorial.prompt = null;
    if (this.tutorial.stepsCompleted === 0) {
      this.tutorial.awaitingSuccess = true;
      return;
    }
    this.completeTutorialStep();
    this.tutorial.awaitingSuccess = false;
  }

  private completeTutorialStep(): void {
    if (!this.tutorial.enabled) return;
    this.tutorial.stepsCompleted += 1;
    if (this.tutorial.stepsCompleted >= this.tutorial.maxSteps) {
      this.tutorial.enabled = false;
      this.tutorial.awaitingSuccess = false;
      this.tutorial.prompt = null;
    }
  }

  handleTap(): void {
    if (this.pauseSource === 'platform' || this.phase === GamePhase.GameOver || this.phase === GamePhase.Menu) return;
    if (this.pauseSource === 'staminaTutorial') {
      this.resumeFromStaminaIntro();
      return;
    }
    if (this.pauseSource === 'tutorial') {
      this.resumeFromTutorial();
    }

    this.unlockStaminaIfNeeded();
    const isFirstTap = !this.firstTapDone;
    if (isFirstTap) {
      this.firstTapDone = true;
      this.phase = GamePhase.Playing;
      this.beginShotAttempt();
    }

    let staminaStrength = 1;
    if (!isFirstTap) {
      const spent = this.spendStaminaForTap();
      if (spent === null) {
        this.showStaminaEmptyFeedback();
        return;
      }
      staminaStrength = spent;
    }

    const ctx = { ball: this.ball, hoop: this.hoop, isFirstTap, staminaStrength };
    if (isFirstTap) {
      this.launchMechanic.onFirstTap(ctx);
    } else {
      if (this.ball.fallingThrough) {
        this.clearFallThrough('tap');
      }
      this.launchMechanic.onTap(ctx);
    }

    this.ball.comboAtShot = this.stats.combo;
    this.callbacks.onTap();
  }

  private updateClimb(dt: number): void {
    const diff = this.targetClimbOffset - this.climbOffset;
    if (Math.abs(diff) < 0.5) {
      this.climbOffset = this.targetClimbOffset;
      this.climbAnimating = false;
      syncHoopToCamera(this.hoop, this.climbOffset);
      return;
    }

    this.climbAnimating = true;
    const step = SCROLL_SPEED * dt;
    if (Math.abs(diff) <= step) {
      this.climbOffset = this.targetClimbOffset;
      this.climbAnimating = false;
    } else {
      this.climbOffset += Math.sign(diff) * step;
    }

    syncHoopToCamera(this.hoop, this.climbOffset);
  }

  private clearFallThrough(reason: string): void {
    if (!this.ball.fallingThrough) return;
    debugLog('fallThrough', 'cleared', {
      reason,
      level: this.stats.level,
      ballY: this.ball.y.toFixed(0),
      clearBelowY: this.clearBelowY.toFixed(0),
      hoopY: this.hoop.y.toFixed(0),
    });
    this.ball.fallingThrough = false;
    this.ball.scoredThisShot = false;
    this.ball.hitRimThisShot = false;
  }

  private tryClearFallThrough(): void {
    if (!this.ball.fallingThrough) return;
    if (this.ball.y > this.clearBelowY) {
      this.clearFallThrough('belowHoop');
      return;
    }
    // Next hoop is higher in world space — player jumps up before passing clearBelowY.
    if (this.ball.y < rimLineY(this.hoop.y)) {
      this.clearFallThrough('aboveRim');
    }
  }

  private maybePauseForTutorial(): void {
    if (!this.tutorial.enabled) return;
    const probe = createTutorialProbe(
      this.phase,
      this.ball,
      this.hoop,
      this.stats,
      this.climbOffset,
      this.targetClimbOffset,
      this.climbAnimating,
    );
    if (shouldPauseForTutorial(this.tutorial, probe, this.launchMechanic)) {
      this.pauseForTutorial();
    }
  }

  update(rawDt: number): void {
    if (this.paused) return;
    const dt = clampDt(rawDt);
    this.time += dt;

    if (this.phase === GamePhase.Menu) return;

    this.updateStamina(dt);
    this.updateClimb(dt);
    this.maybePauseForStaminaIntro();
    if (this.paused) return;

    if (this.phase === GamePhase.Playing) {
      const useFloor = !this.ball.hasLaunched;

      let bounced = false;
      integrateBall(
        this.ball,
        this.hoop,
        this.colliders,
        dt,
        () => {},
        () => {
          bounced = true;
        },
        useFloor,
      );
      updateHoop(this.hoop, dt);
      // Cloth net is expensive — half-rate on low quality phones.
      if (getRenderQuality() !== 'low' || ((this.time * 60) | 0) % 2 === 0) {
        updateHoopNet(this.hoop, this.ball, dt);
      }
      updateParticles(dt);
      this.tryClearFallThrough();
      this.collectCoins();

      if (!this.hoop.animating && !this.climbAnimating) {
        syncHoopToCamera(this.hoop, this.climbOffset);
      }
      this.tryRespawnCoinsAfterTransition();

      if (bounced && this.bounceCooldown <= 0) {
        this.callbacks.onBounce();
        this.bounceCooldown = 0.08;
      }
      this.bounceCooldown -= dt;

      const scoreResult = checkScore(this.ball, this.hoop);
      if (scoreResult) {
        if (this.tutorial.awaitingSuccess) {
          this.completeTutorialStep();
          this.tutorial.awaitingSuccess = false;
        }
        debugLog('score', 'basket!', {
          level: this.stats.level,
          swish: scoreResult.isSwish,
          ballY: this.ball.y.toFixed(0),
          hoopY: this.hoop.y.toFixed(0),
        });
        this.ball.scoredThisShot = true;
        this.ball.fallingThrough = true;
        this.clearBelowY = this.hoop.y + HOOP_CLEARANCE;

        applyScore(scoreResult, this.stats, this.ball, this.floatingTexts);
        this.beginShotAttempt();

        this.stats.level += 1;
        this.unlockStaminaIfNeeded();
        this.restoreStaminaFromBasket();
        this.targetClimbOffset += CLIMB_PER_BASKET;
        this.climbAnimating = true;

        onBasket(this.hoop, this.targetClimbOffset);
        this.coins = [];
        this.pendingCoinRespawn = true;
        resetHoopNet(this.hoop);

        const q = getRenderQuality();
        const burstCount =
          q === 'low' ? (scoreResult.isSwish ? 8 : 5) : scoreResult.isSwish ? 28 : 16;
        spawnBurst(
          this.ball.x,
          this.ball.y,
          scoreResult.isSwish ? '#ffffff' : '#f3c14d',
          burstCount,
        );
        if (scoreResult.isSwish && q !== 'low') spawnSwishFlash(this.ball.x, this.ball.y);
        this.shake = scoreResult.isSwish ? 16 : 9;
        this.shakeDuration = scoreResult.isSwish ? 0.32 : 0.18;
        this.shakeTimer = this.shakeDuration;
        this.callbacks.onScore(scoreResult.points, scoreResult.isSwish);
        if (scoreResult.isSwish) this.callbacks.onSwoosh();
      }

      this.maybePauseForTutorial();

      if (this.ball.hasLaunched && isBallOffScreen(this.ball.y, this.ball.radius, this.climbOffset)) {
        this.resetTutorialRunState();
        this.phase = GamePhase.GameOver;
        this.callbacks.onGameOver(this.stats);
      }
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;
      ft.y += ft.vy * dt;
      if (ft.life <= 0) this.floatingTexts.splice(i, 1);
    }

    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt;
      if (this.shakeTimer <= 0) this.shake = 0;
    }
  }
}
