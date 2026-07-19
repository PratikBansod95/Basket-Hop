import { randomBytes } from 'node:crypto';
import type { WebSocket } from 'ws';
import { VersusGame, type VersusResult } from '../../src/game/VersusGame.js';
import { DefaultTapLaunch } from '../../src/game/mechanics/defaultTapLaunch.js';
import { VERSUS_DURATION_SEC } from '../../src/game/constants.js';
import {
  MATCH_COUNTDOWN_SEC,
  makeRoomCode,
  makeRoomId,
  roomPlayersList,
  type MpClientMessage,
  type MpMatchResult,
  type MpServerMessage,
  type Room,
  type Session,
} from './protocol.js';

const FIXED_DT = 1 / 60;
const SNAPSHOT_EVERY_TICKS = 3;
const MAX_CATCHUP_STEPS = 15;
const SLOW_CONSUMER_BYTES = 256 * 1024;
const MESSAGE_LIMIT = 120;
const MESSAGE_WINDOW_MS = 10_000;
const TAP_LIMIT = 30;
const TAP_WINDOW_MS = 1_000;
const MATCH_START_LEAD_MS = 500;

export interface MatchMakerOptions {
  reconnectGraceMs?: number;
  lobbyTtlMs?: number;
  endedTtlMs?: number;
  countdownSeconds?: number;
  now?: () => number;
  monotonicNow?: () => number;
  log?: (event: string, fields?: Record<string, unknown>) => void;
}

export type RegisterResult =
  | { ok: true; session: Session; resumed: boolean }
  | { ok: false; code: 'duplicate_identity' | 'resume_denied'; message: string };

export class MatchMaker {
  private sessions = new Map<WebSocket, Session>();
  private byPlayerId = new Map<string, Session>();
  private rooms = new Map<string, Room>();
  private roomsByCode = new Map<string, string>();
  private queue: string[] = [];
  private readonly reconnectGraceMs: number;
  private readonly lobbyTtlMs: number;
  private readonly endedTtlMs: number;
  private readonly countdownSeconds: number;
  private readonly now: () => number;
  private readonly monotonicNow: () => number;
  private readonly log: (event: string, fields?: Record<string, unknown>) => void;
  private readonly simulationTimer: ReturnType<typeof setInterval>;

  constructor(options: MatchMakerOptions = {}) {
    this.reconnectGraceMs = options.reconnectGraceMs ?? 5_000;
    this.lobbyTtlMs = options.lobbyTtlMs ?? 10 * 60_000;
    this.endedTtlMs = options.endedTtlMs ?? 60_000;
    this.countdownSeconds = options.countdownSeconds ?? MATCH_COUNTDOWN_SEC;
    this.now = options.now ?? Date.now;
    this.monotonicNow = options.monotonicNow ?? (() => performance.now());
    this.log = options.log ?? (() => undefined);
    this.simulationTimer = setInterval(() => this.advanceSimulations(), 1000 / 60);
    this.simulationTimer.unref();
  }

  dispose(): void {
    clearInterval(this.simulationTimer);
    for (const room of this.rooms.values()) this.clearCountdown(room);
    for (const session of this.byPlayerId.values()) {
      if (session.reconnectTimer) clearTimeout(session.reconnectTimer);
    }
  }

  getSession(ws: WebSocket): Session | undefined {
    return this.sessions.get(ws);
  }

  registerSession(
    ws: WebSocket,
    playerId: string,
    nickname: string,
    resumeToken?: string,
  ): RegisterResult {
    const existing = this.byPlayerId.get(playerId);
    if (existing) {
      if (existing.connected) {
        this.log('auth_rejected', { playerId, reason: 'duplicate_identity' });
        return {
          ok: false,
          code: 'duplicate_identity',
          message: 'This player is already connected.',
        };
      }
      if (!resumeToken || resumeToken !== existing.resumeToken) {
        this.log('auth_rejected', { playerId, reason: 'invalid_resume_token' });
        return {
          ok: false,
          code: 'resume_denied',
          message: 'The reconnect token is invalid or expired.',
        };
      }

      if (existing.reconnectTimer) clearTimeout(existing.reconnectTimer);
      existing.reconnectTimer = null;
      existing.ws = ws;
      existing.connected = true;
      existing.detachedAt = null;
      existing.lastHeartbeatAt = this.now();
      this.sessions.set(ws, existing);
      this.log('session_resumed', { playerId, roomId: existing.roomId });
      return { ok: true, session: existing, resumed: true };
    }

    const now = this.now();
    const session: Session = {
      ws,
      playerId,
      nickname,
      resumeToken: randomBytes(32).toString('base64url'),
      connected: true,
      detachedAt: null,
      reconnectTimer: null,
      lastHeartbeatAt: now,
      roomId: null,
      inQueue: false,
      messageWindowAt: now,
      messageCount: 0,
      tapWindowAt: now,
      tapCount: 0,
    };
    this.sessions.set(ws, session);
    this.byPlayerId.set(playerId, session);
    this.log('session_created', { playerId });
    return { ok: true, session, resumed: false };
  }

