"use client";

import type { MouseEvent, ReactNode } from "react";
import { trackGoal, type AnalyticsGoal } from "@/lib/analytics";

type ClickTrackerProps = {
  goal: AnalyticsGoal;
  children: ReactNode;
  className?: string;
};

/**
 * Обёртка-делегат: ловит клики по ссылкам с data-track-id внутри серверных
 * детей и шлёт trackGoal, не переводя сами дети в клиентские компоненты.
 */
export function ClickTracker({ goal, children, className }: ClickTrackerProps) {
  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-track-id]");
    if (!target) return;
    trackGoal(goal, { id: target.dataset.trackId });
  }

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
}
