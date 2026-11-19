import { UTM_KEYS } from "./lead-schema";

const STORAGE_KEY = "lp_utm";
type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/** Сохраняет UTM из адреса при первом заходе в рамках сессии. */
export function captureUtm() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: Utm = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) utm[key] = value.slice(0, 200);
    }
    if (Object.keys(utm).length > 0) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
  } catch {
    /* sessionStorage может быть недоступен */
  }
}

export function getUtm(): Utm {
  if (typeof window === "undefined") return {};
  const fromUrl: Utm = {};
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) fromUrl[key] = value.slice(0, 200);
    }
    if (Object.keys(fromUrl).length > 0) return fromUrl;
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Utm) : {};
  } catch {
    return fromUrl;
  }
}
