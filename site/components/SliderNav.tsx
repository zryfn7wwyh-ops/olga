"use client";

import { cn } from "@/lib/cn";
import { IconArrowLeft, IconArrowRight } from "./Icons";

export function SliderNav({
  index,
  total,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  dark,
  label,
}: {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  dark?: boolean;
  label: string;
}) {
  const btn = cn(
    "grid h-12 w-12 place-items-center border transition-[border-color,color,background-color,opacity] duration-200 disabled:cursor-default disabled:opacity-35",
    dark ? "border-slate-2 text-ivory enabled:hover:border-mist" : "border-line text-text enabled:hover:border-steel enabled:hover:text-steel-deep",
  );
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-5" role="group" aria-label={label}>
      <span className={cn("tech tabular", dark ? "text-mist" : "text-muted")} aria-live="polite">
        <span className={dark ? "text-ivory" : "text-text"}>{pad(index + 1)}</span> / {pad(total)}
      </span>
      <div className="flex gap-2">
        <button type="button" className={btn} onClick={onPrev} disabled={prevDisabled} aria-label="Предыдущий">
          <IconArrowLeft className="h-5 w-5" />
        </button>
        <button type="button" className={btn} onClick={onNext} disabled={nextDisabled} aria-label="Следующий">
          <IconArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
