"use client";

import type { ReactNode } from "react";
import { caseAksenova } from "@/content/case-aksenova";
import { track } from "@/lib/analytics";

/** Ссылка на действующий сайт адвоката: новая вкладка + событие external_site_click. */
export function ExternalSiteLink({ children, className, place }: { children: ReactNode; className?: string; place: string }) {
  return (
    <a
      href={caseAksenova.siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track("external_site_click", { place })}
    >
      {children}
      <span className="sr-only"> (откроется в новой вкладке)</span>
    </a>
  );
}
