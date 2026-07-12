import {
  BALL_RADIUS,
  BALL_SPAWN_Y,
  CANVAS_WIDTH,
  CLIMB_PER_BASKET,
  HOOP_CLEARANCE,
  INITIAL_CLIMB_OFFSET,
  isBallOffScreen,
  SCROLL_SPEED,
  VERSUS_DURATION_SEC,
  VERSUS_P1_SPAWN_X,
  VERSUS_P2_SPAWN_X,
} from './constants';
import { createColliders } from './collision';
import { resolveBallBallCollision } from './ballBallCollision';
import { createHoop, onBasket, syncHoopToCamera, updateHoop } from './hoop';
import { resetHoopNet, updateHoopNet } from './netPhysics';
import type { LaunchMechanic } from './mechanics/LaunchMechanic';
import { clampDt, integrateBall } from './physics';
import { clearParticles, spawnBurst, spawnSwishFlash, updateParticles } from './particles';
import { checkScore } from './scoring';
import { getRenderQuality } from './renderQuality';
import { GamePhase, type Ball, type FloatingText, type Hoop } from './types';

export type VersusPlayerId = 0 | 1;

export interface VersusResult {
  scoreP1: number;
  scoreP2: number;
  winner: 'p1' | 'p2' | 'draw';
  durationSec: number;
}

export interface VersusCallbacks {
  onScore(player: VersusPlayerId, scoreP1: number, scoreP2: number): void;
  onMatchEnd(result: VersusResult): void;
  onTap(): void;
  onBounce(): void;
  onSwoosh(): void;
}

function createVersusBall(x: number): Ball {
  return {
    x,
    y: BALL_SPAWN_Y,
    vx: 0,
    vy: 0,
    radius: BALL_RADIUS,
    hasLaunched: false,
    scoredThisShot: false,
    hitRimThisShot: false,
    fallingThrough: false,
    rotation: 0,
    frameStartX: x,
    frameStartY: BALL_SPAWN_Y,
    frameStartVelY: 0,
    comboAtShot: 0,
  };
}

export class VersusGame {
  phase: GamePhase = GamePhase.Menu;
  hoop: Hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
  balls: [Ball, Ball] = [
    createVersusBall(VERSUS_P1_SPAWN_X),
    createVersusBall(VERSUS_P2_SPAWN_X),
  ];
  scoreP1 = 0;
  scoreP2 = 0;
  timeLeft = VERSUS_DURATION_SEC;
  floatingTexts: FloatingText[] = [];
  shake = 0;
  shakeTimer = 0;
  colliders = createColliders();
  climbOffset = INITIAL_CLIMB_OFFSET;
  targetClimbOffset = INITIAL_CLIMB_OFFSET;
  climbAnimating = false;
  time = 0;

  prevBallX: [number, number] = [0, 0];
  prevBallY: [number, number] = [0, 0];
  prevBallRot: [number, number] = [0, 0];
  prevClimbOffset = INITIAL_CLIMB_OFFSET;
  prevHoopX = 0;
  prevHoopY = 0;
  prevHoopTilt = 0;

  private platformPaused = false;
  private bounceCooldown = 0;
  private clearBelowY = [0, 0];
  private ended = false;
  /** Guest online mode: simulate motion only; host snapshots own scores/timer/hoop. */
  networkPuppet = false;

  constructor(
    private launchMechanic: LaunchMechanic,
    private callbacks: VersusCallbacks,
  ) {}

  set paused(value: boolean) {
    this.platformPaused = value;
  }

  get paused(): boolean {
    return this.platformPaused;
  }

  reset(): void {
    this.phase = GamePhase.Idle;
    this.ended = false;
    this.networkPuppet = false;
    this.hoop = createHoop('right', INITIAL_CLIMB_OFFSET);
    this.balls = [
      createVersusBall(VERSUS_P1_SPAWN_X),
      createVersusBall(VERSUS_P2_SPAWN_X),
    ];
    this.scoreP1 = 0;
    this.scoreP2 = 0;
    this.timeLeft = VERSUS_DURATION_SEC;
    this.climbOffset = INITIAL_CLIMB_OFFSET;
    this.targetClimbOffset = INITIAL_CLIMB_OFFSET;
    this.climbAnimating = false;
    this.time = 0;
    this.floatingTexts = [];
    this.shake = 0;
    this.shakeTimer = 0;
    this.bounceCooldown = 0;
    this.clearBelowY = [0, 0];
    resetHoopNet(this.hoop);
    clearParticles();
    this.launchMechanic.reset();
    this.syncRenderPrev();
  }

