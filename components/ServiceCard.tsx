"use client";

import type { Service } from "@/data/services";
import { ChevronDownIcon } from "@/components/ui/icons";

type ServiceCardProps = {
  service: Service;
  isOpen: boolean;
  onToggle: () => void;
};

export function ServiceCard({ service, isOpen, onToggle }: ServiceCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-paper transition-colors duration-300 hover:border-bronze/60">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`service-panel-${service.id}`}
        className="flex w-full items-start justify-between gap-4 px-6 py-6 text-left sm:px-7"
      >
        <div>
          <h3 className="text-lg font-semibold text-ink sm:text-xl">{service.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-muted sm:text-[0.95rem]">
            {service.summary}
          </p>
        </div>
        <span
          className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-bronze/40 text-bronze transition-transform duration-300 ${
            isOpen ? "rotate-180 bg-bronze/10" : ""
          }`}
        >
          <ChevronDownIcon />
        </span>
      </button>

      <div
        id={`service-panel-${service.id}`}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-line px-6 pb-6 pt-5 sm:px-7">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-bronze">
              Важно
            </span>
            <p className="mt-2 text-sm leading-relaxed text-text sm:text-[0.95rem]">
              {service.important}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
