import { z } from "zod";

/** Источники формы — для аналитики и CRM. Каждой кнопке — свой источник. */
export const FORM_SOURCES = [
  "hero_primary",
  "hero_secondary",
  "header_cta",
  "sticky_cta",
  "case_cta",
  "system_cta",
  "payment_cta",
  "lead_section",
] as const;
export type FormSource = (typeof FORM_SOURCES)[number];

export const SPECIALIZATIONS = [
  { value: "criminal", label: "Уголовные дела" },
  { value: "civil", label: "Гражданские споры" },
  { value: "family", label: "Семейные споры" },
  { value: "arbitration", label: "Арбитраж и бизнес" },
  { value: "bankruptcy", label: "Банкротство" },
  { value: "multiple", label: "Несколько направлений" },
  { value: "other", label: "Другое" },
] as const;
export type Specialization = (typeof SPECIALIZATIONS)[number]["value"];
const SPECIALIZATION_VALUES = SPECIALIZATIONS.map((s) => s.value) as [Specialization, ...Specialization[]];

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/* ---------------- Телефон ---------------- */

/** Оставляет только цифры; российские 8XXXXXXXXXX → 7XXXXXXXXXX. */
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (digits.length === 10 && !raw.trim().startsWith("+")) digits = `7${digits}`;
  return digits;
}

/** Российский номер — ровно 11 цифр с кодом 7; международный — 8–15 цифр с «+». */
export function isValidPhone(raw: string): boolean {
  const trimmed = raw.trim();
  const digits = normalizePhone(trimmed);
  const isInternational = trimmed.startsWith("+") && !trimmed.startsWith("+7");
  if (isInternational) return digits.length >= 8 && digits.length <= 15;
  return digits.length === 11 && digits.startsWith("7") && /^[3-9]/.test(digits.slice(1));
}

/**
 * Маска ввода: +7 (999) 123-45-67 для российских номеров,
 * для международных («+» и не 7) — только цифры с «+».
 */
export function formatPhoneInput(raw: string): string {
  const trimmed = raw.trimStart();
  if (trimmed === "" || trimmed === "+") return trimmed;
  if (trimmed.startsWith("+") && !trimmed.startsWith("+7")) {
    return `+${trimmed.replace(/\D/g, "").slice(0, 15)}`;
  }
  let digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("8") || digits.startsWith("7")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  let out = "+7";
  if (digits.length > 0) out += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) out += ")";
  if (digits.length > 3) out += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) out += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) out += `-${digits.slice(8, 10)}`;
  return out;
}

/* ---------------- Схемы ---------------- */

const trimmed = (max: number, requiredMessage = "Заполните поле") =>
  z.string({ message: requiredMessage }).trim().max(max, `Не более ${max} символов`);

/** Единая короткая форма: обязательны только имя и телефон (+ согласие). */
export const leadFieldsSchema = z.object({
  name: trimmed(80, "Укажите имя").min(2, "Укажите имя"),
  phone: z
    .string({ message: "Укажите телефон" })
    .trim()
    .min(1, "Укажите телефон")
    .refine(isValidPhone, "Проверьте номер: например, +7 (999) 123-45-67"),
  specialization: z.enum(SPECIALIZATION_VALUES).optional(),
  city: trimmed(120).optional(),
  consent: z.literal(true, { message: "Необходимо согласие на обработку персональных данных" }),
});

const utmSchema = z
  .object(Object.fromEntries(UTM_KEYS.map((k) => [k, trimmed(200).optional()])) as Record<
    (typeof UTM_KEYS)[number],
    z.ZodOptional<z.ZodString>
  >)
  .partial();

/** Тело запроса POST /api/leads. */
export const leadRequestSchema = z.object({
  form_source: z.enum(FORM_SOURCES),
  /** Поля проверяются отдельно, чтобы вернуть ошибки по каждому полю. */
  fields: z.record(z.string(), z.unknown()),
  utm: utmSchema.default({}),
  page_url: trimmed(1000).optional(),
  referrer: trimmed(1000).optional(),
  /** Идентификатор попытки отправки — защита от повторной доставки при двойном клике/ретраях. */
  submission_id: z.string().max(64).optional(),
  /** Honeypot: реальный пользователь это поле не видит и не заполняет. */
  company_url: z.string().max(500).optional(),
});

export type LeadFields = z.infer<typeof leadFieldsSchema>;
export type LeadRequest = z.infer<typeof leadRequestSchema>;

export type LeadPayload = {
  formSource: FormSource;
  name: string;
  phone: string;
  city?: string;
  specialization?: Specialization;
  specializationLabel?: string;
  consent: true;
  consentAt: string;
  utm: Partial<Record<(typeof UTM_KEYS)[number], string>>;
  pageUrl?: string;
  referrer?: string;
  submittedAt: string;
};

export type LeadApiResponse =
  | { ok: true; mode: "live" | "demo"; duplicate?: boolean }
  | {
      ok: false;
      code: "validation" | "rate_limited" | "delivery_unavailable" | "delivery_failed" | "bad_request";
      message: string;
      fieldErrors?: Record<string, string>;
    };

export const specializationLabel = (value: Specialization) =>
  SPECIALIZATIONS.find((s) => s.value === value)?.label ?? value;
