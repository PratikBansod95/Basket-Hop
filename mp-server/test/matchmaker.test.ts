import type { WebSocket } from 'ws';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MatchMaker } from '../src/matchmaker.js';
import type { MpServerMessage, Session } from '../src/protocol.js';

const P1 = '123e4567-e89b-42d3-a456-426614174000';
const P2 = '223e4567-e89b-42d3-a456-426614174000';

class FakeSocket {
  readyState = 1;
  bufferedAmount = 0;
  sent: MpServerMessage[] = [];
  closeCode: number | null = null;

  send(raw: string): void {
    this.sent.push(JSON.parse(raw) as MpServerMessage);
  }

  close(code: number): void {
    this.closeCode = code;
    this.readyState = 3;
  }
}

function socket(): { fake: FakeSocket; ws: WebSocket } {
  const fake = new FakeSocket();
  return { fake, ws: fake as unknown as WebSocket };
}

function register(
  maker: MatchMaker,
  ws: WebSocket,
  playerId: string,
  nickname: string,
  token?: string,
): Session {
  const result = maker.registerSession(ws, playerId, nickname, token);
  if (!result.ok) throw new Error(result.code);
  return result.session;
}

describe('MatchMaker', () => {
  const makers: MatchMaker[] = [];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    for (const maker of makers) maker.dispose();
    makers.length = 0;
    vi.useRealTimers();
  });

  it('pairs players, starts immediately after countdown, and acknowledges valid taps', () => {
    const maker = new MatchMaker({ countdownSeconds: 0 });
    makers.push(maker);
    const one = socket();
    const two = socket();
    const p1 = register(maker, one.ws, P1, 'One');
    const p2 = register(maker, two.ws, P2, 'Two');

    maker.enqueue(p1);
    maker.enqueue(p2);

    expect(one.fake.sent.some((message) => message.type === 'match_start')).toBe(true);
    expect(two.fake.sent.some((message) => message.type === 'match_start')).toBe(true);
    const initial = one.fake.sent.find((message) => message.type === 'snapshot');
    expect(initial?.type === 'snapshot' && initial.state.tick).toBe(0);
    vi.advanceTimersByTime(500);

    maker.handleMatchMessage(p1, { type: 'tap', slot: 1, seq: 1, clientTime: 1 });
    expect(one.fake.sent).toContainEqual(
      expect.objectContaining({ type: 'error', code: 'bad_slot' }),
    );

    maker.handleMatchMessage(p1, { type: 'tap', slot: 0, seq: 1, clientTime: 1 });
    vi.advanceTimersByTime(100);
    const snapshots = one.fake.sent.filter((message) => message.type === 'snapshot');
    const latest = snapshots.at(-1);
    expect(latest?.type).toBe('snapshot');
    if (latest?.type === 'snapshot') {
      expect(latest.state.tick).toBeGreaterThanOrEqual(3);
      expect(latest.state.ackTapSeq).toEqual([1, 0]);
      expect(latest.state.balls[0].hasLaunched).toBe(true);
      expect(latest.state.timeLeft).toBeLessThan(120);
    }
  });

  it('retains a disconnected session and only resumes with its token', () => {
    const maker = new MatchMaker({ countdownSeconds: 0 });
    makers.push(maker);
    const original = socket();
    const peer = socket();
    const p1 = register(maker, original.ws, P1, 'One');
    const p2 = register(maker, peer.ws, P2, 'Two');
    maker.enqueue(p1);
    maker.enqueue(p2);

    const activeDuplicate = socket();
    expect(maker.registerSession(activeDuplicate.ws, P1, 'One', p1.resumeToken)).toMatchObject({
      ok: false,
      code: 'duplicate_identity',
    });
    expect(original.fake.closeCode).toBeNull();

    maker.detach(original.ws, 'test');
    const invalid = socket();
    expect(maker.registerSession(invalid.ws, P1, 'One', 'invalid-token-value-12345')).toMatchObject({
      ok: false,
      code: 'resume_denied',
    });

    const resumedSocket = socket();
    const resumed = maker.registerSession(resumedSocket.ws, P1, 'One', p1.resumeToken);
    expect(resumed).toMatchObject({ ok: true, resumed: true });
    if (!resumed.ok) return;
    maker.restoreSessionState(resumed.session);
    expect(resumedSocket.fake.sent.some((message) => message.type === 'room')).toBe(true);
    expect(resumedSocket.fake.sent.some((message) => message.type === 'match_start')).toBe(true);
    expect(resumedSocket.fake.sent.some((message) => message.type === 'snapshot')).toBe(true);
  });

  it('returns a private-room survivor to lobby when a player leaves countdown', () => {
    const maker = new MatchMaker({ countdownSeconds: 3 });
    makers.push(maker);
    const hostSocket = socket();
    const guestSocket = socket();
    const host = register(maker, hostSocket.ws, P1, 'One');
    const guest = register(maker, guestSocket.ws, P2, 'Two');
    maker.createPrivateRoom(host);
    const room = hostSocket.fake.sent.find(
      (message): message is Extract<MpServerMessage, { type: 'room' }> =>
        message.type === 'room' && message.code !== null,
    );
    expect(room?.code).toBeTruthy();
    maker.joinPrivateRoom(guest, room!.code!);

    maker.leaveRoom(guest);

    const roomUpdates = hostSocket.fake.sent.filter(
      (message): message is Extract<MpServerMessage, { type: 'room' }> =>
        message.type === 'room',
    );
    expect(roomUpdates.at(-1)?.phase).toBe('lobby');
    expect(roomUpdates.at(-1)?.players).toHaveLength(1);
    expect(hostSocket.fake.sent.some((message) => message.type === 'match_end')).toBe(false);
  });

  it('does not start while a countdown player is disconnected', () => {
    const maker = new MatchMaker({ countdownSeconds: 3, reconnectGraceMs: 5_000 });
    makers.push(maker);
    const one = socket();
    const two = socket();
    const p1 = register(maker, one.ws, P1, 'One');
    const p2 = register(maker, two.ws, P2, 'Two');
    maker.enqueue(p1);
    maker.enqueue(p2);

    maker.detach(two.ws, 'test');
    vi.advanceTimersByTime(3_000);

    expect(one.fake.sent.some((message) => message.type === 'match_start')).toBe(false);
    const roomUpdates = one.fake.sent.filter(
      (message): message is Extract<MpServerMessage, { type: 'room' }> =>
        message.type === 'room',
    );
    expect(roomUpdates.at(-1)?.phase).toBe('lobby');
  });

  it('expires reconnect grace into an authoritative forfeit', () => {
    const maker = new MatchMaker({ countdownSeconds: 0, reconnectGraceMs: 5_000 });
    makers.push(maker);
    const one = socket();
    const two = socket();
    const p1 = register(maker, one.ws, P1, 'One');
    const p2 = register(maker, two.ws, P2, 'Two');
    maker.enqueue(p1);
    maker.enqueue(p2);

    maker.detach(two.ws, 'close');
    vi.advanceTimersByTime(4_999);
    expect(one.fake.sent.some((message) => message.type === 'match_end')).toBe(false);
    vi.advanceTimersByTime(1);
    expect(one.fake.sent).toContainEqual(
      expect.objectContaining({
        type: 'match_end',
        result: expect.objectContaining({ winner: 'p1', reason: 'forfeit' }),
      }),
    );
  });

  it('enforces per-session tap limits', () => {
    const maker = new MatchMaker();
    makers.push(maker);
    const one = socket();
    const session = register(maker, one.ws, P1, 'One');
    for (let index = 0; index < 30; index += 1) {
      expect(maker.allowMessage(session, true)).toBe(true);
    }
    expect(maker.allowMessage(session, true)).toBe(false);
    expect(one.fake.closeCode).toBe(4008);
  });

  it('ends from wall-clock time even when simulation ticks fall behind', () => {
    let now = 0;
    let monotonicNow = 0;
    const maker = new MatchMaker({
      countdownSeconds: 0,
      now: () => now,
      monotonicNow: () => monotonicNow,
    });
    makers.push(maker);
    const one = socket();
    const two = socket();
    const p1 = register(maker, one.ws, P1, 'One');
    const p2 = register(maker, two.ws, P2, 'Two');
    maker.enqueue(p1);
    maker.enqueue(p2);

    now = 120_501;
    monotonicNow = 16;
    (
      maker as unknown as {
        advanceSimulations(): void;
      }
    ).advanceSimulations();

    expect(one.fake.sent).toContainEqual(
      expect.objectContaining({
        type: 'match_end',
        result: expect.objectContaining({ reason: 'timer' }),
      }),
    );
  });
});
