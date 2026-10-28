import type { CaseItem } from "@/content/cases";
import s from "./showcase.module.css";

/**
 * Desktop + mobile превью концепта. Декоративная иллюстрация (aria-hidden):
 * смысл передаётся текстом карточки кейса.
 */
export function CasePreview({ item }: { item: CaseItem }) {
  const { Desktop, Phone } = VIEWS[item.preview];
  return (
    <div className={s.caseStageInner} aria-hidden="true">
      <div className={s.browser}>
        <div className={s.browserBar}>
          <i />
          <i />
          <i />
          <span className={s.browserUrl} />
        </div>
        <div className={s.screen}>
          <Desktop id={item.id} />
        </div>
      </div>
      <div className={s.phone}>
        <div className={s.phoneFrame}>
          <div className={s.phoneScreen}>
            <Phone />
          </div>
        </div>
      </div>
    </div>
  );
}

const Detail = ({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) => (
  <div className={className} data-motion="detail-focus" data-motion-id={`detail-${id}`}>
    {children}
  </div>
);

const Nav = ({ brand, links, cta }: { brand: string; links: string[]; cta: string }) => (
  <div className={s.nav}>
    <span className={s.logo}>
      <span className={s.logoMark} />
      {brand}
    </span>
    <span className={s.navLinks}>
      {links.map((l) => (
        <span key={l}>{l}</span>
      ))}
    </span>
    <span className={s.navBtn}>{cta}</span>
  </div>
);

const PhoneTop = ({ brand }: { brand: string }) => (
  <div className={s.pLogo}>
    {brand}
    <span className={s.pBurger} />
  </div>
);

const VIEWS = {
  landing: {
    Desktop: ({ id }: { id: string }) => (
      <>
        <Nav brand="Инженерные системы" links={["Услуги", "Этапы", "Вопросы"]} cta="Рассчитать" />
        <div className={s.mHero}>
          <div>
            <p className={s.mH}>Монтаж отопления и вентиляции для коммерческих объектов</p>
            <p className={s.mP}>Проектирование, подбор оборудования и монтаж под ключ. Смету готовим по данным объекта.</p>
            <ul className={s.mList}>
              <li>Выезд инженера на объект</li>
              <li>Смета с перечнем оборудования</li>
              <li>Исполнительная документация</li>
            </ul>
          </div>
          <Detail id={`${id}-form`} className={s.mForm}>
            <span className={s.mFormTitle}>Рассчитать смету</span>
            <span className={s.mInput}>Площадь объекта, м²</span>
            <span className={s.mInput}>Телефон</span>
            <span className={s.mBtn}>Получить смету</span>
          </Detail>
        </div>
      </>
    ),
    Phone: () => (
      <>
        <PhoneTop brand="Инженерные системы" />
        <p className={s.pH}>Монтаж отопления и вентиляции</p>
        <span className={s.pInput}>Площадь объекта, м²</span>
        <span className={s.pInput}>Телефон</span>
        <span className={s.pBtn}>Получить смету</span>
      </>
    ),
  },
  corporate: {
    Desktop: ({ id }: { id: string }) => (
      <>
        <Nav brand="Консалтинг" links={["Услуги", "Отрасли", "О компании", "Контакты"]} cta="Обсудить задачу" />
        <div className={s.mHero} style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <p className={s.mH} style={{ maxWidth: "70%" }}>
              Управленческий консалтинг для производственных компаний
            </p>
            <p className={s.mP} style={{ maxWidth: "60%" }}>
              Помогаем выстроить процессы, планирование и финансовый контроль — от диагностики до внедрения.
            </p>
          </div>
        </div>
        <Detail id={`${id}-cards`} className={s.mCards}>
          {[
            ["01", "Стратегия", "Цели, приоритеты и план развития"],
            ["02", "Операции", "Процессы, роли и регламенты"],
            ["03", "Финансы", "Бюджетирование и управленческий учёт"],
          ].map(([n, t, d]) => (
            <div key={n} className={s.mCard}>
              <span className={s.mCardNum}>{n}</span>
              <span className={s.mCardTitle}>{t}</span>
              <span className={s.mP} style={{ marginTop: 0 }}>
                {d}
              </span>
            </div>
          ))}
        </Detail>
        <div className={s.mBand}>
          <p className={s.mH} style={{ fontSize: "2.4cqw" }}>
            Обсудим задачу вашей компании
          </p>
          <p className={s.mP}>Оставьте контакт — договоримся о встрече.</p>
        </div>
      </>
    ),
    Phone: () => (
      <>
        <PhoneTop brand="Консалтинг" />
        <p className={s.pH}>Управленческий консалтинг</p>
        <div className={s.pCard}>
          <b>Стратегия</b>
          <span style={{ color: "var(--color-muted)" }}>Цели и план развития</span>
        </div>
        <div className={s.pCard}>
          <b>Операции</b>
          <span style={{ color: "var(--color-muted)" }}>Процессы и регламенты</span>
        </div>
        <span className={s.pBtn}>Обсудить задачу</span>
      </>
    ),
  },
  catalog: {
    Desktop: ({ id }: { id: string }) => (
      <>
        <Nav brand="Каталог оборудования" links={["Каталог", "Доставка", "Сервис"]} cta="Запросить КП" />
        <div className={s.catalog}>
          <Detail id={`${id}-filters`} className={s.filters}>
            <span className={s.filterTitle}>Категории</span>
            {[
              ["Компрессоры", true],
              ["Насосы", false],
              ["Генераторы", false],
              ["Сварочное", false],
            ].map(([l, on]) => (
              <span key={l as string} className={s.filter} data-on={on}>
                <i />
                {l}
              </span>
            ))}
            <span className={s.filterTitle} style={{ marginTop: "1.6cqw" }}>
              Привод
            </span>
            <span className={s.filter} data-on="true">
              <i />
              Электрический
            </span>
            <span className={s.filter}>
              <i />
              Дизельный
            </span>
          </Detail>
          <div className={s.products}>
            {["Компрессор винтовой", "Компрессор поршневой", "Осушитель воздуха", "Ресивер", "Компрессор безмасляный", "Фильтр магистральный"].map(
              (n) => (
                <div key={n} className={s.product}>
                  <span className={s.productImg}>
                    <GearIcon />
                  </span>
                  <span className={s.productName}>{n}</span>
                  <span className={s.productLink}>Запросить цену →</span>
                </div>
              ),
            )}
          </div>
        </div>
      </>
    ),
    Phone: () => (
      <>
        <PhoneTop brand="Каталог" />
        <span className={s.pInput}>Поиск по каталогу</span>
        {["Компрессор винтовой", "Осушитель воздуха"].map((n) => (
          <div key={n} className={s.pCard}>
            <span className={s.productImg} style={{ borderRadius: "3cqw" }}>
              <GearIcon />
            </span>
            <b>{n}</b>
            <span style={{ color: "var(--color-accent)", fontWeight: 600 }}>Запросить цену →</span>
          </div>
        ))}
      </>
    ),
  },
} satisfies Record<CaseItem["preview"], { Desktop: (p: { id: string }) => React.ReactNode; Phone: () => React.ReactNode }>;

function GearIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="14" width="36" height="22" rx="4" />
      <circle cx="18" cy="25" r="6" />
      <path d="M30 20h8M30 25h8M30 30h5M10 36v4M38 36v4" />
    </svg>
  );
}
