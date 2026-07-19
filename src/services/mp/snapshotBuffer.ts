import type { MpBallSnap, MpHoopSnap, MpMatchSnapshot } from '../../../shared/contracts/mp';
import { CANVAS_WIDTH } from '../../game/constants';

const MAX_BUFFER = 32;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpWrappedX(a: number, b: number, t: number): number {
  let delta = b - a;
  if (Math.abs(delta) > CANVAS_WIDTH * 0.5) {
    delta -= Math.sign(delta) * (CANVAS_WIDTH + 60);
  }
  let value = a + delta * t;
  if (value < -30) value += CANVAS_WIDTH + 60;
  if (value > CANVAS_WIDTH + 30) value -= CANVAS_WIDTH + 60;
  return value;
}

function wrapX(value: number): number {
  if (value < -30) return value + CANVAS_WIDTH + 60;
  if (value > CANVAS_WIDTH + 30) return value - CANVAS_WIDTH - 60;
  return value;
}

function lerpBall(a: MpBallSnap, b: MpBallSnap, t: number): MpBallSnap {
  return {
    x: lerpWrappedX(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    vx: lerp(a.vx, b.vx, t),
    vy: lerp(a.vy, b.vy, t),
    rotation: lerp(a.rotation, b.rotation, t),
    hasLaunched: t < 0.5 ? a.hasLaunched : b.hasLaunched,
    fallingThrough: t < 0.5 ? a.fallingThrough : b.fallingThrough,
    scoredThisShot: t < 0.5 ? a.scoredThisShot : b.scoredThisShot,
    hitRimThisShot: t < 0.5 ? a.hitRimThisShot : b.hitRimThisShot,
  };
}

function lerpHoop(a: MpHoopSnap, b: MpHoopSnap, t: number): MpHoopSnap {
  return {
    side: t < 0.5 ? a.side : b.side,
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    targetX: lerp(a.targetX, b.targetX, t),
    targetY: lerp(a.targetY, b.targetY, t),
    slideFromX: lerp(a.slideFromX, b.slideFromX, t),
    slideFromY: lerp(a.slideFromY, b.slideFromY, t),
    slideT: lerp(a.slideT, b.slideT, t),
    tilt: lerp(a.tilt, b.tilt, t),
    tiltVel: lerp(a.tiltVel, b.tiltVel, t),
    animating: t < 0.5 ? a.animating : b.animating,
  };
}

export function lerpSnapshot(a: MpMatchSnapshot, b: MpMatchSnapshot, t: number): MpMatchSnapshot {
  const u = Math.max(0, Math.min(1, t));
  return {
    seq: b.seq,
    tick: b.tick,
    serverTime: lerp(a.serverTime, b.serverTime, u),
    ackTapSeq: b.ackTapSeq,
    timeLeft: lerp(a.timeLeft, b.timeLeft, u),
    scoreP1: u < 1 ? a.scoreP1 : b.scoreP1,
    scoreP2: u < 1 ? a.scoreP2 : b.scoreP2,
    climbOffset: lerp(a.climbOffset, b.climbOffset, u),
    targetClimbOffset: lerp(a.targetClimbOffset, b.targetClimbOffset, u),
    climbAnimating: u < 0.5 ? a.climbAnimating : b.climbAnimating,
    hoop: lerpHoop(a.hoop, b.hoop, u),
    balls: [lerpBall(a.balls[0], b.balls[0], u), lerpBall(a.balls[1], b.balls[1], u)],
  };
}

/**
 * Holds authoritative snapshots and samples the world at a delayed render time
 * (classic entity interpolation).
 */
export class SnapshotBuffer {
  private snaps: MpMatchSnapshot[] = [];
  private arrivalJitterMs = 0;
  private lastArrivalAt = 0;
  private lastServerTime = 0;
  private sampleCount = 0;
  private underrunCount = 0;

  clear(): void {
    this.snaps = [];
    this.arrivalJitterMs = 0;
    this.lastArrivalAt = 0;
    this.lastServerTime = 0;
    this.sampleCount = 0;
    this.underrunCount = 0;
  }

  push(state: MpMatchSnapshot, receivedAt = Date.now()): void {
    if (this.snaps.length > 0 && state.seq <= this.snaps[this.snaps.length - 1]!.seq) {
      return;
    }
    if (this.lastArrivalAt > 0 && this.lastServerTime > 0) {
      const arrivalGap = receivedAt - this.lastArrivalAt;
      const publishGap = state.serverTime - this.lastServerTime;
      const sample = Math.abs(arrivalGap - publishGap);
      this.arrivalJitterMs =
        this.arrivalJitterMs === 0 ? sample : this.arrivalJitterMs * 0.85 + sample * 0.15;
    }
    this.lastArrivalAt = receivedAt;
    this.lastServerTime = state.serverTime;
    this.snaps.push(state);
    if (this.snaps.length > MAX_BUFFER) {
      this.snaps.splice(0, this.snaps.length - MAX_BUFFER);
    }
  }

  get latest(): MpMatchSnapshot | null {
    return this.snaps.length > 0 ? this.snaps[this.snaps.length - 1]! : null;
  }

  get size(): number {
    return this.snaps.length;
  }

  get jitterMs(): number {
    return this.arrivalJitterMs;
  }

  get underrunRate(): number {
    return this.sampleCount > 0 ? this.underrunCount / this.sampleCount : 0;
  }

  recommendedDelayMs(rttMs: number): number {
    return Math.max(80, Math.min(300, rttMs * 0.5 + 55 + this.arrivalJitterMs * 2));
  }

  /**
   * Sample interpolated state on the synchronized server timeline.
   */
  sampleAt(renderServerTime: number): MpMatchSnapshot | null {
    if (this.snaps.length === 0) return null;
    this.sampleCount += 1;

    const first = this.snaps[0]!;
    const last = this.snaps[this.snaps.length - 1]!;

    if (renderServerTime <= first.serverTime) return first;
    if (renderServerTime >= last.serverTime) {
      if (renderServerTime - last.serverTime > 80) this.underrunCount += 1;
      // Extrapolate slightly past last snap using velocity.
      const dt = Math.min(0.08, (renderServerTime - last.serverTime) / 1000);
      if (dt <= 0) return last;
      return {
        ...last,
        balls: [
          {
            ...last.balls[0],
            x: wrapX(last.balls[0].x + last.balls[0].vx * dt),
            y: last.balls[0].y + last.balls[0].vy * dt,
          },
          {
            ...last.balls[1],
            x: wrapX(last.balls[1].x + last.balls[1].vx * dt),
            y: last.balls[1].y + last.balls[1].vy * dt,
          },
        ],
      };
    }

    for (let i = 0; i < this.snaps.length - 1; i += 1) {
      const a = this.snaps[i]!;
      const b = this.snaps[i + 1]!;
      if (renderServerTime >= a.serverTime && renderServerTime <= b.serverTime) {
        const span = b.serverTime - a.serverTime;
        const t = span > 0 ? (renderServerTime - a.serverTime) / span : 1;
        return lerpSnapshot(a, b, t);
      }
    }

    return last;
  }
}
