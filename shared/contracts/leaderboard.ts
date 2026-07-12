export const MAX_NICKNAME_LENGTH = 8;
export const MIN_NICKNAME_LENGTH = 3;
export const LEADERBOARD_DEFAULT_LIMIT = 25;
export const LEADERBOARD_MAX_LIMIT = 100;

export type LeaderboardSurface = "web" | "playables";

export interface ApiErrorResponse {
  error: string;
  field?: string;
}

export interface PlayerProfile {
  playerId: string;
  nickname: string;
  bestScore: number;
  bestLogs: number;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPlayerRequest {
  playerId: string;
  nickname: string;
  localBestScore?: number;
  localBestLogs?: number;
}

export interface RegisterPlayerResponse {
  player: PlayerProfile;
}

export interface RenameNicknameRequest {
  playerId: string;
  nickname: string;
}

export interface RenameNicknameResponse {
  player: PlayerProfile;
}

export interface SubmitScoreRequest {
  playerId: string;
  clientRunId: string;
  score: number;
  logsClimbed: number;
  perfects: number;
  goods: number;
  peakCombo: number;
  surface: LeaderboardSurface;
}

export interface SubmitScoreResponse {
  accepted: boolean;
  personalBest: boolean;
  leaderboardRank: number | null;
  playerBestScore: number;
  playerBestLogs: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  nickname: string;
  score: number;
  logsClimbed: number;
  updatedAt: string;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  playerEntry: LeaderboardEntry | null;
  limit: number;
  fetchedAt: string;
}

export interface HealthResponse {
  ok: true;
  database: "ok";
  timestamp: string;
}
