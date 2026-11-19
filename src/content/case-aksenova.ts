/**
 * Кейс: адвокат Аксёнова Анита Георгиевна.
 *
 * Все числа — подтверждённые заказчиком данные за ОДИН отчётный месяц.
 * Правила (см. ТЗ, раздел 2):
 *  - 27 — целевые обращения, НЕ клиенты и НЕ договоры;
 *  - 545 000 ₽ — выручка, НЕ прибыль;
 *  - не публиковать CPL/CAC/ROI/ROAS, пока нет данных по атрибуции;
 *  - формулировка «за один месяц», а не «за первый месяц»;
 *  - консультации по продажам НЕ приписывать этому кейсу.
 */

export type CaseAsset = {
  /** Путь в /public. null — материал ещё не получен / не согласован («asset pending»). */
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
};

export const caseAksenova = {
  id: "aksenova",
  lawyerName: "Аксёнова Анита Георгиевна",
  lawyerShort: "Анита Аксёнова",
  lawyerGenitive: "адвоката Аксёновой",
  siteUrl: "https://адвокат-аксенова.рф/",
  siteLabel: "адвокат-аксенова.рф",
  period: "один отчётный месяц",

  funnel: {
    visitors: 317,
    leads: 27,
    contracts: 5,
    criminalContracts: 3,
  },
  finance: {
    revenue: 545_000,
    adSpend: 57_000,
  },

  /** Выполненные работы (подтверждены). Консультации по продажам — НЕ входят. */
  works: [
    {
      id: "site",
      title: "Разработали сайт адвоката",
      text: "Структура услуг, доверительные элементы, формы обращения, мобильная адаптация.",
    },
    {
      id: "ads",
      title: "Запустили рекламу",
      text: "Работа со спросом по юридическим направлениям и контроль обращений.",
    },
    {
      id: "articles",
      title: "Подготовили экспертные статьи",
      text: "Ответы на вопросы потенциальных доверителей, развитие поискового присутствия.",
    },
    {
      id: "social",
      title: "Создали контент и продвигали соцсети",
      text: "Раскрытие экспертизы и регулярное присутствие в информационном поле.",
    },
  ],

  /**
   * Реальные материалы. Заполнять ТОЛЬКО разрешёнными к публикации, обезличенными файлами.
   * Пока src === null, в интерфейсе показывается аккуратный плейсхолдер, а не «скриншот».
   */
  assets: {
    siteDesktop: { src: null, alt: "Главная страница сайта адвоката Аксёновой, версия для компьютера" },
    siteMobile: { src: null, alt: "Сайт адвоката Аксёновой на мобильном устройстве" },
    analytics: { src: null, alt: "Обезличенный отчёт веб-аналитики за отчётный месяц" },
    articles: { src: null, alt: "Пример экспертной статьи на сайте адвоката" },
    social: { src: null, alt: "Пример публикации в социальных сетях адвоката" },
  } satisfies Record<string, CaseAsset>,
} as const;

/* ---------- Производные показатели (разрешены ТЗ) ---------- */

const pct = (part: number, total: number) => (part / total) * 100;

/** Формат процента по-русски: 8,5% */
export const formatPercent = (value: number, digits = 1) =>
  `${value.toFixed(digits).replace(".", ",")}%`;

/** Формат числа с неразрывными пробелами: 545 000 */
export const formatNumber = (value: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value).replace(/\s/g, " ");

export const formatRub = (value: number) => `${formatNumber(value)} ₽`;

const { visitors, leads, contracts } = caseAksenova.funnel;

export const caseMetrics = {
  /** 27 / 317 = 8,52% → 8,5% */
  visitorToLead: formatPercent(pct(leads, visitors)),
  /** 5 / 27 = 18,52% → 18,5% */
  leadToContract: formatPercent(pct(contracts, leads)),
  /** 5 / 317 = 1,58% → 1,6% */
  visitorToContract: formatPercent(pct(contracts, visitors)),
  visitorToLeadRaw: pct(leads, visitors),
  visitorToContractRaw: pct(contracts, visitors),
};
