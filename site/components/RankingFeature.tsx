import { formatNumber, rating } from "@/data/stats";
import { cn } from "@/lib/cn";
import { PlaceholderMark } from "./PlaceholderMark";

/** Ссылка «Проверить источник →» с placeholder-состоянием. */
export function SourceLink({ className }: { className?: string }) {
  if (rating.sourceUrl) {
    return (
      <a href={rating.sourceUrl} target="_blank" rel="noopener noreferrer" className={cn("link group inline-flex items-center gap-2", className)}>
        Проверить источник <span className="arrow" aria-hidden>→</span>
      </a>
    );
  }
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-2", className)}>
      <span className="opacity-70" title="Ссылка на первоисточник будет добавлена">Проверить источник →</span>
      <PlaceholderMark>ссылка</PlaceholderMark>
    </span>
  );
}

export function RatingDate({ className }: { className?: string }) {
  return (
    <span className={className}>
      {rating.updatedAt ? `Данные на ${rating.updatedAt}` : "Дата актуальности: уточняется"}
    </span>
  );
}

/**
 * Главный визуальный элемент первого экрана: крупное «57».
 * Цифра частично заходит на фотографию (desktop).
 */
export function RankingFeature() {
  return (
    <div className="relative">
      <span className="tech text-bronze">01 / Рейтинг</span>
      <div className="mt-3 flex items-end gap-4 lg:gap-5">
        <span
          className="h-display tabular -mb-[0.12em] block text-[120px] leading-[0.85] text-ivory sm:text-[160px] lg:text-[150px] xl:text-[200px]"
          aria-hidden="true"
        >
          {rating.position}
        </span>
        <span className="mb-3 block h-[min(48%,96px)] w-px bg-bronze/70" aria-hidden />
        <p className="mb-2 max-w-[200px] text-[15px] leading-snug text-ivory/90">
          <span className="sr-only">{rating.position} </span>место среди {formatNumber(rating.total)} арбитражных управляющих
          <span className="mt-2 block text-[13px] text-mist">по данным {rating.sourceGenitive}*</span>
        </p>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-mist">
        <SourceLink />
        <RatingDate className="text-mist/70" />
      </div>
    </div>
  );
}
