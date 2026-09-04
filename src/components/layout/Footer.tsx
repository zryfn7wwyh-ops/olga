import Link from "next/link";
import { siteConfig } from "@/config/site";
import { landingContent } from "@/content/landing";

export function Footer() {
  const year = new Date().getFullYear();
  const { legalEntity, links } = siteConfig;
  const { linkLabels } = landingContent.footer;

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-container px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
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
              <span className="text-sm font-semibold text-navy">{siteConfig.siteName}</span>
            </div>
            <p className="text-sm text-text-secondary">{legalEntity.name}</p>
            <p className="text-sm text-text-secondary">
              ИНН {legalEntity.inn} · ОГРН {legalEntity.ogrn}
            </p>
            <div className="flex flex-col gap-1 text-sm text-text-secondary sm:flex-row sm:gap-4">
              <a href={legalEntity.phoneHref} className="focus-ring rounded-button hover:text-primary">
                {legalEntity.phone}
              </a>
              <a
                href={`mailto:${legalEntity.email}`}
                className="focus-ring rounded-button hover:text-primary"
              >
                {legalEntity.email}
              </a>
            </div>
          </div>

          <nav
            aria-label="Юридическая информация"
            className="flex flex-col gap-2 text-sm text-text-secondary md:items-end"
          >
            <Link href={links.privacyPolicy} className="focus-ring rounded-button hover:text-primary">
              {linkLabels.privacyPolicy}
            </Link>
            <Link
              href={links.personalDataConsent}
              className="focus-ring rounded-button hover:text-primary"
            >
              {linkLabels.personalDataConsent}
            </Link>
            <Link
              href={links.advertisingConsent}
              className="focus-ring rounded-button hover:text-primary"
            >
              {linkLabels.advertisingConsent}
            </Link>
          </nav>
        </div>

        <p className="mt-8 border-t border-border pt-6 text-xs text-text-secondary">
          © {year} {legalEntity.name}. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
