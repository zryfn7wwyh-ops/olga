import "server-only";
import type { LeadPayload } from "./lead-schema";
import { site } from "@/content/site";

/**
 * Настраиваемая доставка заявок.
 *
 * LEAD_DELIVERY_MODE:
 *   - "webhook"  — POST JSON на LEAD_WEBHOOK_URL (n8n, Make, собственный сервер, amoCRM через посредника и т. п.);
 *   - "bitrix24" — создание лида через входящий вебхук Битрикс24 (BITRIX24_WEBHOOK_URL);
 *   - "telegram" — уведомление в Telegram-чат (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID);
 *   - "test"     — локальный тестовый режим: заявка НИКУДА не отправляется.
 *                  Разрешён только вне production.
 *   - не задано  — в development работает как "test", в production — отправка недоступна (503).
 *
 * Можно указать несколько адаптеров через запятую: "bitrix24,telegram".
 * Заявка считается принятой, только если ВСЕ указанные адаптеры ответили успешно.
 *
 * Персональные данные (имя, телефон, комментарий) не пишутся в серверные логи.
 */

export type DeliveryMode = "webhook" | "bitrix24" | "telegram" | "test";
export type DeliveryStatus =
  | { kind: "ready"; modes: Exclude<DeliveryMode, "test">[] }
  | { kind: "test" }
  | { kind: "unavailable"; reason: string };

const isProduction = () => process.env.NODE_ENV === "production";

export function getDeliveryStatus(): DeliveryStatus {
  const raw = (process.env.LEAD_DELIVERY_MODE ?? "").trim().toLowerCase();
  const modes = raw
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean) as DeliveryMode[];

  // Без опубликованных политики и согласия персональные данные в production не принимаем.
  if (isProduction() && !site.legal.documentsApproved) {
    return { kind: "unavailable", reason: "Privacy policy / consent are not approved (site.legal.documentsApproved)" };
  }

  if (modes.length === 0 || modes.includes("test")) {
    if (isProduction()) {
      return { kind: "unavailable", reason: "Lead delivery is not configured for production" };
    }
    return { kind: "test" };
  }

  const live: Exclude<DeliveryMode, "test">[] = [];
  for (const mode of modes) {
    switch (mode) {
      case "webhook":
        if (!process.env.LEAD_WEBHOOK_URL) return { kind: "unavailable", reason: "LEAD_WEBHOOK_URL is missing" };
        live.push(mode);
        break;
      case "bitrix24":
        if (!process.env.BITRIX24_WEBHOOK_URL)
          return { kind: "unavailable", reason: "BITRIX24_WEBHOOK_URL is missing" };
        live.push(mode);
        break;
      case "telegram":
        if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID)
          return { kind: "unavailable", reason: "TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are missing" };
        live.push(mode);
        break;
      default:
        return { kind: "unavailable", reason: `Unknown LEAD_DELIVERY_MODE: ${String(mode)}` };
    }
  }
  return { kind: "ready", modes: live };
}

const TIMEOUT_MS = 10_000;

async function postJson(url: string, body: unknown, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

/* ---------------- Адаптеры ---------------- */

async function deliverWebhook(lead: LeadPayload) {
  const headers: Record<string, string> = {};
  if (process.env.LEAD_WEBHOOK_SECRET) headers["X-Webhook-Secret"] = process.env.LEAD_WEBHOOK_SECRET;
  await postJson(process.env.LEAD_WEBHOOK_URL!, { type: "lead", lead }, headers);
}

async function deliverBitrix24(lead: LeadPayload) {
  const base = process.env.BITRIX24_WEBHOOK_URL!.replace(/\/$/, "");
  const comments = [
    `Источник формы: ${lead.formSource}`,
    `Специализация: ${lead.specializationLabel}`,
    lead.city && `Город/регион: ${lead.city}`,
    lead.website && `Сайт: ${lead.website}`,
    lead.comment && `Комментарий: ${lead.comment}`,
    lead.pageUrl && `Страница: ${lead.pageUrl}`,
    `Согласие на обработку ПДн: да, ${lead.consentAt}`,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await postJson(`${base}/crm.lead.add.json`, {
    fields: {
      TITLE: `Заявка с лендинга: ${lead.specializationLabel}`,
      NAME: lead.name,
      PHONE: [{ VALUE: `+${lead.phone}`, VALUE_TYPE: "WORK" }],
      ADDRESS_CITY: lead.city,
      WEB: lead.website ? [{ VALUE: lead.website, VALUE_TYPE: "WORK" }] : undefined,
      COMMENTS: comments,
      SOURCE_ID: process.env.BITRIX24_SOURCE_ID || "WEB",
      SOURCE_DESCRIPTION: lead.formSource,
      UTM_SOURCE: lead.utm.utm_source,
      UTM_MEDIUM: lead.utm.utm_medium,
      UTM_CAMPAIGN: lead.utm.utm_campaign,
      UTM_CONTENT: lead.utm.utm_content,
      UTM_TERM: lead.utm.utm_term,
    },
    params: { REGISTER_SONET_EVENT: "Y" },
  });
  const data = (await res.json().catch(() => null)) as { result?: unknown; error?: string } | null;
  if (!data || data.error || !data.result) throw new Error("Bitrix24 returned an error");
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function deliverTelegram(lead: LeadPayload) {
  const lines = [
    "<b>Новая заявка с лендинга</b>",
    `Имя: ${escapeHtml(lead.name)}`,
    `Телефон: +${lead.phone}`,
    `Специализация: ${escapeHtml(lead.specializationLabel)}`,
    lead.city && `Город/регион: ${escapeHtml(lead.city)}`,
    lead.website && `Сайт: ${escapeHtml(lead.website)}`,
    lead.comment && `Комментарий: ${escapeHtml(lead.comment)}`,
    `Источник формы: ${lead.formSource}`,
    Object.keys(lead.utm).length > 0 &&
      `UTM: ${escapeHtml(Object.entries(lead.utm).map(([k, v]) => `${k}=${v}`).join(", "))}`,
  ].filter(Boolean);

  const res = await postJson(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text: lines.join("\n"),
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
  const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
  if (!data?.ok) throw new Error("Telegram returned an error");
}

const adapters: Record<Exclude<DeliveryMode, "test">, (lead: LeadPayload) => Promise<void>> = {
  webhook: deliverWebhook,
  bitrix24: deliverBitrix24,
  telegram: deliverTelegram,
};

export type DeliveryResult = { ok: true; mode: "live" | "test" } | { ok: false; reason: "unavailable" | "failed" };

export async function deliverLead(lead: LeadPayload): Promise<DeliveryResult> {
  const status = getDeliveryStatus();

  if (status.kind === "unavailable") {
    console.error(`[leads] delivery unavailable: ${status.reason}`);
    return { ok: false, reason: "unavailable" };
  }

  if (status.kind === "test") {
    // Только служебные поля — без имени, телефона и комментария.
    console.info(
      `[leads] TEST MODE — lead NOT delivered (source=${lead.formSource}, variant=${lead.variant}, specialization=${lead.specialization})`,
    );
    return { ok: true, mode: "test" };
  }

  try {
    for (const mode of status.modes) {
      await adapters[mode](lead);
    }
    console.info(`[leads] delivered (source=${lead.formSource}, via=${status.modes.join("+")})`);
    return { ok: true, mode: "live" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.error(`[leads] delivery failed (source=${lead.formSource}): ${message}`);
    return { ok: false, reason: "failed" };
  }
}
