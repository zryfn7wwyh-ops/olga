import type { LucideIcon } from "lucide-react";

type StatCardTone = "danger" | "navy";

interface StatCardProps {
  accent: string;
  title: string;
  text: string;
  icon: LucideIcon;
  tone?: StatCardTone;
}

const toneClasses: Record<StatCardTone, string> = {
  danger: "text-danger",
  navy: "text-navy",
};

const glowClasses: Record<StatCardTone, string> = {
  danger: "bg-danger/25",
  navy: "bg-primary/25",
};

const badgeGradientClasses: Record<StatCardTone, string> = {
  danger: "bg-gradient-to-br from-danger/30 via-danger/10 to-transparent",
  navy: "bg-gradient-to-br from-primary/30 via-primary/10 to-transparent",
};

const iconClasses: Record<StatCardTone, string> = {
  danger: "text-danger",
  navy: "text-primary",
};

export function StatCard({ accent, title, text, icon: Icon, tone = "navy" }: StatCardProps) {
  return (
    <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-card border border-border bg-surface p-6 shadow-card sm:p-8">
      <div
        className={`bg-blob -right-8 -top-12 h-36 w-36 ${glowClasses[tone]}`}
        aria-hidden="true"
      />
      <div
        className={`glass relative flex h-14 w-14 items-center justify-center rounded-2xl ${badgeGradientClasses[tone]}`}
      >
        <Icon className={`h-6 w-6 ${iconClasses[tone]}`} aria-hidden="true" />
      </div>
      <span
        className={`font-heading text-4xl font-semibold leading-none tracking-tight sm:text-2xl ${toneClasses[tone]}`}
      >
        {accent}
      </span>
      <h3 className="text-xl font-bold text-text-primary">{title}</h3>
      <p className="text-base font-medium leading-relaxed text-text-secondary">{text}</p>
    </div>
  );
}
