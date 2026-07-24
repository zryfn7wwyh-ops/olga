"use client";

import type { ReactNode } from "react";
import { trackGoal, type AnalyticsGoal, type AnalyticsPlacement } from "@/lib/analytics";

type SocialIconLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
  goal: AnalyticsGoal;
  placement: AnalyticsPlacement;
  tone?: "light" | "dark";
};

const base =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200";

const tones = {
  light: {
    active: "border-ink/15 text-ink hover:-translate-y-0.5 hover:border-bronze hover:text-bronze",
    disabled: "border-ink/10 text-text-muted/50",
  },
  dark: {
    active:
      "border-paper/20 text-paper hover:-translate-y-0.5 hover:border-bronze-soft hover:text-bronze-soft",
    disabled: "border-paper/15 text-paper/35",
  },
};

export function SocialIconLink({ href, label, icon, goal, placement, tone = "light" }: SocialIconLinkProps) {
  const palette = tones[tone];

  if (!href) {
    return (
      <span
        className={`${base} ${palette.disabled}`}
        title={`${label} — ссылка появится позже`}
        aria-disabled="true"
      >
        {icon}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={() => trackGoal(goal, { placement })}
      className={`${base} ${palette.active}`}
    >
      {icon}
    </a>
  );
}
