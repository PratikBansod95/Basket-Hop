import type { MpClientMessage } from './protocol.js';

export type ValidationResult =
  | { ok: true; message: MpClientMessage }
  | { ok: false; code: 'bad_json' | 'bad_message'; message: string };

const PLAYER_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ROOM_CODE_RE = /^[A-Z2-9]{4}$/;
const TOKEN_RE = /^[A-Za-z0-9_-]{20,128}$/;
const MAX_CLIENT_TIME = 10 ** 15;
const MAX_SEQUENCE = 2_147_483_647;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function finiteIn(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

function integerIn(value: unknown, min: number, max: number): value is number {
  return finiteIn(value, min, max) && Number.isInteger(value);
}

function invalid(message: string): ValidationResult {
  return { ok: false, code: 'bad_message', message };
}

export function validateClientMessage(raw: string): ValidationResult {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { ok: false, code: 'bad_json', message: 'Message must be valid JSON.' };
  }

  if (!isRecord(value) || typeof value.type !== 'string') {
    return invalid('Message must be an object with a type.');
  }

  switch (value.type) {
    case 'hello':
      if (!integerIn(value.protocol, 1, 10_000)) return invalid('Invalid protocol version.');
      if (typeof value.playerId !== 'string' || !PLAYER_ID_RE.test(value.playerId.trim())) {
        return invalid('Invalid playerId.');
      }
      if (
        value.resumeToken !== undefined &&
        (typeof value.resumeToken !== 'string' || !TOKEN_RE.test(value.resumeToken))
      ) {
        return invalid('Invalid resumeToken.');
      }
      return {
        ok: true,
        message: {
          type: 'hello',
          protocol: value.protocol,
          playerId: value.playerId.trim(),
          ...(value.resumeToken === undefined ? {} : { resumeToken: value.resumeToken }),
        },
      };

    case 'heartbeat':
      if (!finiteIn(value.clientTime, 0, MAX_CLIENT_TIME)) return invalid('Invalid clientTime.');
      return { ok: true, message: { type: 'heartbeat', clientTime: value.clientTime } };

    case 'queue':
    case 'queue_cancel':
    case 'create_room':
    case 'leave_room':
      return { ok: true, message: { type: value.type } };

    case 'join_room': {
      if (typeof value.code !== 'string') return invalid('Room code is required.');
      const code = value.code.trim().toUpperCase();
      if (!ROOM_CODE_RE.test(code)) return invalid('Invalid room code.');
      return { ok: true, message: { type: 'join_room', code } };
    }

    case 'tap':
      if (value.slot !== 0 && value.slot !== 1) return invalid('Invalid tap slot.');
      if (!integerIn(value.seq, 1, MAX_SEQUENCE)) return invalid('Invalid tap sequence.');
      if (!finiteIn(value.clientTime, 0, MAX_CLIENT_TIME)) return invalid('Invalid clientTime.');
      return {
        ok: true,
        message: {
          type: 'tap',
          slot: value.slot,
          seq: value.seq,
          clientTime: value.clientTime,
        },
      };

    case 'snapshot':
    case 'match_end':
      // Kept in the wire union for rolling client compatibility. Their payload
      // is deliberately not parsed because clients have no state authority.
      return { ok: true, message: { type: value.type } as MpClientMessage };

    default:
      return invalid('Unknown message type.');
  }
}
