/**
 * Рейтинг и ключевые цифры.
 * Рейтинг может меняться — обновлять только здесь.
 */
export const rating = {
  position: 57,
  total: 7550,
  source: "Регистр ФНС",
  /** Для фразы «по данным …». */
  sourceGenitive: "регистра ФНС",
  /** Ссылка на первоисточник рейтинга. Пусто — ссылка показывается как placeholder. */
  sourceUrl: "",
  /** Дата актуальности, например "01.10.2026". Пусто — выводится placeholder. */
  updatedAt: "",
};

export const heroFacts = [
  { value: "10+ лет", label: "в торгах" },
  { value: "8+ лет", label: "в сфере банкротства" },
  { value: "По всей России", label: "география проектов" },
];

export const aboutFacts = [
  { value: "ТОП-60", label: "в регистре ФНС" },
  { value: "10+ лет", label: "в торгах" },
  { value: "8+ лет", label: "в банкротстве" },
  { value: "Оценщик", label: "профессиональная квалификация" },
  { value: "Россия", label: "география проектов" },
];

/** Форматирование числа с неразрывным пробелом: 7550 → «7 550». */
export const formatNumber = (n: number) =>
  n.toLocaleString("ru-RU").replace(/\s/g, " ");
