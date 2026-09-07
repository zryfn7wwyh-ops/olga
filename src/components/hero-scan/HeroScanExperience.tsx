"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { heroScanConfig } from "@/config/heroScanConfig";
import { DigitalGrid } from "./DigitalGrid";
import { ScanLine } from "./ScanLine";
import { ScanOverlay } from "./ScanOverlay";
import { ScanMarkers } from "./ScanMarkers";
import { DataPoint } from "./DataPoint";
import { ScanParticles } from "./ScanParticles";

const DATA_POINTS = [
  { key: "site", label: "SITE", xPercent: 8, yPercent: 8 },
  { key: "form", label: "FORM", xPercent: 92, yPercent: 14 },
  { key: "cookie", label: "COOKIE", xPercent: 12, yPercent: 46 },
  { key: "policy", label: "POLICY", xPercent: 88, yPercent: 50 },
  { key: "data", label: "DATA", xPercent: 14, yPercent: 86 },
  { key: "registry", label: "REGISTRY", xPercent: 86, yPercent: 88 },
] as const;

type Tier = "high" | "medium" | "low";

function getTier(): Tier {
  if (typeof navigator === "undefined") return "high";
  const cores = navigator.hardwareConcurrency || 8;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (cores <= 2 || (mem !== undefined && mem <= 2)) return "low";
  if (cores <= 4 || (mem !== undefined && mem <= 4)) return "medium";
  return "high";
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function relativeRect(container: DOMRect, target: DOMRect): Rect {
  return {
    x: target.left - container.left,
    y: target.top - container.top,
    width: target.width,
    height: target.height,
  };
}

export function HeroScanExperience({ sectionId }: { sectionId: string }) {
  const overlayRootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLCanvasElement>(null);

  const h1MarkerRef = useRef<HTMLDivElement>(null);
  const subtitleMarkerRef = useRef<HTMLDivElement>(null);
  const ctaMarkerRef = useRef<HTMLDivElement>(null);
  const visualMarkerRef = useRef<HTMLDivElement>(null);

  const dataPointRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const connectorSvgRef = useRef<SVGSVGElement>(null);

  const markerRects = useRef<Record<string, Rect>>({});

  useEffect(() => {
    if (!heroScanConfig.enabled) return;
    if (typeof window === "undefined") return;

    let cancelled = false;
    let timeline: gsap.core.Timeline | null = null;
    let particleStop: (() => void) | null = null;
    let observer: IntersectionObserver | null = null;

    const section = document.getElementById(sectionId);
    if (!section) return;

    // позиция data-point'ов задаётся в процентах через JSX style, но в этой
    // сборке инлайн-style на forwardRef-компоненте не применяется надёжно —
    // выставляем те же left/top напрямую через DOM, как и для ScanMarkers.
    DATA_POINTS.forEach((dp) => {
      const el = dataPointRefs.current[dp.key];
      if (!el) return;
      el.style.left = `${dp.xPercent}%`;
      el.style.top = `${dp.yPercent}%`;
    });

    const cleanupInlineState = () => {
      section.style.filter = "";
      gsap.set(
        [
          gridRef.current,
          scanLineRef.current,
          tintRef.current,
          noiseRef.current,
          labelRef.current,
          particlesRef.current,
          h1MarkerRef.current,
          subtitleMarkerRef.current,
          ctaMarkerRef.current,
          visualMarkerRef.current,
          connectorSvgRef.current,
          ...Object.values(dataPointRefs.current),
        ].filter(Boolean),
        { clearProps: "all" }
      );
      // left/top/width/height на маркерах выставлены напрямую (не через GSAP),
      // clearProps их не увидит — снимаем явно
      [h1MarkerRef, subtitleMarkerRef, ctaMarkerRef, visualMarkerRef].forEach((ref) => {
        if (!ref.current) return;
        ref.current.style.left = "";
        ref.current.style.top = "";
        ref.current.style.width = "";
        ref.current.style.height = "";
      });
    };

    const abort = () => {
      timeline?.kill();
      particleStop?.();
      cleanupInlineState();
    };

    const runReducedMotionVariant = () => {
      if (!gridRef.current) return;
      timeline = gsap.timeline({
        onComplete: () => {
          cleanupInlineState();
        },
      });
      timeline
        .to(gridRef.current, { opacity: 0.12, duration: 0.15 })
        .to(gridRef.current, { opacity: 0, duration: 0.15 }, "+=0.3");
    };

    const flashMarker = (
      tl: gsap.core.Timeline,
      ref: React.RefObject<HTMLDivElement>,
      at: number,
      hold = 0.32
    ) => {
      if (!ref.current) return;
      tl.to(ref.current, { opacity: 1, duration: 0.14 }, at).to(
        ref.current,
        { opacity: 0, duration: 0.18 },
        at + 0.14 + hold
      );
    };

    const runFullScene = (tier: Tier) => {
      const isMobile = window.innerWidth < 768;
      const timeScale = isMobile ? 0.78 : 1;
      const showParticles = tier === "high" && !isMobile;
      const showMap = tier !== "low";
      const showConnectors = showMap && !isMobile;
      const showTintNoise = tier !== "low";

      const sectionRect = section.getBoundingClientRect();
      const targets: Array<[React.RefObject<HTMLDivElement>, string]> = [
        [h1MarkerRef, "h1"],
        [subtitleMarkerRef, "subtitle"],
        [ctaMarkerRef, "cta"],
        [visualMarkerRef, "visual"],
      ];
      targets.forEach(([ref, key]) => {
        const el = section.querySelector<HTMLElement>(`[data-hero-scan="${key}"]`);
        if (!el) return;
        const rect = relativeRect(sectionRect, el.getBoundingClientRect());
        markerRects.current[key] = rect;
        // рефы — не state, поэтому позицию применяем напрямую к DOM,
        // а не через React-рендер (иначе overlay навсегда останется 0×0)
        if (ref.current) {
          ref.current.style.left = `${rect.x}px`;
          ref.current.style.top = `${rect.y}px`;
          ref.current.style.width = `${rect.width}px`;
          ref.current.style.height = `${rect.height}px`;
        }
      });

      const heroHeight = sectionRect.height;
      const SWEEP = 2.7;

      timeline = gsap.timeline({
        defaults: { ease: "power1.inOut" },
        timeScale,
        onComplete: () => {
          cleanupInlineState();
        },
      });

      const tl = timeline;

      // Этап 1 — переход в режим анализа (0–0.8s)
      tl.to(
        section,
        {
          duration: 0.001,
          onStart: () => {
            section.style.filter = "saturate(0.87) contrast(1.02)";
          },
        },
        0
      );
      if (showTintNoise) {
        tl.to(tintRef.current, { opacity: 1, duration: 0.7 }, 0);
        tl.to(noiseRef.current, { opacity: 0.05, duration: 0.7 }, 0);
      }

      // Этап 2 — цифровая сетка (0.8–1.5s)
      tl.to(gridRef.current, { opacity: 0.12, duration: 0.7 }, 0.8);

      // Этап 3 — scan-line сверху вниз (1.5–4.2s)
      const sweepStart = 1.5;
      tl.fromTo(
        scanLineRef.current,
        { y: -20, opacity: 0 },
        { y: heroHeight + 20, opacity: 1, duration: SWEEP, ease: "power1.inOut" },
        sweepStart
      );
      tl.to(scanLineRef.current, { opacity: 0, duration: 0.2 }, sweepStart + SWEEP - 0.15);

      // реакции элементов — момент, когда линия пересекает их центр
      targets.forEach(([ref, key]) => {
        const rect = markerRects.current[key];
        if (!rect) return;
        const centerY = rect.y + rect.height / 2;
        const fraction = Math.min(Math.max(centerY / heroHeight, 0), 1);
        const at = sweepStart + fraction * SWEEP;
        flashMarker(tl, ref, at);
      });

      // частицы вдоль прохода линии
      if (showParticles && particlesRef.current) {
        tl.call(
          () => {
            particleStop = startParticles(particlesRef.current!, section, SWEEP + 0.3, heroHeight);
          },
          [],
          sweepStart
        );
      }

      const sweepEnd = sweepStart + SWEEP;

      // Этап 4 — digital map (после прохода, 1–1.5s)
      if (showMap) {
        const mapStart = sweepEnd + 0.1;
        DATA_POINTS.forEach((dp, i) => {
          const el = dataPointRefs.current[dp.key];
          if (!el) return;
          tl.to(el, { opacity: 1, duration: 0.25 }, mapStart + i * 0.05);
        });
        if (showConnectors && connectorSvgRef.current) {
          tl.to(connectorSvgRef.current, { opacity: 1, duration: 0.3 }, mapStart);
        }
        // центральная подпись «Цифровой след» — коротко
        tl.to(labelRef.current, { opacity: 1, duration: 0.2 }, mapStart + 0.15);
        tl.to(labelRef.current, { opacity: 0, duration: 0.2 }, mapStart + 1.0);

        // эффект «прочитано» — общий pulse
        const pulseAt = mapStart + 1.2;
        DATA_POINTS.forEach((dp) => {
          const el = dataPointRefs.current[dp.key];
          if (!el) return;
          tl.to(el, { scale: 1.25, duration: 0.15 }, pulseAt).to(el, { scale: 1, duration: 0.2 }, pulseAt + 0.15);
        });
        if (showConnectors && connectorSvgRef.current) {
          tl.to(connectorSvgRef.current, { opacity: 0.9, duration: 0.15 }, pulseAt).to(
            connectorSvgRef.current,
            { opacity: 0.35, duration: 0.2 },
            pulseAt + 0.15
          );
        }

        // Этап 5 — возврат (1–1.5s)
        const returnStart = pulseAt + 0.5;
        DATA_POINTS.forEach((dp, i) => {
          const el = dataPointRefs.current[dp.key];
          if (!el) return;
          tl.to(el, { opacity: 0, duration: 0.25 }, returnStart + i * 0.04);
        });
        if (showConnectors && connectorSvgRef.current) {
          tl.to(connectorSvgRef.current, { opacity: 0, duration: 0.3 }, returnStart);
        }
        tl.to(gridRef.current, { opacity: 0, duration: 0.3 }, returnStart + 0.2);
        if (showTintNoise) {
          tl.to([tintRef.current, noiseRef.current], { opacity: 0, duration: 0.35 }, returnStart + 0.3);
        }
        tl.to(
          section,
          {
            duration: 0.35,
            onStart: () => {
              section.style.filter = "saturate(1) contrast(1)";
            },
          },
          returnStart + 0.3
        );
      } else {
        // LOW: сразу после прохода линии — просто гасим сетку без карты
        tl.to(gridRef.current, { opacity: 0, duration: 0.4 }, sweepEnd + 0.3);
        tl.to(
          section,
          {
            duration: 0.4,
            onStart: () => {
              section.style.filter = "saturate(1) contrast(1)";
            },
          },
          sweepEnd + 0.3
        );
      }
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const timer = window.setTimeout(() => {
      if (cancelled) return;

      // если Hero уже почти покинул экран — не начинать вовсе
      const rect = section.getBoundingClientRect();
      const visibleRatio = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)) / rect.height;
      if (visibleRatio < 0.3) {
        return;
      }

      if (reduced) {
        runReducedMotionVariant();
      } else {
        runFullScene(getTier());
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.intersectionRatio < 0.3) {
            abort();
            observer?.disconnect();
          }
        },
        { threshold: [0, 0.3] }
      );
      observer.observe(section);

      window.addEventListener("resize", abort, { once: true });
    }, heroScanConfig.delay);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      abort();
      observer?.disconnect();
      window.removeEventListener("resize", abort);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  return (
    <div ref={overlayRootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <ScanOverlay tintRef={tintRef} noiseRef={noiseRef} labelRef={labelRef} />
      <DigitalGrid ref={gridRef} />

      <svg
        ref={connectorSvgRef}
        data-scan-el="connectors"
        className="absolute inset-0 h-full w-full opacity-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {DATA_POINTS.map((dp, i) => {
          const next = DATA_POINTS[(i + 1) % DATA_POINTS.length];
          return (
            <line
              key={dp.key}
              x1={dp.xPercent}
              y1={dp.yPercent}
              x2={next.xPercent}
              y2={next.yPercent}
              stroke="#00C2FF"
              strokeOpacity={0.45}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {DATA_POINTS.map((dp) => (
        <DataPoint
          key={dp.key}
          ref={(el) => {
            dataPointRefs.current[dp.key] = el;
          }}
          label={dp.label}
          xPercent={dp.xPercent}
          yPercent={dp.yPercent}
        />
      ))}

      <ScanMarkers ref={h1MarkerRef} rect={markerRects.current.h1 ?? { x: 0, y: 0, width: 0, height: 0 }} label="TEXT BLOCK" />
      <ScanMarkers ref={subtitleMarkerRef} rect={markerRects.current.subtitle ?? { x: 0, y: 0, width: 0, height: 0 }} />
      <ScanMarkers ref={ctaMarkerRef} rect={markerRects.current.cta ?? { x: 0, y: 0, width: 0, height: 0 }} label="CTA" />
      <ScanMarkers ref={visualMarkerRef} rect={markerRects.current.visual ?? { x: 0, y: 0, width: 0, height: 0 }} />

      <ScanLine ref={scanLineRef} />
      <ScanParticles ref={particlesRef} />
    </div>
  );
}

function startParticles(canvas: HTMLCanvasElement, section: HTMLElement, duration: number, heroHeight: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const rect = section.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.opacity = "1";

  const COUNT = 34;
  const particles = Array.from({ length: COUNT }, () => ({
    x: Math.random() * rect.width,
    y: 0,
    vy: 0.6 + Math.random() * 1.4,
    vx: (Math.random() - 0.5) * 0.4,
    r: 0.6 + Math.random() * 1.2,
    life: Math.random(),
  }));

  const start = performance.now();
  let rafId = 0;

  const tick = (now: number) => {
    const elapsed = (now - start) / 1000;
    const progress = Math.min(elapsed / duration, 1);
    const lineY = progress * heroHeight;

    ctx.clearRect(0, 0, rect.width, rect.height);
    particles.forEach((p) => {
      if (Math.abs(p.y - lineY) > 90 && p.y !== 0) {
        p.y = lineY + (Math.random() - 0.5) * 60;
        p.x = Math.random() * rect.width;
        p.life = 1;
      } else if (p.y === 0) {
        p.y = lineY + (Math.random() - 0.5) * 60;
      }
      p.y += p.vy;
      p.x += p.vx;
      p.life -= 0.01;
      const alpha = Math.max(0, Math.min(0.7, p.life));
      ctx.fillStyle = `rgba(125,227,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      canvas.style.opacity = "0";
      ctx.clearRect(0, 0, rect.width, rect.height);
    }
  };
  rafId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(rafId);
    canvas.style.opacity = "0";
    ctx.clearRect(0, 0, rect.width, rect.height);
  };
}
