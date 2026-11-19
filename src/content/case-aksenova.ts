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
      title: "Разработанный сайт",
      text: "Структура услуг, доверительные элементы, формы обращения, мобильная версия.",
    },
    {
      id: "ads",
      media: "caseAdsImage",
      title: "Рекламные кампании",
      text: "Работа со спросом по юридическим направлениям и контроль обращений.",
    },
    {
      id: "articles",
      media: "caseArticlesImage",
      title: "Экспертные статьи",
      text: "Ответы на вопросы потенциальных доверителей, развитие поискового присутствия.",
    },
    {
      id: "social",
      media: "caseSocialImage",
      title: "Контент для социальных сетей",
      text: "Раскрытие экспертизы и регулярное присутствие в информационном поле.",
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
