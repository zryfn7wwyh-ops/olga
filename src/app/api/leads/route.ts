import { NextResponse, type NextRequest } from "next/server";
import { parseLeadPayload } from "@/lib/leads/schema";
import { formDataToPayload } from "@/lib/leads/form-data";
import {
  acceptOnce,
  checkRateLimit,
  clientIp,
  dedupeKey,
  deliverLead,
  getDeliveryConfig,
  logLeadEvent,
} from "@/lib/leads/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;

type Reply = { status: number; body: Record<string, unknown>; headers?: Record<string, string> };

/**
 * Ответ для формы без JavaScript: переадресация на страницу результата.
 * Для fetch-клиента — JSON по контракту.
 */
function respond(req: NextRequest, isForm: boolean, reply: Reply) {
  if (isForm) {
    const status = reply.body.success ? "success" : reply.status === 422 || reply.status === 400 ? "invalid" : "error";
    return NextResponse.redirect(new URL(`/lead?status=${status}`, req.url), 303);
  }
  return NextResponse.json(reply.body, { status: reply.status, headers: { "Cache-Control": "no-store", ...reply.headers } });
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  const isForm = contentType.startsWith("application/x-www-form-urlencoded") || contentType.startsWith("multipart/form-data");

  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return respond(req, isForm, { status: 413, body: { success: false, error: "payload_too_large" } });

  const rate = checkRateLimit(clientIp(req.headers));
  if (!rate.allowed) {
    logLeadEvent("rate_limited", {});
    return respond(req, isForm, {
      status: 429,
      body: { success: false, error: "rate_limited" },
      headers: { "Retry-After": String(rate.retryAfterSec) },
    });
  }

  let input: unknown;
  try {
    const raw = await req.text();
    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) {
      return respond(req, isForm, { status: 413, body: { success: false, error: "payload_too_large" } });
    }
    input = isForm ? formDataToPayload(new URLSearchParams(raw)) : JSON.parse(raw);
  } catch {
    return respond(req, isForm, { status: 400, body: { success: false, error: "bad_request" } });
  }

  const parsed = parseLeadPayload(input);
  if (!parsed.ok) {
    logLeadEvent("validation_failed", { fields: Object.keys(parsed.errors).join(",") });
    return respond(req, isForm, { status: 422, body: { success: false, error: "validation_failed", fields: parsed.errors } });
  }

  // Бот заполнил honeypot: отвечаем нейтрально, заявку не доставляем.
  if (parsed.isBot) {
    logLeadEvent("honeypot", { source: parsed.data.source });
    return respond(req, isForm, { status: 200, body: { success: true, requestId: crypto.randomUUID() } });
  }

  const config = getDeliveryConfig();
  if (config.mode === "disabled") {
    logLeadEvent("delivery_disabled", { reason: config.reason });
    return respond(req, isForm, { status: 503, body: { success: false, error: "delivery_unavailable" } });
  }

  try {
    const { idempotencyKey: _k, website: _w, ...lead } = parsed.data;
    const requestId = await acceptOnce(dedupeKey(parsed.data), (id) =>
      deliverLead({ ...lead, requestId: id, receivedAt: new Date().toISOString() }, config),
    );
    logLeadEvent("delivered", { requestId, source: lead.source, mode: config.mode });
    return respond(req, isForm, {
      status: 201,
      body: { success: true, requestId, ...(config.mode === "test" ? { testMode: true } : {}) },
    });
  } catch (err) {
    logLeadEvent("delivery_failed", { source: parsed.data.source, reason: err instanceof Error ? err.message : "unknown" });
    return respond(req, isForm, { status: 503, body: { success: false, error: "delivery_failed" } });
  }
}
