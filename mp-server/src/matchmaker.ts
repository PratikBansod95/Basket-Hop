import type { WebSocket } from 'ws';
import {
  makeRoomCode,
  makeRoomId,
  roomPlayersList,
  type MpServerMessage,
  type Room,
  type Session,
} from './protocol.js';

export class MatchMaker {
  private sessions = new Map<WebSocket, Session>();
  private byPlayerId = new Map<string, Session>();
  private rooms = new Map<string, Room>();
  private roomsByCode = new Map<string, string>();
  private queue: string[] = [];

  getSession(ws: WebSocket): Session | undefined {
    return this.sessions.get(ws);
  }

  registerSession(ws: WebSocket, playerId: string, nickname: string): Session {
    const existing = this.byPlayerId.get(playerId);
    if (existing && existing.ws !== ws) {
      this.detach(existing.ws, 'replaced');
      try {
        existing.ws.close(4000, 'replaced');
      } catch {
        // ignore
      }
    }

    const session: Session = {
      ws,
      playerId,
      nickname,
      lastHeartbeatAt: Date.now(),
      roomId: null,
      inQueue: false,
    };
    this.sessions.set(ws, session);
    this.byPlayerId.set(playerId, session);
    return session;
  }

  touchHeartbeat(ws: WebSocket): void {
    const session = this.sessions.get(ws);
    if (session) session.lastHeartbeatAt = Date.now();
  }

  send(ws: WebSocket, message: MpServerMessage): void {
    if (ws.readyState !== ws.OPEN) return;
    ws.send(JSON.stringify(message));
  }

  private broadcastRoom(room: Room, message: MpServerMessage): void {
    for (const playerId of room.players.keys()) {
      const session = this.byPlayerId.get(playerId);
      if (session) this.send(session.ws, message);
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
      if (session) this.send(session.ws, this.roomPayload(room, playerId));
    }
  }

  enqueue(session: Session): void {
    this.leaveRoom(session);
    if (session.inQueue) {
      this.send(session.ws, { type: 'queued' });
      return;
    }
    session.inQueue = true;
    this.queue.push(session.playerId);
    this.send(session.ws, { type: 'queued' });
    this.tryPairQueue();
  }

  dequeue(session: Session): void {
    if (!session.inQueue) return;
    session.inQueue = false;
    this.queue = this.queue.filter((id) => id !== session.playerId);
    this.send(session.ws, { type: 'queue_left' });
  }

  private tryPairQueue(): void {
    while (this.queue.length >= 2) {
      const aId = this.queue.shift()!;
      const bId = this.queue.shift()!;
      const a = this.byPlayerId.get(aId);
      const b = this.byPlayerId.get(bId);
      if (!a || !b) continue;
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
    if (!roomId) {
      this.send(session.ws, {
        type: 'error',
        code: 'room_not_found',
        message: 'No room found with that code.',
      });
      return;
    }
    const room = this.rooms.get(roomId);
    if (!room || room.players.size >= 2) {
      this.send(session.ws, {
        type: 'error',
        code: 'room_full',
        message: 'That room is full.',
      });
      return;
    }
    this.dequeue(session);
    this.leaveRoom(session);
    room.players.set(session.playerId, { nickname: session.nickname, slot: 1 });
    session.roomId = room.id;
    this.notifyRoom(room);
  }

  private createPairedRoom(
    host: Session,
    guest: Session | null,
    code: string | null,
  ): void {
    const room: Room = {
      id: makeRoomId(),
      code,
      hostPlayerId: host.playerId,
      players: new Map([[host.playerId, { nickname: host.nickname, slot: 0 }]]),
      phase: 'lobby',
      createdAt: Date.now(),
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
  }

  leaveRoom(session: Session): void {
    if (!session.roomId) return;
    const room = this.rooms.get(session.roomId);
    session.roomId = null;
    if (!room) return;

    const left = room.players.get(session.playerId);
    room.players.delete(session.playerId);
    this.send(session.ws, { type: 'room_left' });

    if (room.players.size === 0) {
      this.rooms.delete(room.id);
      if (room.code) this.roomsByCode.delete(room.code);
      return;
    }

    if (room.hostPlayerId === session.playerId) {
      room.hostPlayerId = [...room.players.keys()][0]!;
    }

    this.broadcastRoom(room, {
      type: 'peer_left',
      playerId: session.playerId,
      nickname: left?.nickname ?? 'Player',
    });
    this.notifyRoom(room);
  }

  detach(ws: WebSocket, _reason: string): void {
    const session = this.sessions.get(ws);
    if (!session) return;
    this.dequeue(session);
    this.leaveRoom(session);
    this.sessions.delete(ws);
    if (this.byPlayerId.get(session.playerId)?.ws === ws) {
      this.byPlayerId.delete(session.playerId);
    }
  }

  sweepStale(timeoutMs: number): void {
    const now = Date.now();
    for (const [ws, session] of this.sessions) {
      if (now - session.lastHeartbeatAt > timeoutMs) {
        this.detach(ws, 'timeout');
        try {
          ws.close(4001, 'heartbeat timeout');
        } catch {
          // ignore
        }
      }
    }
  }

  stats(): { sessions: number; rooms: number; queue: number } {
    return {
      sessions: this.sessions.size,
      rooms: this.rooms.size,
      queue: this.queue.length,
    };
  }
}
