import { legal } from "@/content/legal";
import { company, nav } from "@/content/site";
import s from "./layout.module.css";

export function Footer() {
  const { phone, email, address } = company.contacts;
  const hasContacts = Boolean(phone || email || address);
  return (
    <footer className={s.footer}>
      <div className="container">
        <div className={s.footerGrid}>
          <div>
            <p className={s.brand}>
              <span className={s.mark} aria-hidden="true" />
              {company.brand}
            </p>
            <p className={s.about}>Проектирование и разработка лендингов, корпоративных сайтов и каталогов.</p>
          </div>

          <nav aria-label="Разделы страницы">
            <p className={`mono ${s.colTitle}`}>Разделы</p>
            {nav.map((item) => (
              <a key={item.href} className={s.footerLink} href={item.href}>
                {item.label}
              </a>
            ))}
            <a className={s.footerLink} href="#brief">
              Подробный бриф
            </a>
          </nav>

          <div>
            <p className={`mono ${s.colTitle}`}>Контакты и документы</p>
            {hasContacts ? (
              <div>
                {phone && (
                  <a className={s.footerLink} href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
                    {phone}
                  </a>
                )}
                {email && (
                  <a className={s.footerLink} href={`mailto:${email}`}>
                    {email}
                  </a>
                )}
                {address && <p className={s.contactsNote}>{address}</p>}
              </div>
            ) : (
              // PRODUCTION-БЛОКЕР: контакты не предоставлены заказчиком.
              <p className={s.contactsNote}>
                <span className={`mono ${s.pending}`}>Ожидает утверждения</span>
                Контакты публикуются после утверждения заказчиком. Связаться можно через формы на странице.
              </p>
            )}
            <div className={s.docs}>
              <a className={s.footerLink} href={legal.policyHref}>
                Политика обработки персональных данных
              </a>
              <a className={s.footerLink} href={legal.consentHref}>
                Согласие на обработку персональных данных
              </a>
            </div>
            {company.requisites && <p className={s.contactsNote}>{company.requisites}</p>}
          </div>
        </div>
        <div className={s.footerBottom}>
          <span>
            © {new Date().getFullYear()} {company.brand}
          </span>
          <a href="#top">Наверх</a>
        </div>
      </div>
    </footer>
  );
}
