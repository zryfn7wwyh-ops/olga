"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Слайдер на нативном scroll-snap: swipe на тач-устройствах из коробки,
 * кнопки «← →» прокручивают к соседнему слайду.
 */
export function useSlider<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const slides = () => Array.from(ref.current?.children ?? []) as HTMLElement[];

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const items = slides();
    const left = el.scrollLeft;
    let best = 0;
    let dist = Infinity;
    items.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft - el.offsetLeft - left - (parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0));
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    setIndex(best);
    setAtStart(left <= 4);
    setAtEnd(left + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const goTo = useCallback((i: number) => {
    const el = ref.current;
    const items = slides();
    if (!el || !items[i]) return;
    const pad = (parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0);
    el.scrollTo({ left: items[i].offsetLeft - el.offsetLeft - pad, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, []);

  return { ref, index, atStart, atEnd, goTo, count: () => slides().length };
}
