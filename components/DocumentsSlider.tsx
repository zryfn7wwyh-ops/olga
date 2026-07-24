"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { documents } from "@/data/documents";
import { trackGoal } from "@/lib/analytics";
import { ArrowRightIcon, DocumentIcon, ExpandIcon } from "@/components/ui/icons";
import { Lightbox } from "@/components/ui/Lightbox";

export function DocumentsSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-doc-card]");
    const step = card ? card.offsetWidth + 20 : 300;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  function openDocument(index: number) {
    if (!documents[index].image) return;
    setOpenIndex(index);
    trackGoal("document_view", { placement: "about", id: documents[index].id });
  }

  const activeDoc = openIndex !== null ? documents[openIndex] : null;

  function step(from: number, direction: 1 | -1) {
    let next = from;
    for (let i = 0; i < documents.length; i += 1) {
      next = (next + direction + documents.length) % documents.length;
      if (documents[next].image) return next;
    }
    return from;
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {documents.map((doc, index) => (
          <article
            key={doc.id}
            data-doc-card
            className="group flex w-[240px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-all duration-300 hover:border-bronze/60 sm:w-[260px]"
          >
            <button
              type="button"
              onClick={() => openDocument(index)}
              disabled={!doc.image}
              className="relative aspect-[3/4] w-full overflow-hidden bg-cream disabled:cursor-default"
              aria-label={doc.image ? `Открыть документ: ${doc.title}` : `${doc.title} — скан появится позже`}
            >
              {doc.image ? (
                <>
                  <Image
                    src={doc.image}
                    alt={doc.title}
                    fill
                    sizes="260px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-paper opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <ExpandIcon className="h-4 w-4" />
                  </span>
                </>
              ) : (
                <span className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center text-text-muted">
                  <DocumentIcon className="h-8 w-8 text-bronze/60" />
                  <span className="text-xs leading-snug">Скан появится здесь</span>
                </span>
              )}
            </button>
            <div className="flex flex-1 flex-col gap-1 px-4 py-4">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-bronze">
                {doc.category}
              </span>
              <h3 className="text-sm font-semibold leading-snug text-ink">{doc.title}</h3>
              <p className="mt-auto text-xs text-text-muted">
                {doc.organization}
                {doc.year ? ` · ${doc.year}` : ""}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Предыдущие документы"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-bronze hover:text-bronze"
        >
          <span className="rotate-180">
            <ArrowRightIcon />
          </span>
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Следующие документы"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-bronze hover:text-bronze"
        >
          <ArrowRightIcon />
        </button>
      </div>

      {activeDoc?.image ? (
        <Lightbox
          src={activeDoc.image}
          alt={activeDoc.title}
          title={activeDoc.title}
          subtitle={`${activeDoc.organization}${activeDoc.year ? ` · ${activeDoc.year}` : ""}`}
          onClose={() => setOpenIndex(null)}
          onPrev={() => setOpenIndex((prev) => (prev === null ? null : step(prev, -1)))}
          onNext={() => setOpenIndex((prev) => (prev === null ? null : step(prev, 1)))}
        />
      ) : null}
    </div>
  );
}
