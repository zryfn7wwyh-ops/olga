/**
 * ЕДИНЫЙ ФАЙЛ ЗАМЕНЯЕМЫХ МАТЕРИАЛОВ.
 *
 * Каждый элемент: { value, asset, isPlaceholder, note }.
 *  - value          — текст / значение (null — нет данных);
 *  - asset          — путь к файлу в /public (null — нет файла);
 *  - isPlaceholder  — true, пока это демонстрационная заглушка;
 *  - note           — что нужно предоставить для замены.
 *
 * Режимы (NEXT_PUBLIC_SITE_MODE):
 *  - preview     — заглушки видны с пометкой «ДЕМО / ЗАМЕНИТЬ», страница закрыта от индексации;
 *  - production  — заглушки СКРЫВАЮТСЯ (не публикуем вымышленные лица, отзывы, скриншоты, реквизиты).
 *
 * Как заменить: положите реальный файл в /public/case-aksenova/ (или /public/team/),
 * укажите путь в asset, заполните value и поставьте isPlaceholder: false.
 * Вёрстку менять не нужно.
 */

export type Replaceable<T> = {
  value: T;
  asset: string | null;
  isPlaceholder: boolean;
  note: string;
  /** Пропорции области изображения (для заглушки и реального файла одинаковые). */
  ratio?: `${number}/${number}`;
  /** cover — заполнить область (скриншоты страниц), contain — вписать целиком (макеты, схемы). */
  fit?: "cover" | "contain";
  alt?: string;
};

const env = (key: string): string | null => {
  const v = process.env[key];
  return v && v.trim() !== "" ? v.trim() : null;
};

export type SiteMode = "preview" | "production";
export const SITE_MODE: SiteMode = process.env.NEXT_PUBLIC_SITE_MODE === "production" ? "production" : "preview";
export const isPreview = SITE_MODE === "preview";

/** Показывать ли элемент: реальные материалы — всегда, заглушки — только в preview. */
export function isVisible<T>(item: Replaceable<T>): boolean {
  return !item.isPlaceholder || isPreview;
}