  restoreSessionState(session: Session): void {
    if (session.inQueue) this.sendSession(session, { type: 'queued' });
    if (!session.roomId) return;
    const room = this.rooms.get(session.roomId);
    if (!room || !room.players.has(session.playerId)) {
      session.roomId = null;
      return;
    }

    this.sendSession(session, this.roomPayload(room, session.playerId));
    if (room.phase === 'lobby') this.maybeBeginMatch(room);
    const players = roomPlayersList(room);
    if (room.phase === 'countdown' && room.countdownSeconds !== null) {
      this.sendSession(session, {
        type: 'match_countdown',
        seconds: room.countdownSeconds,
        players,
      });
    } else if (room.phase === 'playing' && room.startAt !== null) {
      const member = room.players.get(session.playerId)!;
      this.sendSession(session, {
        type: 'match_start',
        roomId: room.id,
        yourSlot: member.slot,
        youAreHost: room.hostPlayerId === session.playerId,
        players,
        startAt: room.startAt,
      });
      if (room.latestSnapshot) {
        this.sendSession(session, { type: 'snapshot', state: room.latestSnapshot });
      }
    } else if (room.phase === 'ended' && room.result) {
      if (room.latestSnapshot) {
        this.sendSession(session, { type: 'snapshot', state: room.latestSnapshot });
      }
      this.sendSession(session, { type: 'match_end', result: room.result });
    }
  }

  allowMessage(session: Session, isTap: boolean, countMessage = true): boolean {
    const now = this.now();
    if (countMessage) {
      if (now - session.messageWindowAt >= MESSAGE_WINDOW_MS) {
        session.messageWindowAt = now;
        session.messageCount = 0;
      }
      session.messageCount += 1;
      if (session.messageCount > MESSAGE_LIMIT) {
        this.disconnectForLimit(session, 'message_rate');
        return false;
      }
    }

    if (!isTap) return true;
    if (now - session.tapWindowAt >= TAP_WINDOW_MS) {
      session.tapWindowAt = now;
      session.tapCount = 0;
    }
    session.tapCount += 1;
    if (session.tapCount > TAP_LIMIT) {
      this.disconnectForLimit(session, 'tap_rate');
      return false;
    }
    return true;
  }

  touchHeartbeat(ws: WebSocket): void {
    const session = this.sessions.get(ws);
    if (session) session.lastHeartbeatAt = this.now();
  }

  send(ws: WebSocket, message: MpServerMessage): void {
    if (ws.readyState !== 1) return;
    if (ws.bufferedAmount > SLOW_CONSUMER_BYTES) {
      this.log('slow_consumer', { bufferedAmount: ws.bufferedAmount });
      try {
        ws.close(4008, 'slow consumer');
      } catch {
        // The close event performs session retention/cleanup.
      }
      return;
    }
    ws.send(JSON.stringify(message));
  }

  private sendSession(session: Session, message: MpServerMessage): void {
    if (session.connected && session.ws) this.send(session.ws, message);
  }

  private disconnectForLimit(session: Session, reason: string): void {
    this.log('rate_limit', { playerId: session.playerId, reason });
    if (!session.ws) return;
    this.send(session.ws, {
      type: 'error',
      code: 'rate_limit',
      message: 'Too many messages. Reconnect and try again.',
    });
    try {
      session.ws.close(4008, 'rate limit');
    } catch {
      // The close event performs session retention/cleanup.
    }
  }

