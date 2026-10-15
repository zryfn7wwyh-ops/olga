import { navigation, site } from "@/data/site";
import { contacts } from "@/data/contacts";
import { PlaceholderMark } from "./PlaceholderMark";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark border-t border-slate-2 bg-ink pb-28 pt-16 text-ivory md:pb-12">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-[15px] font-bold tracking-[0.2em]">АНТОН ПУДОВКИН</p>
            <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.2em] text-mist">Арбитражный управляющий</p>
            <div className="mt-6 text-[15px]">
              <a href={contacts.phone.href} className="flex min-h-11 items-center tabular hover:text-mist">
                {contacts.phone.display}
              </a>
              <a href={`mailto:${contacts.email}`} className="flex min-h-11 items-center text-mist hover:text-ivory">
                {contacts.email}
              </a>
            </div>
          </div>
          <nav aria-label="Навигация в подвале" className="lg:col-span-4">
            <ul className="grid grid-cols-2 gap-x-6 text-[15px]">
              {navigation.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="inline-flex min-h-11 items-center text-mist transition-colors duration-200 hover:text-ivory">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={site.bankruptcyUrl} className="inline-flex min-h-11 items-center text-mist transition-colors duration-200 hover:text-ivory">
                  Банкротство граждан
                </a>
              </li>
            </ul>
          </nav>
          <div className="lg:col-span-4">
            <p className="tech text-mist/70">Офисы</p>
            <ul className="mt-4 space-y-3 text-[15px] text-mist">
              {contacts.offices.map((o) => (
                <li key={o.id}>
                  <span className="text-ivory">{o.city}</span> — {o.address}
                </li>
              ))}
            </ul>
            <p className="tech mt-8 text-mist/70">Реквизиты</p>
            {site.legal.requisites.length ? (
              <ul className="mt-3 space-y-1 text-[13px] text-mist">
                {site.legal.requisites.map((r) => (
                  <li key={r.label}>
                    {r.label}: {r.value}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-mist/70">
                ИНН, рег. номер, СРО <PlaceholderMark>уточняются</PlaceholderMark>
              </p>
            )}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-slate-2 pt-8 text-[13px] text-mist/80 md:flex-row md:items-center md:justify-between">
          <p>© {year} Антон Пудовкин. Арбитражный управляющий.</p>
          <ul className="flex flex-wrap gap-x-6">
            <li><a href={site.legal.personalDataUrl} className="inline-flex min-h-11 items-center hover:text-ivory">Политика обработки персональных данных</a></li>
            <li><a href={site.legal.privacyUrl} className="inline-flex min-h-11 items-center hover:text-ivory">Политика конфиденциальности</a></li>
            <li><a href={site.legal.cookieUrl} className="inline-flex min-h-11 items-center hover:text-ivory">Cookie</a></li>
          </ul>
        </div>
        <p className="mt-6 text-[12px] text-mist/60">
          * Позиция в рейтинге приведена по данным {"регистра ФНС"}; рейтинг может изменяться.
        </p>
      </div>
    </footer>
  );
}
