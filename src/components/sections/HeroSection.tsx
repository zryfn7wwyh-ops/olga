"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { landingContent } from "@/content/landing";
import { trackEvent } from "@/lib/analytics/events";
import { DigitalFootprintVisual } from "@/components/ui/DigitalFootprintVisual";

export function HeroSection() {
  const { sectionId, title, description, ctaLabel, ctaNote } = landingContent.hero;

  return (
    <section id={sectionId} className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="bg-blob left-[8%] top-[-16%] h-[460px] w-[460px] animate-drift bg-primary/20" />
        <div className="bg-blob right-[-8%] top-[10%] h-[380px] w-[380px] animate-drift-slow bg-navy/15" />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 animate-magnifier-scan">
          <div className="glass flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 via-white/40 to-transparent shadow-card sm:h-32 sm:w-32">
            <Search className="h-12 w-12 text-primary sm:h-16 sm:w-16" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-container items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="flex flex-col gap-6 animate-fade-in-up">
          <h1 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-navy sm:text-4xl lg:text-[46px]">
            {title}
          </h1>
          <div className="glass flex flex-col gap-4 rounded-card p-5">
            {description.map((paragraph) => (
              <p key={paragraph} className="text-lg font-medium leading-relaxed text-text-secondary sm:text-xl">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="#report"
              onClick={() => trackEvent("hero_cta_click")}
              className="focus-ring inline-flex h-[52px] w-full items-center justify-center rounded-button bg-primary px-7 text-base font-bold text-white transition-colors hover:bg-primary-hover sm:w-fit"
            >
              {ctaLabel}
            </Link>
            <p className="text-base font-medium text-text-secondary">{ctaNote}</p>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <DigitalFootprintVisual />
        </div>
      </div>
    </section>
  );
}
