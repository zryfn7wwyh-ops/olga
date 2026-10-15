"use client";

import { useState } from "react";
import type { CaseItem } from "@/data/cases";
import { trackGoal } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { PlaceholderMark } from "./PlaceholderMark";

const parts: { key: keyof Pick<CaseItem, "situation" | "task" | "actions" | "result">; label: string }[] = [
  { key: "situation", label: "Ситуация" },
  { key: "task", label: "Задача" },
  { key: "actions", label: "Что было сделано" },
  { key: "result", label: "Результат" },
];

/** Большая раскрывающаяся карточка кейса. */
export function CaseAccordion({ item, index }: { item: CaseItem; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <article
      className={cn(
        "group border bg-ivory transition-[border-color,background-color] duration-200",
        open ? "border-steel/50 bg-white" : "border-line hover:border-steel/40 hover:bg-white",
      )}
    >
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`case-${item.id}`}
          onClick={() => {
            setOpen(!open);
            if (!open) trackGoal("case_open", { id: item.id });
          }}
          className="grid w-full gap-5 p-6 text-left sm:p-8 md:grid-cols-[200px_1fr_auto] md:items-center md:gap-10 lg:p-10"
        >
          <span className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
            <span className="font-serif text-[40px] leading-none text-bronze tabular lg:text-[52px]">{String(index + 1).padStart(2, "0")}</span>
            <span className="tech text-steel-deep">{item.category}</span>
          </span>
          <span className="block">
            <span className="flex flex-wrap items-center gap-3">
              <span className="font-serif text-[24px] leading-tight text-text sm:text-[30px]">{item.title}</span>
              {item.placeholder && <PlaceholderMark>placeholder</PlaceholderMark>}
            </span>
            <span className="mt-3 block max-w-[640px] text-[15px] text-muted">{item.summary}</span>
          </span>
          <span className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-steel-deep">
            {open ? "Свернуть" : "Открыть кейс"}
            <span aria-hidden className={cn("arrow-diag transition-transform duration-300", open && "rotate-180")}>↘</span>
          </span>
        </button>
      </h3>
      <div id={`case-${item.id}`} className="reveal" data-open={open} role="region" aria-label={`Подробности кейса ${index + 1}`}>
        <div>
          <dl className="grid gap-px border-t border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {parts.map((p, i) => (
              <div key={p.key} className="bg-white p-6 sm:p-8">
                <dt className="tech flex items-center gap-3 text-muted">
                  <span className="text-bronze tabular">{String(i + 1).padStart(2, "0")}</span> {p.label}
                </dt>
                <dd className="mt-4 text-[15px] leading-relaxed text-text">{item[p.key]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </article>
  );
}