export const siteContent = {
  /* ───────────── Изображения кейса ───────────── */

  // TODO REPLACE: скриншот главной страницы сайта адвоката (desktop, 1600×1000 или 16:10)
  heroCaseImage: {
    value: "Сайт адвоката Аксёновой",
    asset: "/placeholders/hero-case-site.svg",
    isPlaceholder: true,
    note: "Скриншот первого экрана сайта адвокат-аксенова.рф, desktop, 16:10, ≥1600 px по ширине, с разрешения адвоката.",
    ratio: "16/10",
    fit: "cover",
    alt: "Первый экран сайта адвоката Аксёновой",
  },
  // TODO REPLACE: сайт на ноутбуке + телефоне (16:9)
  caseWebsiteDesktop: {
    value: "Разработанный сайт",
    asset: "/placeholders/case-site-desktop.svg",
    isPlaceholder: true,
    note: "Скриншоты сайта desktop + mobile, собранные в одну композицию 16:9 (или два отдельных скриншота).",
    ratio: "16/9",
    fit: "cover",
    alt: "Сайт адвоката Аксёновой на компьютере и телефоне",
  },
  // TODO REPLACE: мобильная версия сайта (9:19.5)
  caseWebsiteMobile: {
    value: "Мобильная версия сайта",
    asset: "/placeholders/case-site-mobile.svg",
    isPlaceholder: true,
    note: "Скриншот мобильной версии сайта, 390×844 или аналогичные пропорции.",
    ratio: "9/19",
    fit: "cover",
    alt: "Мобильная версия сайта адвоката Аксёновой",
  },
  // TODO REPLACE: обезличенный скриншот структуры кампаний (без статистики, если она не согласована)
  caseAdsImage: {
    value: "Рекламные кампании",
    asset: "/placeholders/case-ads.svg",
    isPlaceholder: true,
    note: "Обезличенный скриншот структуры кампаний Яндекс Директа или схема кампаний. Показатели — только с согласия клиента.",
    ratio: "4/3",
    fit: "contain",
    alt: "Структура рекламных кампаний по юридическим направлениям",
  },
  // TODO REPLACE: скриншот опубликованной экспертной статьи
  caseArticlesImage: {
    value: "Экспертные статьи",
    asset: "/placeholders/case-articles.svg",
    isPlaceholder: true,
    note: "Скриншот 1–2 опубликованных статей с сайта адвоката, 4:3.",
    ratio: "4/3",
    fit: "cover",
    alt: "Экспертная статья на сайте адвоката",
  },
  // TODO REPLACE: публикации в соцсетях
  caseSocialImage: {
    value: "Контент для социальных сетей",
    asset: "/placeholders/case-social.svg",
    isPlaceholder: true,
    note: "Скриншоты 3–6 публикаций в социальных сетях адвоката, собранные в сетку 4:3.",
    ratio: "4/3",
    fit: "cover",
    alt: "Публикации адвоката в социальных сетях",
  },

  /* ───────────── Команда ───────────── */

  // TODO REPLACE: портрет руководителя проекта (3:4, ≥900×1200)
  teamPortrait: {
    value: "[ЗАПОЛНИТЬ: фотография руководителя проекта]",
    asset: "/placeholders/team-portrait.svg",
    isPlaceholder: true,
    note: "Реальная фотография руководителя проекта, 3:4, нейтральный фон, с согласием на публикацию.",
    ratio: "3/4",
    fit: "cover",
    alt: "Руководитель проекта",
  },
  // TODO REPLACE
  teamName: {
    value: "[ЗАПОЛНИТЬ: имя и фамилия]",
    asset: null,
    isPlaceholder: true,
    note: "Имя и фамилия руководителя проекта.",
  },
  // TODO REPLACE
  teamRole: {
    value: "[ЗАПОЛНИТЬ: должность]",
    asset: null,
    isPlaceholder: true,
    note: "Должность и роль в проекте Аксёновой (например, что именно делал).",
  },
  // TODO REPLACE: 2–3 проверяемых факта опыта
  teamFacts: {
    value: ["[ЗАПОЛНИТЬ: факт об опыте]", "[ЗАПОЛНИТЬ: второй факт об опыте]", "[ЗАПОЛНИТЬ: за что отвечал в проекте]"],
    asset: null,
    isPlaceholder: true,
    note: "2–3 коротких проверяемых факта: стаж, специализация, роль в проекте Аксёновой.",
  },
  // TODO REPLACE: видео- или текстовый отзыв адвоката о работе маркетинговой команды
  clientReview: {
    value: null as string | null,
    asset: null,
    isPlaceholder: true,
    note: "Видеоотзыв адвоката о работе подрядчика (не об адвокатской деятельности) — только с согласия и после юридической проверки. Обложка 16:9 + ссылка на видео.",
    ratio: "16/9",
    fit: "cover",
    alt: "Видеоотзыв адвоката",
  },

  /* ───────────── Данные кейса ───────────── */

  // TODO REPLACE: точный месяц/год отчётного периода
  casePeriod: {
    value: null as string | null,
    asset: null,
    isPlaceholder: true,
    note: "Название отчётного месяца (например, «март 2026»). Пока используется нейтральное «один отчётный месяц».",
  },

  /* ───────────── Контакты и юридические данные ───────────── */

  contactEmail: {
    value: env("NEXT_PUBLIC_CONTACT_EMAIL"),
    asset: null,
    isPlaceholder: !env("NEXT_PUBLIC_CONTACT_EMAIL"),
    note: "Email для связи (переменная NEXT_PUBLIC_CONTACT_EMAIL).",
  },
  contactPhone: {
    value: env("NEXT_PUBLIC_CONTACT_PHONE"),
    asset: null,
    isPlaceholder: !env("NEXT_PUBLIC_CONTACT_PHONE"),
    note: "Телефон для связи (NEXT_PUBLIC_CONTACT_PHONE).",
  },
  legalEntityDetails: {
    value: env("NEXT_PUBLIC_LEGAL_ENTITY"),
    asset: null,
    isPlaceholder: !env("NEXT_PUBLIC_LEGAL_ENTITY"),
    note: "Наименование, ИНН/ОГРН оператора персональных данных (NEXT_PUBLIC_LEGAL_ENTITY).",
  },
  crmEndpoint: {
    value: null,
    asset: null,
    isPlaceholder: true,
    note: "Подключение CRM/email/webhook — только на сервере: LEAD_DELIVERY_MODE и реквизиты в .env (см. .env.example). Ключи в клиентский код не попадают.",
  },
  privacyPolicyUrl: {
    value: env("NEXT_PUBLIC_PRIVACY_URL") ?? "/privacy",
    asset: null,
    isPlaceholder: !env("NEXT_PUBLIC_PRIVACY_URL"),
    note: "Ссылка на утверждённую политику обработки ПДн (NEXT_PUBLIC_PRIVACY_URL) или текст в src/content/legal.ts.",
  },
  consentUrl: {
    value: env("NEXT_PUBLIC_CONSENT_URL") ?? "/privacy#consent",
    asset: null,
    isPlaceholder: !env("NEXT_PUBLIC_CONSENT_URL"),
    note: "Ссылка на утверждённый текст согласия на обработку ПДн (NEXT_PUBLIC_CONSENT_URL) или текст в src/content/legal.ts.",
  },
  analyticsId: {
    value: env("NEXT_PUBLIC_YANDEX_METRIKA_ID"),
    asset: null,
    isPlaceholder: !env("NEXT_PUBLIC_YANDEX_METRIKA_ID"),
    note: "ID счётчика Яндекс Метрики (NEXT_PUBLIC_YANDEX_METRIKA_ID).",
  },
} satisfies Record<string, Replaceable<unknown>>;

export type SiteContentKey = keyof typeof siteContent;
