import type { WebSocket } from 'ws';
import type {
  MpMatchResult,
  MpMatchSnapshot,
  MpPlayerInfo,
} from '../../shared/contracts/mp.js';
import type { VersusGame } from '../../src/game/VersusGame.js';

export { MP_PROTOCOL_VERSION } from '../../shared/contracts/mp.js';
export type {
  MpClientMessage,
  MpMatchResult,
  MpMatchSnapshot,
  MpPlayerInfo,
  MpServerMessage,
} from '../../shared/contracts/mp.js';
export const MATCH_COUNTDOWN_SEC = 3;

export interface Session {
  ws: WebSocket | null;
  playerId: string;
  nickname: string;
  resumeToken: string;
  connected: boolean;
  detachedAt: number | null;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  lastHeartbeatAt: number;
  roomId: string | null;
  inQueue: boolean;
  messageWindowAt: number;
  messageCount: number;
  tapWindowAt: number;
  tapCount: number;
}

export interface Room {
  id: string;
  code: string | null;
  hostPlayerId: string;
  players: Map<string, { nickname: string; slot: 0 | 1 }>;
  phase: 'lobby' | 'countdown' | 'playing' | 'ended';
  createdAt: number;
  updatedAt: number;
  countdownTimer: ReturnType<typeof setInterval> | null;
  countdownSeconds: number | null;
  game: VersusGame | null;
  startAt: number | null;
  tick: number;
  snapshotSeq: number;
  ackTapSeq: [number, number];
  latestSnapshot: MpMatchSnapshot | null;
  lastSimAt: number;
  simAccumulator: number;
  result: MpMatchResult | null;
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
