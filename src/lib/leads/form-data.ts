import { legal } from "@/content/legal";

/**
 * Преобразует обычную HTML-отправку формы (без JavaScript) в payload контракта.
 * Имена полей совпадают с именами input в компонентах форм.
 */
export function formDataToPayload(form: URLSearchParams): Record<string, unknown> {
  const get = (k: string) => form.get(k) ?? undefined;
  return {
    source: get("source"),
    siteType: get("siteType"),
    contactMethod: get("contactMethod"),
    contact: get("contact"),
    name: get("name"),
    description: get("description"),
    scope: get("scope"),
    dataCategory: get("dataCategory"),
    consent: { accepted: form.get("consent") === "on", documentVersion: get("consentVersion") ?? legal.documentVersion },
    attribution: {},
    website: get("website"),
  };
}
