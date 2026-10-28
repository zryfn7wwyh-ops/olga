import { legal as defaultLegal, type LegalConfig } from "@/content/legal";
import {
  LIMITS,
  normalizeEmail,
  normalizePhone,
  validateContact,
  type ContactErrorCode,
  type ContactMethod,
} from "@/lib/validation";
import { QUIZ_QUESTIONS } from "@/lib/quiz";

export const LEAD_SOURCES = ["hero_estimate", "quiz", "pdn_consultation", "final_brief"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const SITE_TYPES = ["unknown", "landing", "corporate", "catalog", "other"] as const;
export type SiteType = (typeof SITE_TYPES)[number];

export const SCOPES = ["unknown", "one_page", "up_to_10", "over_10"] as const;
export type Scope = (typeof SCOPES)[number];

export const DATA_CATEGORIES = ["form_requests", "user_registration", "orders", "unknown"] as const;
export type DataCategory = (typeof DATA_CATEGORIES)[number];

export const CONTACT_METHODS = ["phone", "email"] as const;

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type Attribution = Partial<Record<UtmKey, string | null>>;

export type QuizPayload = {
  goal: string;
  current: string;
  launch: string;
  recommendation: SiteType;
};

/** Контракт POST /api/leads. */
export type LeadPayload = {
  source: LeadSource;
  siteType: SiteType | null;
  contactMethod: ContactMethod;
  contact: string;
  name: string | null;
  description: string | null;
  scope: Scope | null;
  answers: QuizPayload | null;
  dataCategory: DataCategory | null;
  consent: { accepted: boolean; documentVersion: string };
  attribution: Attribution;
  /** Ключ идемпотентности: повторная отправка того же черновика не создаёт дубль. */
  idempotencyKey?: string;
  /** Honeypot: поле скрыто от людей, боты его заполняют. */
  website?: string;
};

export type FieldErrorCode = ContactErrorCode | "consent_required" | "too_long" | "invalid_option";
export type FieldErrors = Partial<Record<"source" | "siteType" | "contactMethod" | "contact" | "name" | "description" | "scope" | "answers" | "dataCategory" | "consent", FieldErrorCode>>;

export type ParseResult =
  | { ok: true; data: LeadPayload; isBot: boolean }
  | { ok: false; errors: FieldErrors };

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const oneOf = <T extends readonly string[]>(list: T, v: unknown): v is T[number] =>
  typeof v === "string" && (list as readonly string[]).includes(v);

function optionalText(v: unknown, max: number): { value: string | null; error?: "too_long" | "invalid_option" } {
  if (v === undefined || v === null) return { value: null };
  if (typeof v !== "string") return { value: null, error: "invalid_option" };
  const t = v.trim();
  if (!t) return { value: null };
  if (t.length > max) return { value: null, error: "too_long" };
  return { value: t };
}

/** Какие поля относятся к сценарию; остальные отбрасываются (минимизация данных). */
const SOURCE_FIELDS: Record<LeadSource, { siteType: boolean; scope: boolean; text: boolean; answers: boolean; dataCategory: boolean }> = {
  hero_estimate: { siteType: true, scope: false, text: false, answers: false, dataCategory: false },
  quiz: { siteType: false, scope: false, text: false, answers: true, dataCategory: false },
  pdn_consultation: { siteType: false, scope: false, text: false, answers: false, dataCategory: true },
  final_brief: { siteType: true, scope: true, text: true, answers: false, dataCategory: false },
};

/**
 * Серверная (и клиентская) проверка заявки. Возвращает нормализованные данные
 * или ошибки по полям. Неизвестные поля игнорируются.
 */
export function parseLeadPayload(input: unknown, legal: LegalConfig = defaultLegal): ParseResult {
  const errors: FieldErrors = {};
  if (!isObj(input)) return { ok: false, errors: { source: "invalid_option" } };

  if (!oneOf(LEAD_SOURCES, input.source)) return { ok: false, errors: { source: "invalid_option" } };
  const source = input.source;
  const fields = SOURCE_FIELDS[source];

  const contactMethod: ContactMethod = oneOf(CONTACT_METHODS, input.contactMethod) ? input.contactMethod : "phone";
  if (!oneOf(CONTACT_METHODS, input.contactMethod)) errors.contactMethod = "invalid_option";

  const rawContact = typeof input.contact === "string" ? input.contact : "";
  const contactError = validateContact(contactMethod, rawContact);
  if (contactError) errors.contact = contactError;
  const contact = contactError ? "" : contactMethod === "email" ? normalizeEmail(rawContact) : normalizePhone(rawContact);

  let siteType: SiteType | null = null;
  if (fields.siteType) {
    if (input.siteType === undefined || input.siteType === null || input.siteType === "") siteType = "unknown";
    else if (oneOf(SITE_TYPES, input.siteType) && (source === "final_brief" || input.siteType !== "other")) siteType = input.siteType;
    else errors.siteType = "invalid_option";
  }

  let scope: Scope | null = null;
  if (fields.scope && input.scope !== undefined && input.scope !== null && input.scope !== "") {
    if (oneOf(SCOPES, input.scope)) scope = input.scope;
    else errors.scope = "invalid_option";
  }

  let name: string | null = null;
  let description: string | null = null;
  if (fields.text) {
    const n = optionalText(input.name, LIMITS.name);
    if (n.error) errors.name = n.error;
    name = n.value;
    const d = optionalText(input.description, LIMITS.description);
    if (d.error) errors.description = d.error;
    description = d.value;
  }

  let answers: QuizPayload | null = null;
  if (fields.answers) {
    const a = input.answers;
    const valid =
      isObj(a) &&
      QUIZ_QUESTIONS.every((q) => q.options.some((o) => o.value === a[q.id])) &&
      oneOf(SITE_TYPES, a.recommendation);
    if (valid) {
      answers = { goal: a.goal as string, current: a.current as string, launch: a.launch as string, recommendation: a.recommendation as SiteType };
      siteType = answers.recommendation;
    } else errors.answers = "invalid_option";
  }

  let dataCategory: DataCategory | null = null;
  if (fields.dataCategory) {
    if (oneOf(DATA_CATEGORIES, input.dataCategory)) dataCategory = input.dataCategory;
    else errors.dataCategory = "invalid_option";
  }

  const consentIn = isObj(input.consent) ? input.consent : {};
  const accepted = consentIn.accepted === true;
  if (legal.consentRequired && (!accepted || consentIn.documentVersion !== legal.documentVersion)) {
    errors.consent = "consent_required";
  }

  const attribution: Attribution = {};
  if (isObj(input.attribution)) {
    for (const key of UTM_KEYS) {
      const v = input.attribution[key];
      if (typeof v === "string" && v.trim()) attribution[key] = v.trim().slice(0, LIMITS.utm);
    }
  }

  const idempotencyKey =
    typeof input.idempotencyKey === "string" && /^[A-Za-z0-9-]{8,64}$/.test(input.idempotencyKey) ? input.idempotencyKey : undefined;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const isBot = typeof input.website === "string" && input.website.trim() !== "";

  return {
    ok: true,
    isBot,
    data: {
      source,
      siteType,
      contactMethod,
      contact,
      name,
      description,
      scope,
      answers,
      dataCategory,
      consent: { accepted, documentVersion: legal.documentVersion },
      attribution,
      idempotencyKey,
    },
  };
}

/** Порядок полей на странице — для перевода фокуса к первой ошибке. */
export const FIELD_ORDER: (keyof FieldErrors)[] = [
  "siteType",
  "scope",
  "dataCategory",
  "answers",
  "description",
  "name",
  "contactMethod",
  "contact",
  "consent",
];
