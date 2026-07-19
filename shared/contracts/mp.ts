/** Shared multiplayer protocol (client <-> Railway WS server). */

export const MP_PROTOCOL_VERSION = 4;

export interface MpPlayerInfo {
  playerId: string;
  nickname: string;
  slot: 0 | 1;
}

export interface MpBallSnap {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  hasLaunched: boolean;
  fallingThrough: boolean;
  scoredThisShot: boolean;
  hitRimThisShot: boolean;
}

export interface MpHoopSnap {
  side: 'left' | 'right';
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  slideFromX: number;
  slideFromY: number;
  slideT: number;
  tilt: number;
  tiltVel: number;
  animating: boolean;
}

export interface MpMatchSnapshot {
  seq: number;
  /** Authoritative 60 Hz simulation tick. */
  tick: number;
  /** Server Unix time in milliseconds at publish. */
  serverTime: number;
  /** Highest tap sequence applied for each player. */
  ackTapSeq: [number, number];
  timeLeft: number;
  scoreP1: number;
  scoreP2: number;
  climbOffset: number;
  targetClimbOffset: number;
  climbAnimating: boolean;
  hoop: MpHoopSnap;
  balls: [MpBallSnap, MpBallSnap];
}

export interface MpMatchResult {
  scoreP1: number;
  scoreP2: number;
  winner: 'p1' | 'p2' | 'draw';
  reason: 'timer' | 'forfeit';
}

/** Client → server */
export type MpClientMessage =
  | { type: 'hello'; protocol: number; playerId: string; resumeToken?: string }
  | { type: 'heartbeat'; clientTime: number }
  | { type: 'queue' }
  | { type: 'queue_cancel' }
  | { type: 'create_room' }
  | { type: 'join_room'; code: string }
  | { type: 'leave_room' }
  | { type: 'tap'; slot: 0 | 1; seq: number; clientTime: number }
  | { type: 'snapshot'; state: MpMatchSnapshot }
  | { type: 'match_end'; result: MpMatchResult };

/** Server → client */
export type MpServerMessage =
  | { type: 'welcome'; playerId: string; nickname: string; resumeToken: string }
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
  | { type: 'pong'; clientTime: number; serverTime: number }
  | { type: 'match_countdown'; seconds: number; players: MpPlayerInfo[] }
  | {
      type: 'match_start';
      roomId: string;
      yourSlot: 0 | 1;
      youAreHost: boolean;
      players: MpPlayerInfo[];
      startAt: number;
    }
  | { type: 'tap'; slot: 0 | 1; seq: number; clientTime: number }
  | { type: 'snapshot'; state: MpMatchSnapshot }
  | { type: 'match_end'; result: MpMatchResult };
