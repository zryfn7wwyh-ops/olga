import type { FieldErrors, LeadPayload } from "@/lib/leads/schema";

export type SubmitResult =
  | { ok: true; requestId: string; testMode: boolean }
  | { ok: false; kind: "validation"; fields: FieldErrors }
  | { ok: false; kind: "rate_limited" | "server" | "network" };

const TIMEOUT_MS = 15_000;

/** Типизированная отправка заявки. Успех — только при подтверждении сервера. */
export async function submitLead(payload: LeadPayload, fetchImpl: typeof fetch = fetch): Promise<SubmitResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetchImpl("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const body = (await res.json().catch(() => null)) as
      | { success?: boolean; requestId?: string; testMode?: boolean; fields?: FieldErrors }
      | null;

    if ((res.status === 200 || res.status === 201) && body?.success === true && typeof body.requestId === "string") {
      return { ok: true, requestId: body.requestId, testMode: body.testMode === true };
    }
    if ((res.status === 400 || res.status === 422) && body?.fields) return { ok: false, kind: "validation", fields: body.fields };
    if (res.status === 429) return { ok: false, kind: "rate_limited" };
    return { ok: false, kind: "server" };
  } catch {
    return { ok: false, kind: "network" };
  } finally {
    clearTimeout(timer);
  }
}

export function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `k-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
