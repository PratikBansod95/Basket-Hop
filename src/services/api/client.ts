import type { ApiErrorResponse } from '../../../shared/contracts/leaderboard';

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly field?: string,
  ) {
    super(message);
  }
}

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configured) return trimTrailingSlash(configured);

  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:3000';
  }

  return '';
}

function getRequestUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = getApiBaseUrl();
  return base ? `${base}${normalizedPath}` : normalizedPath;
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(getRequestUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const text = await response.text();
  let parsed: T | ApiErrorResponse | null = null;
  if (text) {
    try {
      parsed = JSON.parse(text) as T | ApiErrorResponse;
    } catch {
      if (!response.ok) {
        throw new ApiClientError(`Server error (${response.status}). Please try again.`, response.status);
      }
      throw new ApiClientError('The server returned an invalid response.', response.status);
    }
  }

  if (!response.ok) {
    const errorPayload = parsed as ApiErrorResponse | null;
    throw new ApiClientError(
      errorPayload?.error ?? 'Request failed.',
      response.status,
      errorPayload?.field,
    );
  }

  return parsed as T;
}
