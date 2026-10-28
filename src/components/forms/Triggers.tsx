"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { SiteType } from "@/lib/leads/schema";
import { useLeadUI } from "./LeadUIProvider";

type Variant = "primary" | "secondary" | "ghost" | "onInk" | "onInkSecondary" | "onInkGhost" | "link";

/** Кнопка карточки формата: предвыбирает тип в Hero-форме и ведёт к #calc. */
export function EstimateButton({
  siteType,
  children,
  variant = "link",
  block,
}: {
  siteType?: Exclude<SiteType, "other">;
  children: ReactNode;
  variant?: Variant;
  block?: boolean;
}) {
  const { requestEstimate } = useLeadUI();
  return (
    <Button variant={variant} block={block} onClick={() => requestEstimate(siteType)} data-site-type={siteType}>
      {children}
      {variant === "link" && <Icon name="arrow" size={18} />}
    </Button>
  );
}

export function QuizButton({ children = "Подобрать сайт за 3 вопроса", variant = "ghost" }: { children?: ReactNode; variant?: Variant }) {
  const { openQuiz } = useLeadUI();
  return (
    <Button variant={variant} onClick={(e) => openQuiz(e.currentTarget)} aria-haspopup="dialog">
      {children}
      <Icon name="arrow" size={18} />
    </Button>
  );
}

export function ConsultationButton({ children, variant = "onInk" }: { children: ReactNode; variant?: Variant }) {
  const { openConsultation } = useLeadUI();
  return (
    <Button variant={variant} onClick={(e) => openConsultation(e.currentTarget)} aria-haspopup="dialog">
      {children}
    </Button>
  );
}
