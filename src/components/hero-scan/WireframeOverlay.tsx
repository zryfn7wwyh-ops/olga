"use client";

import { forwardRef } from "react";

interface WireframeOverlayProps {
  rect: { x: number; y: number; width: number; height: number };
}

const NODES = [
  { x: 18, y: 22 },
  { x: 62, y: 14 },
  { x: 84, y: 46 },
  { x: 40, y: 58 },
  { x: 12, y: 78 },
  { x: 70, y: 82 },
];

const LINKS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [1, 3],
  [3, 4],
  [3, 5],
];

/**
 * «Чертёжный» режим блока — накладывается поверх реального визуала
 * на время локальной проверки лупой / прохода scan-line: полупрозрачная
 * рамка + узлы + соединяющие линии создают ощущение blueprint-режима,
 * не трогая DOM самого визуала.
 */
export const WireframeOverlay = forwardRef<HTMLDivElement, WireframeOverlayProps>(function WireframeOverlay(
  { rect },
  ref
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-scan-el="wireframe"
      className="pointer-events-none absolute rounded-[10px] border border-[#00C2FF]/0 opacity-0"
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        background: "rgba(11,27,43,0.28)",
        backdropFilter: "saturate(0.9)",
      }}
    >
      <div className="absolute inset-0 rounded-[10px] border" style={{ borderColor: "rgba(0,194,255,0.4)" }} />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {LINKS.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="#00C2FF"
            strokeOpacity={0.5}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {NODES.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={1.1} fill="#7DE3FF" />
        ))}
      </svg>
    </div>
  );
});
