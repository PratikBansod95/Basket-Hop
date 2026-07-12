/** Shared multiplayer protocol (client <-> Railway WS server). */

export const MP_PROTOCOL_VERSION = 1;

export interface MpPlayerInfo {
  playerId: string;
  nickname: string;
  slot: 0 | 1;
}

/** Client → server */
export type MpClientMessage =
  | { type: 'hello'; protocol: number; playerId: string }
  | { type: 'heartbeat' }
  | { type: 'queue' }
  | { type: 'queue_cancel' }
  | { type: 'create_room' }
  | { type: 'join_room'; code: string }
  | { type: 'leave_room' };

/** Server → client */
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
