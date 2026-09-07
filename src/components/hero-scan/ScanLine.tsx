"use client";

import { forwardRef } from "react";

/**
 * Сканирующая линия: яркое ядро + свечение + лёгкий chromatic-fringe.
 * Позиция по Y (translateY) анимируется снаружи через GSAP на ref
 * контейнера — сам компонент только про внешний вид.
 */
export const ScanLine = forwardRef<HTMLDivElement>(function ScanLine(_props, ref) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-scan-el="line"
      className="pointer-events-none absolute inset-x-0 top-0 opacity-0"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="relative -translate-y-1/2">
        {/* мягкая широкая волна позади линии — "цифровой след" */}
        <div
          data-scan-el="line-wave"
          className="absolute inset-x-0 -translate-y-1/2"
          style={{
            height: 130,
            background: "linear-gradient(to bottom, transparent, rgba(0,194,255,0.08), rgba(0,194,255,0.03), transparent)",
            filter: "blur(6px)",
          }}
        />
        {/* glow */}
        <div
          className="absolute inset-x-0 -translate-y-1/2"
          style={{
            height: 64,
            background: "linear-gradient(to bottom, transparent, rgba(0,194,255,0.32), transparent)",
            filter: "blur(4px)",
          }}
        />
        {/* лёгкий chromatic-fringe по краям линии */}
        <div
          className="absolute inset-x-0 h-px -translate-y-1/2"
          style={{ transform: "translate(-1.5px, -50%)", background: "rgba(255,45,85,0.35)" }}
        />
        <div
          className="absolute inset-x-0 h-px -translate-y-1/2"
          style={{ transform: "translate(1.5px, -50%)", background: "rgba(0,194,255,0.35)" }}
        />
        {/* основное яркое ядро */}
        <div
          className="absolute inset-x-0 -translate-y-1/2"
          style={{
            height: 2,
            background: "linear-gradient(90deg, transparent, #7DE3FF 15%, #ffffff 50%, #7DE3FF 85%, transparent)",
            boxShadow: "0 0 10px 2px rgba(0,194,255,0.85)",
          }}
        />
        {/* короткий trail снизу */}
        <div
          className="absolute inset-x-0 -translate-y-1/2"
          style={{
            top: 3,
            height: 22,
            background: "linear-gradient(to bottom, rgba(125,227,255,0.22), transparent)",
          }}
        />
      </div>
    </div>
  );
});
