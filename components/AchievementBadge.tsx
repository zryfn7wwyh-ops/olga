type AchievementBadgeProps = {
  className?: string;
};

export function AchievementBadge({ className = "" }: AchievementBadgeProps) {
  return (
    <div
      className={`flex flex-col items-start gap-4 rounded-2xl border border-bronze/40 bg-ink px-6 py-6 text-paper sm:flex-row sm:items-center sm:gap-7 sm:px-8 ${className}`}
    >
      <span className="font-display text-4xl font-semibold leading-none text-bronze-soft sm:text-5xl">
        1 из 4
      </span>
      <div className="max-w-md">
        <p className="text-sm leading-relaxed text-paper/90 sm:text-base">
          адвокатов в России, которые в 2026 году добились в Верховном суде возврата
          недвижимости по делу, схожему с резонансным «делом Долиной».
        </p>
      </div>
    </div>
  );
}
