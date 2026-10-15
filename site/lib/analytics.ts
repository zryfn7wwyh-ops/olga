import { site } from "@/data/site";

/** Цели Яндекс Метрики. Имена целей нужно завести в интерфейсе Метрики. */
export type Goal =
  | "phone_click"
  | "cta_click"
  | "modal_open"
  | "telegram_click"
  | "email_click"
  | "case_open"
  | "service_open"
  | "document_view"
  | "review_interaction"
  | "map_interaction"
  | "bankruptcy_page_click"
  | "faq_open"
  | "route_click";

export type GoalParams = { placement?: string; id?: string; [k: string]: unknown };

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}

/**
 * Единая точка отправки целей.
 * trackGoal("phone_click", { placement: "hero" })
 */
export function trackGoal(goal: Goal, params: GoalParams = {}) {
  if (typeof window === "undefined") return;
  const id = site.analytics.yandexMetrikaId;
  if (id && typeof window.ym === "function") {
    window.ym(id, "reachGoal", goal, params);
  } else if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", goal, params);
  }
}