  returnToMenu(): void {
    this.phase = GamePhase.Menu;
    this.ended = false;
    this.networkPuppet = false;
  }

  captureRenderPrev(): void {
    for (let i = 0; i < 2; i += 1) {
      this.prevBallX[i] = this.balls[i].x;
      this.prevBallY[i] = this.balls[i].y;
      this.prevBallRot[i] = this.balls[i].rotation;
    }
    this.prevClimbOffset = this.climbOffset;
    this.prevHoopX = this.hoop.x;
    this.prevHoopY = this.hoop.y;
    this.prevHoopTilt = this.hoop.tilt;
  }

  syncRenderPrev(): void {
    this.captureRenderPrev();
  }

  getDisplayBall(index: VersusPlayerId, alpha: number): { x: number; y: number; rotation: number } {
    const t = Math.max(0, Math.min(1, alpha));
    const ball = this.balls[index];
    const dx = ball.x - this.prevBallX[index];
    if (Math.abs(dx) > CANVAS_WIDTH * 0.5) {
      return { x: ball.x, y: ball.y, rotation: ball.rotation };
    }
    return {
      x: this.prevBallX[index] + dx * t,
      y: this.prevBallY[index] + (ball.y - this.prevBallY[index]) * t,
      rotation: this.prevBallRot[index] + (ball.rotation - this.prevBallRot[index]) * t,
    };
  }

  getDisplayClimbOffset(alpha: number): number {
    const t = Math.max(0, Math.min(1, alpha));
    return this.prevClimbOffset + (this.climbOffset - this.prevClimbOffset) * t;
  }

  getDisplayHoop(alpha: number): Hoop {
    const t = Math.max(0, Math.min(1, alpha));
    return {
      ...this.hoop,
      x: this.prevHoopX + (this.hoop.x - this.prevHoopX) * t,
      y: this.prevHoopY + (this.hoop.y - this.prevHoopY) * t,
      tilt: this.prevHoopTilt + (this.hoop.tilt - this.prevHoopTilt) * t,
    };
  }

  getDisplayShake(): number {
    return this.shake;
  }

  exportSnapshot(seq: number): import('../../shared/contracts/mp').MpMatchSnapshot {
    const r1 = (n: number) => Math.round(n * 10) / 10;
    const r2 = (n: number) => Math.round(n * 100) / 100;
    return {
      seq,
      timeLeft: r2(this.timeLeft),
      scoreP1: this.scoreP1,
      scoreP2: this.scoreP2,
      climbOffset: r1(this.climbOffset),
      targetClimbOffset: r1(this.targetClimbOffset),
      climbAnimating: this.climbAnimating,
      hoop: {
        side: this.hoop.side,
        x: r1(this.hoop.x),
        y: r1(this.hoop.y),
        targetX: r1(this.hoop.targetX),
        targetY: r1(this.hoop.targetY),
        slideFromX: r1(this.hoop.slideFromX),
        slideFromY: r1(this.hoop.slideFromY),
        slideT: r2(this.hoop.slideT),
        tilt: r2(this.hoop.tilt),
        tiltVel: r2(this.hoop.tiltVel),
        animating: this.hoop.animating,
      },
      balls: [
        {
          x: r1(this.balls[0].x),
          y: r1(this.balls[0].y),
          vx: r1(this.balls[0].vx),
          vy: r1(this.balls[0].vy),
          rotation: r2(this.balls[0].rotation),
          hasLaunched: this.balls[0].hasLaunched,
          fallingThrough: this.balls[0].fallingThrough,
          scoredThisShot: this.balls[0].scoredThisShot,
          hitRimThisShot: this.balls[0].hitRimThisShot,
        },
        {
          x: r1(this.balls[1].x),
          y: r1(this.balls[1].y),
          vx: r1(this.balls[1].vx),
          vy: r1(this.balls[1].vy),
          rotation: r2(this.balls[1].rotation),
          hasLaunched: this.balls[1].hasLaunched,
          fallingThrough: this.balls[1].fallingThrough,
          scoredThisShot: this.balls[1].scoredThisShot,
          hitRimThisShot: this.balls[1].hitRimThisShot,
        },
      ],
    };
  }

