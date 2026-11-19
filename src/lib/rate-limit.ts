import "server-only";

/**
 * Простой rate limit в памяти процесса (скользящее окно).
 * Подходит для одного инстанса. При горизонтальном масштабировании
 * замените на Redis / лимиты на уровне reverse-proxy (см. TODO_BEFORE_LAUNCH.md).
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}
