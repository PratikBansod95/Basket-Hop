import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { ApiErrorResponse } from "../shared/contracts/leaderboard";

export function json<T>(
  res: VercelResponse,
  statusCode: number,
  payload: T | ApiErrorResponse,
): void {
  res.status(statusCode).json(payload);
}

export function error(
  res: VercelResponse,
  statusCode: number,
  message: string,
  field?: string,
): void {
  json<ApiErrorResponse>(res, statusCode, { error: message, field });
}

export function getRequestOrigin(req: VercelRequest): string | null {
  const origin = req.headers.origin;
  return typeof origin === "string" ? origin : null;
}

function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

/** Exact match, or patterns like https://*.vercel.app */
export function isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
  if (allowedOrigins.length === 0) return true;

  const normalized = normalizeOrigin(origin);
  for (const raw of allowedOrigins) {
    const allowed = normalizeOrigin(raw);
    if (!allowed) continue;
    if (allowed === normalized) return true;

    const wildcard = allowed.match(/^(https?:\/\/)\*\.(.+)$/i);
    if (wildcard) {
      const [, scheme, rest] = wildcard;
      try {
        const url = new URL(normalized);
        if (`${url.protocol}//` !== scheme.toLowerCase()) continue;
        if (url.hostname === rest || url.hostname.endsWith(`.${rest}`)) return true;
      } catch {
        // ignore invalid origin
      }
    }
  }

  return false;
}

export function applyCors(
  req: VercelRequest,
  res: VercelResponse,
  allowedOrigins: string[],
): boolean {
  const origin = getRequestOrigin(req);

  if (!origin) {
    res.setHeader("Vary", "Origin");
    return true;
  }

  if (!isOriginAllowed(origin, allowedOrigins)) {
    return false;
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return true;
}

export function handleOptions(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method !== "OPTIONS") return false;
  res.status(204).end();
  return true;
}

export function methodNotAllowed(res: VercelResponse): void {
  error(res, 405, "Method not allowed.");
}

export function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].split(",")[0].trim();
  }

  return "unknown";
}

export function readJsonBody<T>(req: VercelRequest): T {
  if (typeof req.body === "string") {
    return JSON.parse(req.body) as T;
  }

  return req.body as T;
}
