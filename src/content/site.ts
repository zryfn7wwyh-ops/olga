/**
 * Сведения о компании. PRODUCTION-БЛОКЕР: название, логотип, контакты и реквизиты
 * не предоставлены заказчиком. Пока `confirmed: false`, на странице не выводятся
 * контакты и структурированные данные Organization.
 */
export type Palette = "graphite" | "emerald" | "emerald-sand";

export const company = {
  confirmed: false,
  /**
   * Цветовая палитра сайта: «emerald» — изумруд (выбрана заказчиком),
   * «emerald-sand» — изумруд на угле и песке, «graphite» — графит и синий из дизайн-ТЗ.
   */
  palette: "emerald" as Palette,
  /** Рабочее название до утверждения бренда. */
  brand: "Студия веб-разработки",
  shortBrand: "Веб-студия",
  contacts: {
    phone: null as string | null,
    email: null as string | null,
    address: null as string | null,
  },
  requisites: null as string | null,
};

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const seo = {
  title: "Создание сайтов для бизнеса — предварительный расчёт стоимости",
  description:
    "Разработка лендингов, корпоративных сайтов и каталогов: адаптивная вёрстка, SEO-основа, корректные формы заявок. Получите предварительный расчёт стоимости под вашу задачу.",
};

export const nav = [
  { href: "#formats", label: "Виды сайтов" },
  { href: "#approach", label: "Подход" },
  { href: "#steps", label: "Этапы" },
  { href: "#faq", label: "Вопросы" },
] as const;
