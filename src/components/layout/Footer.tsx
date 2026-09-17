import Link from "next/link";
import { siteConfig } from "@/config/site";
import { landingContent } from "@/content/landing";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  const year = new Date().getFullYear();
  const { legalEntity, links } = siteConfig;
  const { linkLabels } = landingContent.footer;

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-container px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2">
            <Logo variant="markWithLabel" theme="light" size={28} />
            <p className="text-base font-medium text-text-secondary">{legalEntity.name}</p>
            <p className="text-base font-medium text-text-secondary">
              ИНН {legalEntity.inn} · ОГРН {legalEntity.ogrn}
            </p>
            <div className="flex flex-col gap-1 text-base font-medium text-text-secondary sm:flex-row sm:gap-4">
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
            className="flex flex-col gap-2 text-base font-medium text-text-secondary md:items-end"
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

        <p className="mt-8 border-t border-border pt-6 text-sm font-medium text-text-secondary">
          © {year} {legalEntity.name}. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
