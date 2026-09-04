"use client";

import { useEffect, useState } from "react";

export type ScanTier = "full" | "lite" | "fallback" | "static" | "idle";

const SESSION_KEY = "digitalScanPlayed";

function supportsWebgl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

/**
 * Решает, какой вариант сцены сканирования показать: полноценную 3D-сцену,
 * облегченную (mobile), CSS-фолбэк без 3D (нет WebGL) или ничего — если
 * пользователь предпочитает без анимаций или сцена уже проигрывалась в
 * этой сессии.
 */
export function useDigitalScan() {
  const [tier, setTier] = useState<ScanTier>("idle");

  useEffect(() => {
    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "true";
    } catch {
      alreadyPlayed = false;
    }
    if (alreadyPlayed) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTier("static");
      return;
    }

    if (!supportsWebgl()) {
      setTier("fallback");
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    setTier(isMobile ? "lite" : "full");
  }, []);

  const markPlayed = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // sessionStorage недоступен (приватный режим и т.п.) — не критично
    }
  };

  return { tier, markPlayed };
}
