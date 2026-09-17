"use client";

import Link from "next/link";
import { landingContent } from "@/content/landing";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics/events";
import { Logo } from "@/components/brand/Logo";

interface HeaderProps {
  /** Только для /brand-preview — подменяет знак логотипа, не затрагивая продакшен по умолчанию. */
  logoOverride?: React.ReactNode;
}

export function Header({ logoOverride }: HeaderProps = {}) {
  const { navLinks, ctaLabel, ctaLabelMobile } = landingContent.header;

  const handleCtaClick = () => {
    trackEvent("hero_cta_click");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-container items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="#digital-footprint"
          className="focus-ring flex min-w-0 items-center rounded-button"
          aria-label={siteConfig.siteName}
        >
          {logoOverride ?? <Logo variant="mark" theme="light" size={32} />}
        </Link>

        <nav className="hidden items-center gap-5 xl:flex xl:gap-7" aria-label="Основная навигация">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring whitespace-nowrap rounded-button text-sm font-bold text-text-secondary transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="#report"
          onClick={handleCtaClick}
          className="focus-ring inline-flex h-11 items-center justify-center whitespace-nowrap rounded-button bg-primary px-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-hover sm:px-5"
        >
          <span className="hidden sm:inline">{ctaLabel}</span>
          <span className="sm:hidden">{ctaLabelMobile}</span>
        </Link>
      </div>
    </header>
  );
}
