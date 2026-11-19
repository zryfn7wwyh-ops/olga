"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { approach } from "@/content/landing";
import { cn } from "@/lib/cn";

/**
 * Схема «путь до договора» — доступные вкладки (WAI-ARIA Tabs):
 * клик / наведение / клавиатура (← → Home End) переключают этап.
 */
export function SystemFlow() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const uid = useId();
  const steps = approach.steps;

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const last = steps.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabsRef.current[next]?.focus();
  }

  return (
    <div>
      <p className="mb-6 text-[14px] text-[var(--on-dark-muted)]" id={`${uid}-hint`}>
        {approach.hint}
      </p>
      <div
        role="tablist"
        aria-label="Этапы пути клиента"
        aria-describedby={`${uid}-hint`}
        className="relative grid grid-cols-1 gap-2 lg:grid-cols-5 lg:gap-0"
      >
        {/* Соединительная линия на десктопе */}
        <span aria-hidden="true" className="absolute top-[27px] right-[10%] left-[10%] hidden h-px bg-[var(--on-dark-stroke)] lg:block" />
        <span
          aria-hidden="true"
          className="absolute top-[27px] left-[10%] hidden h-px bg-gold transition-[width] duration-500 ease-out motion-reduce:transition-none lg:block"
          style={{ width: `${(active / (steps.length - 1)) * 80}%` }}
        />
        {steps.map((step, i) => {
          const selected = i === active;
          const passed = i <= active;
          return (
            <button
              key={step.id}
              ref={(el) => {
                tabsRef.current[i] = el;
              }}
              id={`${uid}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${uid}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onKeyDown={onKeyDown}
              className={cn(
                "group relative flex items-center gap-4 rounded-[12px] border px-4 py-3 text-left transition-colors duration-200 lg:flex-col lg:items-center lg:border-0 lg:bg-transparent lg:px-3 lg:pt-0 lg:pb-2 lg:text-center",
                selected ? "border-gold/60 bg-white/[0.04]" : "border-[var(--on-dark-stroke)] hover:border-gold/40",
              )}
            >
              <span
                className={cn(
                  "relative z-10 grid size-[54px] shrink-0 place-items-center rounded-full border font-serif text-[22px] lining-nums tabular-nums transition-colors duration-200",
                  selected
                    ? "border-gold bg-gold text-navy-deep"
                    : passed
                      ? "border-gold bg-navy-deep text-gold-soft"
                      : "border-[var(--on-dark-stroke)] bg-navy-deep text-ivory/80 group-hover:border-gold/60",
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "text-[16px] leading-snug font-semibold transition-colors lg:mt-4 lg:max-w-[190px]",
                  selected ? "text-ivory" : "text-ivory/75",
                )}
              >
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${active}`}
        tabIndex={0}
        className="mt-6 grid gap-4 rounded-[14px] border border-[var(--on-dark-stroke)] bg-white/[0.03] p-6 sm:p-8 lg:mt-10 lg:grid-cols-12 lg:gap-10"
      >
        <p className="font-serif text-[26px] leading-tight text-gold-soft lg:col-span-4">
          <span className="mr-3 text-ivory/50 lining-nums tabular-nums">0{active + 1}</span>
          {steps[active].title}
        </p>
        <p className="lead text-ivory/90 lg:col-span-8">{steps[active].text}</p>
      </div>
    </div>
  );
}
