"use client";

import type { ReactNode } from "react";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import type { SiteType } from "@/lib/leads/schema";
import { useLeadUI } from "./LeadUIProvider";

/** Кнопка карточки формата: предвыбирает тип в Hero-форме и ведёт к #calc. */
export function EstimateButton({ siteType, children }: { siteType?: Exclude<SiteType, "other">; children: ReactNode }) {
  const { requestEstimate } = useLeadUI();
  return (
    <Button block arrow onClick={() => requestEstimate(siteType)} data-site-type={siteType}>
      {children}
    </Button>
  );
}

export function QuizButton({ children = "Подобрать сайт за 3 вопроса", variant = "dark" }: { children?: ReactNode; variant?: ButtonVariant }) {
  const { openQuiz } = useLeadUI();
  return (
    <Button variant={variant} arrow onClick={(e) => openQuiz(e.currentTarget)} aria-haspopup="dialog">
      {children}
    </Button>
  );
}

export function ConsultationButton({ children, variant = "light" }: { children: ReactNode; variant?: ButtonVariant }) {
  const { openConsultation } = useLeadUI();
  return (
    <Button variant={variant} onClick={(e) => openConsultation(e.currentTarget)} aria-haspopup="dialog">
      {children}
    </Button>
  );
}
