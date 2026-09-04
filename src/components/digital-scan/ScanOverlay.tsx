"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { landingContent } from "@/content/landing";

export interface ScanOverlayHandle {
  scannerLine: HTMLDivElement | null;
  grid: HTMLDivElement | null;
  footprint: HTMLDivElement | null;
  markers: HTMLDivElement[];
}

// Точки данных разбросаны вокруг визуальной колонки первого экрана —
// не задевают заголовок и CTA в текстовой колонке слева.
const MARKER_POSITIONS = [
  { x: 56, y: 15 },
  { x: 60, y: 86 },
  { x: 78, y: 9 },
  { x: 87, y: 30 },
  { x: 92, y: 70 },
  { x: 78, y: 93 },
];

export const ScanOverlay = forwardRef<ScanOverlayHandle>(function ScanOverlay(_props, ref) {
  const scannerLineRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const footprintRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<HTMLDivElement[]>([]);

  useImperativeHandle(ref, () => ({
    get scannerLine() {
      return scannerLineRef.current;
    },
    get grid() {
      return gridRef.current;
    },
    get footprint() {
      return footprintRef.current;
    },
    get markers() {
      return markerRefs.current;
    },
  }));

  const markers = landingContent.digitalScan.markers;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(36,107,253,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(36,107,253,0.35) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 80%)",
        }}
      />

      <div ref={scannerLineRef} className="absolute inset-x-0 top-0 opacity-0" style={{ transform: "translateY(-10%)" }}>
        <div className="h-16 bg-gradient-to-b from-transparent via-primary/25 to-transparent sm:h-20" />
        <div className="h-[2px] bg-primary/70 shadow-[0_0_20px_5px_rgba(36,107,253,0.55)]" />
      </div>

      {markers.map((label, i) => {
        const pos = MARKER_POSITIONS[i];
        return (
          <div
            key={label}
            ref={(el) => {
              if (el) markerRefs.current[i] = el;
            }}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 opacity-0"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_2px_rgba(36,107,253,0.7)]" />
            <span className="whitespace-nowrap rounded bg-navy/85 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {label}
            </span>
          </div>
        );
      })}

      <div
        ref={footprintRef}
        className="absolute left-1/2 top-[18%] -translate-x-1/2 whitespace-nowrap rounded-full border border-primary/40 bg-navy/80 px-5 py-2 text-sm font-bold uppercase tracking-[0.2em] text-white opacity-0 shadow-[0_0_30px_rgba(36,107,253,0.35)] sm:text-base"
      >
        {landingContent.digitalScan.footprintLabel}
      </div>
    </div>
  );
});
