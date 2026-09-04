"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { landingContent } from "@/content/landing";
import { trackEvent } from "@/lib/analytics/events";

export function StickyMobileCta() {
  const [pastHero, setPastHero] = useState(false);
  const [reportInView, setReportInView] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(landingContent.hero.sectionId);
    const report = document.getElementById(landingContent.reportForm.sectionId);
    if (!hero || !report) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );
    const reportObserver = new IntersectionObserver(
      ([entry]) => setReportInView(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -20% 0px" }
    );

    heroObserver.observe(hero);
    reportObserver.observe(report);
    return () => {
      heroObserver.disconnect();
      reportObserver.disconnect();
    };
  }, []);

  const visible = pastHero && !reportInView;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 p-3 backdrop-blur transition-transform duration-200 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      aria-hidden={!visible}
    >
      <Link
        href="#report"
        tabIndex={visible ? 0 : -1}
        onClick={() => trackEvent("hero_cta_click")}
        className="focus-ring flex h-[52px] w-full items-center justify-center rounded-button bg-primary text-[15px] font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        {landingContent.stickyMobileCta.label}
      </Link>
    </div>
  );
}
