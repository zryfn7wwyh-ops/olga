"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { caseAksenova } from "@/content/case-aksenova";
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const show = useCallback((idx: number) => {
    openerRef.current = document.activeElement as HTMLElement;
    setOpen(idx);
    track("gallery_open", { item: visible[idx]?.id ?? "" });
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
      <ul className="grid gap-4 md:grid-cols-2 md:gap-5">
        {items.map((it, i) => {
          const vIndex = visible.indexOf(it);
          const hasMedia = vIndex !== -1;
          return (
            <li
              key={it.id}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${(i % 2) * 80}ms` }}
              className="flex flex-col overflow-hidden rounded-[14px] border border-stroke bg-paper"
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
              <div className="flex flex-1 items-start gap-4 p-6 sm:p-7">
                <span className="font-serif text-[22px] leading-none text-gold-ink">0{i + 1}</span>
                <div>
                  <h4 className="h3 text-[22px]!">{it.title}</h4>
                  <p className="mt-2 text-[15.5px] text-muted-text">{it.text}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

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
