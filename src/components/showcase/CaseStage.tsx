"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import s from "./showcase.module.css";

const MIN = 320;
const MAX = 1440;
const widthCss = (v: number) => `calc(${MIN}px + (100% - ${MIN}px) * ${((v - MIN) / (MAX - MIN)).toFixed(4)})`;

const motionAllowed = () =>
  document.documentElement.dataset.anim === "on" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Сцена макета с ползунком ширины 320–1440 px. При первом появлении на экране
 * макет один раз сжимается до телефонной ширины и возвращается (если анимация включена).
 */
export function CaseStage({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  const [width, setWidth] = useState(MAX);
  const [anim, setAnim] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined" || !motionAllowed()) return;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setAnim(true);
        setWidth(420);
        timers.push(window.setTimeout(() => setWidth(MAX), 1500));
        timers.push(window.setTimeout(() => setAnim(false), 2500));
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <figure className={s.figure}>
      <div className={s.stage} ref={ref} data-motion="case-reveal" data-motion-id={id}>
        <div className={`${s.frame} ${anim ? s.frameAnim : ""}`} style={{ width: widthCss(width) }} data-motion-layer>
          <div className={s.mock} role="img" aria-label={label}>
            {children}
          </div>
        </div>
      </div>
      <div className={`mono ${s.scrub}`}>
        <span aria-hidden="true">{MIN}</span>
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={10}
          value={width}
          aria-label={`Ширина макета: ${label}`}
          aria-valuetext={`${width} пикселей`}
          onChange={(e) => {
            setAnim(false);
            setWidth(Number(e.target.value));
          }}
        />
        <b>{width} px</b>
      </div>
    </figure>
  );
}
