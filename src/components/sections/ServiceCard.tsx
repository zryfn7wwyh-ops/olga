"use client";

import { useId, useState } from "react";
import { BarChart3, LayoutTemplate, MessagesSquare, PenLine, Plus, Search, Target } from "lucide-react";
import { cn } from "@/lib/cn";

const icons = {
  layout: LayoutTemplate,
  target: Target,
  search: Search,
  pen: PenLine,
  messages: MessagesSquare,
  chart: BarChart3,
} as const;

type Props = {
  index: number;
  icon: keyof typeof icons;
  title: string;
  what: string;
  result: string;
  details: readonly string[];
  doLabel: string;
  resultLabel: string;
  openLabel: string;
  closeLabel: string;
};

export function ServiceCard({ index, icon, title, what, result, details, doLabel, resultLabel, openLabel, closeLabel }: Props) {
  const [open, setOpen] = useState(false);
  const uid = useId();
  const Icon = icons[icon];

  return (
    <article className="group flex h-full flex-col rounded-[14px] border border-stroke bg-paper p-7 transition-[border-color,box-shadow] duration-300 hover:border-[#c5c9c6] hover:shadow-[0_20px_40px_-30px_rgba(20,35,45,0.35)] sm:p-8">
      <div className="flex items-center justify-between">
        <Icon className="size-7 text-navy" strokeWidth={1.25} aria-hidden="true" />
        <span className="font-serif text-[18px] text-gold-ink lining-nums tabular-nums">0{index + 1}</span>
      </div>
      <h3 className="h3 mt-8">{title}</h3>
      <dl className="mt-5 space-y-4 text-[15.5px]">
        <div>
          <dt className="text-[12px] font-bold tracking-[0.14em] text-muted-text uppercase">{doLabel}</dt>
          <dd className="mt-1.5 text-ink">{what}</dd>
        </div>
        <div className="border-t border-stroke pt-4">
          <dt className="text-[12px] font-bold tracking-[0.14em] text-muted-text uppercase">{resultLabel}</dt>
          <dd className="mt-1.5 text-ink">{result}</dd>
        </div>
      </dl>

      <div className="mt-auto pt-5">
        <div id={`${uid}-details`} className="accordion-panel" data-open={open} inert={!open}>
          <div>
            <ul className="mb-4 space-y-2 border-t border-stroke pt-4 text-[15px] text-muted-text">
              {details.map((d) => (
                <li key={d} className="flex gap-3">
                  <span className="mt-[11px] h-px w-3 shrink-0 bg-gold" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${uid}-details`}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ink transition-colors hover:text-gold-ink"
        >
          <Plus
            className={cn("size-4 transition-transform duration-300 motion-reduce:transition-none", open && "rotate-45")}
            strokeWidth={2}
            aria-hidden="true"
          />
          {open ? closeLabel : openLabel}
          <span className="sr-only">: {title}</span>
        </button>
      </div>
    </article>
  );
}
