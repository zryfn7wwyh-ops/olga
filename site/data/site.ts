/**
 * Глобальные настройки сайта.
 * Всё, что может меняться без участия разработчика, вынесено сюда и в соседние data-файлы.
 */
export const site = {
  url: "https://pudovkinanton.ru",
  name: "Антон Пудовкин",
  role: "Арбитражный управляющий",
  monogram: "AP",
  title:
    "Антон Пудовкин — арбитражный управляющий | Банкротство, торги, сложные активы",
  description:
    "Арбитражный управляющий Антон Пудовкин. Сопровождение сложных процедур банкротства, торгов, оценки и реализации имущества. Работа со сложными и залоговыми активами.",
  /** Путь к направлению «Банкротство физических лиц». */
  bankruptcyUrl: "/bankrotstvo",
  /**
   * Показывать ли на странице пометки «требует замены» у placeholder-блоков.
   * Перед публикацией — false (или заменить контент).
   */
  showPlaceholderMarks: true,
  analytics: {
    /** ID счётчика Яндекс Метрики. null — события только логируются в консоль. */
    yandexMetrikaId: null as number | null,
  },
  legal: {
    privacyUrl: "/privacy",
    personalDataUrl: "/personal-data",
    cookieUrl: "/cookie",
    /** Профессиональные реквизиты (ИНН, рег. номер в реестре, СРО). Пусто — требуется от заказчика. */
    requisites: [] as { label: string; value: string }[],
  },
} as const;

export type NavItem = { id: string; label: string };

export const navigation: NavItem[] = [
  { id: "expertise", label: "Экспертиза" },
  { id: "about", label: "Об Антоне" },
  { id: "process", label: "Как работаем" },
  { id: "cases", label: "Кейсы" },
  { id: "team", label: "Команда" },
  { id: "reviews", label: "Отзывы" },
  { id: "faq", label: "FAQ" },
  { id: "contacts", label: "Контакты" },
];
