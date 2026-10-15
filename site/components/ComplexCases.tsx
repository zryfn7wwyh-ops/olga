"use client";

import { useState } from "react";
import { complexSituations } from "@/data/expertise";
import { cn } from "@/lib/cn";
import { CTAButton } from "./ContactModal";

/** «Когда стандартного сопровождения недостаточно» — hover (desktop) / tap (mobile). */
export function ComplexCases() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section aria-labelledby="complex-title" className="on-dark section-y relative overflow-hidden bg-ink text-ivory">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 hidden lg:block" />
      <div className="container-x relative grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <span className="eyebrow">04 / Сложные процедуры</span>
            <h2 id="complex-title" className="h-section mt-6">
              Есть процедуры, где цена ошибки значительно выше стоимости профессионального сопровождения
            </h2>
            <CTAButton placement="complex" className="btn btn-ghost-dark mt-10">
              Обсудить процедуру <span className="arrow" aria-hidden>→</span>
            </CTAButton>
          </div>
        </div>
        <ol className="border-t border-slate-2 lg:col-span-6 lg:col-start-7" onMouseLeave={() => setOpen(null)}>
          {complexSituations.map((s, i) => {
            const isOpen = open === i;
            return (
              <li key={s.title} className="border-b border-slate-2" onMouseEnter={() => setOpen(i)}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`cx-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  onFocus={() => setOpen(i)}
                  className="group flex min-h-[72px] w-full items-center gap-6 py-5 text-left"
                >
                  <span className={cn("tech tabular w-8 transition-colors duration-200", isOpen ? "text-bronze" : "text-mist/60")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden className={cn("h-px bg-bronze transition-[width] duration-250 ease-[var(--ease-premium)]", isOpen ? "w-8" : "w-3")} />
                  <span className={cn("flex-1 font-serif text-[22px] leading-tight transition-colors duration-200 sm:text-[28px]", isOpen ? "text-ivory" : "text-ivory/75")}>
                    {s.title}
                  </span>
                </button>
                <div id={`cx-${i}`} className="reveal" data-open={isOpen}>
                  <div>
                    <p className="max-w-[520px] pb-6 pl-14 text-[15px] leading-relaxed text-mist sm:pl-[88px]">{s.text}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
