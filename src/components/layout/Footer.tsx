import { site } from "@/content/site";
import { ContactLinks } from "./ContactLinks";
import { CurrentYear } from "./CurrentYear";

export function Footer() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const doc = (href: string) => (href.startsWith("/") ? `${base}${href}` : href);
  return (
    <footer className="on-dark border-t border-[var(--on-dark-stroke)] bg-navy-deep text-ivory">
      <div className="container-lp grid gap-10 py-12 md:grid-cols-12 md:py-14">
        <div className="md:col-span-5">
          <p className="font-serif text-[24px] font-semibold">{site.name}</p>
          <p className="mt-1 text-[15px] text-[var(--on-dark-muted)]">{site.tagline}</p>
          {site.legalEntity && <p className="mt-4 text-[14px] text-[var(--on-dark-muted)]">{site.legalEntity}</p>}
        </div>
        <nav aria-label="Навигация в подвале" className="md:col-span-3">
          <ul className="space-y-1">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="inline-flex min-h-10 items-center text-[16px] text-ivory/80 transition-colors hover:text-ivory">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-3 text-[16px] md:col-span-4">
          <ContactLinks />
          <p>
            <a href={doc(site.legal.privacyHref)} className="link-underline text-ivory/80 hover:text-ivory">
              Политика обработки персональных данных
            </a>
          </p>
          <p>
            <a href={doc(site.legal.consentHref)} className="link-underline text-ivory/80 hover:text-ivory">
              Согласие на обработку персональных данных
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--on-dark-stroke)]">
        <div className="container-lp flex flex-col gap-2 py-6 text-[14px] text-[var(--on-dark-muted)] sm:flex-row sm:justify-between">
          <p>
            © <CurrentYear /> {site.name}
          </p>
          <p>Результаты кейса относятся к конкретному проекту и не являются гарантией.{site.mode === "preview" ? " · Предпросмотр" : ""}</p>
        </div>
      </div>
    </footer>
  );
}
