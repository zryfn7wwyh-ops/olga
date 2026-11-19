"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export function StageDetails({
  items,
  openLabel,
  closeLabel,
  title,
  tone = "dark",
}: {
  items: readonly string[];
  openLabel: string;
  closeLabel: string;
  title: string;
  tone?: "light" | "dark";
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="pt-4">
      <div id={id} className="accordion-panel" data-open={open} inert={!open}>
        <div>
          <ul className={cn("mb-3 space-y-2 text-[16px]", tone === "dark" ? "text-ivory/85" : "text-ink")}>
            {items.map((d) => (
              <li key={d} className="flex gap-3">
                <span className={cn("mt-[11px] h-px w-3 shrink-0", tone === "dark" ? "bg-ivory/40" : "bg-navy/40")} aria-hidden="true" />
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
        className={cn(
          "inline-flex min-h-11 items-center gap-2 text-[16px] font-semibold underline-offset-4 transition-colors hover:underline",
          tone === "dark" ? "text-ivory" : "text-ink",
        )}
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
