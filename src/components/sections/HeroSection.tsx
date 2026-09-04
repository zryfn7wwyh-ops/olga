"use client";

import Link from "next/link";
import { landingContent } from "@/content/landing";
import { trackEvent } from "@/lib/analytics/events";
import { DigitalFootprintVisual } from "@/components/ui/DigitalFootprintVisual";

export function HeroSection() {
  const { sectionId, title, description, ctaLabel, ctaNote } = landingContent.hero;

  return (
    <section id={sectionId} className="py-16 sm:py-20 lg:py-28">
      <div className="mx-auto grid max-w-container items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="flex flex-col gap-6 animate-fade-in-up">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-navy sm:text-4xl lg:text-[44px]">
            {title}
          </h1>
          <div className="flex flex-col gap-4">
            {description.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-text-secondary sm:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="#report"
              onClick={() => trackEvent("hero_cta_click")}
              className="focus-ring inline-flex h-[52px] w-full items-center justify-center rounded-button bg-primary px-7 text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover sm:w-fit"
            >
              {ctaLabel}
            </Link>
            <p className="text-sm text-text-secondary">{ctaNote}</p>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <DigitalFootprintVisual />
        </div>
      </div>
    </section>
  );
}
