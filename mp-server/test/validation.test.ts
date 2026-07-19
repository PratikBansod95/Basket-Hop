import { describe, expect, it } from 'vitest';
import { validateClientMessage } from '../src/validation.js';

const PLAYER_ID = '123e4567-e89b-42d3-a456-426614174000';

describe('validateClientMessage', () => {
  it('normalizes valid hello and room messages', () => {
    expect(
      validateClientMessage(
        JSON.stringify({
          type: 'hello',
          protocol: 3,
          playerId: ` ${PLAYER_ID} `,
          resumeToken: 'abcdefghijklmnopqrstuvwx',
        }),
      ),
    ).toEqual({
      ok: true,
      message: {
        type: 'hello',
        protocol: 3,
        playerId: PLAYER_ID,
        resumeToken: 'abcdefghijklmnopqrstuvwx',
      },
    });
    expect(validateClientMessage('{"type":"join_room","code":" ab2z "}')).toEqual({
      ok: true,
      message: { type: 'join_room', code: 'AB2Z' },
    });
  });

  it('rejects malformed JSON, identities, times, slots, and sequences', () => {
    expect(validateClientMessage('{').ok).toBe(false);
    expect(
      validateClientMessage('{"type":"hello","protocol":3,"playerId":"not-a-uuid"}').ok,
    ).toBe(false);
    expect(
      validateClientMessage('{"type":"heartbeat","clientTime":-1}').ok,
    ).toBe(false);
    expect(
      validateClientMessage('{"type":"tap","slot":2,"seq":1,"clientTime":1}').ok,
    ).toBe(false);
    expect(
      validateClientMessage('{"type":"tap","slot":0,"seq":1.5,"clientTime":1}').ok,
    ).toBe(false);
    expect(validateClientMessage('{"type":"unknown"}').ok).toBe(false);
  });

  it('recognizes legacy authority messages so the server can explicitly reject them', () => {
    expect(validateClientMessage('{"type":"snapshot","state":{}}')).toMatchObject({
      ok: true,
      message: { type: 'snapshot' },
    });
    expect(validateClientMessage('{"type":"match_end","result":{}}')).toMatchObject({
      ok: true,
      message: { type: 'match_end' },
    });
  });
});
