type AchievementBadgeProps = {
  className?: string;
  compact?: boolean;
};

export function AchievementBadge({ className = "", compact = false }: AchievementBadgeProps) {
  if (compact) {
    return (
      <div
        className={`flex w-full items-center gap-3 rounded-xl border border-gold/70 bg-gradient-to-br from-ink via-ink to-emerald px-4 py-3 text-paper shadow-[0_0_28px_-8px_rgba(218,184,118,0.6)] ${className}`}
      >
        <span className="font-display text-2xl font-semibold leading-none text-gold shrink-0 drop-shadow-[0_0_8px_rgba(218,184,118,0.5)]">
          1 из 4
        </span>
        <p className="text-xs leading-snug text-paper">
          адвокатов России, которые в 2026 году добились в Верховном суде отмены
          последствий в сделке с квартирой, аналогичной «делу Долиной»
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-start gap-4 rounded-2xl border border-gold/70 bg-gradient-to-br from-ink via-ink to-emerald px-6 py-6 text-paper shadow-[0_0_36px_-8px_rgba(218,184,118,0.55)] sm:flex-row sm:items-center sm:gap-7 sm:px-8 ${className}`}
    >
      <span className="font-display text-4xl font-semibold leading-none text-gold sm:text-5xl drop-shadow-[0_0_10px_rgba(218,184,118,0.5)]">
        1 из 4
      </span>
      <div className="max-w-md">
        <p className="text-sm leading-relaxed text-paper sm:text-base">
          адвокатов России, которые в 2026 году добились в Верховном суде отмены
          последствий в сделке с квартирой, аналогичной «делу Долиной».
        </p>
      </div>
    </div>
  );
}
