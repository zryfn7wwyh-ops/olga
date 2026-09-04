type StatCardTone = "danger" | "navy";

interface StatCardProps {
  accent: string;
  title: string;
  text: string;
  tone?: StatCardTone;
}

const toneClasses: Record<StatCardTone, string> = {
  danger: "text-danger",
  navy: "text-navy",
};

export function StatCard({ accent, title, text, tone = "navy" }: StatCardProps) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-card border border-border bg-surface p-6 shadow-card sm:p-8">
      <span className={`text-4xl font-semibold tracking-tight sm:text-5xl ${toneClasses[tone]}`}>
        {accent}
      </span>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="text-[15px] leading-relaxed text-text-secondary">{text}</p>
    </div>
  );
}
