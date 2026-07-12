import {
  LEADERBOARD_DEFAULT_LIMIT,
  LEADERBOARD_MAX_LIMIT,
  MAX_NICKNAME_LENGTH,
  MIN_NICKNAME_LENGTH,
  type LeaderboardSurface,
  type RegisterPlayerRequest,
  type RenameNicknameRequest,
  type SubmitScoreRequest,
} from "../shared/contracts/leaderboard.js";

const RESERVED_WORDS = new Set([
  "admin",
  "administrator",
  "anonymous",
  "cursor",
  "guest",
  "baskethop",
  "null",
  "owner",
  "system",
  "undefined",
]);

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly statusCode = 400,
  ) {
    super(message);
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function expectString(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new ValidationError(`${field} must be a string.`, field);
  }

  return value;
}

function expectPositiveInteger(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new ValidationError(`${field} must be a non-negative number.`, field);
  }

  return Math.floor(value);
}

function parseOptionalNonNegativeInteger(value: unknown, field: string): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return expectPositiveInteger(value, field);
}

export function normalizeNickname(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeNicknameKey(value: string): string {
  return normalizeNickname(value).toLowerCase();
}

export function validateNickname(raw: unknown): string {
  const nickname = normalizeNickname(expectString(raw, "nickname"));

  if (nickname.length < MIN_NICKNAME_LENGTH || nickname.length > MAX_NICKNAME_LENGTH) {
    throw new ValidationError(
      `Nickname must be ${MIN_NICKNAME_LENGTH}-${MAX_NICKNAME_LENGTH} characters long.`,
      "nickname",
    );
  }

  if (!/^[A-Za-z0-9 _-]+$/.test(nickname)) {
    throw new ValidationError(
      "Nickname may only contain letters, numbers, spaces, underscores, and hyphens.",
      "nickname",
    );
  }

  if (RESERVED_WORDS.has(normalizeNicknameKey(nickname))) {
    throw new ValidationError("That nickname is reserved. Please choose another.", "nickname");
  }

  return nickname;
}

export function validatePlayerId(raw: unknown): string {
  const playerId = expectString(raw, "playerId").trim();
  if (!/^[a-f0-9-]{16,}$/i.test(playerId)) {
    throw new ValidationError("playerId is invalid.", "playerId");
  }

  return playerId;
}

export function validateRegisterBody(raw: unknown): RegisterPlayerRequest {
  if (!isObject(raw)) {
    throw new ValidationError("Request body must be an object.");
  }

  return {
    playerId: validatePlayerId(raw.playerId),
    nickname: validateNickname(raw.nickname),
    localBestScore: parseOptionalNonNegativeInteger(raw.localBestScore, "localBestScore"),
    localBestLogs: parseOptionalNonNegativeInteger(raw.localBestLogs, "localBestLogs"),
  };
}

export function validateRenameBody(raw: unknown): RenameNicknameRequest {
  return validateRegisterBody(raw);
}

function validateSurface(raw: unknown): LeaderboardSurface {
  if (raw === "web" || raw === "playables") return raw;
  throw new ValidationError("surface must be either 'web' or 'playables'.", "surface");
}

export function validateSubmitScoreBody(
  raw: unknown,
  maxScore: number,
): SubmitScoreRequest {
  if (!isObject(raw)) {
    throw new ValidationError("Request body must be an object.");
  }

  const score = expectPositiveInteger(raw.score, "score");
  if (score > maxScore) {
    throw new ValidationError(`score exceeds the maximum accepted value of ${maxScore}.`, "score");
  }

  return {
    playerId: validatePlayerId(raw.playerId),
    clientRunId: expectString(raw.clientRunId, "clientRunId").trim(),
    score,
    logsClimbed: expectPositiveInteger(raw.logsClimbed, "logsClimbed"),
    perfects: expectPositiveInteger(raw.perfects, "perfects"),
    goods: expectPositiveInteger(raw.goods, "goods"),
    peakCombo: expectPositiveInteger(raw.peakCombo, "peakCombo"),
    surface: validateSurface(raw.surface),
  };
}

export function validateLeaderboardLimit(raw: unknown): number {
  if (raw === undefined) return LEADERBOARD_DEFAULT_LIMIT;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new ValidationError("limit must be a positive number.", "limit");
  }

  return Math.min(LEADERBOARD_MAX_LIMIT, Math.floor(parsed));
}