  applySnapshot(state: import('../../shared/contracts/mp').MpMatchSnapshot): void {
    this.phase = GamePhase.Playing;
    this.timeLeft = state.timeLeft;
    this.scoreP1 = state.scoreP1;
    this.scoreP2 = state.scoreP2;
    this.climbOffset = state.climbOffset;
    this.targetClimbOffset = state.targetClimbOffset;
    this.climbAnimating = state.climbAnimating;
    Object.assign(this.hoop, state.hoop);
    for (let i = 0; i < 2; i += 1) {
      const ball = this.balls[i];
      const snap = state.balls[i];
      ball.x = snap.x;
      ball.y = snap.y;
      ball.vx = snap.vx;
      ball.vy = snap.vy;
      ball.rotation = snap.rotation;
      ball.hasLaunched = snap.hasLaunched;
      ball.fallingThrough = snap.fallingThrough;
      ball.scoredThisShot = snap.scoredThisShot;
      ball.hitRimThisShot = snap.hitRimThisShot;
      ball.frameStartX = snap.x;
      ball.frameStartY = snap.y;
      ball.frameStartVelY = snap.vy;
    }
  }

  handleTap(player: VersusPlayerId): void {
    if (this.paused || this.ended) return;
    if (this.phase === GamePhase.Menu || this.phase === GamePhase.GameOver) return;

    const ball = this.balls[player];
    if (this.phase === GamePhase.Idle) {
      this.phase = GamePhase.Playing;
    }

    this.callbacks.onTap();
    this.launchMechanic.onTap({
      ball,
      hoop: this.hoop,
      isFirstTap: !ball.hasLaunched,
      staminaStrength: 1,
    });
    if (ball.hasLaunched) {
      ball.hitRimThisShot = false;
      ball.scoredThisShot = false;
      ball.comboAtShot = 0;
    }
  }

  private softRespawn(player: VersusPlayerId): void {
    const spawnX = player === 0 ? VERSUS_P1_SPAWN_X : VERSUS_P2_SPAWN_X;
    const ball = this.balls[player];
    ball.x = spawnX;
    ball.y = BALL_SPAWN_Y - (this.climbOffset - INITIAL_CLIMB_OFFSET);
    ball.vx = 0;
    ball.vy = 0;
    ball.hasLaunched = false;
    ball.scoredThisShot = false;
    ball.hitRimThisShot = false;
    ball.fallingThrough = false;
    ball.rotation = 0;
    ball.frameStartX = ball.x;
    ball.frameStartY = ball.y;
    ball.frameStartVelY = 0;
  }

  private tryClearFallThrough(player: VersusPlayerId): void {
    const ball = this.balls[player];
    if (!ball.fallingThrough) return;
    if (ball.y - ball.radius > this.clearBelowY[player]) {
      ball.fallingThrough = false;
      ball.scoredThisShot = false;
    }
  }

  private updateClimb(dt: number): void {
    if (!this.climbAnimating) return;
    const dy = this.targetClimbOffset - this.climbOffset;
    if (Math.abs(dy) < 0.5) {
      this.climbOffset = this.targetClimbOffset;
      this.climbAnimating = false;
      return;
    }
    const step = Math.sign(dy) * Math.min(Math.abs(dy), SCROLL_SPEED * dt);
    this.climbOffset += step;
  }

  /** Mark over without firing onMatchEnd (used by online guest / forfeit). */
  markMatchOver(): void {
    this.ended = true;
    this.phase = GamePhase.GameOver;
  }

  private finishMatch(): void {
    if (this.ended) return;
    this.ended = true;
    this.phase = GamePhase.GameOver;
    const winner =
      this.scoreP1 === this.scoreP2 ? 'draw' : this.scoreP1 > this.scoreP2 ? 'p1' : 'p2';
    this.callbacks.onMatchEnd({
      scoreP1: this.scoreP1,
      scoreP2: this.scoreP2,
      winner,
      durationSec: VERSUS_DURATION_SEC,
    });
  }

