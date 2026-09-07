"use client";

import { forwardRef } from "react";

/**
 * Canvas для декоративных частиц вокруг scan-line. Сам canvas ничего
 * не рисует — жизненным циклом (старт/стоп/очистка) управляет
 * HeroScanExperience через методы, которые дергают ref.
 */
export const ScanParticles = forwardRef<HTMLCanvasElement>(function ScanParticles(_props, ref) {
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
    />
  );
});
