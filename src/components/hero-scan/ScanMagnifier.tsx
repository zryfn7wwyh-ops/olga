"use client";

import { forwardRef } from "react";

export const MAGNIFIER_SIZE_DESKTOP = 208;
export const MAGNIFIER_SIZE_MOBILE = 156;

const TICKS = Array.from({ length: 16 }, (_, i) => i * (360 / 16));

/**
 * Технологичная круглая линза-анализатор. Сама по себе не знает, что
 * увеличивает — просто рамка/кольца/tick marks вокруг круглого окна.
 * Внутри окна лежит MagnifiedLayer, куда оркестратор кладёт живой клон
 * текущей цели. Позиция и прозрачность линзы анимируются снаружи через
 * GSAP на ref контейнера.
 */
export const ScanMagnifier = forwardRef<HTMLDivElement>(function ScanMagnifier(_props, ref) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-scan-el="magnifier"
      className="pointer-events-none absolute left-0 top-0 opacity-0"
      style={{ willChange: "transform, opacity" }}
    >
      <div
        className="relative -translate-x-1/2 -translate-y-1/2"
        style={{ ["--lens-size" as string]: `${MAGNIFIER_SIZE_DESKTOP}px`, width: "var(--lens-size)", height: "var(--lens-size)" }}
      >
        {/* внешнее свечение */}
        <div
          className="absolute rounded-full"
          style={{ inset: -14, boxShadow: "0 0 46px 12px rgba(0,194,255,0.22)" }}
        />
        {/* технические кольца */}
        <div className="absolute inset-0 rounded-full border" style={{ borderColor: "rgba(0,194,255,0.55)", borderWidth: 1.5 }} />
        <div className="absolute rounded-full border" style={{ inset: 9, borderColor: "rgba(0,194,255,0.28)" }} />
        <div className="absolute rounded-full border" style={{ inset: 18, borderColor: "rgba(0,194,255,0.16)" }} />

        {/* tick marks по ободу */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
          {TICKS.map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const long = i % 4 === 0;
            const rOuter = 49;
            const rInner = long ? 44 : 46.5;
            const x1 = 50 + rOuter * Math.cos(rad);
            const y1 = 50 + rOuter * Math.sin(rad);
            const x2 = 50 + rInner * Math.cos(rad);
            const y2 = 50 + rInner * Math.sin(rad);
            return (
              <line
                key={deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(0,194,255,0.45)"
                strokeWidth={long ? 0.9 : 0.5}
              />
            );
          })}
        </svg>

        {/* круглое окно с увеличенным содержимым */}
        <div
          data-scan-el="magnifier-viewport"
          className="absolute overflow-hidden rounded-full bg-[#0B1B2B]/35 backdrop-blur-[0.5px]"
          style={{ inset: 4 }}
        >
          <div
            data-scan-el="magnifier-content"
            className="absolute left-1/2 top-1/2"
            style={{ transform: "translate(-50%, -50%) scale(1)", transformOrigin: "center" }}
          />
          {/* focus-sweep */}
          <div
            data-scan-el="magnifier-sweep"
            className="pointer-events-none absolute inset-y-0 w-1/3 opacity-0"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
              transform: "translateX(-120%)",
            }}
          />
          {/* микросетка внутри линзы */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0,194,255,0.18) 1px, transparent 1px)," +
                "linear-gradient(to bottom, rgba(0,194,255,0.18) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />
        </div>

        {/* подпись под линзой */}
        <div
          data-scan-el="magnifier-label"
          className="pointer-events-none absolute left-1/2 -bottom-7 -translate-x-1/2 whitespace-nowrap rounded border border-[#00C2FF]/40 bg-[#102A43]/80 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-[#7DE3FF] opacity-0"
        />
      </div>
    </div>
  );
});