  private applyPlayerScore(player: VersusPlayerId, isSwish: boolean): void {
    const ball = this.balls[player];
    ball.scoredThisShot = true;
    ball.fallingThrough = true;
    this.clearBelowY[player] = this.hoop.y + HOOP_CLEARANCE;

    if (player === 0) this.scoreP1 += 1;
    else this.scoreP2 += 1;

    this.floatingTexts.push({
      x: ball.x,
      y: ball.y - 40,
      text: '+1',
      life: 1.2,
      vy: -80,
      color: isSwish ? '#4ade80' : '#fbbf24',
    });

    this.callbacks.onScore(player, this.scoreP1, this.scoreP2);
    if (isSwish) this.callbacks.onSwoosh();
  }

  private advanceSharedCourt(isSwish: boolean, celebrateBall: Ball): void {
    this.targetClimbOffset += CLIMB_PER_BASKET;
    this.climbAnimating = true;
    onBasket(this.hoop, this.targetClimbOffset);
    resetHoopNet(this.hoop);

    const q = getRenderQuality();
    const burstCount = q === 'low' ? (isSwish ? 8 : 5) : isSwish ? 28 : 16;
    spawnBurst(celebrateBall.x, celebrateBall.y, isSwish ? '#ffffff' : '#f3c14d', burstCount);
    if (isSwish && q !== 'low') spawnSwishFlash(celebrateBall.x, celebrateBall.y);
    this.shake = isSwish ? 16 : 9;
    this.shakeTimer = isSwish ? 0.32 : 0.18;
  }

  update(rawDt: number): void {
    if (this.paused || this.ended) return;
    const dt = clampDt(rawDt);
    this.time += dt;

    if (this.phase === GamePhase.Menu) return;

    this.updateClimb(dt);

    if (this.phase === GamePhase.Playing || this.phase === GamePhase.Idle) {
      if (!this.networkPuppet && this.phase === GamePhase.Playing) {
        this.timeLeft = Math.max(0, this.timeLeft - dt);
        if (this.timeLeft <= 0) {
          this.finishMatch();
          return;
        }
      }

      let bounced = false;
      for (let i = 0; i < 2; i += 1) {
        const ball = this.balls[i];
        const useFloor = !ball.hasLaunched;
        integrateBall(
          ball,
          this.hoop,
          this.colliders,
          dt,
          () => {
            ball.hitRimThisShot = true;
          },
          () => {
            bounced = true;
          },
          useFloor,
        );
        this.tryClearFallThrough(i as VersusPlayerId);
      }

      resolveBallBallCollision(this.balls[0], this.balls[1]);

      updateHoop(this.hoop, dt);
      const netBall =
        this.balls[0].hasLaunched || !this.balls[1].hasLaunched
          ? this.balls[0]
          : this.balls[1];
      updateHoopNet(this.hoop, netBall, dt);
      updateParticles(dt);

      if (!this.hoop.animating && !this.climbAnimating) {
        syncHoopToCamera(this.hoop, this.climbOffset);
      }

      if (bounced && this.bounceCooldown <= 0) {
        this.callbacks.onBounce();
        this.bounceCooldown = 0.08;
      }
      this.bounceCooldown -= dt;

      if (!this.networkPuppet) {
        // Score check — gather first so simultaneous baskets share one climb/flip.
        const scored: Array<{ player: VersusPlayerId; isSwish: boolean }> = [];
        for (let i = 0; i < 2; i += 1) {
          const result = checkScore(this.balls[i], this.hoop);
          if (result) scored.push({ player: i as VersusPlayerId, isSwish: result.isSwish });
        }
        if (scored.length > 0) {
          for (const hit of scored) {
            this.applyPlayerScore(hit.player, hit.isSwish);
          }
          this.advanceSharedCourt(
            scored[scored.length - 1]!.isSwish,
            this.balls[scored[scored.length - 1]!.player],
          );
        }
      }

      for (let i = 0; i < 2; i += 1) {
        const ball = this.balls[i];
        if (ball.hasLaunched && isBallOffScreen(ball.y, ball.radius, this.climbOffset)) {
          this.softRespawn(i as VersusPlayerId);
        }
      }
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i -= 1) {
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
