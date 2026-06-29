import {
  BALL_RADIUS,
  BALL_SPAWN_X,
  BALL_SPAWN_Y,
  CLIMB_PER_BASKET,
  HOOP_CLEARANCE,
  INITIAL_CLIMB_OFFSET,
  isBallOffScreen,
  SCROLL_SPEED,
} from './constants';
import { createColliders } from './collision';
import { createHoop, onBasket, syncHoopToCamera, updateHoop } from './hoop';
import { resetHoopNet, updateHoopNet } from './netPhysics';
import type { LaunchMechanic } from './mechanics/LaunchMechanic';
import { clampDt, integrateBall } from './physics';
import { clearParticles, spawnBurst, updateParticles } from './particles';
import { applyScore, checkScore } from './scoring';
import { GamePhase, type Ball, type FloatingText, type Hoop, type RunStats } from './types';

export interface GameCallbacks {
  onScore(points: number, isSwish: boolean): void;
  onGameOver(stats: RunStats): void;
  onTap(): void;
  onBounce(): void;
  onSwoosh(): void;
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

export class Game {
  phase: GamePhase = GamePhase.Menu;
  ball: Ball = createBall();
  hoop: Hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
  stats: RunStats = createStats();
  floatingTexts: FloatingText[] = [];
  shake = 0;
  shakeTimer = 0;
  paused = false;
  colliders = createColliders();

  climbOffset = INITIAL_CLIMB_OFFSET;
  targetClimbOffset = INITIAL_CLIMB_OFFSET;
  climbAnimating = false;
  time = 0;

  private firstTapDone = false;
  private bounceCooldown = 0;
  private clearBelowY = 0;

  constructor(
    private launchMechanic: LaunchMechanic,
    private callbacks: GameCallbacks,
  ) {}

  reset(): void {
    this.phase = GamePhase.Idle;
    this.ball = createBall();
    this.climbOffset = INITIAL_CLIMB_OFFSET;
    this.targetClimbOffset = INITIAL_CLIMB_OFFSET;
    this.climbAnimating = false;
    this.time = 0;
    this.hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
    resetHoopNet(this.hoop);
    this.stats = createStats();
    this.floatingTexts = [];
    this.shake = 0;
    this.shakeTimer = 0;
    this.firstTapDone = false;
    this.bounceCooldown = 0;
    this.clearBelowY = 0;
    clearParticles();
    this.launchMechanic.reset();
  }

  returnToMenu(): void {
    this.reset();
    this.phase = GamePhase.Menu;
  }

  handleTap(): void {
    if (this.paused || this.phase === GamePhase.GameOver || this.phase === GamePhase.Menu) return;

    const isFirstTap = !this.firstTapDone;
    if (isFirstTap) {
      this.firstTapDone = true;
      this.phase = GamePhase.Playing;
    }

    const ctx = { ball: this.ball, hoop: this.hoop, isFirstTap };
    if (isFirstTap) {
      this.launchMechanic.onFirstTap(ctx);
    } else {
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

  private tryClearFallThrough(): void {
    if (!this.ball.fallingThrough) return;
    if (this.ball.y > this.clearBelowY) {
      this.ball.fallingThrough = false;
      this.ball.scoredThisShot = false;
      this.ball.hitRimThisShot = false;
    }
  }

  update(rawDt: number): void {
    if (this.paused) return;
    const dt = clampDt(rawDt);
    this.time += dt;

    if (this.phase === GamePhase.Menu) return;

    this.updateClimb(dt);

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
      updateHoopNet(this.hoop, this.ball, dt);
      updateParticles(dt);
      this.tryClearFallThrough();

      if (!this.hoop.animating && !this.climbAnimating) {
        syncHoopToCamera(this.hoop, this.climbOffset);
      }

      if (bounced && this.bounceCooldown <= 0) {
        this.callbacks.onBounce();
        this.bounceCooldown = 0.08;
      }
      this.bounceCooldown -= dt;

      const scoreResult = checkScore(this.ball, this.hoop);
      if (scoreResult) {
        this.ball.scoredThisShot = true;
        this.ball.fallingThrough = true;
        this.clearBelowY = this.hoop.y + HOOP_CLEARANCE;

        applyScore(scoreResult, this.stats, this.ball, this.floatingTexts);

        this.stats.level += 1;
        this.targetClimbOffset += CLIMB_PER_BASKET;
        this.climbAnimating = true;

        onBasket(this.hoop, this.targetClimbOffset);
        resetHoopNet(this.hoop);

        spawnBurst(
          this.ball.x,
          this.ball.y,
          scoreResult.isSwish ? '#ffffff' : '#f3c14d',
          scoreResult.isSwish ? 24 : 14,
        );
        this.shake = scoreResult.isSwish ? 14 : 8;
        this.shakeTimer = scoreResult.isSwish ? 0.25 : 0.15;
        this.callbacks.onScore(scoreResult.points, scoreResult.isSwish);
        if (scoreResult.isSwish) this.callbacks.onSwoosh();
      }

      if (this.ball.hasLaunched && isBallOffScreen(this.ball.y, this.ball.radius, this.climbOffset)) {
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
