/**
 * Тексты юридических документов.
 * Заполняются ТОЛЬКО утверждёнными юристом/оператором ПДн текстами.
 * Шаблоны без проверки не подставлять (ТЗ, раздел 9).
 * После заполнения установите site.legal.documentsApproved = true.
 */
export type LegalDocument = { title: string; updatedAt: string | null; paragraphs: string[] };

export const privacyPolicy: LegalDocument = {
  title: "Политика обработки персональных данных",
  updatedAt: null,
  paragraphs: [],
};

export const consentText: LegalDocument = {
  title: "Согласие на обработку персональных данных",
  updatedAt: null,
  paragraphs: [],
};
