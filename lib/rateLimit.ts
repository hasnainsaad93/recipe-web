// Tiny in-memory limiter for sign-in attempts (per key, e.g. email or IP).
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

const hits = new Map<string, { count: number; reset: number }>();

export function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export function resetAttempts(key: string) {
  hits.delete(key);
}

export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0].trim() || headers.get("x-real-ip") || "unknown";
}
