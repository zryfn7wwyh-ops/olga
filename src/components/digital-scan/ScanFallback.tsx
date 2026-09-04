"use client";

import { useEffect } from "react";

interface ScanFallbackProps {
  onDone: () => void;
}

/**
 * Фолбэк без WebGL/3D: простая линия сканирования и кратковременная
 * цифровая сетка, без робота — проигрывается один раз.
 */
export function ScanFallback({ onDone }: ScanFallbackProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 animate-scan-grid-flash"
        style={{
          backgroundImage:
            "linear-gradient(rgba(36,107,253,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(36,107,253,0.35) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-24 animate-scan-once bg-gradient-to-b from-transparent via-primary/25 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-[2px] animate-scan-once bg-primary/70 shadow-[0_0_18px_4px_rgba(36,107,253,0.5)]" />
    </div>
  );
}
