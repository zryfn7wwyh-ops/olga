"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  /** Форматирование итогового и промежуточных значений. */
  format?: (n: number) => string;
  duration?: number;
  className?: string;
};

const defaultFormat = (n: number) =>
  new Intl.NumberFormat("ru-RU").format(Math.round(n)).replace(/\s/g, " ");

/**
 * Число однократно «досчитывает» от нуля до итога при появлении в viewport.
 * - Сервер рендерит итоговое значение (SEO, без JS, скринридеры).
 * - Ширина зарезервирована итоговым значением — без layout shift.
 * - При prefers-reduced-motion анимация не запускается.
 */
export function AnimatedNumber({ value, format = defaultFormat, duration = 1100, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(() => format(value));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    // Не анимируем, если число уже на экране при загрузке.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    let raf = 0;
    setDisplay(format(0));
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(format(value * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, format, duration]);

  const final = format(value);
  return (
    <span ref={ref} className={className} style={{ display: "inline-grid" }}>
      <span className="sr-only">{final}</span>
      <span aria-hidden="true" style={{ gridArea: "1 / 1", visibility: "hidden" }}>
        {final}
      </span>
      <span aria-hidden="true" style={{ gridArea: "1 / 1", textAlign: "inherit" }}>
        {display}
      </span>
    </span>
  );
}
