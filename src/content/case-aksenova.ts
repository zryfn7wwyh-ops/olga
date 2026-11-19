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

  /**
   * Выполненные работы (подтверждены). Консультации по продажам — НЕ входят.
   * media — ключ изображения в siteContent.ts (там же заглушки и замена).
   */
  works: [
    {
      id: "site",
      media: "caseWebsiteDesktop",
      title: "Сайт",
      text: "Структура услуг, формы обращения на каждой странице, мобильная версия.",
    },
    {
      id: "ads",
      media: "caseAdsImage",
      title: "Реклама",
      text: "Кампании по юридическим направлениям и контроль поступающих обращений.",
    },
    {
      id: "articles",
      media: "caseArticlesImage",
      title: "Экспертные статьи",
      text: "Ответы на вопросы, которые доверители задают до первой консультации.",
    },
    {
      id: "social",
      media: "caseSocialImage",
      title: "Соцсети",
      text: "Регулярные публикации о практике и экспертизе адвоката.",
    },
  ],
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
