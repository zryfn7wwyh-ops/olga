"use client";

import { useState } from "react";
import { faq } from "@/data/faq";
import { contacts } from "@/data/contacts";
import { trackGoal } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { IconPlus } from "./Icons";
import { PlaceholderMark } from "./PlaceholderMark";
import { TrackedLink } from "./TrackedLink";

export function FAQ() {
  const [open, setOpen] = useState<string | null>(faq[0]?.id ?? null);
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y bg-stone">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <span className="eyebrow">10 / FAQ</span>
          <h2 id="faq-title" className="h-section mt-6">
            Частые вопросы
          </h2>
          <p className="mt-6 max-w-[340px] text-[16px] text-muted">Не нашли ответ на свой вопрос? Задайте его напрямую.</p>
          <TrackedLink goal="phone_click" params={{ placement: "faq" }} href={contacts.phone.href} className="link mt-2 inline-flex min-h-11 items-center gap-2 text-[17px] font-semibold tabular">
            {contacts.phone.display} <span className="arrow" aria-hidden>→</span>
          </TrackedLink>
        </div>
        <div className="border-t border-line lg:col-span-8">
          {faq.map((f, i) => {
            const isOpen = open === f.id;
            return (
              <div key={f.id} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    id={`faq-btn-${f.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${f.id}`}
                    onClick={() => {
                      setOpen(isOpen ? null : f.id);
                      if (!isOpen) trackGoal("faq_open", { id: f.id });
                    }}
                    className="group flex min-h-16 w-full items-start gap-5 py-6 text-left"
                  >
                    <span className="tech tabular pt-1.5 text-bronze">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-[17px] font-semibold leading-snug transition-colors duration-200 group-hover:text-steel-deep sm:text-[19px]">{f.question}</span>
                    <IconPlus className={cn("mt-0.5 h-5 w-5 shrink-0 text-steel transition-transform duration-300", isOpen && "rotate-45")} />
                  </button>
                </h3>
                <div id={`faq-${f.id}`} role="region" aria-labelledby={`faq-btn-${f.id}`} className="reveal" data-open={isOpen}>
                  <div>
                    <div className="max-w-[680px] pb-7 pl-[46px] text-[16px] leading-relaxed text-muted">
                      <p>{f.answer}</p>
                      {f.needsReview && <PlaceholderMark className="mt-3">ответ требует подтверждения</PlaceholderMark>}
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
