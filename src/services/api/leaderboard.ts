import type {
  LeaderboardResponse,
  SubmitScoreRequest,
  SubmitScoreResponse,
} from '../../../shared/contracts/leaderboard';
import { requestJson } from './client';

export function fetchLeaderboard(
  playerId: string,
  limit = 25,
  signal?: AbortSignal,
): Promise<LeaderboardResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
  });
  if (playerId) params.set('playerId', playerId);
  return requestJson<LeaderboardResponse>(`/api/leaderboard?${params.toString()}`, { signal });
}

export function submitScore(request: SubmitScoreRequest): Promise<SubmitScoreResponse> {
  return requestJson<SubmitScoreResponse>('/api/scores/submit', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
