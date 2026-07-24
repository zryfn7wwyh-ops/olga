export type AnalyticsGoal =
  | "phone_click"
  | "call_modal_open"
  | "call_modal_phone_click"
  | "telegram_click"
  | "max_click"
  | "case_expand"
  | "document_view"
  | "review_view"
  | "route_build"
  | "yandex_reviews_click";

export type AnalyticsPlacement =
  | "header"
  | "mobile_call_bar"
  | "hero"
  | "services"
  | "urgent"
  | "about"
  | "process"
  | "cases"
  | "pricing"
  | "reviews"
  | "contacts"
  | "modal";

export type AnalyticsParams = {
  placement?: AnalyticsPlacement;
  id?: string;
  [key: string]: string | number | boolean | undefined;
};

declare global {
  interface Window {
    ym?: (counterId: number, action: string, target: string, params?: AnalyticsParams) => void;
    dataLayer?: unknown[];
  }
}

// ID счётчика Яндекс.Метрики подключается позже, при выпуске сайта в прод.
const YANDEX_METRIKA_COUNTER_ID: number | null = null;

export function trackGoal(goal: AnalyticsGoal, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;

  if (YANDEX_METRIKA_COUNTER_ID && typeof window.ym === "function") {
    window.ym(YANDEX_METRIKA_COUNTER_ID, "reachGoal", goal, params);
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: goal, ...params });

  if (process.env.NODE_ENV === "development") {
     
    console.debug("[analytics]", goal, params);
  }
}
