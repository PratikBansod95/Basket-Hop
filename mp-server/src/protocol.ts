import type { WebSocket } from 'ws';

export interface MpPlayerInfo {
  playerId: string;
  nickname: string;
  slot: 0 | 1;
}

export type MpClientMessage =
  | { type: 'hello'; protocol: number; playerId: string }
  | { type: 'heartbeat' }
  | { type: 'queue' }
  | { type: 'queue_cancel' }
  | { type: 'create_room' }
  | { type: 'join_room'; code: string }
  | { type: 'leave_room' };

export type MpServerMessage =
  | { type: 'welcome'; playerId: string; nickname: string }
  | { type: 'error'; code: string; message: string }
  | { type: 'queued' }
  | { type: 'queue_left' }
  | {
      type: 'room';
      roomId: string;
      code: string | null;
      players: MpPlayerInfo[];
      youAreHost: boolean;
      phase: 'lobby' | 'countdown' | 'playing' | 'ended';
    }
  | { type: 'room_left' }
  | { type: 'peer_left'; playerId: string; nickname: string }
  | { type: 'pong' };

export const MP_PROTOCOL_VERSION = 1;

export interface Session {
  ws: WebSocket;
  playerId: string;
  nickname: string;
  lastHeartbeatAt: number;
  roomId: string | null;
  inQueue: boolean;
}

export interface Room {
  id: string;
  code: string | null;
  hostPlayerId: string;
  players: Map<string, { nickname: string; slot: 0 | 1 }>;
  phase: 'lobby' | 'countdown' | 'playing' | 'ended';
  createdAt: number;
}

export function makeRoomId(): string {
  return `rm_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function makeRoomCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

export function roomPlayersList(room: Room): MpPlayerInfo[] {
  return [...room.players.entries()]
    .map(([playerId, info]) => ({
      playerId,
      nickname: info.nickname,
      slot: info.slot,
    }))
    .sort((a, b) => a.slot - b.slot);
}
