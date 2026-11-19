"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { faq } from "@/content/faq";
import { faqSection } from "@/content/landing";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export function FAQ() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const uid = useId();

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        next.add(id);
        track("faq_open", { question: id });
      }
      return next;
    });
  }

  return (
    <section id="faq" aria-labelledby="faq-title" className="section on-light bg-paper">
      <div className="container-lp grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28" data-reveal>
            <p className="eyebrow mb-5">{faqSection.eyebrow}</p>
            <h2 id="faq-title" className="h2">
              {faqSection.title}
            </h2>
          </div>
        </div>
        <div className="border-t border-stroke lg:col-span-8">
          {faq.map((item) => {
            const open = openIds.has(item.id);
            const btnId = `${uid}-${item.id}-btn`;
            const panelId = `${uid}-${item.id}-panel`;
            return (
              <div key={item.id} className="border-b border-stroke">
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggle(item.id)}
                    className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left font-serif text-[21px] leading-snug font-semibold text-ink transition-colors hover:text-gold-ink sm:text-[24px]"
                  >
                    {item.question}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color] duration-300 motion-reduce:transition-none",
                        open ? "rotate-45 border-navy bg-navy text-ivory" : "border-stroke text-ink group-hover:border-navy/40",
                      )}
                    >
                      <Plus className="size-4" strokeWidth={2} />
                    </span>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={btnId} className="accordion-panel" data-open={open} inert={!open}>
                  <div>
                    <p className="max-w-[68ch] pr-14 pb-7 text-[16.5px] text-muted-text">{item.answer}</p>
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
