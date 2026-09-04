"use client";

import {
  Cookie,
  Database,
  FileText,
  FormInput,
  Globe,
  Layers,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { landingContent } from "@/content/landing";

const ICONS: LucideIcon[] = [
  Globe,
  FormInput,
  Cookie,
  ShieldCheck,
  Database,
  Users,
  Layers,
  FileText,
];

// Расположены строго по кругу (радиус 42 от центра 50,50) — как цифры на циферблате часов.
const POSITIONS = [
  { x: 50, y: 8 },
  { x: 79.7, y: 20.3 },
  { x: 92, y: 50 },
  { x: 79.7, y: 79.7 },
  { x: 50, y: 92 },
  { x: 20.3, y: 79.7 },
  { x: 8, y: 50 },
  { x: 20.3, y: 20.3 },
];

export function DigitalFootprintVisual() {
  const nodes = landingContent.heroVisual.nodes;

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[420px]"
      role="img"
      aria-label={`${landingContent.heroVisual.title}: ${nodes.join(", ")}`}
    >
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <div
          className="absolute inset-x-0 h-1/3 animate-scan-line bg-gradient-to-b from-transparent via-primary/10 to-transparent"
          aria-hidden="true"
        />
      </div>

      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--primary)" strokeOpacity="0.28" strokeWidth="0.6" strokeDasharray="1 4" strokeLinecap="round" />
      </svg>

      <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 animate-pulse-soft flex-col items-center justify-center rounded-full bg-navy text-center shadow-card sm:h-24 sm:w-24">
        <span className="px-2 text-xs font-bold leading-tight text-white sm:text-sm">
          {landingContent.heroVisual.centerLabel}
        </span>
      </div>

      {POSITIONS.map((pos, i) => {
        const Icon = ICONS[i];
        const label = nodes[i];
        return (
          <div
            key={label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 animate-node-in flex-col items-center gap-1.5"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, animationDelay: `${0.3 + i * 0.08}s` }}
          >
            <div
              className="glass flex h-11 w-11 animate-float-toward items-center justify-center rounded-full bg-gradient-to-br from-primary/20 via-white/40 to-transparent sm:h-12 sm:w-12"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <span className="w-20 text-center text-xs font-extrabold leading-tight text-navy sm:text-sm">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
