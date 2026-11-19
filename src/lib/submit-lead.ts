import type { FormSource, LeadApiResponse } from "./lead-schema";
import { getUtm } from "./utm";

/**
 * Единый клиентский адаптер отправки заявки. Все формы вызывают только его.
 * Секретов здесь нет: доставка в CRM/email/webhook настраивается на сервере (/api/leads, переменные окружения).
 */
export type SubmitLeadInput = {
  source: FormSource;
  fields: { name: string; phone: string; specialization?: string; city?: string; consent: boolean };
  honeypot?: string;
  submissionId: string;
};

export type SubmitLeadResult =
  | { status: "success"; mode: "live" | "demo" }
  | { status: "error"; code: string; message: string; fieldErrors?: Record<string, string> };

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export async function submitLead(input: SubmitLeadInput): Promise<SubmitLeadResult> {
  try {
    const res = await fetch(`${BASE_PATH}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form_source: input.source,
        fields: {
          ...input.fields,
          specialization: input.fields.specialization || undefined,
          city: input.fields.city?.trim() || undefined,
        },
        utm: getUtm(),
        page_url: window.location.href.split("#")[0],
        referrer: document.referrer || undefined,
        submission_id: input.submissionId,
        company_url: input.honeypot || undefined,
      }),
      signal: AbortSignal.timeout(20_000),
    });
    const data = (await res.json().catch(() => null)) as LeadApiResponse | null;
    if (res.ok && data?.ok) return { status: "success", mode: data.mode };
    if (data && !data.ok) return { status: "error", code: data.code, message: data.message, fieldErrors: data.fieldErrors };
    return { status: "error", code: `http_${res.status}`, message: "Не удалось отправить заявку. Попробуйте ещё раз." };
  } catch {
    return {
      status: "error",
      code: "network",
      message: "Не удалось связаться с сервером. Проверьте подключение к интернету и попробуйте ещё раз.",
    };
  }
}
