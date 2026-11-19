"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { caseAksenova } from "@/content/case-aksenova";
import { caseSection } from "@/content/landing";
import { isVisible, siteContent, type Replaceable } from "@/content/siteContent";
import { DemoBadge } from "@/components/ui/MediaFrame";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type Work = (typeof caseAksenova.works)[number];
type Item = Work & { asset: Replaceable<unknown> };

const items: Item[] = caseAksenova.works.map((w) => ({
  ...w,
  asset: siteContent[w.media as keyof typeof siteContent] as Replaceable<unknown>,
}));

/**
 * Материалы кейса.
 * Desktop/tablet: сайт — главный визуал (с колонкой `aside`), под ним `results`, затем ряд из трёх меньших материалов.
 * Mobile: горизонтальный слайдер из всех материалов (scroll-snap, индикатор).
 * Клик по любому материалу открывает лайтбокс (Esc, стрелки, возврат фокуса).
 */
export function CaseGallery({ aside, results }: { aside: ReactNode; results: ReactNode }) {
  const visible = items.filter((it) => it.asset.asset && isVisible(it.asset));
  const [open, setOpen] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const sliderRef = useRef<HTMLUListElement>(null);

  const show = (item: Item) => {
    const idx = visible.indexOf(item);
    if (idx === -1) return;
    openerRef.current = document.activeElement as HTMLElement;
    setOpen(idx);
    track("case_gallery_open", { item: item.id });
  };

  useEffect(() => {
    const d = dialogRef.current;
    if (d && open !== null && !d.open) {
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

  const step = (dir: 1 | -1) => setOpen((cur) => (cur === null ? cur : (cur + dir + visible.length) % visible.length));
  const current = open !== null ? visible[open] : null;
  const [feature, ...rest] = items;
  const featureVisible = visible.includes(feature);

  const onSliderScroll = () => {
    const el = sliderRef.current;
    if (!el?.firstElementChild) return;
    const w = (el.firstElementChild as HTMLElement).offsetWidth + 12;
    setSlide(Math.min(items.length - 1, Math.round(el.scrollLeft / w)));
  };

  return (
    <>
      {/* ───── Desktop / tablet ───── */}
      <div className="hidden md:block">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <figure className="lg:col-span-8">
            {featureVisible ? (
              <MediaButton item={feature} onOpen={show} sizes="(min-width: 1280px) 800px, (min-width: 1024px) 66vw, 100vw" ratio="16 / 9" />
            ) : null}
            <figcaption className="mt-3 text-[15px] text-muted-text">
              <span className="font-semibold text-ink">{feature.title}.</span> {feature.text}
            </figcaption>
          </figure>
          <div className="lg:col-span-4">{aside}</div>
        </div>

        {results}

        <ul className="mt-12 grid grid-cols-3 gap-6 border-t border-navy/15 pt-8 lg:gap-10">
          {rest.map((it) => (
            <li key={it.id}>
              {visible.includes(it) && <MediaButton item={it} onOpen={show} sizes="(min-width: 1024px) 380px, 33vw" ratio="4 / 3" />}
              <h4 className="mt-3 text-[17px] font-semibold text-ink">{it.title}</h4>
              <p className="mt-1 text-[15.5px] text-muted-text">{it.text}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* ───── Mobile: слайдер ───── */}
      <div className="md:hidden">
        <p className="mb-3 text-[16px] font-semibold text-ink">{caseSection.galleryTitle}</p>
        <ul
          ref={sliderRef}
          onScroll={onSliderScroll}
          data-slider
          tabIndex={0}
          aria-label={caseSection.galleryLabel}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 focus-visible:outline-offset-[-2px]"
        >
          {items.map((it) => (
            <li key={it.id} className="w-[80%] shrink-0 snap-start">
              {visible.includes(it) && <MediaButton item={it} onOpen={show} sizes="80vw" ratio="16 / 10" />}
              <h4 className="mt-2.5 text-[16px] font-semibold text-ink">{it.title}</h4>
              <p className="mt-0.5 text-[15px] leading-snug text-muted-text">{it.text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between" aria-hidden="true">
          <div className="flex gap-1.5" data-slider-dots>
            {items.map((it, i) => (
              <span
                key={it.id}
                className={cn("h-1.5 rounded-full transition-[width,background-color] duration-300", i === slide ? "w-6 bg-navy" : "w-1.5 bg-navy/25")}
              />
            ))}
          </div>
          <span className="text-[12.5px] text-muted-text" data-slider-count>
            {slide + 1} / {items.length} · листайте
          </span>
        </div>
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
          <div className="relative flex w-full flex-col">
            <div
              className="relative max-h-[calc(100dvh-110px)] overflow-hidden rounded-[6px] bg-ivory"
              style={{ aspectRatio: current.asset.ratio?.replace("/", " / ") }}
            >
              <Image src={current.asset.asset!} alt={current.asset.alt ?? current.title} fill sizes="(min-width: 1280px) 1200px, 100vw" className="object-contain" />
              {current.asset.isPlaceholder && <DemoBadge />}
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-ivory">
              <p className="text-[16px]">
                <span className="mr-2 text-ivory/60">
                  {open! + 1} / {visible.length}
                </span>
                {current.title}. <span className="text-ivory/75">{current.text}</span>
              </p>
              <div className="flex shrink-0 gap-2">
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

function MediaButton({ item, onOpen, sizes, ratio }: { item: Item; onOpen: (it: Item) => void; sizes: string; ratio: string }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group relative block w-full overflow-hidden rounded-[4px] border border-navy/10 bg-ivory text-left"
      style={{ aspectRatio: ratio }}
      aria-label={`Открыть изображение: ${item.title}`}
    >
      <Image
        src={item.asset.asset!}
        alt={item.asset.alt ?? item.title}
        fill
        sizes={sizes}
        className={cn(
          "transition-transform duration-500 ease-out group-hover:scale-[1.015] motion-reduce:transition-none",
          item.asset.fit === "contain" ? "object-contain p-2" : "object-cover object-top",
        )}
      />
      {item.asset.isPlaceholder && <DemoBadge />}
    </button>
  );
}

function LightboxButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
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
