"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useDigitalScan } from "@/hooks/useDigitalScan";
import { ScanFallback } from "./ScanFallback";

// Three.js/GSAP не должны попадать в критический путь рендера Hero —
// подгружаем сцену лениво и только на клиенте.
const DigitalScanScene = dynamic(
  () => import("./DigitalScanScene").then((mod) => mod.DigitalScanScene),
  { ssr: false }
);

const START_DELAY_MS = 3000;

/**
 * Робот появляется и «сканирует» первый экран один раз за сессию:
 * полноценная 3D-сцена на десктопе, облегченная — на мобильных,
 * CSS-фолбэк без 3D — без WebGL, ничего — при prefers-reduced-motion
 * или если сцена уже проигрывалась в этой сессии.
 */
export function DigitalScanExperience() {
  const { tier, markPlayed } = useDigitalScan();
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (tier === "idle" || tier === "static" || done) return;
    const timer = setTimeout(() => setReady(true), START_DELAY_MS);
    return () => clearTimeout(timer);
  }, [tier, done]);

  if (done || tier === "idle" || tier === "static" || !ready) return null;

  const finish = () => {
    markPlayed();
    setDone(true);
  };

  if (tier === "fallback") return <ScanFallback onDone={finish} />;

  return <DigitalScanScene lite={tier === "lite"} onDone={finish} />;
}
