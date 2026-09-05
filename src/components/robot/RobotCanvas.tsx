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
        camera={{ position: [-1.9, 0.35, 6.6], fov: 28 }}
        style={{ pointerEvents: "none" }}
      >
        {/* мягкий заполняющий свет + условное env-освещение для отражений */}
        <ambientLight intensity={0.55} />
        <hemisphereLight args={["#dbe8ff", "#0a1730", 0.55]} />
        {/* key light — сверху слева */}
        <directionalLight position={[3, 4.2, 4.5]} intensity={1.35} color="#ffffff" />
        {/* fill — деликатный, с противоположной стороны */}
        <directionalLight position={[-2.6, 1.2, 3.2]} intensity={0.35} color="#eef3ff" />
        {/* rim — холодный cyan сзади для контурного света */}
        <directionalLight position={[-2.2, 1.6, -3.4]} intensity={0.9} color="#6fd8ff" />
        <RobotModel />
      </Canvas>
    </div>
  );
}