  private broadcastRoom(room: Room, message: MpServerMessage, exceptPlayerId?: string): void {
    for (const playerId of room.players.keys()) {
      if (exceptPlayerId === playerId) continue;
      const session = this.byPlayerId.get(playerId);
      if (session) this.sendSession(session, message);
    }
  }

  private roomPayload(room: Room, forPlayerId: string): MpServerMessage {
    return {
      type: 'room',
      roomId: room.id,
      code: room.code,
      players: roomPlayersList(room),
      youAreHost: room.hostPlayerId === forPlayerId,
      phase: room.phase,
    };
  }

  private notifyRoom(room: Room): void {
    for (const playerId of room.players.keys()) {
      const session = this.byPlayerId.get(playerId);
      if (session) this.sendSession(session, this.roomPayload(room, playerId));
    }
  }

  private clearCountdown(room: Room): void {
    if (room.countdownTimer) clearInterval(room.countdownTimer);
    room.countdownTimer = null;
    room.countdownSeconds = null;
  }

  private allPlayersConnected(room: Room): boolean {
    return (
      room.players.size === 2 &&
      [...room.players.keys()].every((playerId) => this.byPlayerId.get(playerId)?.connected)
    );
  }

  private maybeBeginMatch(room: Room): void {
    if (!this.allPlayersConnected(room) || room.phase !== 'lobby') return;
    this.clearCountdown(room);
    room.phase = 'countdown';
    room.updatedAt = this.now();
    room.countdownSeconds = this.countdownSeconds;
    const players = roomPlayersList(room);
    this.broadcastRoom(room, {
      type: 'match_countdown',
      seconds: room.countdownSeconds,
      players,
    });
    this.notifyRoom(room);
    this.log('match_countdown', { roomId: room.id, players: players.map((p) => p.playerId) });

    if (this.countdownSeconds <= 0) {
      this.startMatch(room);
      return;
    }
    room.countdownTimer = setInterval(() => {
      if (room.phase !== 'countdown' || !this.allPlayersConnected(room)) {
        this.clearCountdown(room);
        if (room.phase === 'countdown') {
          room.phase = 'lobby';
          room.updatedAt = this.now();
          this.notifyRoom(room);
        }
        return;
      }
      room.countdownSeconds = (room.countdownSeconds ?? 1) - 1;
      if (room.countdownSeconds > 0) {
        this.broadcastRoom(room, {
          type: 'match_countdown',
          seconds: room.countdownSeconds,
          players: roomPlayersList(room),
        });
        return;
      }
      this.startMatch(room);
    }, 1_000);
    room.countdownTimer.unref();
  }

  private startMatch(room: Room): void {
    if (room.phase !== 'countdown' || !this.allPlayersConnected(room)) return;
    this.clearCountdown(room);
    room.phase = 'playing';
    room.updatedAt = this.now();
    room.startAt = this.now() + MATCH_START_LEAD_MS;
    room.tick = 0;
    room.snapshotSeq = 0;
    room.ackTapSeq = [0, 0];
    room.lastSimAt = this.monotonicNow();
    room.simAccumulator = 0;

    const game = new VersusGame(new DefaultTapLaunch(), {
      onScore: () => undefined,
      onMatchEnd: (result) => this.finishTimerMatch(room, result),
      onTap: () => undefined,
      onBounce: () => undefined,
      onSwoosh: () => undefined,
    });
    game.effectsEnabled = false;
    game.externalClock = true;
    game.reset();
    game.startPlaying();
    room.game = game;
    room.latestSnapshot = game.exportSnapshot(0, 0, room.startAt, [0, 0]);

    const players = roomPlayersList(room);
    for (const [playerId, member] of room.players) {
      const session = this.byPlayerId.get(playerId);
      if (!session) continue;
      this.sendSession(session, {
        type: 'match_start',
        roomId: room.id,
        yourSlot: member.slot,
        youAreHost: room.hostPlayerId === playerId,
        players,
        startAt: room.startAt,
      });
    }
    this.broadcastRoom(room, { type: 'snapshot', state: room.latestSnapshot });
    this.notifyRoom(room);
    this.log('match_started', { roomId: room.id, startAt: room.startAt });
  }

