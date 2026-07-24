import { contacts } from "@/data/contacts";
import { Container } from "@/components/ui/Container";

const NAV_LINKS = [
  { href: "#services", label: "Услуги" },
  { href: "#about", label: "Об адвокате" },
  { href: "#process", label: "Как проходит работа" },
  { href: "#cases", label: "Кейсы" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#prices", label: "Стоимость" },
  { href: "#contacts", label: "Контакты" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Политика конфиденциальности" },
  { href: "/privacy#personal-data", label: "Обработка персональных данных" },
  { href: "/privacy#cookies", label: "Использование cookie" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-emerald text-paper">
      <Container className="py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-bronze-soft/60 font-display text-lg">
              АА
            </span>
            <p className="mt-4 font-display text-lg font-semibold">{contacts.fullName}</p>
            <p className="mt-1 text-sm text-paper/70">
              Рег. № {contacts.regNumber} · {contacts.chamber}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-bronze-soft">
              Контакты
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              <li>
                <a href={`tel:${contacts.phone}`} className="hover:text-paper">
                  {contacts.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${contacts.email}`} className="hover:text-paper">
                  {contacts.email}
                </a>
              </li>
              <li>{contacts.address}</li>
              <li>{contacts.receptionHours}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-bronze-soft">
              Разделы сайта
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-paper">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-bronze-soft">
              Документы
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-paper">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-paper/15 pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-paper/60 sm:text-sm">
            Информация на сайте носит ознакомительный характер. Возможность оказания помощи и
            оценка перспектив определяются после изучения обстоятельств конкретного дела.
          </p>
          <p className="mt-4 text-xs text-paper/50">
            © {year} {contacts.fullName}. Все права защищены.
          </p>
        </div>
      </Container>
    </footer>
  );
}
