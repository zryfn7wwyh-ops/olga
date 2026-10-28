import "server-only";
import { randomUUID, createHash } from "node:crypto";
import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import type { LeadPayload } from "@/lib/leads/schema";

/* ---------- Конфигурация канала доставки ---------- */

export type DeliveryConfig =
  | { mode: "webhook"; url: string; secret?: string; timeoutMs: number }
  | { mode: "test"; file: string }
  | { mode: "disabled"; reason: string };

export function getDeliveryConfig(env: NodeJS.ProcessEnv = process.env): DeliveryConfig {
  const isProd = env.NODE_ENV === "production";
  const mode = env.LEAD_DELIVERY_MODE?.trim() || (isProd ? "" : "test");

  if (mode === "webhook") {
    const url = env.LEAD_WEBHOOK_URL?.trim();
    if (!url) return { mode: "disabled", reason: "LEAD_WEBHOOK_URL is not set" };
    if (isProd && !url.startsWith("https://")) return { mode: "disabled", reason: "LEAD_WEBHOOK_URL must use HTTPS in production" };
    return {
      mode: "webhook",
      url,
      secret: env.LEAD_WEBHOOK_SECRET?.trim() || undefined,
      timeoutMs: Number(env.LEAD_WEBHOOK_TIMEOUT_MS) || 8000,
    };
  }
  if (mode === "test") {
    if (isProd && env.LEAD_ALLOW_TEST_MODE_IN_PRODUCTION !== "true") {
      return { mode: "disabled", reason: "test mode is not allowed in production" };
    }
    return { mode: "test", file: path.resolve(env.LEAD_TEST_FILE?.trim() || ".data/leads.jsonl") };
  }
  return { mode: "disabled", reason: "LEAD_DELIVERY_MODE is not configured" };
}

export class DeliveryError extends Error {}

export type StoredLead = LeadPayload & { requestId: string; receivedAt: string };

export async function deliverLead(lead: StoredLead, config: DeliveryConfig): Promise<void> {
  if (config.mode === "disabled") throw new DeliveryError(config.reason);

  if (config.mode === "test") {
    await mkdir(path.dirname(config.file), { recursive: true });
    await appendFile(config.file, JSON.stringify(lead) + "\n", { encoding: "utf8", mode: 0o600 });
    return;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);
  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": lead.requestId,
        ...(config.secret ? { Authorization: `Bearer ${config.secret}` } : {}),
      },
      body: JSON.stringify(lead),
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) throw new DeliveryError(`webhook responded ${res.status}`);
  } catch (err) {
    if (err instanceof DeliveryError) throw err;
    throw new DeliveryError(controller.signal.aborted ? "webhook timeout" : "webhook request failed");
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- Ограничение частоты (in-memory, на один инстанс) ---------- */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string, now = Date.now(), env: NodeJS.ProcessEnv = process.env) {
  const max = Number(env.LEAD_RATE_LIMIT_MAX) || 5;
  const windowMs = Number(env.LEAD_RATE_LIMIT_WINDOW_MS) || 10 * 60_000;
  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }
  bucket.count += 1;
  if (bucket.count > max) return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  return { allowed: true, retryAfterSec: 0 };
}

/* ---------- Защита от дублей ---------- */

type DedupeEntry = { promise: Promise<string>; expiresAt: number };
const recent = new Map<string, DedupeEntry>();
const DEDUPE_TTL_MS = 10 * 60_000;

/** Ключ: idempotencyKey клиента, иначе хэш содержимого заявки. */
export function dedupeKey(lead: LeadPayload): string {
  if (lead.idempotencyKey) return `k:${lead.idempotencyKey}`;
  const { idempotencyKey: _k, website: _w, attribution: _a, ...content } = lead;
  return "h:" + createHash("sha256").update(JSON.stringify(content)).digest("hex");
}

/**
 * Принимает заявку один раз: параллельные и повторные запросы с тем же ключом
 * получают тот же requestId. Неудачная доставка не кэшируется — можно повторить.
 */
export function acceptOnce(key: string, deliver: (requestId: string) => Promise<void>, now = Date.now()): Promise<string> {
  for (const [k, e] of recent) if (e.expiresAt <= now) recent.delete(k);
  const existing = recent.get(key);
  if (existing) return existing.promise;

  const requestId = randomUUID();
  const promise = deliver(requestId).then(
    () => requestId,
    (err) => {
      recent.delete(key);
      throw err;
    },
  );
  recent.set(key, { promise, expiresAt: now + DEDUPE_TTL_MS });
  return promise;
}

export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

/** Журнал без персональных данных. */
export function logLeadEvent(event: string, meta: Record<string, string | number | undefined>) {
  console.info(JSON.stringify({ scope: "leads", event, ...meta, at: new Date().toISOString() }));
}

/** Только для тестов. */
export function __resetServerState() {
  buckets.clear();
  recent.clear();
}
