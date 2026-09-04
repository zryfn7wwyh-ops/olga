"use client";

import Link from "next/link";
import { Check, FileCheck2 } from "lucide-react";
import { landingContent } from "@/content/landing";
import { trackEvent } from "@/lib/analytics/events";

export function AudienceSection() {
  const { sectionId, left, right } = landingContent.audience;

  return (
    <section id={sectionId} className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-container gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="flex flex-col gap-5">
          <h2 className="font-heading text-2xl font-semibold leading-tight tracking-tight text-navy sm:text-3xl">
            {left.title}
          </h2>
          <p className="text-base text-text-secondary">{left.intro}</p>
          <ul className="flex flex-col gap-2.5">
            {left.items.map((item) => (
              <li
                key={item}
                className="flex cursor-default items-start gap-3 rounded-card border border-border bg-surface px-4 py-3 shadow-card transition-colors duration-150 hover:border-primary/30 hover:bg-primary/5"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="text-[15px] text-text-primary">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="font-heading text-2xl font-semibold leading-tight tracking-tight text-navy sm:text-3xl">
            {right.title}
          </h2>
          <p className="text-base text-text-secondary">{right.intro}</p>
          <ul className="flex flex-col gap-2.5">
            {right.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="text-[15px] text-text-primary">{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 rounded-card border border-primary/20 bg-primary/5 p-5">
            <span className="glass flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent">
              <FileCheck2 className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <p className="text-[15px] font-medium text-navy">{right.highlight}</p>
          </div>

          <p className="text-[15px] leading-relaxed text-text-secondary">{right.outro}</p>

          <Link
            href="#report"
            onClick={() => trackEvent("hero_cta_click")}
            className="focus-ring inline-flex h-[52px] w-full items-center justify-center rounded-button bg-primary px-7 text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover sm:w-fit"
          >
            {right.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
