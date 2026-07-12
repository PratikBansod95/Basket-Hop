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
