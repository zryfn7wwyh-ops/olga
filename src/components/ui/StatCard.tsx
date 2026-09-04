type StatCardTone = "danger" | "navy";

interface StatCardProps {
  accent?: string;
  title: string;
  text: string;
  highlight?: string;
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

export function StatCard({ accent, title, text, highlight, tone = "navy" }: StatCardProps) {
  const highlightIndex = highlight ? text.indexOf(highlight) : -1;

  return (
    <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-card border border-border bg-surface p-6 shadow-card sm:p-8">
      <div
        className={`bg-blob -right-8 -top-12 h-36 w-36 ${glowClasses[tone]}`}
        aria-hidden="true"
      />
      {accent && (
        <span
          className={`font-heading text-4xl font-semibold leading-none tracking-tight sm:text-2xl ${toneClasses[tone]}`}
        >
          {accent}
        </span>
      )}
      <h3 className="text-xl font-bold text-text-primary">{title}</h3>
      <p className="text-base font-medium leading-relaxed text-text-secondary">
        {highlightIndex >= 0 && highlight ? (
          <>
            {text.slice(0, highlightIndex)}
            <strong className="font-bold text-danger">{highlight}</strong>
            {text.slice(highlightIndex + highlight.length)}
          </>
        ) : (
          text
        )}
      </p>
    </div>
  );
}
