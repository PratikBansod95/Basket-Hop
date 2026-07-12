import type { RunStats } from '../../game/types';
import type { SaveData } from '../../platform/types';
import type { LeaderboardSurface } from '../../../shared/contracts/leaderboard';
import { submitScore } from './leaderboard';

export function newClientRunId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `run-${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`;
}

/** Best-effort solo leaderboard submit. Maps baskets/level into Hopiko-shaped fields. */
export function submitSoloRunScore(
  save: SaveData,
  stats: RunStats,
  surface: LeaderboardSurface,
  clientRunId: string,
): void {
  if (!save.nickname || !save.playerId) return;
  if (stats.score === 0 && stats.level <= 1) return;

  void submitScore({
    playerId: save.playerId,
    clientRunId,
    score: stats.score,
    logsClimbed: Math.max(0, stats.level),
    perfects: stats.cleanShots,
    goods: Math.max(0, stats.totalShots - stats.cleanShots),
    peakCombo: stats.combo,
    surface,
  }).catch(() => {
    // Best-effort global leaderboard submission.
  });
}
