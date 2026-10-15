"use client";

import { useEffect, useRef, useState } from "react";
import { documents, type DocumentItem } from "@/data/documents";
import { trackGoal } from "@/lib/analytics";
import { IconArrowLeft, IconArrowRight, IconClose, IconExpand } from "./Icons";
import { PlaceholderMark } from "./PlaceholderMark";
import { SliderNav } from "./SliderNav";
import { useSlider } from "./useSlider";

/** Превью документа: скан либо схематичный «лист» с подписью. */
function DocPreview({ doc, large }: { doc: DocumentItem; large?: boolean }) {
  if (doc.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={doc.image} alt={doc.title} loading="lazy" className="h-full w-full object-contain" />;
  }
  return (
    <div className="relative mx-auto flex h-full w-full max-w-[min(100%,560px)] flex-col bg-white p-[8%] shadow-[0_1px_0_#D9D6CE,0_18px_40px_-24px_rgb(16_26_34/0.35)]">
      <div className="flex items-start justify-between">
        <span className="h-6 w-6 border border-bronze/60" aria-hidden />
        <span className="tech text-[9px] text-muted">№ —</span>
      </div>
      <p className={large ? "mt-[10%] font-serif text-[clamp(20px,3vw,32px)] leading-tight" : "mt-[12%] font-serif text-[15px] leading-tight"}>{doc.title}</p>
      <div className="mt-[8%] space-y-[6%]" aria-hidden>
        {[92, 78, 86, 64, 80, 52].map((w, i) => (
          <span key={i} className="block h-[3px] bg-line" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="mt-auto flex items-end justify-between">
        <span className="tech text-[9px] text-muted">Скан будет добавлен</span>
        <span className="h-10 w-10 rounded-full border border-steel/40" aria-hidden />
      </div>
    </div>
  );
}

export function DocumentsSlider() {
  const { ref, index, atStart, atEnd, goTo } = useSlider<HTMLUListElement>();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openLb = (i: number) => {
    setLightbox(i);
    trackGoal("document_view", { id: documents[i].id });
    dialogRef.current?.showModal();
  };

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % documents.length));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + documents.length) % documents.length));
    };
    const onClick = (e: MouseEvent) => e.target === d && d.close();
    const onClose = () => setLightbox(null);
    d.addEventListener("keydown", onKey);
    d.addEventListener("click", onClick);
    d.addEventListener("close", onClose);
    return () => {
      d.removeEventListener("keydown", onKey);
      d.removeEventListener("click", onClick);
      d.removeEventListener("close", onClose);
    };
  }, []);

  const current = lightbox !== null ? documents[lightbox] : null;

  return (
    <div className="mt-24 border-t border-line pt-12 lg:mt-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h3 className="font-serif text-[28px] leading-tight sm:text-[34px]">Документы и квалификация</h3>
          <p className="mt-3 max-w-[520px] text-[15px] text-muted">
            Сведения об арбитражном управляющем, членство в СРО, квалификация оценщика и образование. <PlaceholderMark className="ml-1 align-middle">сканы</PlaceholderMark>
          </p>
        </div>
        <SliderNav
          label="Навигация по документам"
          index={index}
          total={documents.length}
          onPrev={() => goTo(Math.max(0, index - 1))}
          onNext={() => goTo(Math.min(documents.length - 1, index + 1))}
          prevDisabled={atStart}
          nextDisabled={atEnd}
        />
      </div>

      <ul
        ref={ref}
        className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 xl:mx-0 xl:scroll-px-0 xl:px-0"
        aria-label="Документы"
      >
        {documents.map((d, i) => (
          <li key={d.id} className="w-[78%] shrink-0 snap-start xs:w-[64%] sm:w-[42%] lg:w-[calc((100%-48px)/4)]">
            <button
              type="button"
              onClick={() => openLb(i)}
              className="group block w-full text-left"
              aria-label={`Открыть документ: ${d.title}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden border border-line bg-[#ECE8DF] p-6 transition-colors duration-200 group-hover:border-steel/60">
                <div className="h-full transition-transform duration-300 ease-[var(--ease-premium)] group-hover:scale-[1.02]">
                  <DocPreview doc={d} />
                </div>
                <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center bg-ink/85 text-ivory opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <IconExpand className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-4 text-[15px] font-semibold leading-snug">{d.title}</p>
              <p className="mt-1 flex justify-between gap-4 text-[13px] text-muted">
                <span>{d.organization}</span>
                <span className="tabular">{d.year}</span>
              </p>
            </button>
          </li>
        ))}
      </ul>

      {/* Fullscreen lightbox */}
      <dialog
        ref={dialogRef}
        aria-label={current ? `Документ: ${current.title}` : "Документ"}
        className="on-dark m-0 h-dvh max-h-none w-screen max-w-none bg-ink/97 p-0 text-ivory"
      >
        {current && lightbox !== null && (
          <div className="flex h-full flex-col">
            <div className="container-x flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-[15px] font-semibold">{current.title}</p>
                <p className="text-[13px] text-mist">
                  {current.organization} · {current.year}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="tech tabular text-mist">
                  {String(lightbox + 1).padStart(2, "0")} / {String(documents.length).padStart(2, "0")}
                </span>
                <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Закрыть" className="grid h-11 w-11 place-items-center border border-slate-2 hover:border-mist">
                  <IconClose className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-8 sm:px-20">
              <div key={current.id} className="aspect-[3/4] h-full max-h-[calc(100dvh-140px)] max-w-full motion-safe:animate-[fade_250ms_var(--ease-premium)]">
                <DocPreview doc={current} large />
              </div>
              <button
                type="button"
                aria-label="Предыдущий документ"
                onClick={() => setLightbox((lightbox - 1 + documents.length) % documents.length)}
                className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-slate-2 bg-ink/70 hover:border-mist sm:left-6"
              >
                <IconArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Следующий документ"
                onClick={() => setLightbox((lightbox + 1) % documents.length)}
                className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-slate-2 bg-ink/70 hover:border-mist sm:right-6"
              >
                <IconArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