  private advanceSimulations(): void {
    const monotonicNow = this.monotonicNow();
    for (const room of this.rooms.values()) {
      if (room.phase !== 'playing' || !room.game) continue;
      if (room.startAt !== null && this.now() < room.startAt) {
        room.lastSimAt = monotonicNow;
        continue;
      }
      const timeLeft = Math.max(
        0,
        VERSUS_DURATION_SEC - (this.now() - (room.startAt ?? this.now())) / 1_000,
      );
      room.game.timeLeft = timeLeft;
      if (timeLeft <= 0) {
        const scoreP1 = room.game.scoreP1;
        const scoreP2 = room.game.scoreP2;
        this.finishMatch(room, {
          scoreP1,
          scoreP2,
          winner: scoreP1 === scoreP2 ? 'draw' : scoreP1 > scoreP2 ? 'p1' : 'p2',
          reason: 'timer',
        });
        continue;
      }
      const elapsed = Math.min(0.25, Math.max(0, (monotonicNow - room.lastSimAt) / 1000));
      room.lastSimAt = monotonicNow;
      room.simAccumulator += elapsed;
      let steps = 0;
      while (
        room.phase === 'playing' &&
        room.simAccumulator >= FIXED_DT &&
        steps < MAX_CATCHUP_STEPS
      ) {
        room.tick += 1;
        room.game.update(FIXED_DT);
        room.simAccumulator -= FIXED_DT;
        steps += 1;
        if (room.phase === 'playing' && room.tick % SNAPSHOT_EVERY_TICKS === 0) {
          this.publishSnapshot(room);
        }
      }
      if (steps === MAX_CATCHUP_STEPS && room.simAccumulator > FIXED_DT * MAX_CATCHUP_STEPS) {
        room.simAccumulator = FIXED_DT;
      }
    }
  }

  private publishSnapshot(room: Room): void {
    if (!room.game) return;
    room.snapshotSeq += 1;
    room.latestSnapshot = room.game.exportSnapshot(
      room.snapshotSeq,
      room.tick,
      this.now(),
      [...room.ackTapSeq],
    );
    this.broadcastRoom(room, { type: 'snapshot', state: room.latestSnapshot });
  }

  private finishTimerMatch(room: Room, result: VersusResult): void {
    this.finishMatch(room, {
      scoreP1: result.scoreP1,
      scoreP2: result.scoreP2,
      winner: result.winner,
      reason: 'timer',
    });
  }

  enqueue(session: Session): void {
    this.leaveRoom(session);
    if (session.inQueue) {
      this.sendSession(session, { type: 'queued' });
      return;
    }
    session.inQueue = true;
    this.queue.push(session.playerId);
    this.sendSession(session, { type: 'queued' });
    this.tryPairQueue();
  }

  dequeue(session: Session): void {
    if (!session.inQueue) return;
    this.dequeueSilently(session);
    this.sendSession(session, { type: 'queue_left' });
  }

  private dequeueSilently(session: Session): void {
    session.inQueue = false;
    this.queue = this.queue.filter((id) => id !== session.playerId);
  }

  private tryPairQueue(): void {
    while (this.queue.length >= 2) {
      const aId = this.queue.shift()!;
      const bId = this.queue.shift()!;
      if (aId === bId) continue;
      const a = this.byPlayerId.get(aId);
      const b = this.byPlayerId.get(bId);
      if (!a?.connected || !b?.connected || !a.inQueue || !b.inQueue) continue;
      a.inQueue = false;
      b.inQueue = false;
      this.createPairedRoom(a, b, null);
    }
  }

  createPrivateRoom(session: Session): void {
    this.dequeue(session);
    this.leaveRoom(session);
    let code = makeRoomCode();
    while (this.roomsByCode.has(code)) code = makeRoomCode();
    this.createPairedRoom(session, null, code);
  }

