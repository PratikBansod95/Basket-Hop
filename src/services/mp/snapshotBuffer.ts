import type { MpBallSnap, MpHoopSnap, MpMatchSnapshot } from '../../../shared/contracts/mp';

const MAX_BUFFER = 32;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpBall(a: MpBallSnap, b: MpBallSnap, t: number): MpBallSnap {
  return {
    x: lerp(a.x, b.x, t),
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
    serverTime: lerp(a.serverTime, b.serverTime, u),
    timeLeft: b.timeLeft,
    scoreP1: b.scoreP1,
    scoreP2: b.scoreP2,
    climbOffset: lerp(a.climbOffset, b.climbOffset, u),
    targetClimbOffset: lerp(a.targetClimbOffset, b.targetClimbOffset, u),
    climbAnimating: u < 0.5 ? a.climbAnimating : b.climbAnimating,
    hoop: lerpHoop(a.hoop, b.hoop, u),
    balls: [lerpBall(a.balls[0], b.balls[0], u), lerpBall(a.balls[1], b.balls[1], u)],
  };
}

/**
 * Holds host snapshots and samples the world at a delayed render time
 * (classic entity interpolation).
 */
export class SnapshotBuffer {
  private snaps: MpMatchSnapshot[] = [];

  clear(): void {
    this.snaps = [];
  }

  push(state: MpMatchSnapshot): void {
    if (this.snaps.length > 0 && state.seq <= this.snaps[this.snaps.length - 1]!.seq) {
      return;
    }
    this.snaps.push(state);
    if (this.snaps.length > MAX_BUFFER) {
      this.snaps.splice(0, this.snaps.length - MAX_BUFFER);
    }
  }

  get latest(): MpMatchSnapshot | null {
    return this.snaps.length > 0 ? this.snaps[this.snaps.length - 1]! : null;
  }

  /**
   * Sample interpolated state at host timeline `renderHostTime`
   * (typically latest.serverTime - delay, mapped onto host clock).
   */
  sampleAt(renderHostTime: number): MpMatchSnapshot | null {
    if (this.snaps.length === 0) return null;
    if (this.snaps.length === 1) return this.snaps[0]!;

    const first = this.snaps[0]!;
    const last = this.snaps[this.snaps.length - 1]!;

    if (renderHostTime <= first.serverTime) return first;
    if (renderHostTime >= last.serverTime) {
      // Extrapolate slightly past last snap using velocity.
      const dt = Math.min(0.08, (renderHostTime - last.serverTime) / 1000);
      if (dt <= 0) return last;
      return {
        ...last,
        balls: [
          {
            ...last.balls[0],
            x: last.balls[0].x + last.balls[0].vx * dt,
            y: last.balls[0].y + last.balls[0].vy * dt,
          },
          {
            ...last.balls[1],
            x: last.balls[1].x + last.balls[1].vx * dt,
            y: last.balls[1].y + last.balls[1].vy * dt,
          },
        ],
      };
    }

    for (let i = 0; i < this.snaps.length - 1; i += 1) {
      const a = this.snaps[i]!;
      const b = this.snaps[i + 1]!;
      if (renderHostTime >= a.serverTime && renderHostTime <= b.serverTime) {
        const span = b.serverTime - a.serverTime;
        const t = span > 0 ? (renderHostTime - a.serverTime) / span : 1;
        return lerpSnapshot(a, b, t);
      }
    }

    return last;
  }
}

/** Interp delay from RTT: clamp(rtt/2 + 40, 60, 140). */
export function interpDelayMs(rttMs: number): number {
  return Math.max(60, Math.min(140, rttMs * 0.5 + 40));
}
