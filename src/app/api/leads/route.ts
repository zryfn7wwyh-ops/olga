import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import {
  fullLeadSchema,
  leadRequestSchema,
  normalizePhone,
  shortLeadSchema,
  specializationLabel,
  type LeadApiResponse,
  type LeadPayload,
} from "@/lib/lead-schema";
import { deliverLead } from "@/lib/lead-delivery";
import { isRateLimited } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const json = (body: LeadApiResponse, status: number) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

const GENERIC_ERROR = "Не удалось отправить заявку. Попробуйте ещё раз немного позже.";

function clientKey(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  // В памяти храним только хеш IP.
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
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
    return json({ ok: true, mode: "test" }, 200);
  }

  if (isRateLimited(clientKey(req))) {
    return json(
      { ok: false, code: "rate_limited", message: "Слишком много попыток. Пожалуйста, попробуйте позже." },
      429,
    );
  }

  const fieldsSchema = body.variant === "full" ? fullLeadSchema : shortLeadSchema;
  const fields = fieldsSchema.safeParse(body.fields);
  if (!fields.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of fields.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return json(
      { ok: false, code: "validation", message: "Проверьте правильность заполнения формы.", fieldErrors },
      422,
    );
  }

  const f = fields.data;
  const now = new Date().toISOString();
  const lead: LeadPayload = {
    variant: body.variant,
    formSource: body.form_source,
    name: f.name,
    phone: normalizePhone(f.phone),
    city: f.city || undefined,
    specialization: f.specialization,
    specializationLabel: specializationLabel(f.specialization),
    website: f.website || undefined,
    comment: f.comment || undefined,
    consent: true,
    consentAt: now,
    utm: Object.fromEntries(Object.entries(body.utm).filter(([, v]) => v)),
    pageUrl: body.page_url,
    referrer: body.referrer,
    submittedAt: now,
  };

  const result = await deliverLead(lead);
  if (result.ok) return json({ ok: true, mode: result.mode }, 200);

  if (result.reason === "unavailable") {
    return json(
      {
        ok: false,
        code: "delivery_unavailable",
        message: "Онлайн-отправка заявок временно недоступна. Заявка не отправлена.",
      },
      503,
    );
  }
  return json({ ok: false, code: "delivery_failed", message: GENERIC_ERROR }, 502);
}

export function GET() {
  return json({ ok: false, code: "bad_request", message: "Method not allowed" }, 405);
}