  joinPrivateRoom(session: Session, rawCode: string): void {
    const code = rawCode.trim().toUpperCase();
    const roomId = this.roomsByCode.get(code);
    const room = roomId ? this.rooms.get(roomId) : undefined;
    if (!room) {
      this.sendSession(session, {
        type: 'error',
        code: 'room_not_found',
        message: 'No room found with that code.',
      });
      return;
    }
    if (room.players.size >= 2) {
      this.sendSession(session, {
        type: 'error',
        code: 'room_full',
        message: 'That room is full.',
      });
      return;
    }
    if (room.phase !== 'lobby') {
      this.sendSession(session, {
        type: 'error',
        code: 'room_started',
        message: 'That match already started.',
      });
      return;
    }
    if (
      [...room.players.keys()].some(
        (playerId) => !this.byPlayerId.get(playerId)?.connected,
      )
    ) {
      this.sendSession(session, {
        type: 'error',
        code: 'room_unavailable',
        message: 'That room owner is reconnecting. Try again shortly.',
      });
      return;
    }
    this.dequeue(session);
    this.leaveRoom(session);
    const usedSlots = new Set([...room.players.values()].map((player) => player.slot));
    const slot: 0 | 1 = usedSlots.has(0) ? 1 : 0;
    room.players.set(session.playerId, { nickname: session.nickname, slot });
    room.updatedAt = this.now();
    session.roomId = room.id;
    this.notifyRoom(room);
    this.maybeBeginMatch(room);
  }

  private createPairedRoom(host: Session, guest: Session | null, code: string | null): void {
    const now = this.now();
    const room: Room = {
      id: makeRoomId(),
      code,
      hostPlayerId: host.playerId,
      players: new Map([[host.playerId, { nickname: host.nickname, slot: 0 }]]),
      phase: 'lobby',
      createdAt: now,
      updatedAt: now,
      countdownTimer: null,
      countdownSeconds: null,
      game: null,
      startAt: null,
      tick: 0,
      snapshotSeq: 0,
      ackTapSeq: [0, 0],
      latestSnapshot: null,
      lastSimAt: 0,
      simAccumulator: 0,
      result: null,
    };
    if (guest) {
      room.players.set(guest.playerId, { nickname: guest.nickname, slot: 1 });
      guest.roomId = room.id;
      guest.inQueue = false;
    }
    host.roomId = room.id;
    host.inQueue = false;
    this.rooms.set(room.id, room);
    if (code) this.roomsByCode.set(code, room.id);
    this.notifyRoom(room);
    this.maybeBeginMatch(room);
    this.log('room_created', { roomId: room.id, private: code !== null });
  }

  handleMatchMessage(session: Session, message: MpClientMessage): void {
    if (message.type === 'snapshot' || message.type === 'match_end') {
      this.sendSession(session, {
        type: 'error',
        code: 'server_authoritative',
        message: 'The server owns match state and results.',
      });
      this.log('authority_rejected', { playerId: session.playerId, type: message.type });
      return;
    }
    if (message.type !== 'tap') return;
    if (!session.roomId) {
      this.sendSession(session, {
        type: 'error',
        code: 'not_in_room',
        message: 'Join a room before sending match messages.',
      });
      return;
    }
    const room = this.rooms.get(session.roomId);
    const member = room?.players.get(session.playerId);
    if (!room || !member || room.phase !== 'playing' || !room.game) return;
    if (room.startAt !== null && this.now() < room.startAt) return;
    if (message.slot !== member.slot) {
      this.sendSession(session, {
        type: 'error',
        code: 'bad_slot',
        message: 'You can only tap your own ball.',
      });
      this.log('tap_rejected', { playerId: session.playerId, reason: 'slot' });
      return;
    }
    const acknowledged = room.ackTapSeq[member.slot];
    if (message.seq <= acknowledged) return;
    if (message.seq - acknowledged > 1_000) {
      this.sendSession(session, {
        type: 'error',
        code: 'bad_sequence',
        message: 'Tap sequence advanced too far.',
      });
      this.log('tap_rejected', { playerId: session.playerId, reason: 'sequence' });
      return;
    }
    room.ackTapSeq[member.slot] = message.seq;
    room.game.handleTap(member.slot);
  }

  private finishMatch(room: Room, result: MpMatchResult): void {
    if (room.phase === 'ended') return;
    this.clearCountdown(room);
    if (result.reason === 'forfeit') room.game?.markMatchOver();
    if (room.game) {
      room.latestSnapshot = room.game.exportSnapshot(
        ++room.snapshotSeq,
        room.tick,
        this.now(),
        [...room.ackTapSeq],
      );
      this.broadcastRoom(room, { type: 'snapshot', state: room.latestSnapshot });
    }
    room.phase = 'ended';
    room.result = result;
    room.updatedAt = this.now();
    this.broadcastRoom(room, { type: 'match_end', result });
    this.notifyRoom(room);
    this.log('match_ended', { roomId: room.id, ...result });
  }

