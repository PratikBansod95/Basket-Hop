import type { VercelRequest } from "@vercel/node";
import type {
  HealthResponse,
  LeaderboardResponse,
  RegisterPlayerResponse,
  RenameNicknameResponse,
  SubmitScoreResponse,
} from "../../shared/contracts/leaderboard.js";
import { getServerEnv } from "../env.js";
import { getClientIp } from "../http.js";
import {
  checkDatabaseHealth,
  getLeaderboard,
  getPlayerById,
  getPlayerByNicknameKey,
  getPlayerRank,
  insertScoreSubmission,
  touchPlayer,
  updatePlayerBest,
  upsertPlayer,
} from "../repositories/leaderboardRepo.js";
import { checkRateLimit } from "../rateLimit.js";
import {
  ValidationError,
  normalizeNicknameKey,
  validateLeaderboardLimit,
  validateRegisterBody,
  validateRenameBody,
  validateSubmitScoreBody,
} from "../validation.js";

function enforceRateLimit(req: VercelRequest, playerId: string): void {
  const env = getServerEnv();
  const windowMs = env.rateLimitWindowMs;
  const maxRequests = env.rateLimitMaxRequests;
  const clientIp = getClientIp(req);

  const ipResult = checkRateLimit(`ip:${clientIp}`, maxRequests, windowMs);
  if (!ipResult.allowed) {
    throw new ValidationError("Too many requests. Please try again shortly.", undefined, 429);
  }

  const playerResult = checkRateLimit(`player:${playerId}`, maxRequests, windowMs);
  if (!playerResult.allowed) {
    throw new ValidationError("Too many score submissions. Please slow down.", undefined, 429);
  }
}

export async function getHealth(): Promise<HealthResponse> {
  await checkDatabaseHealth();
  return {
    ok: true,
    database: "ok",
    timestamp: new Date().toISOString(),
  };
}

export async function registerPlayer(body: unknown): Promise<RegisterPlayerResponse> {
  const env = getServerEnv();
  const request = validateRegisterBody(body);
  const nicknameKey = normalizeNicknameKey(request.nickname);
  const existingByName = await getPlayerByNicknameKey(nicknameKey);

  if (existingByName && existingByName.playerId !== request.playerId) {
    throw new ValidationError("That nickname is already taken.", "nickname", 409);
  }

  let player = await upsertPlayer(request.playerId, request.nickname, nicknameKey);

  const localBestScore = Math.min(request.localBestScore ?? 0, env.maxScore);
  if (localBestScore > 0) {
    player = await updatePlayerBest(
      request.playerId,
      localBestScore,
      request.localBestLogs ?? 0,
    );
  }

  return { player };
}

export async function renamePlayer(body: unknown): Promise<RenameNicknameResponse> {
  const request = validateRenameBody(body);
  const currentPlayer = await getPlayerById(request.playerId);
  if (!currentPlayer) {
    throw new ValidationError("Player not found.", "playerId", 404);
  }

  const nicknameKey = normalizeNicknameKey(request.nickname);
  const existingByName = await getPlayerByNicknameKey(nicknameKey);
  if (existingByName && existingByName.playerId !== request.playerId) {
    throw new ValidationError("That nickname is already taken.", "nickname", 409);
  }

  const player = await upsertPlayer(request.playerId, request.nickname, nicknameKey);
  return { player };
}

export async function submitScore(
  req: VercelRequest,
  body: unknown,
): Promise<SubmitScoreResponse> {
  const env = getServerEnv();
  const request = validateSubmitScoreBody(body, env.maxScore);
  enforceRateLimit(req, request.playerId);

  const player = await getPlayerById(request.playerId);
  if (!player) {
    throw new ValidationError("Player not found. Register a nickname first.", "playerId", 404);
  }

  const accepted = await insertScoreSubmission(
    request.playerId,
    request.clientRunId,
    request.score,
    request.logsClimbed,
    request.perfects,
    request.goods,
    request.peakCombo,
    request.surface,
  );

  if (!accepted) {
    await touchPlayer(request.playerId);
    const currentRank = await getPlayerRank(request.playerId);
    return {
      accepted: false,
      personalBest: false,
      leaderboardRank: currentRank?.rank ?? null,
      playerBestScore: player.bestScore,
      playerBestLogs: player.bestLogs,
    };
  }

  const personalBest = request.score > player.bestScore;
  const updatedPlayer = await updatePlayerBest(
    request.playerId,
    request.score,
    request.logsClimbed,
  );
  const rank = await getPlayerRank(request.playerId);

  return {
    accepted: true,
    personalBest,
    leaderboardRank: rank?.rank ?? null,
    playerBestScore: updatedPlayer.bestScore,
    playerBestLogs: updatedPlayer.bestLogs,
  };
}

export async function fetchLeaderboard(
  limitRaw: unknown,
  playerIdRaw: unknown,
): Promise<LeaderboardResponse> {
  const limit = validateLeaderboardLimit(limitRaw);
  const entries = await getLeaderboard(limit);
  const playerId = typeof playerIdRaw === "string" ? playerIdRaw.trim() : "";
  const playerEntry = playerId ? await getPlayerRank(playerId) : null;

  return {
    entries,
    playerEntry:
      playerEntry &&
      entries.every((entry: { playerId: string }) => entry.playerId !== playerEntry.playerId)
        ? playerEntry
        : null,
    limit,
    fetchedAt: new Date().toISOString(),
  };
}
