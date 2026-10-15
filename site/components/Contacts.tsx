import { contacts, routeUrl } from "@/data/contacts";
import { CTAButton } from "./ContactModal";
import { IconMail, IconPhone, IconRoute, IconTelegram } from "./Icons";
import { YandexMap } from "./Map";
import { TrackedLink } from "./TrackedLink";

export function Contacts() {
  return (
    <section id="contacts" aria-labelledby="contacts-title" className="on-dark section-y relative overflow-hidden bg-ink text-ivory">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 hidden lg:block" />
      <div className="container-x relative">
        <span className="eyebrow">11 / Контакты</span>
        <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 id="contacts-title" className="h-section">
              Есть сложная процедура? Обсудим её&nbsp;напрямую.
            </h2>
            <TrackedLink
              goal="phone_click"
              params={{ placement: "contacts" }}
              href={contacts.phone.href}
              className="group mt-12 inline-block"
            >
              <span className="tech block text-mist/80">Телефон Антона Пудовкина</span>
              <span className="h-display mt-3 block whitespace-nowrap text-[34px] tabular transition-colors duration-200 group-hover:text-mist xs:text-[38px] sm:text-[60px] xl:text-[76px]">
                {contacts.phone.display}
              </span>
              <span aria-hidden className="mt-3 block h-px w-full origin-left scale-x-[0.3] bg-bronze transition-transform duration-300 ease-[var(--ease-premium)] group-hover:scale-x-100" />
            </TrackedLink>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <TrackedLink goal="phone_click" params={{ placement: "contacts_btn" }} href={contacts.phone.href} className="btn btn-primary">
                <IconPhone className="h-[18px] w-[18px]" /> Позвонить
              </TrackedLink>
              {contacts.telegram ? (
                <TrackedLink goal="telegram_click" params={{ placement: "contacts" }} href={contacts.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark">
                  <IconTelegram className="h-[18px] w-[18px]" /> Написать
                </TrackedLink>
              ) : (
                <TrackedLink goal="email_click" params={{ placement: "contacts" }} href={`mailto:${contacts.email}`} className="btn btn-ghost-dark">
                  <IconMail className="h-[18px] w-[18px]" /> Написать
                </TrackedLink>
              )}
              <TrackedLink goal="route_click" params={{ office: contacts.offices[0].id }} href={routeUrl(contacts.offices[0])} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark">
                <IconRoute className="h-[18px] w-[18px]" /> Построить маршрут
              </TrackedLink>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pt-3">
            <dl className="border-t border-slate-2">
              <div className="grid gap-1 border-b border-slate-2 py-6 sm:grid-cols-[120px_1fr]">
                <dt className="tech pt-1 text-mist/70">E-mail</dt>
                <dd>
                  <TrackedLink goal="email_click" params={{ placement: "contacts" }} href={`mailto:${contacts.email}`} className="link inline-flex min-h-11 items-center text-[18px]">
                    {contacts.email}
                  </TrackedLink>
                </dd>
              </div>
              {contacts.offices.map((o) => (
                <div key={o.id} className="grid gap-1 border-b border-slate-2 py-6 sm:grid-cols-[120px_1fr]">
                  <dt className="tech pt-1 text-mist/70">{o.city}</dt>
                  <dd>
                    <p className="text-[18px]">{o.address}</p>
                    <TrackedLink goal="route_click" params={{ office: o.id }} href={routeUrl(o)} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center gap-2 text-[14px]">
                      Маршрут <span className="arrow" aria-hidden>→</span>
                    </TrackedLink>
                  </dd>
                </div>
              ))}
              <div className="grid gap-1 py-6 sm:grid-cols-[120px_1fr]">
                <dt className="tech pt-1 text-mist/70">География</dt>
                <dd className="text-[16px] text-mist">Проекты сопровождаются по всей России, независимо от региона.</dd>
              </div>
            </dl>
            <CTAButton placement="contacts" className="btn btn-light mt-4 w-full sm:w-auto" />
          </div>
        </div>
        <YandexMap />
      </div>
    </section>
  );
}
