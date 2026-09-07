"use client";

import { forwardRef } from "react";

/**
 * Координатная сетка поверх Hero, которая "строится" в три стадии:
 * вертикальные линии → горизонтальные линии → узловые точки. Каждая
 * стадия — отдельный слой с собственной прозрачностью, которой
 * управляет оркестратор через querySelector(data-scan-el) + GSAP.
 */
export const DigitalGrid = forwardRef<HTMLDivElement>(function DigitalGrid(_props, ref) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-scan-el="grid"
      className="pointer-events-none absolute inset-0"
      style={{
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 40%, black, transparent 92%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 40%, black, transparent 92%)",
      }}
    >
      <div
        data-scan-el="grid-v"
        className="absolute inset-0 opacity-0"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(0,194,255,0.5) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />
      <div
        data-scan-el="grid-h"
        className="absolute inset-0 opacity-0"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(0,194,255,0.5) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />
      <div
        data-scan-el="grid-dots"
        className="absolute inset-0 opacity-0"
        style={{
          backgroundImage: "radial-gradient(rgba(125,227,255,0.95) 1px, transparent 1.6px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* координатные засечки — появляются вместе с узлами */}
      <div data-scan-el="grid-ticks" className="absolute inset-0 opacity-0">
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
    </div>
  );
});
