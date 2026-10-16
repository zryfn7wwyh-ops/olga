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
 * Главный визуальный элемент первого экрана: светлая плашка рейтинга поверх фото.
 * Контрастна тёмному hero и не пересекается с текстовой колонкой.
 */
export function RankingFeature() {
  return (
    <div className="plaque relative bg-ivory text-text shadow-[0_30px_80px_-24px_rgb(0_0_0/0.65)]">
      <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-bronze" />
      <div className="flex items-center justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-6">
        <span className="tech text-bronze">01 / Рейтинг</span>
        <span className="tech bg-ink px-2.5 py-1 text-ivory">ТОП-60</span>
      </div>
      <div className="flex items-center gap-4 px-5 pb-5 pt-3 sm:gap-6 sm:px-7 sm:pb-6">
        <span
          className="h-display tabular block shrink-0 text-[88px] leading-[0.9] tracking-[-0.04em] text-ink xs:text-[96px] sm:text-[112px] lg:text-[96px] xl:text-[120px]"
          aria-hidden="true"
        >
          {rating.position}
        </span>
        <span aria-hidden className="block w-px self-stretch bg-line" />
        <p className="min-w-0 text-[15px] font-semibold leading-snug text-ink sm:text-[17px]">
          <span className="sr-only">{rating.position} </span>место среди {formatNumber(rating.total)} арбитражных управляющих
          <span className="mt-2 block text-[13px] font-normal text-muted">по данным {rating.sourceGenitive}*</span>
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-line px-5 py-3.5 text-[13px] sm:px-7">
        <SourceLink className="font-semibold" />
        <RatingDate className="text-muted" />
      </div>
    </div>
  );
}
