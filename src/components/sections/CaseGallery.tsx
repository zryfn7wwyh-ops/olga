"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { caseAksenova } from "@/content/case-aksenova";
import { caseSection } from "@/content/landing";
import { isVisible, siteContent, type Replaceable } from "@/content/siteContent";
import { DemoBadge } from "@/components/ui/MediaFrame";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type Work = (typeof caseAksenova.works)[number];
type Item = Work & { media: keyof typeof siteContent; asset: Replaceable<unknown> };

const items: Item[] = caseAksenova.works.map((w) => ({
  ...w,
  asset: siteContent[w.media as keyof typeof siteContent] as Replaceable<unknown>,
})) as Item[];



/**
 * «Что сделали» + «Посмотреть, как это выглядело»: 4 карточки работ с миниатюрами,
 * клик открывает лайтбокс. В production заглушки скрыты — карточки остаются текстовыми.
 */
export function CaseGallery() {
  const visible = items.filter((it) => it.asset.asset && isVisible(it.asset));
  const [open, setOpen] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const sliderRef = useRef<HTMLUListElement>(null);

  // Индикатор положения мобильного слайдера.
  const onSliderScroll = () => {
    const el = sliderRef.current;
    if (!el || !el.firstElementChild) return;
    const w = (el.firstElementChild as HTMLElement).offsetWidth + 12;
    setSlide(Math.min(items.length - 1, Math.round(el.scrollLeft / w)));
  };
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const show = useCallback((idx: number) => {
    openerRef.current = document.activeElement as HTMLElement;
    setOpen(idx);
    track("case_gallery_open", { item: visible[idx]?.id ?? "" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open !== null && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    }
  }, [open]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => {
      setOpen(null);
      document.documentElement.style.overflow = "";
      openerRef.current?.focus({ preventScroll: true });
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  const step = (dir: 1 | -1) =>
    setOpen((cur) => (cur === null ? cur : (cur + dir + visible.length) % visible.length));

  const current = open !== null ? visible[open] : null;

  return (
    <>
      <ul
        ref={sliderRef}
        onScroll={onSliderScroll}
        data-slider
        tabIndex={0}
        aria-label={caseSection.galleryLabel}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 focus-visible:outline-offset-[-2px] md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0"
      >
        {items.map((it, i) => {
          const vIndex = visible.indexOf(it);
          const hasMedia = vIndex !== -1;
          return (
            <li
              key={it.id}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${(i % 2) * 80}ms` }}
              className="flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-[14px] border border-stroke bg-paper xs:w-[78%] md:w-auto"
            >
              {hasMedia && (
                <button
                  type="button"
                  onClick={() => show(vIndex)}
                  className="group relative block w-full overflow-hidden border-b border-stroke bg-ivory text-left"
                  style={{ aspectRatio: "16 / 10" }}
                  aria-label={`Открыть изображение: ${it.title}`}
                >
                  <Image
                    src={it.asset.asset!}
                    alt={it.asset.alt ?? it.title}
                    fill
                    sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
                    className={cn(
                      "transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none",
                      it.asset.fit === "contain" ? "object-contain p-2" : "object-cover object-top",
                    )}
                  />
                  {it.asset.isPlaceholder && <DemoBadge />}
                  <span className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-navy-deep/80 text-ivory opacity-90 transition-opacity group-hover:opacity-100">
                    <Maximize2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                </button>
              )}
              <div className="flex flex-1 items-start gap-3 p-4 sm:gap-4 sm:p-7">
                <span className="font-serif text-[22px] leading-none text-gold-ink">0{i + 1}</span>
                <div>
                  <h4 className="h3 text-[20px]! sm:text-[22px]!">{it.title}</h4>
                  <p className="mt-1.5 text-[14.5px] text-muted-text sm:mt-2 sm:text-[15.5px]">{it.text}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex items-center justify-between md:hidden" aria-hidden="true">
        <div className="flex gap-1.5" data-slider-dots>
          {items.map((it, i) => (
            <span
              key={it.id}
              className={cn("h-1.5 rounded-full transition-[width,background-color] duration-300", i === slide ? "w-6 bg-gold" : "w-1.5 bg-navy/25")}
            />
          ))}
        </div>
        <span className="text-[12.5px] text-muted-text" data-slider-count>
          {slide + 1} / {items.length} · листайте
        </span>
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox-dialog"
        aria-label={current ? current.title : "Просмотр изображения"}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {current && (
          <div className="relative flex max-h-[calc(100dvh-32px)] w-full flex-col">
            <div
              className="relative max-h-[calc(100dvh-110px)] overflow-hidden rounded-[12px] bg-ivory"
              style={{ aspectRatio: current.asset.ratio?.replace("/", " / ") }}
            >
              <Image
                src={current.asset.asset!}
                alt={current.asset.alt ?? current.title}
                fill
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-contain"
              />
              {current.asset.isPlaceholder && <DemoBadge />}
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-ivory">
              <p className="text-[15px]">
                <span className="mr-2 font-serif text-gold-soft">
                  {open! + 1} / {visible.length}
                </span>
                {current.title}
              </p>
              <div className="flex gap-2">
                <LightboxButton label="Предыдущее изображение" onClick={() => step(-1)}>
                  <ChevronLeft className="size-5" strokeWidth={1.75} />
                </LightboxButton>
                <LightboxButton label="Следующее изображение" onClick={() => step(1)}>
                  <ChevronRight className="size-5" strokeWidth={1.75} />
                </LightboxButton>
                <LightboxButton label="Закрыть" onClick={() => dialogRef.current?.close()}>
                  <X className="size-5" strokeWidth={1.75} />
                </LightboxButton>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

function LightboxButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-white/25 text-ivory transition-colors hover:border-gold hover:text-gold-soft"
    >
      {children}
    </button>
  );
}
