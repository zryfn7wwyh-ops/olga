"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { CloseIcon } from "@/components/ui/icons";

type LightboxProps = {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export function Lightbox({ src, alt, title, subtitle, onClose, onPrev, onNext }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && onPrev) onPrev();
      if (event.key === "ArrowRight" && onNext) onNext();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? alt}
    >
      <div className="absolute inset-0 bg-ink/85 animate-fade-in" onClick={onClose} aria-hidden="true" />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Закрыть просмотр"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors hover:bg-paper/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze-soft sm:right-6 sm:top-6"
      >
        <CloseIcon />
      </button>

      {onPrev ? (
        <button
          type="button"
          onClick={onPrev}
          aria-label="Предыдущий документ"
          className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors hover:bg-paper/10 sm:flex sm:left-6"
        >
          <span className="rotate-180">›</span>
        </button>
      ) : null}
      {onNext ? (
        <button
          type="button"
          onClick={onNext}
          aria-label="Следующий документ"
          className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors hover:bg-paper/10 sm:flex sm:right-6"
        >
          ›
        </button>
      ) : null}

      <figure className="relative z-10 flex max-h-full max-w-3xl flex-col items-center gap-4 animate-rise">
        <div className="relative max-h-[75dvh] w-full overflow-auto rounded-lg bg-paper p-2">
          <Image
            src={src}
            alt={alt}
            width={1000}
            height={1400}
            className="h-auto w-full rounded"
            sizes="(min-width: 640px) 700px, 92vw"
          />
        </div>
        {title ? (
          <figcaption className="max-w-xl text-center text-sm text-paper/85 sm:text-base">
            <span className="font-semibold text-paper">{title}</span>
            {subtitle ? <span className="block text-paper/65">{subtitle}</span> : null}
          </figcaption>
        ) : null}
      </figure>
    </div>
  );
}
