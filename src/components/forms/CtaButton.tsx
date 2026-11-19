"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { useLeadModal } from "./LeadModal";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import type { FormSource } from "@/lib/lead-schema";

type Props = {
  source: FormSource;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Дополнительное событие клика (например, hero_cta_click). */
  event?: AnalyticsEvent;
  arrow?: boolean;
};

/** Кнопка, открывающая модальное окно заявки. Единое поведение и аналитика для всех CTA. */
export function CtaButton({ source, children, variant = "primary", size = "lg", className, event, arrow = true }: Props) {
  const { open } = useLeadModal();
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      aria-haspopup="dialog"
      onClick={() => {
        if (event) track(event, { form_source: source });
        open(source);
      }}
    >
      <span>{children}</span>
      {arrow && (
        <ArrowRight
          className="size-[18px] shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5 motion-reduce:transition-none"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      )}
    </Button>
  );
}
