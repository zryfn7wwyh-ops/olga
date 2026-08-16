type AchievementBadgeProps = {
  className?: string;
  compact?: boolean;
};

export function AchievementBadge({ className = "", compact = false }: AchievementBadgeProps) {
  if (compact) {
    return (
      <div
        className={`flex w-full items-center gap-3 rounded-xl border border-bronze/40 bg-ink px-4 py-3 text-paper shadow-lg ${className}`}
      >
        <span className="font-display text-2xl font-semibold leading-none text-bronze-soft shrink-0">
          1 из 4
        </span>
        <p className="text-xs leading-snug text-paper/90">
          адвокатов России, которые в 2026 году добились в Верховном суде отмены
          последствий в сделке с квартирой, аналогичной «делу Долиной»
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-start gap-4 rounded-2xl border border-bronze/40 bg-ink px-6 py-6 text-paper sm:flex-row sm:items-center sm:gap-7 sm:px-8 ${className}`}
    >
      <span className="font-display text-4xl font-semibold leading-none text-bronze-soft sm:text-5xl">
        1 из 4
      </span>
      <div className="max-w-md">
        <p className="text-sm leading-relaxed text-paper/90 sm:text-base">
          адвокатов России, которые в 2026 году добились в Верховном суде отмены
          последствий в сделке с квартирой, аналогичной «делу Долиной».
        </p>
      </div>
    </div>
  );
}
