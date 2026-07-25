"use client";

import { useState } from "react";
import type { CaseItem } from "@/data/cases";
import { trackGoal } from "@/lib/analytics";
import { ArrowRightIcon, ExpandIcon } from "@/components/ui/icons";
import { Lightbox } from "@/components/ui/Lightbox";

type CaseCardProps = {
  item: CaseItem;
  isOpen: boolean;
  onToggle: () => void;
};

export function CaseCard({ item, isOpen, onToggle }: CaseCardProps) {
  const [isDocOpen, setIsDocOpen] = useState(false);
  const isFeatured = Boolean(item.featured);

  function handleToggle() {
    onToggle();
    if (!isOpen) {
      trackGoal("case_expand", { placement: "cases", id: item.id });
    }
  }

  return (
    <article
      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
        isFeatured
          ? "border-bronze/40 bg-ink text-paper"
          : "border-line bg-paper text-ink hover:border-bronze/50"
      }`}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={`case-panel-${item.id}`}
        className="flex w-full flex-col gap-3 px-6 py-7 text-left sm:px-8 sm:py-8"
      >
        <span
          className={`inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] ${
            isFeatured ? "text-bronze-soft" : "text-bronze"
          }`}
        >
          {item.category}
          {item.isPlaceholder ? (
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium normal-case tracking-normal ${
                isFeatured ? "border-paper/30 text-paper/70" : "border-bronze/30 text-text-muted"
              }`}
            >
              Описание уточняется
            </span>
          ) : null}
        </span>

        <h3 className={`font-display text-xl font-semibold sm:text-2xl ${isFeatured ? "text-paper" : "text-ink"}`}>
          {item.title}
        </h3>

        <p className={`text-sm leading-relaxed sm:text-base ${isFeatured ? "text-paper/80" : "text-text-muted"}`}>
          {item.summary}
        </p>

        <span
          className={`mt-2 inline-flex items-center gap-2 text-sm font-semibold ${
            isFeatured ? "text-bronze-soft" : "text-bronze"
          }`}
        >
          {isOpen ? "Свернуть" : "Подробнее"}
          <span className={`inline-flex transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}>
            <ArrowRightIcon />
          </span>
        </span>
      </button>

      <div
        id={`case-panel-${item.id}`}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", contain: "paint" }}
      >
        <div className="overflow-hidden">
          <div
            className={`space-y-5 border-t px-6 pb-8 pt-6 sm:px-8 ${
              isFeatured ? "border-paper/15" : "border-line"
            }`}
          >
            <CaseSection label="Ситуация" text={item.situation} isFeatured={isFeatured} />
            <CaseSection label="Что было сделано" text={item.actions} isFeatured={isFeatured} />
            <CaseSection label="Результат" text={item.result} isFeatured={isFeatured} />

            {item.documentImage ? (
              <button
                type="button"
                onClick={() => {
                  setIsDocOpen(true);
                  trackGoal("document_view", { placement: "cases", id: item.id });
                }}
                className="inline-flex items-center gap-2 rounded-full border border-bronze-soft/60 px-4 py-2 text-sm font-semibold text-bronze-soft transition-colors hover:bg-paper/10"
              >
                <ExpandIcon className="h-4 w-4" />
                Открыть документ дела
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {isDocOpen && item.documentImage ? (
        <Lightbox
          src={item.documentImage}
          alt={item.title}
          title={item.title}
          onClose={() => setIsDocOpen(false)}
        />
      ) : null}
    </article>
  );
}

function CaseSection({
  label,
  text,
  isFeatured,
}: {
  label: string;
  text: string;
  isFeatured: boolean;
}) {
  return (
    <div>
      <span
        className={`text-xs font-semibold uppercase tracking-[0.14em] ${
          isFeatured ? "text-bronze-soft" : "text-bronze"
        }`}
      >
        {label}
      </span>
      <p className={`mt-1.5 text-sm leading-relaxed sm:text-base ${isFeatured ? "text-paper/85" : "text-text"}`}>
        {text}
      </p>
    </div>
  );
}
