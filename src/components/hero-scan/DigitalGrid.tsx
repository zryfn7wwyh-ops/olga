"use client";

import { forwardRef } from "react";

/**
 * Тонкая координатная сетка поверх Hero. Прозрачность анимируется
 * снаружи через ref (GSAP), сама по себе сетка всегда в DOM —
 * это дешевле, чем монтировать/размонтировать на каждый показ.
 */
export const DigitalGrid = forwardRef<HTMLDivElement>(function DigitalGrid(_props, ref) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-scan-el="grid"
      className="pointer-events-none absolute inset-0 opacity-0"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0,194,255,0.55) 1px, transparent 1px)," +
          "linear-gradient(to bottom, rgba(0,194,255,0.55) 1px, transparent 1px)",
        backgroundSize: "42px 42px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 40%, black, transparent 92%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 40%, black, transparent 92%)",
      }}
    >
      {/* координатные засечки по краям — декоративная деталь интерфейса анализа */}
      {["00", "10", "20", "30", "40"].map((tick, i) => (
        <span
          key={"top-" + tick}
          className="absolute top-1 font-mono text-[9px] tracking-wider text-[#00C2FF]"
          style={{ left: `${8 + i * 22}%` }}
        >
          {tick}
        </span>
      ))}
      {["A", "B", "C", "D"].map((tick, i) => (
        <span
          key={"side-" + tick}
          className="absolute left-1 font-mono text-[9px] tracking-wider text-[#00C2FF]"
          style={{ top: `${14 + i * 22}%` }}
        >
          {tick}
        </span>
      ))}
    </div>
  );
});
