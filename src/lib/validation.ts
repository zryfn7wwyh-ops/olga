/**
 * Проверка контактов. Используется и в браузере, и на сервере —
 * клиентская проверка только помогает пользователю, решение принимает сервер.
 */

export type ContactMethod = "phone" | "email";

export const LIMITS = {
  name: 100,
  email: 254,
  phoneInput: 32,
  description: 2000,
  utm: 100,
} as const;

export type ContactErrorCode = "contact_required" | "phone_invalid" | "email_invalid" | "contact_too_long";

const EMAIL_RE = /^[^\s@"<>()[\],;:]+@[^\s@"<>()[\],;:]+\.[^\s@"<>()[\],;:]{2,}$/;
/** Допустимые символы в номере: цифры, пробелы, скобки, дефисы, точки и «+» в начале. */
const PHONE_CHARS_RE = /^\+?[\d\s().-]+$/;

export function validateEmail(raw: string): ContactErrorCode | null {
  const value = raw.trim();
  if (!value) return "contact_required";
  if (value.length > LIMITS.email) return "contact_too_long";
  if (!EMAIL_RE.test(value)) return "email_invalid";
  const [local] = value.split("@");
  if (local.length > 64) return "email_invalid";
  return null;
}

export function validatePhone(raw: string): ContactErrorCode | null {
  const value = raw.trim();
  if (!value) return "contact_required";
  if (value.length > LIMITS.phoneInput) return "contact_too_long";
  if (!PHONE_CHARS_RE.test(value)) return "phone_invalid";
  const digits = value.replace(/\D/g, "");
  // E.164: не более 15 цифр; меньше 7 — не похоже на реальный номер.
  if (digits.length < 7 || digits.length > 15) return "phone_invalid";
  return null;
}

export function validateContact(method: ContactMethod, raw: string): ContactErrorCode | null {
  return method === "email" ? validateEmail(raw) : validatePhone(raw);
}

/**
 * Серверная нормализация номера. Российские номера в формате 8XXXXXXXXXX
 * и 7XXXXXXXXXX приводятся к +7XXXXXXXXXX, международные номера сохраняются.
 */
export function normalizePhone(raw: string): string {
  const value = raw.trim();
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("8") || digits.startsWith("7")) && !value.startsWith("+")) {
    return `+7${digits.slice(1)}`;
  }
  return `+${digits}`;
}

export function normalizeEmail(raw: string): string {
  const value = raw.trim();
  const at = value.lastIndexOf("@");
  return `${value.slice(0, at)}@${value.slice(at + 1).toLowerCase()}`;
}

/** Параметры поля контакта в зависимости от выбранного способа связи. */
export function contactFieldConfig(method: ContactMethod) {
  return method === "email"
    ? {
        label: "Email",
        type: "email" as const,
        inputMode: "email" as const,
        autoComplete: "email",
        placeholder: "name@company.ru",
        maxLength: LIMITS.email,
      }
    : {
        label: "Телефон",
        type: "tel" as const,
        inputMode: "tel" as const,
        autoComplete: "tel",
        placeholder: "+7 900 000-00-00",
        maxLength: LIMITS.phoneInput,
      };
}

export const FIELD_ERROR_MESSAGES: Record<string, string> = {
  contact_required_phone: "Введите номер телефона",
  contact_required_email: "Введите email",
  phone_invalid: "Проверьте номер телефона",
  email_invalid: "Проверьте email",
  contact_too_long: "Слишком длинное значение",
  consent_required: "Необходимо согласие на обработку данных",
  too_long: "Слишком длинный текст",
  invalid_option: "Выберите один из вариантов",
};

export function contactErrorMessage(code: ContactErrorCode, method: ContactMethod): string {
  if (code === "contact_required") return FIELD_ERROR_MESSAGES[`contact_required_${method}`];
  return FIELD_ERROR_MESSAGES[code];
}
