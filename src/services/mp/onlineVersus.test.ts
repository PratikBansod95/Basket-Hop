import { describe, expect, it, vi } from 'vitest';
import type { MpClientMessage, MpMatchSnapshot } from '../../../shared/contracts/mp';
import { VersusGame } from '../../game/VersusGame';
import { DefaultTapLaunch } from '../../game/mechanics/defaultTapLaunch';
import type { MpClient } from './client';
import { OnlineVersusSession } from './onlineVersus';

function state(ack: [number, number], serverTime = 1_000): MpMatchSnapshot {
  const game = new VersusGame(new DefaultTapLaunch(), {
    onScore: vi.fn(),
    onMatchEnd: vi.fn(),
    onTap: vi.fn(),
    onBounce: vi.fn(),
    onSwoosh: vi.fn(),
  });
  game.reset();
  game.startPlaying();
  return game.exportSnapshot(1, 3, serverTime, ack);
}

describe('OnlineVersusSession', () => {
  it('predicts local taps immediately and preserves them until acknowledged', () => {
    const sent: MpClientMessage[] = [];
    const mp = {
      send: (message: MpClientMessage) => sent.push(message),
      getRttMs: () => 80,
      getJitterMs: () => 4,
      serverNow: () => 1_100,
    } as unknown as MpClient;
    const game = new VersusGame(new DefaultTapLaunch(), {
      onScore: vi.fn(),
      onMatchEnd: vi.fn(),
      onTap: vi.fn(),
      onBounce: vi.fn(),
      onSwoosh: vi.fn(),
    });
    const session = new OnlineVersusSession(mp, game, {
      onCountdown: vi.fn(),
      onMatchStart: vi.fn(),
      onMatchEnd: vi.fn(),
    });

    session.bindMessage({
      type: 'match_start',
      roomId: 'room',
      yourSlot: 0,
      youAreHost: false,
      players: [
        { playerId: 'one', nickname: 'One', slot: 0 },
        { playerId: 'two', nickname: 'Two', slot: 1 },
      ],
      startAt: 1_000,
    });
    session.handleLocalTap();
    expect(game.balls[0].hasLaunched).toBe(true);
    expect(sent).toContainEqual(expect.objectContaining({ type: 'tap', seq: 1, slot: 0 }));

    session.bindMessage({ type: 'snapshot', state: state([0, 0]) });
    expect(game.balls[0].hasLaunched).toBe(true);
    session.bindMessage({
      type: 'match_start',
      roomId: 'room',
      yourSlot: 0,
      youAreHost: false,
      players: [
        { playerId: 'one', nickname: 'One', slot: 0 },
        { playerId: 'two', nickname: 'Two', slot: 1 },
      ],
      startAt: 1_000,
    });
    expect(sent.filter((message) => message.type === 'tap')).toHaveLength(2);
    expect(game.balls[0].hasLaunched).toBe(true);

    const acknowledged = state([1, 0], 1_050);
    acknowledged.seq = 2;
    acknowledged.tick = 6;
    acknowledged.balls[0] = { ...acknowledged.balls[0], hasLaunched: true, vy: -600 };
    session.bindMessage({ type: 'snapshot', state: acknowledged });
    session.sampleRemoteState(0);
    expect(session.getPresentationSnapshot()).not.toBeNull();
    expect(session.getDiagnostics().bufferedSnapshots).toBe(2);
  });

  it('keeps the slot-one presentation timeline monotonic while jitter delay changes', () => {
    const sent: MpClientMessage[] = [];
    let serverNow = 1_200;
    const mp = {
      send: (message: MpClientMessage) => sent.push(message),
      getRttMs: () => 280,
      getJitterMs: () => 70,
      serverNow: () => serverNow,
    } as unknown as MpClient;
    const game = new VersusGame(new DefaultTapLaunch(), {
      onScore: vi.fn(),
      onMatchEnd: vi.fn(),
      onTap: vi.fn(),
      onBounce: vi.fn(),
      onSwoosh: vi.fn(),
    });
    const session = new OnlineVersusSession(mp, game, {
      onCountdown: vi.fn(),
      onMatchStart: vi.fn(),
      onMatchEnd: vi.fn(),
    });
    session.bindMessage({
      type: 'match_start',
      roomId: 'room',
      yourSlot: 1,
      youAreHost: false,
      players: [
        { playerId: 'one', nickname: 'One', slot: 0 },
        { playerId: 'two', nickname: 'Two', slot: 1 },
      ],
      startAt: 1_000,
    });
    session.handleLocalTap();
    expect(sent).toContainEqual(expect.objectContaining({ type: 'tap', slot: 1 }));

    const sampledTimes: number[] = [];
    for (let seq = 1; seq <= 8; seq += 1) {
      const snapshot = state([0, 1], 1_000 + seq * 50);
      snapshot.seq = seq;
      snapshot.tick = seq * 3;
      snapshot.hoop.x = 600 + seq * 8;
      snapshot.balls[1] = { ...snapshot.balls[1], hasLaunched: true, vy: -500 };
      serverNow = snapshot.serverTime + 140;
      session.bindMessage({ type: 'snapshot', state: snapshot });
      session.sampleRemoteState(seq * 16.7);
      const presentation = session.getPresentationSnapshot()!;
      sampledTimes.push(presentation.serverTime);
      expect(game.hoop.x).toBeCloseTo(presentation.hoop.x);
    }

    for (let index = 1; index < sampledTimes.length; index += 1) {
      expect(sampledTimes[index]).toBeGreaterThanOrEqual(sampledTimes[index - 1]!);
    }
  });
});
