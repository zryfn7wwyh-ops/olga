"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  /** Подпись кнопки в раскрытом состоянии. */
  closeLabel?: string;
  children: ReactNode;
  /** Раскрыт по умолчанию на ширине от collapseBelow px и выше; ниже — свёрнут. */
  collapseBelow?: number;
  defaultOpen?: boolean;
  event?: AnalyticsEvent;
  tone?: "light" | "dark";
  className?: string;
  buttonClassName?: string;
};

/** Доступный раскрывающийся блок (aria-expanded, клавиатура, без layout shift при reduced motion). */
export function Disclosure({
  label,
  closeLabel,
  children,
  collapseBelow,
  defaultOpen = false,
  event,
  tone = "light",
  className,
  buttonClassName,
}: Props) {
  const id = useId();
  const [open, setOpen] = useState(collapseBelow ? true : defaultOpen);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- начальное состояние зависит от ширины экрана
    if (collapseBelow && window.innerWidth < collapseBelow) setOpen(false);
  }, [collapseBelow]);

  return (
    <div className={className} data-collapse-below={collapseBelow}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        data-label-open={closeLabel ?? label}
        data-label-closed={label}
        data-event={event}
        onClick={() => {
          setOpen((v) => !v);
          if (!open && event) track(event);
        }}
        className={cn(
          "group inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold transition-colors",
          tone === "dark" ? "text-ivory hover:text-gold-soft" : "text-ink hover:text-gold-ink",
          buttonClassName,
        )}
      >
        <span data-label>{open ? (closeLabel ?? label) : label}</span>
        <ChevronDown
          className={cn("size-4 transition-transform duration-300 motion-reduce:transition-none", open && "rotate-180")}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>
      <div id={id} className="accordion-panel" data-open={open} inert={!open}>
        <div>{children}</div>
      </div>
    </div>
  );
}
