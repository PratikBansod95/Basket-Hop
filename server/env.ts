const DEFAULT_MAX_SCORE = 9999;
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000;
const DEFAULT_RATE_LIMIT_MAX_REQUESTS = 12;

export interface ServerEnv {
  databaseUrl: string;
  allowedOrigins: string[];
  maxScore: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}

let cachedEnv: ServerEnv | null = null;

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

export function getServerEnv(): ServerEnv {
  if (cachedEnv) return cachedEnv;

  const databaseUrl =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL_NON_POOLING;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL or POSTGRES_URL is required.");
  }

  cachedEnv = {
    databaseUrl,
    allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    maxScore: parseNumber(process.env.LEADERBOARD_MAX_SCORE, DEFAULT_MAX_SCORE),
    rateLimitWindowMs: parseNumber(
      process.env.LEADERBOARD_RATE_LIMIT_WINDOW_MS,
      DEFAULT_RATE_LIMIT_WINDOW_MS,
    ),
    rateLimitMaxRequests: parseNumber(
      process.env.LEADERBOARD_RATE_LIMIT_MAX_REQUESTS,
      DEFAULT_RATE_LIMIT_MAX_REQUESTS,
    ),
  };

  return cachedEnv;
}
