"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export function StageDetails({
  items,
  openLabel,
  closeLabel,
  title,
}: {
  items: readonly string[];
  openLabel: string;
  closeLabel: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="mt-auto pt-5">
      <div id={id} className="accordion-panel" data-open={open} inert={!open}>
        <div>
          <ul className="mb-4 space-y-2.5 border-t border-[var(--on-dark-stroke)] pt-4 text-[15px] text-ivory/85">
            {items.map((d) => (
              <li key={d} className="flex gap-3">
                <span className="mt-[11px] h-px w-3 shrink-0 bg-gold" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ivory transition-colors hover:text-gold-soft"
      >
        <Plus
          className={cn("size-4 transition-transform duration-300 motion-reduce:transition-none", open && "rotate-45")}
          strokeWidth={2}
          aria-hidden="true"
        />
        <span data-label>{open ? closeLabel : openLabel}</span>
        <span className="sr-only">: {title}</span>
      </button>
    </div>
  );
}
