"use client";

import type { RefObject } from "react";

interface ScanOverlayProps {
  tintRef: RefObject<HTMLDivElement>;
  noiseRef: RefObject<HTMLDivElement>;
  labelRef: RefObject<HTMLDivElement>;
}

/**
 * Слой активации: холодный тонкий tint, технический grain и короткая
 * центральная подпись «ЦИФРОВОЙ СЛЕД». Все прозрачности анимируются
 * снаружи через GSAP на переданных ref.
 */
export function ScanOverlay({ tintRef, noiseRef, labelRef }: ScanOverlayProps) {
  return (
    <>
      <div
        ref={tintRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 55% 30%, rgba(0,194,255,0.10), rgba(16,42,67,0.05) 60%, transparent 85%)",
        }}
      />
      <div
        ref={noiseRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          backgroundSize: "120px 120px",
        }}
      />
      <div
        ref={labelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-[#00C2FF]/40 bg-[#102A43]/75 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-white opacity-0 backdrop-blur-sm"
      >
        Цифровой след
      </div>
    </>
  );
}
