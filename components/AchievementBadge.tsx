type AchievementBadgeProps = {
  className?: string;
};

export function AchievementBadge({ className = "" }: AchievementBadgeProps) {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border-2 border-gold bg-gradient-to-br from-ink to-emerald px-5 py-4 text-paper shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] sm:gap-5 sm:px-6 sm:py-5 ${className}`}
    >
      <span className="shrink-0 font-display text-3xl font-bold leading-none text-gold drop-shadow-[0_0_10px_rgba(218,184,118,0.5)] sm:text-4xl">
        1 из 4
      </span>
      <p className="text-xs leading-snug text-paper sm:text-sm">
        адвокатов России, которые в 2026 году добились в Верховном суде отмены последствий в сделке
        с квартирой, аналогичной «делу Долиной».
      </p>
    </div>
  );
}
