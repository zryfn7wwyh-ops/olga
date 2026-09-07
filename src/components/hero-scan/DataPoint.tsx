"use client";

import { forwardRef } from "react";

interface DataPointProps {
  label: string;
  xPercent: number;
  yPercent: number;
}

/**
 * Технологичная метка «цифровой карты» (SITE / FORM / COOKIE / ...).
 * Позиция в процентах от области Hero; появление/исчезновение и pulse
 * управляются снаружи через GSAP на ref.
 */
export const DataPoint = forwardRef<HTMLDivElement, DataPointProps>(function DataPoint(
  { label, xPercent, yPercent },
  ref
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-scan-el="data-point"
      data-scan-label={label}
      className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 opacity-0"
      style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
    >
      <span
        className="block h-1.5 w-1.5 rounded-full"
        style={{ background: "#7DE3FF", boxShadow: "0 0 8px 2px rgba(0,194,255,0.85)" }}
      />
      <span className="whitespace-nowrap rounded border border-[#00C2FF]/35 bg-[#102A43]/70 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-[#7DE3FF] backdrop-blur-sm">
        {label}
      </span>
    </div>
  );
});
