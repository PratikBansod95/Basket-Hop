import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getServerEnv } from "../../server/env.js";
import {
  applyCors,
  error,
  handleOptions,
  json,
  methodNotAllowed,
  readJsonBody,
} from "../../server/http.js";
import { ValidationError } from "../../server/validation.js";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const { registerPlayer } = await import("../../server/services/leaderboardService.js");
    const env = getServerEnv();
    if (!applyCors(req, res, env.allowedOrigins)) {
      error(res, 403, "Origin not allowed.");
      return;
    }

    if (handleOptions(req, res)) return;
    if (req.method !== "POST") {
      methodNotAllowed(res);
      return;
    }

    const body = readJsonBody(req);
    json(res, 200, await registerPlayer(body));
  } catch (err) {
    if (err instanceof ValidationError) {
      error(res, err.statusCode, err.message, err.field);
      return;
    }

    const message = err instanceof Error ? err.message : "Internal server error.";
    error(res, 500, message);
  }
}
