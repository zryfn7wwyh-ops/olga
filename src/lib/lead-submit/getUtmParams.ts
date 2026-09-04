const UTM_STORAGE_KEY = "lead_form_utm_v1";

export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  pageUrl?: string;
}

const UTM_QUERY_MAP: Record<keyof Omit<UtmParams, "referrer" | "pageUrl">, string> = {
  utmSource: "utm_source",
  utmMedium: "utm_medium",
  utmCampaign: "utm_campaign",
  utmContent: "utm_content",
  utmTerm: "utm_term",
};

/**
 * Основной трафик идет из e-mail рассылки, поэтому UTM-метки читаются
 * из URL при первом заходе и сохраняются в sessionStorage до отправки формы,
 * даже если пользователь перейдет по внутренним ссылкам страницы.
 */
export function captureAndGetUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};

  const searchParams = new URLSearchParams(window.location.search);
  const fromUrl: UtmParams = {};
  let hasAnyUtmInUrl = false;

  (Object.keys(UTM_QUERY_MAP) as (keyof typeof UTM_QUERY_MAP)[]).forEach((key) => {
    const value = searchParams.get(UTM_QUERY_MAP[key]);
    if (value) {
      fromUrl[key] = value;
      hasAnyUtmInUrl = true;
    }
  });

  if (hasAnyUtmInUrl) {
    const toStore: UtmParams = {
      ...fromUrl,
      referrer: document.referrer || undefined,
      pageUrl: window.location.href,
    };
    try {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(toStore));
    } catch {
      // sessionStorage может быть недоступен (приватный режим) — не критично
    }
    return toStore;
  }

  try {
    const stored = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UtmParams;
    }
  } catch {
    // ignore
  }

  return {
    referrer: document.referrer || undefined,
    pageUrl: window.location.href,
  };
}
