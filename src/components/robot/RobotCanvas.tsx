"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { RobotModel } from "./RobotModel";

/**
 * Контейнер робота: ограничен областью Hero (absolute, не fixed на весь
 * документ), занимает ~1/8 высоты экрана, полностью внутри viewport.
 * Только статичный объект — без GSAP, без сканирования, без движения.
 */
export function RobotCanvas() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className="pointer-events-none absolute bottom-6 right-8 z-10 h-[clamp(100px,12.5vh,150px)] w-[clamp(75px,9.375vh,112.5px)] select-none transition-opacity duration-300 ease-out lg:bottom-8 lg:right-12"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 28 }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.7} />
        <hemisphereLight args={["#dbe8ff", "#0a1730", 0.5]} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-3, -1, 2]} intensity={0.6} color="#4fd6ff" />
        <RobotModel />
      </Canvas>
    </div>
  );
}
