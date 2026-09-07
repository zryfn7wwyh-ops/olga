"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { heroScanConfig } from "@/config/heroScanConfig";
import { DigitalGrid } from "./DigitalGrid";
import { ScanLine } from "./ScanLine";
import { ScanOverlay } from "./ScanOverlay";
import { ScanMarkers } from "./ScanMarkers";
import { ScanParticles } from "./ScanParticles";
import { ScanMagnifier, MAGNIFIER_SIZE_DESKTOP, MAGNIFIER_SIZE_MOBILE } from "./ScanMagnifier";
import { WireframeOverlay } from "./WireframeOverlay";

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

/** Прямоугольники всех строк текста внутри элемента (Range API) — для line-by-line эффектов. */
function lineRects(container: DOMRect, el: HTMLElement): Rect[] {
  const range = document.createRange();
  range.selectNodeContents(el);
  const rects = Array.from(range.getClientRects());
  range.detach?.();
  return rects
    .filter((r) => r.width > 4 && r.height > 4)
    .map((r) => relativeRect(container, r));
}

export function HeroScanExperience({ sectionId }: { sectionId: string }) {
  const overlayRootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLCanvasElement>(null);
  const magnifierRef = useRef<HTMLDivElement>(null);
  const wireframeRef = useRef<HTMLDivElement>(null);

  const h1MarkerRef = useRef<HTMLDivElement>(null);
  const subtitleMarkerRef = useRef<HTMLDivElement>(null);
  const ctaMarkerRef = useRef<HTMLDivElement>(null);
  const visualMarkerRef = useRef<HTMLDivElement>(null);

  const markerRects = useRef<Record<string, Rect>>({});

  useEffect(() => {
    if (!heroScanConfig.enabled) return;
    if (typeof window === "undefined") return;

    let cancelled = false;
    let timeline: gsap.core.Timeline | null = null;
    let particleStop: (() => void) | null = null;
    let observer: IntersectionObserver | null = null;
    const dynamicEls: HTMLElement[] = [];

    const section = document.getElementById(sectionId);
    if (!section) return;

    const clearDynamicEls = () => {
      dynamicEls.forEach((el) => el.remove());
      dynamicEls.length = 0;
    };

    const clearMagnifierContent = () => {
      const slot = magnifierRef.current?.querySelector<HTMLElement>('[data-scan-el="magnifier-content"]');
      if (slot) slot.innerHTML = "";
    };

    const mountMagnifiedClone = (targetEl: HTMLElement | null) => {
      const slot = magnifierRef.current?.querySelector<HTMLElement>('[data-scan-el="magnifier-content"]');
      if (!slot || !targetEl) return;
      const clone = targetEl.cloneNode(true) as HTMLElement;
      clone.removeAttribute("id");
      clone.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
      const rect = targetEl.getBoundingClientRect();
      clone.style.position = "static";
      clone.style.margin = "0";
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.pointerEvents = "none";
      slot.innerHTML = "";
      slot.appendChild(clone);
    };

    const cleanupInlineState = () => {
      section.style.filter = "";
      clearMagnifierContent();
      clearDynamicEls();
      gsap.set(
        [
          gridRef.current,
          gridRef.current?.querySelector('[data-scan-el="grid-v"]'),
          gridRef.current?.querySelector('[data-scan-el="grid-h"]'),
          gridRef.current?.querySelector('[data-scan-el="grid-dots"]'),
          gridRef.current?.querySelector('[data-scan-el="grid-ticks"]'),
          scanLineRef.current,
          tintRef.current,
          noiseRef.current,
          labelRef.current,
          statusRef.current,
          particlesRef.current,
          h1MarkerRef.current,
          subtitleMarkerRef.current,
          ctaMarkerRef.current,
          visualMarkerRef.current,
          magnifierRef.current,
          wireframeRef.current,
          magnifierRef.current?.querySelector('[data-scan-el="magnifier-content"]'),
          magnifierRef.current?.querySelector('[data-scan-el="magnifier-sweep"]'),
          magnifierRef.current?.querySelector('[data-scan-el="magnifier-label"]'),
        ].filter(Boolean),
        { clearProps: "all" }
      );
      [h1MarkerRef, subtitleMarkerRef, ctaMarkerRef, visualMarkerRef, wireframeRef].forEach((ref) => {
        if (!ref.current) return;
        ref.current.style.left = "";
        ref.current.style.top = "";
        ref.current.style.width = "";
        ref.current.style.height = "";
      });
      if (labelRef.current) labelRef.current.textContent = "Цифровой след сформирован";
    };

    const abort = () => {
      timeline?.kill();
      particleStop?.();
      cleanupInlineState();
    };

    const runReducedMotionVariant = () => {
      if (!gridRef.current) return;
      const gv = gridRef.current.querySelector('[data-scan-el="grid-v"]');
      const gh = gridRef.current.querySelector('[data-scan-el="grid-h"]');
      timeline = gsap.timeline({ onComplete: () => cleanupInlineState() });
      timeline
        .to([gv, gh].filter(Boolean), { opacity: 0.12, duration: 0.15 })
        .to([gv, gh].filter(Boolean), { opacity: 0, duration: 0.15 }, "+=0.3");
    };

    const flashMarker = (
      tl: gsap.core.Timeline,
      ref: React.RefObject<HTMLDivElement>,
      at: number,
      hold = 0.6
    ) => {
      if (!ref.current) return;
      tl.to(ref.current, { opacity: 1, duration: 0.16 }, at).to(
        ref.current,
        { opacity: 0, duration: 0.2 },
        at + 0.16 + hold
      );
    };

    const setRectEl = (el: HTMLElement | null, rect: Rect) => {
      if (!el) return;
      el.style.left = `${rect.x}px`;
      el.style.top = `${rect.y}px`;
      el.style.width = `${rect.width}px`;
      el.style.height = `${rect.height}px`;
    };

    const runFullScene = (tier: Tier) => {
      const isMobile = window.innerWidth < 768;
      const timeScale = isMobile ? 0.85 : 1;
      const showMagnifier = tier !== "low";
      const showWireframe = showMagnifier;
      const showParticles = tier === "high" && !isMobile;
      const showTintNoise = tier !== "low";

      const sectionRect = section.getBoundingClientRect();

      const h1El = section.querySelector<HTMLElement>('[data-hero-scan="h1"]');
      const subtitleEl = section.querySelector<HTMLElement>('[data-hero-scan="subtitle"]');
      const ctaEl = section.querySelector<HTMLElement>('[data-hero-scan="cta"]');
      const visualEl = section.querySelector<HTMLElement>('[data-hero-scan="visual"]');

      const targets: Array<[React.RefObject<HTMLDivElement>, string, HTMLElement | null]> = [
        [h1MarkerRef, "h1", h1El],
        [subtitleMarkerRef, "subtitle", subtitleEl],
        [ctaMarkerRef, "cta", ctaEl],
        [visualMarkerRef, "visual", visualEl],
      ];
      targets.forEach(([ref, key, el]) => {
        if (!el) return;
        const rect = relativeRect(sectionRect, el.getBoundingClientRect());
        markerRects.current[key] = rect;
        setRectEl(ref.current, rect);
      });
      if (visualEl && wireframeRef.current) {
        setRectEl(wireframeRef.current, markerRects.current.visual);
      }

      if (magnifierRef.current) {
        magnifierRef.current.style.setProperty(
          "--lens-size",
          `${isMobile ? MAGNIFIER_SIZE_MOBILE : MAGNIFIER_SIZE_DESKTOP}px`
        );
      }

      const heroHeight = sectionRect.height;

      timeline = gsap.timeline({
        defaults: { ease: "power1.inOut" },
        timeScale,
        onComplete: () => cleanupInlineState(),
      });
      const tl = timeline;

      // ───────────── Этап 1 — активация (0 – 1.1s) ─────────────
      tl.to(
        section,
        { duration: 0.001, onStart: () => { section.style.filter = "saturate(0.85) contrast(1.03)"; } },
        0
      );
      if (showTintNoise) {
        tl.to(tintRef.current, { opacity: 1, duration: 0.6 }, 0);
        tl.to(noiseRef.current, { opacity: 0.05, duration: 0.6 }, 0);
      }
      tl.to(statusRef.current, { opacity: 1, duration: 0.35 }, 0.3);
      // короткий универсальный outline на всех блоках
      targets.forEach(([ref]) => {
        if (!ref.current) return;
        tl.to(ref.current, { opacity: 0.55, duration: 0.2 }, 0.35).to(ref.current, { opacity: 0, duration: 0.25 }, 0.75);
      });

      // ───────────── Этап 2 — сетка строится (1.1 – 2.4s) ─────────────
      const gridV = gridRef.current?.querySelector('[data-scan-el="grid-v"]');
      const gridH = gridRef.current?.querySelector('[data-scan-el="grid-h"]');
      const gridDots = gridRef.current?.querySelector('[data-scan-el="grid-dots"]');
      const gridTicks = gridRef.current?.querySelector('[data-scan-el="grid-ticks"]');
      if (gridV) tl.to(gridV, { opacity: 0.14, duration: 0.55 }, 1.1);
      if (gridH) tl.to(gridH, { opacity: 0.14, duration: 0.55 }, 1.45);
      if (gridDots) tl.to(gridDots, { opacity: 0.22, duration: 0.5 }, 1.9);
      if (gridTicks) tl.to(gridTicks, { opacity: 0.8, duration: 0.4 }, 1.95);

      // ───────────── Этап 3 — лупа: локальные проверки ─────────────
      if (showMagnifier && magnifierRef.current && ctaEl) {
        const ctaRect = markerRects.current.cta;
        const ctaCenter = { x: ctaRect.x + ctaRect.width / 2, y: ctaRect.y + ctaRect.height / 2 };
        const spawn = { x: sectionRect.width * 0.5, y: sectionRect.height * 0.14 };

        tl.set(magnifierRef.current, { left: spawn.x, top: spawn.y, scale: 0.6, opacity: 0 }, 2.4);
        tl.to(magnifierRef.current, { opacity: 1, scale: 1, duration: 0.35 }, 2.4);
        tl.to(magnifierRef.current, { left: ctaCenter.x, top: ctaCenter.y, duration: 0.6, ease: "power2.inOut" }, 2.55);
        tl.call(() => mountMagnifiedClone(ctaEl), [], 3.15);
        const contentSlot = magnifierRef.current.querySelector('[data-scan-el="magnifier-content"]');
        if (contentSlot) {
          tl.set(contentSlot, { xPercent: -50, yPercent: -50, scale: 1 }, 2.4);
          tl.fromTo(contentSlot, { scale: 1 }, { scale: 1.4, duration: 0.35, ease: "power2.out" }, 3.15);
        }
        const sweep = magnifierRef.current.querySelector('[data-scan-el="magnifier-sweep"]');
        if (sweep) {
          tl.set(sweep, { x: "-120%", opacity: 0.9 }, 3.2);
          tl.to(sweep, { x: "220%", duration: 0.6, ease: "power1.inOut" }, 3.2);
        }
        const magLabel = magnifierRef.current.querySelector('[data-scan-el="magnifier-label"]');
        if (magLabel) {
          magLabel.textContent = "Action detected";
          tl.to(magLabel, { opacity: 1, duration: 0.2 }, 3.3).to(magLabel, { opacity: 0, duration: 0.2 }, 3.95);
        }
        flashMarker(tl, ctaMarkerRef, 3.15, 0.75);

        // переход к визуальному блоку
        if (visualEl) {
          const visRect = markerRects.current.visual;
          const visCenter = { x: visRect.x + visRect.width / 2, y: visRect.y + visRect.height / 2 };
          tl.call(() => clearMagnifierContent(), [], 4.25);
          if (contentSlot) tl.set(contentSlot, { scale: 1 }, 4.25);
          tl.to(magnifierRef.current, { left: visCenter.x, top: visCenter.y, duration: 0.6, ease: "power2.inOut" }, 4.3);
          tl.call(() => mountMagnifiedClone(visualEl), [], 4.95);
          if (contentSlot) tl.fromTo(contentSlot, { scale: 1 }, { scale: 1.35, duration: 0.35, ease: "power2.out" }, 4.95);
          if (sweep) {
            tl.set(sweep, { x: "-120%", opacity: 0.9 }, 5.0);
            tl.to(sweep, { x: "220%", duration: 0.6, ease: "power1.inOut" }, 5.0);
          }
          if (showWireframe && wireframeRef.current) {
            tl.to(wireframeRef.current, { opacity: 0.8, duration: 0.25 }, 4.95).to(
              wireframeRef.current,
              { opacity: 0, duration: 0.25 },
              5.55
            );
          }
          flashMarker(tl, visualMarkerRef, 4.95, 0.85);

          tl.call(() => clearMagnifierContent(), [], 6.15);
          tl.to(magnifierRef.current, { opacity: 0, scale: 0.7, duration: 0.3 }, 6.1);
        } else {
          tl.to(magnifierRef.current, { opacity: 0, scale: 0.7, duration: 0.3 }, 4.0);
        }
      }

      // ───────────── Этап 4 — основной проход scan-line (6.3 – 10.3s) ─────────────
      const sweepStart = 6.3;
      const SWEEP = 4.0;
      tl.fromTo(
        scanLineRef.current,
        { y: -20, opacity: 0 },
        { y: heroHeight + 20, opacity: 1, duration: SWEEP, ease: "power1.inOut" },
        sweepStart
      );
      tl.to(scanLineRef.current, { opacity: 0, duration: 0.25 }, sweepStart + SWEEP - 0.2);

      targets.forEach(([ref, key]) => {
        const rect = markerRects.current[key];
        if (!rect) return;
        const centerY = rect.y + rect.height / 2;
        const fraction = Math.min(Math.max(centerY / heroHeight, 0), 1);
        const at = sweepStart + fraction * SWEEP;
        const hold = key === "h1" ? 0.7 : key === "subtitle" ? 0.6 : 0.55;
        flashMarker(tl, ref, at, hold);
        // визуальный блок при проходе линии коротко мигает wireframe'ом (без лупы)
        if (key === "visual" && showWireframe && wireframeRef.current) {
          tl.to(wireframeRef.current, { opacity: 0.6, duration: 0.2 }, at).to(
            wireframeRef.current,
            { opacity: 0, duration: 0.25 },
            at + 0.45
          );
        }
      });

      // baseline guides по строкам H1 — синхронно с реакцией заголовка
      if (h1El) {
        const h1Rects = lineRects(sectionRect, h1El);
        const h1CenterY = markerRects.current.h1.y + markerRects.current.h1.height / 2;
        const h1At = sweepStart + Math.min(Math.max(h1CenterY / heroHeight, 0), 1) * SWEEP;
        h1Rects.forEach((r, i) => {
          const guide = document.createElement("div");
          guide.setAttribute("aria-hidden", "true");
          guide.style.position = "absolute";
          guide.style.left = `${r.x}px`;
          guide.style.top = `${r.y + r.height - 1}px`;
          guide.style.height = "1px";
          guide.style.width = `${r.width}px`;
          guide.style.background = "rgba(0,194,255,0.6)";
          guide.style.opacity = "0";
          guide.style.transformOrigin = "left center";
          overlayRootRef.current?.appendChild(guide);
          dynamicEls.push(guide);
          tl.fromTo(
            guide,
            { opacity: 0.9, scaleX: 0 },
            { scaleX: 1, duration: 0.25, ease: "power1.out" },
            h1At + i * 0.05
          ).to(guide, { opacity: 0, duration: 0.3 }, h1At + 0.5 + i * 0.05);
        });
        tl.to(
          h1El,
          { duration: 0.001, onStart: () => { h1El.style.textShadow = "0 0 10px rgba(0,194,255,0.55)"; } },
          h1At
        ).to(
          h1El,
          { duration: 0.001, onStart: () => { h1El.style.textShadow = ""; } },
          h1At + 0.65
        );
      }

      // line-by-line reveal подзаголовка
      if (subtitleEl) {
        const subRects = lineRects(sectionRect, subtitleEl);
        const subCenterY = markerRects.current.subtitle.y + markerRects.current.subtitle.height / 2;
        const subAt = sweepStart + Math.min(Math.max(subCenterY / heroHeight, 0), 1) * SWEEP;
        const subStart = subAt - 0.3;
        subRects.forEach((r, i) => {
          const bar = document.createElement("div");
          bar.setAttribute("aria-hidden", "true");
          bar.style.position = "absolute";
          bar.style.left = `${r.x}px`;
          bar.style.top = `${r.y}px`;
          bar.style.width = `${r.width}px`;
          bar.style.height = `${r.height}px`;
          bar.style.background = "linear-gradient(90deg, rgba(0,194,255,0.16), rgba(0,194,255,0.04))";
          bar.style.opacity = "0";
          overlayRootRef.current?.appendChild(bar);
          dynamicEls.push(bar);

          const tick = document.createElement("div");
          tick.setAttribute("aria-hidden", "true");
          tick.style.position = "absolute";
          tick.style.left = `${r.x - 6}px`;
          tick.style.top = `${r.y + r.height / 2 - 3}px`;
          tick.style.width = "5px";
          tick.style.height = "5px";
          tick.style.borderRadius = "50%";
          tick.style.background = "#7DE3FF";
          tick.style.boxShadow = "0 0 6px 1px rgba(0,194,255,0.7)";
          tick.style.opacity = "0";
          overlayRootRef.current?.appendChild(tick);
          dynamicEls.push(tick);

          const at = subStart + i * 0.12;
          tl.to([bar, tick], { opacity: 1, duration: 0.15 }, at).to([bar, tick], { opacity: 0, duration: 0.25 }, at + 0.4);
        });
      }

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

      // ───────────── Этап 5 — финальный статус и возврат ─────────────
      const finalAt = sweepEnd + 0.3;
      if (labelRef.current) labelRef.current.textContent = "Цифровой след сформирован";
      tl.to(labelRef.current, { opacity: 1, duration: 0.2 }, finalAt).to(labelRef.current, { opacity: 0, duration: 0.25 }, finalAt + 0.8);

      const returnStart = finalAt + 0.9;
      [gridV, gridH, gridDots, gridTicks].forEach((layer) => {
        if (!layer) return;
        tl.to(layer, { opacity: 0, duration: 0.3 }, returnStart);
      });
      tl.to(statusRef.current, { opacity: 0, duration: 0.3 }, returnStart);
      if (showTintNoise) {
        tl.to([tintRef.current, noiseRef.current], { opacity: 0, duration: 0.35 }, returnStart + 0.1);
      }
      tl.to(
        section,
        { duration: 0.35, onStart: () => { section.style.filter = "saturate(1) contrast(1)"; } },
        returnStart + 0.15
      );
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const timer = window.setTimeout(() => {
      if (cancelled) return;

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
      <ScanOverlay tintRef={tintRef} noiseRef={noiseRef} labelRef={labelRef} statusRef={statusRef} />
      <DigitalGrid ref={gridRef} />

      <ScanMarkers ref={h1MarkerRef} rect={markerRects.current.h1 ?? { x: 0, y: 0, width: 0, height: 0 }} label="TEXT BLOCK" />
      <ScanMarkers ref={subtitleMarkerRef} rect={markerRects.current.subtitle ?? { x: 0, y: 0, width: 0, height: 0 }} />
      <ScanMarkers ref={ctaMarkerRef} rect={markerRects.current.cta ?? { x: 0, y: 0, width: 0, height: 0 }} label="INTERACTION POINT" />
      <ScanMarkers ref={visualMarkerRef} rect={markerRects.current.visual ?? { x: 0, y: 0, width: 0, height: 0 }} />
      <WireframeOverlay ref={wireframeRef} rect={markerRects.current.visual ?? { x: 0, y: 0, width: 0, height: 0 }} />

      <ScanLine ref={scanLineRef} />
      <ScanParticles ref={particlesRef} />
      <ScanMagnifier ref={magnifierRef} />
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

  const COUNT = 40;
  const particles = Array.from({ length: COUNT }, () => ({
    x: Math.random() * rect.width,
    y: 0,
    vy: 0.5 + Math.random() * 1.2,
    vx: (Math.random() - 0.5) * 0.35,
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
      if (Math.abs(p.y - lineY) > 100 && p.y !== 0) {
        p.y = lineY + (Math.random() - 0.5) * 70;
        p.x = Math.random() * rect.width;
        p.life = 1;
      } else if (p.y === 0) {
        p.y = lineY + (Math.random() - 0.5) * 70;
      }
      p.y += p.vy;
      p.x += p.vx;
      p.life -= 0.008;
      const alpha = Math.max(0, Math.min(0.65, p.life));
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
