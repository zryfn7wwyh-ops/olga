/**
 * Правовая конфигурация форм.
 *
 * PRODUCTION-БЛОКЕР: тексты политики и согласия, основание обработки и версия
 * документа должны быть утверждены ответственным за ПДн. Пока `approved: false`,
 * страницы /privacy и /consent показывают явно помеченный черновик.
 */
export type LegalConfig = {
  consentRequired: boolean;
  documentVersion: string;
  approved: boolean;
  policyHref: string;
  consentHref: string;
};

export const legal: LegalConfig = {
  /** Основание обработки — согласие (галочка всегда пустая по умолчанию). */
  consentRequired: true,
  /** Версия текста согласия — сохраняется вместе с заявкой. */
  documentVersion: "draft-2026-10-28",
  approved: false,
  policyHref: "/privacy",
  consentHref: "/consent",
};
