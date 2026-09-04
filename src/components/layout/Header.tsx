"use client";

import Link from "next/link";
import { landingContent } from "@/content/landing";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics/events";

export function Header() {
  const { navLinks, ctaLabel, ctaLabelMobile } = landingContent.header;

  const handleCtaClick = () => {
    trackEvent("hero_cta_click");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-container items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="#digital-footprint" className="focus-ring flex items-center gap-2 rounded-button">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="var(--navy)" />
            <path
              d="M16 6L25 10.5V16.7C25 21.7 21.4 24.9 16 27C10.6 24.9 7 21.7 7 16.7V10.5L16 6Z"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M12 16.5L15 19.5L20.5 13"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-heading text-[15px] font-semibold text-navy">{siteConfig.siteName}</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Основная навигация">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring rounded-button text-sm font-medium text-text-secondary transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="#report"
          onClick={handleCtaClick}
          className="focus-ring inline-flex h-11 items-center justify-center rounded-button bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-hover sm:px-5"
        >
          <span className="hidden sm:inline">{ctaLabel}</span>
          <span className="sm:hidden">{ctaLabelMobile}</span>
        </Link>
      </div>
    </header>
  );
}
