import { legal } from "@/content/legal";
import { company, nav } from "@/content/site";
import s from "./layout.module.css";

export function Footer() {
  const { phone, email, address } = company.contacts;
  const hasContacts = Boolean(phone || email || address);
  return (
    <footer className={s.footer}>
      <div className={`container ${s.footerGrid}`}>
        <div className={s.footerCol}>
          <span className={s.logo}>
            <span className={s.logoMark} aria-hidden="true" />
            {company.brand}
          </span>
          <p className={s.footerMuted}>Проектирование и разработка лендингов, корпоративных сайтов и каталогов.</p>
        </div>

        <nav className={s.footerCol} aria-label="Разделы страницы">
          <p className={s.footerTitle}>Разделы</p>
          <ul className={s.footerLinks}>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
            <li>
              <a href="#brief">Подробный бриф</a>
            </li>
          </ul>
        </nav>

        <div className={s.footerCol}>
          <p className={s.footerTitle}>Контакты и документы</p>
          {hasContacts ? (
            <ul className={s.footerLinks}>
              {phone && (
                <li>
                  <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              )}
              {address && <li className={s.footerMuted}>{address}</li>}
            </ul>
          ) : (
            // PRODUCTION-БЛОКЕР: контакты не предоставлены заказчиком.
            <p className={s.footerMuted}>
              <span className={s.pending}>Ожидает утверждения</span> Контакты публикуются после утверждения заказчиком. Связаться
              можно через формы на странице.
            </p>
          )}
          <ul className={s.footerLinks}>
            <li>
              <a href={legal.policyHref}>Политика обработки персональных данных</a>
            </li>
            <li>
              <a href={legal.consentHref}>Согласие на обработку персональных данных</a>
            </li>
          </ul>
          {company.requisites && <p className={s.footerMuted}>{company.requisites}</p>}
        </div>
      </div>
      <div className={`container`}>
        <div className={s.footerBottom}>
          <span>© {new Date().getFullYear()} {company.brand}</span>
          <a href="#top" style={{ color: "inherit" }}>
            Наверх
          </a>
        </div>
      </div>
    </footer>
  );
}
