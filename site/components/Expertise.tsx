"use client";

import { useRef, useState } from "react";
import { expertise, type ExpertiseItem } from "@/data/expertise";
import { trackGoal } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { CTAButton } from "./ContactModal";
import { SectionHeading } from "./SectionHeading";
import { IconPlus } from "./Icons";

function Panel({ item }: { item: ExpertiseItem }) {
  return (
    <div>
      <p className="text-[18px] leading-relaxed text-text sm:text-[20px]">{item.text}</p>
      {item.highlight && (
        <p className="mt-6 inline-flex items-center gap-3 border-l-2 border-bronze bg-stone px-4 py-3 text-[15px] font-semibold text-text">
          {item.highlight}
        </p>
      )}
      <ul className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        {item.points.map((p) => (
          <li key={p} className="bg-ivory px-4 py-4 text-[14px] leading-snug text-muted">
            {p}
          </li>
        ))}
      </ul>
      {item.whenImportant && (
        <div className="mt-8 grid gap-3 sm:grid-cols-[180px_1fr] sm:gap-8">
          <h4 className="tech pt-1 text-bronze">Когда особенно важно</h4>
          <p className="text-[16px] leading-relaxed text-muted">{item.whenImportant}</p>
        </div>
      )}
    </div>
  );
}

export function Expertise() {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    setActive(i);
    trackGoal("service_open", { id: expertise[i].id, placement: "desktop" });
  };

  // Клавиатурная навигация по табам (WAI-ARIA, вертикальный tablist)
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const n = expertise.length;
    let next = -1;
    if (e.key === "ArrowDown") next = (i + 1) % n;
    if (e.key === "ArrowUp") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next >= 0) {
      e.preventDefault();
      select(next);
      tabsRef.current[next]?.focus();
    }
  };

  const item = expertise[active];

  return (
    <section id="expertise" aria-labelledby="expertise-title" className="section-y bg-ivory">
      <div className="container-x">
        <SectionHeading index="03" label="Экспертиза" id="expertise-title" title="С какими задачами можно обратиться" />

        {/* Desktop: вертикальный список + меняющийся контент */}
        <div className="mt-16 hidden gap-12 md:grid md:grid-cols-[minmax(260px,5fr)_7fr] lg:gap-20">
          <div role="tablist" aria-orientation="vertical" aria-label="Направления экспертизы" className="border-t border-line">
            {expertise.map((e, i) => (
              <button
                key={e.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                id={`tab-${e.id}`}
                aria-selected={active === i}
                aria-controls={`panel-${e.id}`}
                tabIndex={active === i ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={(ev) => onKeyDown(ev, i)}
                className={cn(
                  "group relative flex w-full items-baseline gap-5 border-b border-line py-5 text-left transition-colors duration-200 lg:py-6",
                  active === i ? "text-text" : "text-muted hover:text-text",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-px bottom-[-1px] top-0 w-[2px] origin-top bg-steel transition-transform duration-250 ease-[var(--ease-premium)]",
                    active === i ? "scale-y-100" : "scale-y-0",
                  )}
                />
                <span className={cn("tech tabular pl-4 transition-colors duration-200", active === i ? "text-bronze" : "text-muted")}>{e.index}</span>
                <span className="font-serif text-[21px] leading-tight lg:text-[24px]">{e.short}</span>
                <span aria-hidden className={cn("arrow ml-auto pr-1 text-steel transition-opacity duration-200", active === i ? "opacity-100" : "opacity-0 group-hover:opacity-60")}>
                  →
                </span>
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`panel-${item.id}`}
            aria-labelledby={`tab-${item.id}`}
            tabIndex={0}
            className="relative border border-line bg-white/60 p-8 lg:p-12"
          >
            <div key={item.id} className="motion-safe:animate-[fade_300ms_var(--ease-premium)]">
              <div className="flex items-start justify-between gap-6">
                <h3 className="font-serif text-[30px] leading-tight lg:text-[38px]">{item.title}</h3>
                <span className="font-serif text-[48px] leading-none text-bronze/70 tabular lg:text-[64px]">{item.index}</span>
              </div>
              <div className="mt-8">
                <Panel item={item} />
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-line pt-8">
                <CTAButton placement={`expertise:${item.id}`} className="btn btn-primary">
                  Обсудить процедуру <span className="arrow" aria-hidden>→</span>
                </CTAButton>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: accordion */}
        <div className="mt-10 border-t border-line md:hidden">
          {expertise.map((e, i) => {
            const open = openMobile === i;
            return (
              <div key={e.id} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`acc-${e.id}`}
                    id={`acc-btn-${e.id}`}
                    onClick={() => {
                      setOpenMobile(open ? null : i);
                      if (!open) trackGoal("service_open", { id: e.id, placement: "mobile" });
                    }}
                    className="flex min-h-16 w-full items-center gap-4 py-4 text-left"
                  >
                    <span className="tech tabular text-bronze">{e.index}</span>
                    <span className="flex-1 font-serif text-[20px] leading-tight">{e.title}</span>
                    <IconPlus className={cn("h-5 w-5 shrink-0 text-steel transition-transform duration-300", open && "rotate-45")} />
                  </button>
                </h3>
                <div id={`acc-${e.id}`} role="region" aria-labelledby={`acc-btn-${e.id}`} className="reveal" data-open={open}>
                  <div>
                    <div className="pb-8 pt-1">
                      <Panel item={e} />
                      <CTAButton placement={`expertise_mobile:${e.id}`} className="btn btn-ghost mt-6 w-full">
                        Обсудить процедуру <span className="arrow" aria-hidden>→</span>
                      </CTAButton>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
