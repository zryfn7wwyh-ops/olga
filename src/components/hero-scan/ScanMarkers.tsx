"use client";

import { forwardRef } from "react";

interface ScanMarkersProps {
  rect: { x: number; y: number; width: number; height: number };
  label?: string;
}

const CORNER_SIZE = 14;

/**
 * Bounding-box с угловыми маркерами поверх реального DOM-элемента —
 * реакция интерфейса на прохождение scan-line. Позиционируется абсолютно
 * поверх измеренного прямоугольника целевого элемента; opacity анимируется
 * снаружи через GSAP.
 */
export const ScanMarkers = forwardRef<HTMLDivElement, ScanMarkersProps>(function ScanMarkers(
  { rect, label },
  ref
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute opacity-0"
      style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height }}
    >
      <div className="absolute inset-0 rounded-[4px] border border-[#00C2FF]/45" />
      {[
        { top: -1, left: -1, borderTop: true, borderLeft: true },
        { top: -1, right: -1, borderTop: true, borderRight: true },
        { bottom: -1, left: -1, borderBottom: true, borderLeft: true },
        { bottom: -1, right: -1, borderBottom: true, borderRight: true },
      ].map((corner, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            top: corner.top,
            bottom: corner.bottom,
            left: corner.left,
            right: corner.right,
            width: CORNER_SIZE,
            height: CORNER_SIZE,
            borderTop: corner.borderTop ? "2px solid #7DE3FF" : undefined,
            borderBottom: corner.borderBottom ? "2px solid #7DE3FF" : undefined,
            borderLeft: corner.borderLeft ? "2px solid #7DE3FF" : undefined,
            borderRight: corner.borderRight ? "2px solid #7DE3FF" : undefined,
          }}
        />
      ))}
      {label && (
        <span className="absolute -top-5 left-0 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#00C2FF]">
          {label}
        </span>
      )}
    </div>
  );
});
