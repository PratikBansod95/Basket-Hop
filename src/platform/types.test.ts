import { describe, expect, it } from 'vitest';
import type { RunStats } from '../game/types';
import { DEFAULT_SAVE, mergeRunIntoSave, parseSaveData } from './types';

function createStats(overrides: Partial<RunStats> = {}): RunStats {
  return {
    score: 0,
    combo: 0,
    cleanShots: 0,
    rimHits: 0,
    totalShots: 0,
    hasScoredOnce: false,
    level: 0,
    ...overrides,
  };
}

describe('save data helpers', () => {
  it('defaults coins and stamina tutorial flag when parsing older saves', () => {
    const save = parseSaveData(JSON.stringify({ best: 7, totalGames: 3 }));

    expect(save).toEqual({
      ...DEFAULT_SAVE,
      best: 7,
      totalGames: 3,
      coins: 0,
      staminaTutorialSeen: false,
    });
  });

  it('banks run coins into the saved wallet at game over', () => {
    const nextSave = mergeRunIntoSave(
      {
        ...DEFAULT_SAVE,
        best: 4,
        coins: 12,
        totalGames: 2,
        totalShots: 8,
        cleanShots: 3,
      },
      createStats({ score: 9, totalShots: 5, cleanShots: 2 }),
      4,
    );

    expect(nextSave.best).toBe(9);
    expect(nextSave.coins).toBe(16);
    expect(nextSave.totalGames).toBe(3);
    expect(nextSave.totalShots).toBe(13);
    expect(nextSave.cleanShots).toBe(5);
  });
});
