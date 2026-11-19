/**
 * Глобальная конфигурация сайта: бренд, контакты, навигация, SEO, модель оплаты.
 *
 * ВАЖНО: значения со статусом null не выводятся в интерфейс.
 * Не подставляйте сюда выдуманные телефоны, адреса и реквизиты —
 * заполняйте только реальными, переданными заказчиком данными.
 */

export type NavItem = { label: string; href: `#${string}` };

const env = (key: string): string | null => {
  const value = process.env[key];
  return value && value.trim() !== "" ? value.trim() : null;
};

export const site = {
  /** Рабочее название бренда. TODO: заменить на утверждённое название / логотип. */
  name: env("NEXT_PUBLIC_SITE_NAME") ?? "Legal Performance",
  /** Короткий дескриптор под логотипом. */
  tagline: "Маркетинг для юристов и адвокатов",
  /** Путь к файлу логотипа в /public (например, "/images/logo.svg"). null — текстовый логотип. */
  logoPath: null as string | null,

  /** Канонический адрес (без завершающего слеша). null — canonical/sitemap не выводятся. */
  url: env("NEXT_PUBLIC_SITE_URL"),
  /** Разрешить индексацию поисковыми системами. Включать только после утверждения домена. */
  indexing: env("NEXT_PUBLIC_SITE_INDEXING") === "true",

  contacts: {
    /** Телефон в отображаемом формате. null — не выводится. */
    phone: env("NEXT_PUBLIC_CONTACT_PHONE"),
    email: env("NEXT_PUBLIC_CONTACT_EMAIL"),
    /** Ссылка на мессенджер (Telegram / WhatsApp / MAX). */
    messengerUrl: env("NEXT_PUBLIC_CONTACT_MESSENGER_URL"),
    messengerLabel: env("NEXT_PUBLIC_CONTACT_MESSENGER_LABEL") ?? "Написать в мессенджер",
  },

  /** Юридическое лицо / ИП — оператор персональных данных. null — реквизиты не выводятся. */
  legalEntity: env("NEXT_PUBLIC_LEGAL_ENTITY"),

  nav: [
    { label: "Кейс", href: "#case" },
    { label: "Подход", href: "#approach" },
    { label: "Услуги", href: "#services" },
    { label: "Условия", href: "#payment" },
    { label: "FAQ", href: "#faq" },
  ] satisfies NavItem[],

  headerCta: "Обсудить продвижение",

  seo: {
    title: "Маркетинг для юристов и адвокатов с оплатой за результат",
    description:
      "Маркетинг для юристов: сайты, реклама, SEO и консультации по продажам. Кейс: 27 целевых обращений, 5 договоров и 545 000 ₽ выручки за месяц.",
    /** Путь к OG-изображению в /public. null — не выводится, пока исходник не подготовлен. */
    ogImage: null as string | null,
    /** FAQPage JSON-LD. Включать только после проверки соответствия правилам поисковых систем. */
    faqJsonLd: false,
  },

  /**
   * Модель оплаты. Пока схема не утверждена — используется безопасная формулировка из ТЗ.
   * Не добавлять «только за договоры», «без предоплаты», «гарантия» без утверждённого договора.
   */
  payment: {
    approvedNote: "Условия и показатели результата согласовываем до старта работ.",
    disclaimer:
      "Конкретная модель оплаты, фиксированная и переменная части обсуждаются индивидуально и закрепляются в договоре.",
  },

  /** Документы. Ссылки ведут на страницу /privacy (тексты — после юридического согласования). */
  legal: {
    privacyHref: "/privacy",
    consentHref: "/privacy#consent",
    /** true — тексты политики и согласия утверждены и размещены в content/legal.ts. */
    documentsApproved: false,
  },
} as const;

export type Site = typeof site;
