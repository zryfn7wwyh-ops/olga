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

/**
 * Защита от дублей: успешно доставленная заявка с тем же телефоном (или тем же submission_id)
 * в течение 10 минут не доставляется повторно — пользователь получает тот же успешный ответ.
 */
const DEDUPE_MS = 10 * 60 * 1000;
const delivered = new Map<string, { at: number; mode: "live" | "demo" }>();

export function findDuplicate(keys: string[], now = Date.now()) {
  for (const key of keys) {
    const hit = delivered.get(key);
    if (hit && now - hit.at < DEDUPE_MS) return hit;
  }
  return null;
}

export function rememberDelivered(keys: string[], mode: "live" | "demo", now = Date.now()) {
  for (const key of keys) delivered.set(key, { at: now, mode });
  if (delivered.size > 5000) {
    for (const [k, v] of delivered) if (now - v.at >= DEDUPE_MS) delivered.delete(k);
  }
}
