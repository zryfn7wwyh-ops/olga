"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Событие case_view — однократно, когда секция кейса реально появилась на экране. */
export function CaseViewTracker() {
  useEffect(() => {
    const el = document.getElementById("case");
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track("case_view");
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return null;
}
