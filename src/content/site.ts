/**
 * Глобальная конфигурация: бренд, навигация, SEO, режим сайта.
 * Контакты, реквизиты, ссылки на документы и все заменяемые материалы — в siteContent.ts.
 */
import { SITE_MODE, siteContent } from "./siteContent";

export type NavItem = { label: string; href: `#${string}` };

const env = (key: string): string | null => {
  const value = process.env[key];
  return value && value.trim() !== "" ? value.trim() : null;
};

export const site = {
  mode: SITE_MODE,
  /** Рабочее название бренда. TODO REPLACE: утверждённое название / логотип. */
  name: env("NEXT_PUBLIC_SITE_NAME") ?? "Legal Performance",
  tagline: "Маркетинг для юристов и адвокатов",
  /** Путь к файлу логотипа в /public. null — текстовый знак. */
  logoPath: null as string | null,

  /** Канонический адрес без завершающего слеша. null — canonical/sitemap не выводятся. */
  url: env("NEXT_PUBLIC_SITE_URL"),
  /** Индексация только в production и только при заданном домене. Preview всегда noindex, nofollow. */
  indexing: SITE_MODE === "production" && Boolean(env("NEXT_PUBLIC_SITE_URL")),

  contacts: {
    phone: siteContent.contactPhone.value,
    email: siteContent.contactEmail.value,
    messengerUrl: env("NEXT_PUBLIC_CONTACT_MESSENGER_URL"),
    messengerLabel: env("NEXT_PUBLIC_CONTACT_MESSENGER_LABEL") ?? "Написать в мессенджер",
  },
  legalEntity: siteContent.legalEntityDetails.value,

  nav: [
    { label: "Кейс", href: "#case" },
    { label: "Система", href: "#system" },
    { label: "Условия", href: "#payment" },
    { label: "Команда", href: "#team" },
    { label: "FAQ", href: "#faq" },
  ] satisfies NavItem[],

  headerCta: "Обсудить продвижение",

  seo: {
    title: "Маркетинг для юристов и адвокатов с оплатой за результат | Legal Performance",
    description:
      "Сайты, реклама, личный бренд адвоката и консультации по продажам в одном пакете. Кейс: 27 целевых обращений, 5 договоров и 545 000 ₽ выручки за месяц.",
    /** OG-обложка. В preview — демонстрационная; для production укажите реальную (1200×630). */
    ogImage: (SITE_MODE === "preview" ? "/placeholders/og-cover.png" : env("NEXT_PUBLIC_OG_IMAGE")) as string | null,
    faqJsonLd: false,
  },

  payment: {
    approvedNote: "Условия и показатели результата согласовываем до старта работ.",
  },

  legal: {
    privacyHref: siteContent.privacyPolicyUrl.value,
    consentHref: siteContent.consentUrl.value,
    /** true — тексты политики и согласия утверждены (src/content/legal.ts или внешние ссылки). TODO REPLACE */
    documentsApproved: env("LEGAL_DOCUMENTS_APPROVED") === "true",
  },
} as const;

export type Site = typeof site;