  leaveRoom(session: Session): void {
    this.removeFromRoom(session, true);
  }

  private removeFromRoom(session: Session, notifyLeaver: boolean): void {
    if (!session.roomId) return;
    const room = this.rooms.get(session.roomId);
    session.roomId = null;
    if (!room) return;

    const left = room.players.get(session.playerId);
    const previousPhase = room.phase;
    room.players.delete(session.playerId);
    room.updatedAt = this.now();
    if (notifyLeaver) this.sendSession(session, { type: 'room_left' });

    if (room.players.size === 0) {
      this.deleteRoom(room);
      return;
    }

    if (room.hostPlayerId === session.playerId) {
      room.hostPlayerId = [...room.players.keys()][0]!;
    }

    if (previousPhase === 'playing' && left) {
      const remaining = [...room.players.values()][0]!;
      const game = room.game;
      this.finishMatch(room, {
        scoreP1: game?.scoreP1 ?? 0,
        scoreP2: game?.scoreP2 ?? 0,
        winner: remaining.slot === 0 ? 'p1' : 'p2',
        reason: 'forfeit',
      });
    } else if (previousPhase === 'countdown') {
      this.clearCountdown(room);
      room.phase = 'lobby';
      room.startAt = null;
      room.game = null;
      room.latestSnapshot = null;
      room.result = null;
    }

    this.broadcastRoom(room, {
      type: 'peer_left',
      playerId: session.playerId,
      nickname: left?.nickname ?? 'Player',
    });
    this.notifyRoom(room);
  }

  detach(ws: WebSocket, reason: string): void {
    const session = this.sessions.get(ws);
    if (!session || session.ws !== ws) return;
    this.sessions.delete(ws);
    this.dequeueSilently(session);
    session.ws = null;
    session.connected = false;
    session.detachedAt = this.now();
    session.reconnectTimer = setTimeout(() => {
      if (!session.connected && this.byPlayerId.get(session.playerId) === session) {
        this.removeFromRoom(session, false);
        this.byPlayerId.delete(session.playerId);
        session.reconnectTimer = null;
        this.log('session_expired', { playerId: session.playerId, reason });
      }
    }, this.reconnectGraceMs);
    session.reconnectTimer.unref();
    this.log('session_detached', {
      playerId: session.playerId,
      roomId: session.roomId,
      reason,
      graceMs: this.reconnectGraceMs,
    });
  }

  sweepStale(timeoutMs: number): void {
    const now = this.now();
    for (const [ws, session] of this.sessions) {
      if (now - session.lastHeartbeatAt <= timeoutMs) continue;
      this.detach(ws, 'heartbeat_timeout');
      try {
        ws.close(4001, 'heartbeat timeout');
      } catch {
        // Already detached.
      }
    }
    for (const room of [...this.rooms.values()]) {
      const ttl = room.phase === 'ended' ? this.endedTtlMs : this.lobbyTtlMs;
      if (
        (room.phase === 'ended' || room.phase === 'lobby') &&
        now - room.updatedAt > ttl
      ) {
        this.expireRoom(room);
      }
    }
  }

  private expireRoom(room: Room): void {
    for (const playerId of room.players.keys()) {
      const session = this.byPlayerId.get(playerId);
      if (session?.roomId === room.id) {
        session.roomId = null;
        this.sendSession(session, { type: 'room_left' });
      }
    }
    this.log('room_expired', { roomId: room.id, phase: room.phase });
    this.deleteRoom(room);
  }

  private deleteRoom(room: Room): void {
    this.clearCountdown(room);
    this.rooms.delete(room.id);
    if (room.code) this.roomsByCode.delete(room.code);
  }

  stats(): {
    sessions: number;
    retainedSessions: number;
    rooms: number;
    playingRooms: number;
    queue: number;
  } {
    let retainedSessions = 0;
    for (const session of this.byPlayerId.values()) {
      if (!session.connected) retainedSessions += 1;
    }
    let playingRooms = 0;
    for (const room of this.rooms.values()) {
      if (room.phase === 'playing') playingRooms += 1;
    }
    return {
      sessions: this.sessions.size,
      retainedSessions,
      rooms: this.rooms.size,
      playingRooms,
      queue: this.queue.length,
    };
  }
}
