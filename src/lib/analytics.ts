/**
 * Аналитика (Яндекс Метрика). Счётчик подключается, только если задан
 * NEXT_PUBLIC_YANDEX_METRIKA_ID (см. components/layout/Analytics.tsx).
 *
 * ВАЖНО: в события НЕ передаются персональные данные (имя, телефон, текст заявки).
 * Допустимые параметры — только служебные: источник формы, вариант формы, id вопроса.
 */

export type AnalyticsEvent =
  | "hero_cta_click"
  | "case_view"
  | "case_cta_click"
  | "lead_modal_open"
  | "lead_form_start"
  | "lead_form_submit_attempt"
  | "lead_submit_success"
  | "lead_form_error"
  | "phone_click"
  | "messenger_click"
  | "faq_open"
  | "external_site_click"
  | "mobile_sticky_cta_click"
  | "case_gallery_open"
  | "payment_example_expand";

type SafeParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}

export const METRIKA_ID = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID) || null;

export function track(event: AnalyticsEvent, params?: SafeParams) {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, params ?? "");
  }
  if (!METRIKA_ID || typeof window.ym !== "function") return;
  try {
    window.ym(METRIKA_ID, "reachGoal", event, params);
  } catch {
    /* аналитика не должна ломать интерфейс */
  }
}
