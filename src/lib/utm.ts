import { UTM_KEYS, type Attribution } from "@/lib/leads/schema";
import { LIMITS } from "@/lib/validation";

const STORAGE_KEY = "lead_attribution";

/** UTM по белому списку, с ограничением длины. Хранится только в рамках сессии. */
export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const fromUrl: Attribution = {};
  const params = new URLSearchParams(window.location.search);
  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v) fromUrl[key] = v.slice(0, LIMITS.utm);
  }
  try {
    if (Object.keys(fromUrl).length) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Attribution) : {};
  } catch {
    return fromUrl;
  }
}
