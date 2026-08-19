type AchievementBadgeProps = {
  className?: string;
};

export function AchievementBadge({ className = "" }: AchievementBadgeProps) {
  return (
    <div
      className={`group flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-gradient-to-br from-ink to-emerald text-center shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105 sm:h-28 sm:w-28 lg:h-32 lg:w-32 ${className}`}
      title="1 из 4 адвокатов России, которые в 2026 году добились в Верховном суде отмены последствий в сделке с квартирой, аналогичной «делу Долиной»"
    >
      <span className="absolute inset-1.5 rounded-full border border-gold/40" aria-hidden="true" />
      <div className="flex flex-col items-center leading-none">
        <span className="font-display text-3xl font-bold text-gold drop-shadow-[0_0_10px_rgba(218,184,118,0.5)] sm:text-4xl">
          1/4
        </span>
        <span className="mt-1.5 max-w-[4.5rem] text-[9px] font-semibold uppercase leading-tight tracking-[0.08em] text-paper/85 sm:text-[10px]">
          адвокатов РФ в Верховном суде
        </span>
      </div>
      <span className="sr-only">
        1 из 4 адвокатов России, которые в 2026 году добились в Верховном суде отмены последствий в
        сделке с квартирой, аналогичной «делу Долиной».
      </span>
    </div>
  );
}
