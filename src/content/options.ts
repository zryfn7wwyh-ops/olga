import type { DataCategory, Scope, SiteType } from "@/lib/leads/schema";

export const HERO_SITE_TYPES: { value: Exclude<SiteType, "other">; label: string }[] = [
  { value: "landing", label: "Лендинг" },
  { value: "corporate", label: "Корпоративный сайт" },
  { value: "catalog", label: "Сайт-каталог" },
  { value: "unknown", label: "Пока не знаю" },
];

export const BRIEF_SITE_TYPES: { value: SiteType; label: string }[] = [
  { value: "unknown", label: "Пока не знаю" },
  { value: "landing", label: "Лендинг" },
  { value: "corporate", label: "Корпоративный сайт" },
  { value: "catalog", label: "Сайт-каталог" },
  { value: "other", label: "Иной формат" },
];

export const SCOPE_OPTIONS: { value: Scope; label: string }[] = [
  { value: "unknown", label: "Пока не знаю" },
  { value: "one_page", label: "Одна страница" },
  { value: "up_to_10", label: "До 10 страниц" },
  { value: "over_10", label: "Более 10 страниц" },
];

export const DATA_CATEGORY_OPTIONS: { value: DataCategory; label: string }[] = [
  { value: "form_requests", label: "Заявки из формы" },
  { value: "user_registration", label: "Регистрации пользователей" },
  { value: "orders", label: "Заказы" },
  { value: "unknown", label: "Пока не знаю" },
];

export const SITE_TYPE_LABEL: Record<SiteType, string> = {
  unknown: "Формат подберём вместе",
  landing: "Лендинг",
  corporate: "Корпоративный сайт",
  catalog: "Сайт-каталог",
  other: "Иной формат",
};
