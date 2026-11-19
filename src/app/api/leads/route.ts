import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import {
  leadFieldsSchema,
  leadRequestSchema,
  normalizePhone,
  specializationLabel,
  type LeadApiResponse,
  type LeadPayload,
} from "@/lib/lead-schema";
import { deliverLead } from "@/lib/lead-delivery";
import { findDuplicate, isRateLimited, rememberDelivered } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const json = (body: LeadApiResponse, status: number) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

const GENERIC_ERROR = "Не удалось отправить заявку. Попробуйте ещё раз немного позже.";
const hash = (v: string) => createHash("sha256").update(v).digest("hex").slice(0, 32);

function clientKey(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  return hash(`ip:${ip}`);
}

export async function POST(req: NextRequest) {
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) {
    return json({ ok: false, code: "bad_request", message: GENERIC_ERROR }, 415);
  }

  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > 20_000) return json({ ok: false, code: "bad_request", message: GENERIC_ERROR }, 413);
    raw = JSON.parse(text);
  } catch {
    return json({ ok: false, code: "bad_request", message: GENERIC_ERROR }, 400);
  }

  const parsed = leadRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return json({ ok: false, code: "bad_request", message: "Проверьте правильность заполнения формы." }, 400);
  }
  const body = parsed.data;

  // Honeypot: боту отвечаем нейтрально, заявку не доставляем.
  if (body.company_url && body.company_url.trim() !== "") {
    return json({ ok: true, mode: "demo" }, 200);
  }

  const fields = leadFieldsSchema.safeParse({
    ...body.fields,
    specialization: body.fields.specialization || undefined,
    city: body.fields.city || undefined,
  });
  if (!fields.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of fields.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return json({ ok: false, code: "validation", message: "Проверьте правильность заполнения формы.", fieldErrors }, 422);
  }

  const f = fields.data;
  const phone = normalizePhone(f.phone);
  const dedupeKeys = [hash(`phone:${phone}`), ...(body.submission_id ? [hash(`sid:${body.submission_id}`)] : [])];

  // Повторная отправка уже доставленной заявки — не дублируем в CRM.
  const duplicate = findDuplicate(dedupeKeys);
  if (duplicate) return json({ ok: true, mode: duplicate.mode, duplicate: true }, 200);

  if (isRateLimited(clientKey(req))) {
    return json({ ok: false, code: "rate_limited", message: "Слишком много попыток. Пожалуйста, попробуйте позже." }, 429);
  }

  const now = new Date().toISOString();
  const lead: LeadPayload = {
    formSource: body.form_source,
    name: f.name,
    phone,
    city: f.city || undefined,
    specialization: f.specialization,
    specializationLabel: f.specialization ? specializationLabel(f.specialization) : undefined,
    consent: true,
    consentAt: now,
    utm: Object.fromEntries(Object.entries(body.utm).filter(([, v]) => v)),
    pageUrl: body.page_url,
    referrer: body.referrer,
    submittedAt: now,
  };

  const result = await deliverLead(lead);
  if (result.ok) {
    rememberDelivered(dedupeKeys, result.mode);
    return json({ ok: true, mode: result.mode }, 200);
  }
  if (result.reason === "unavailable") {
    return json(
      { ok: false, code: "delivery_unavailable", message: "Онлайн-отправка заявок временно недоступна. Заявка не отправлена." },
      503,
    );
  }
  return json({ ok: false, code: "delivery_failed", message: GENERIC_ERROR }, 502);
}

export function GET() {
  return json({ ok: false, code: "bad_request", message: "Method not allowed" }, 405);
}
