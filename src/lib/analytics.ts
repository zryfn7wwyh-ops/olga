/**
 * Аналитические события страницы. В события НЕ передаются имена, телефоны,
 * email и свободный текст — только источник формы и категориальные параметры.
 *
 * Система аналитики не подключена: события складываются в window.dataLayer
 * (если он есть) и транслируются как DOM-событие `site:analytics`.
 * Подключение счётчика — после проверки его роли в обработке ПДн.
 */

export type AnalyticsEvent =
  | "estimate_form_view"
  | "site_type_select"
  | "quiz_open"
  | "quiz_step_complete"
  | "quiz_result_view"
  | "pdn_consultation_open"
  | "lead_submit_attempt"
  | "lead_submit_success"
  | "lead_submit_error"
  | "case_view";

type Params = Record<string, string | number | boolean | null | undefined>;

/** Ключи, которые могут содержать ПДн, никогда не уходят в аналитику. */
const FORBIDDEN_KEYS = new Set(["contact", "phone", "email", "name", "description", "message"]);

export function sanitizeParams(params: Params = {}): Params {
  const out: Params = {};
  for (const [k, v] of Object.entries(params)) {
    if (FORBIDDEN_KEYS.has(k)) continue;
    // Подстраховка: значения, похожие на email или телефон, отбрасываются.
    if (typeof v === "string" && (v.includes("@") || v.replace(/\D/g, "").length >= 7)) continue;
    out[k] = typeof v === "string" ? v.slice(0, 64) : v;
  }
  return out;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: AnalyticsEvent, params?: Params) {
  if (typeof window === "undefined") return;
  const safe = sanitizeParams(params);
  window.dataLayer?.push({ event, ...safe });
  window.dispatchEvent(new CustomEvent("site:analytics", { detail: { event, ...safe } }));
}
