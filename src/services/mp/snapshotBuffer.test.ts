import { describe, expect, it } from 'vitest';
import type { MpMatchSnapshot } from '../../../shared/contracts/mp';
import { SnapshotBuffer, lerpSnapshot } from './snapshotBuffer';

function snapshot(
  seq: number,
  serverTime: number,
  overrides: Partial<MpMatchSnapshot> = {},
): MpMatchSnapshot {
  return {
    seq,
    tick: seq * 3,
    serverTime,
    ackTapSeq: [0, 0],
    timeLeft: 120 - seq * 0.05,
    scoreP1: 0,
    scoreP2: 0,
    climbOffset: 0,
    targetClimbOffset: 0,
    climbAnimating: false,
    hoop: {
      side: 'right',
      x: 700,
      y: 400,
      targetX: 700,
      targetY: 400,
      slideFromX: 700,
      slideFromY: 400,
      slideT: 1,
      tilt: 0,
      tiltVel: 0,
      animating: false,
    },
    balls: [
      {
        x: seq * 10,
        y: 500,
        vx: 100,
        vy: 0,
        rotation: 0,
        hasLaunched: true,
        fallingThrough: false,
        scoredThisShot: false,
        hitRimThisShot: false,
      },
      {
        x: 500,
        y: 500,
        vx: 0,
        vy: 0,
        rotation: 0,
        hasLaunched: false,
        fallingThrough: false,
        scoredThisShot: false,
        hitRimThisShot: false,
      },
    ],
    ...overrides,
  };
}

describe('SnapshotBuffer', () => {
  it('rejects stale snapshots and interpolates continuous state', () => {
    const buffer = new SnapshotBuffer();
    buffer.push(snapshot(1, 1_000), 1_050);
    buffer.push(snapshot(2, 1_050), 1_100);
    buffer.push(snapshot(1, 1_025, { balls: [snapshot(1, 0).balls[0], snapshot(1, 0).balls[1]] }), 1_125);

    expect(buffer.size).toBe(2);
    expect(buffer.sampleAt(1_025)?.balls[0].x).toBeCloseTo(15);
  });

  it('does not expose a later score before its sample boundary', () => {
    const a = snapshot(1, 1_000, { scoreP1: 0 });
    const b = snapshot(2, 1_050, { scoreP1: 1 });

    expect(lerpSnapshot(a, b, 0.99).scoreP1).toBe(0);
    expect(lerpSnapshot(a, b, 1).scoreP1).toBe(1);
  });

  it('interpolates across horizontal wrap without crossing the whole court', () => {
    const a = snapshot(1, 1_000);
    const b = snapshot(2, 1_050);
    a.balls[0].x = 745;
    b.balls[0].x = -20;

    const midpoint = lerpSnapshot(a, b, 0.5).balls[0].x;
    expect(midpoint > 700 || midpoint < 20).toBe(true);
  });

  it('adapts interpolation delay to arrival jitter', () => {
    const buffer = new SnapshotBuffer();
    buffer.push(snapshot(1, 1_000), 1_020);
    buffer.push(snapshot(2, 1_050), 1_070);
    const stableDelay = buffer.recommendedDelayMs(80);
    buffer.push(snapshot(3, 1_100), 1_180);

    expect(buffer.jitterMs).toBeGreaterThan(0);
    expect(buffer.recommendedDelayMs(80)).toBeGreaterThan(stableDelay);
  });

  it('caps extrapolation to 80 milliseconds and records prolonged underruns', () => {
    const buffer = new SnapshotBuffer();
    buffer.push(snapshot(1, 1_000), 1_020);
    const sampled = buffer.sampleAt(1_200)!;

    expect(sampled.balls[0].x).toBeCloseTo(18);
    expect(buffer.underrunRate).toBe(1);
  });

  it.each([
    { rtt: 40, jitter: 5 },
    { rtt: 150, jitter: 40 },
    { rtt: 250, jitter: 80 },
  ])('keeps remote motion continuous at $rtt ms RTT and $jitter ms jitter', ({ rtt, jitter }) => {
    const buffer = new SnapshotBuffer();
    const packets: Array<{ arrival: number; state: MpMatchSnapshot }> = [];
    let previousArrival = 0;
    for (let seq = 1; seq <= 80; seq += 1) {
      const publishedAt = seq * 50;
      const signedJitter = (((seq * 37) % 101) / 100 - 0.5) * jitter * 2;
      const arrival = Math.max(previousArrival + 1, publishedAt + rtt * 0.5 + signedJitter);
      previousArrival = arrival;
      const state = snapshot(seq, publishedAt);
      state.balls[0].x = 100 + publishedAt * 0.1;
      state.balls[0].vx = 100;
      packets.push({ arrival, state });
    }

    let packetIndex = 0;
    let previousX: number | null = null;
    let maxFrameMovement = 0;
    for (let now = 0; now <= 4_000; now += 16) {
      while (packets[packetIndex] && packets[packetIndex]!.arrival <= now) {
        const packet = packets[packetIndex]!;
        buffer.push(packet.state, packet.arrival);
        packetIndex += 1;
      }
      if (buffer.size < 3) continue;
      const sampled = buffer.sampleAt(now - buffer.recommendedDelayMs(rtt));
      if (!sampled) continue;
      const x = sampled.balls[0].x;
      if (previousX !== null) {
        expect(x).toBeGreaterThanOrEqual(previousX - 0.01);
        maxFrameMovement = Math.max(maxFrameMovement, Math.abs(x - previousX));
      }
      previousX = x;
    }

    expect(maxFrameMovement).toBeLessThan(12);
    expect(buffer.underrunRate).toBeLessThan(0.02);
  });
});
