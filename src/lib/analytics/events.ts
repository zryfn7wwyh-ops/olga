import { siteConfig } from "@/config/site";

export type AnalyticsEvent =
  | "hero_cta_click"
  | "report_form_view"
  | "report_form_start"
  | "report_form_submit"
  | "report_form_success"
  | "report_form_error"
  | "has_website_selected"
  | "employees_selected"
  | "legal_form_selected";

/**
 * Данные, которые запрещено передавать в аналитику ни при каких условиях.
 */
const FORBIDDEN_KEYS = ["inn", "phone", "email"];

type EventPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    ym?: (counterId: number, action: string, target: string, params?: unknown) => void;
  }
}

function sanitizePayload(payload?: EventPayload): EventPayload | undefined {
  if (!payload) return undefined;
  const clean: EventPayload = {};
  for (const [key, value] of Object.entries(payload)) {
    if (FORBIDDEN_KEYS.includes(key.toLowerCase())) continue;
    clean[key] = value;
  }
  return clean;
}

export function trackEvent(event: AnalyticsEvent, payload?: EventPayload): void {
  if (typeof window === "undefined") return;

  const safePayload = sanitizePayload(payload);
  const counterId = Number(siteConfig.analytics.yandexMetrikaId);

  if (siteConfig.analytics.yandexMetrikaId && !Number.isNaN(counterId) && window.ym) {
    window.ym(counterId, "reachGoal", event, safePayload);
    return;
  }

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, safePayload);
  }
}
