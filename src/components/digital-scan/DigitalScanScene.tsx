"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { RobotSceneCanvas } from "./RobotSceneCanvas";
import { ScanOverlay, type ScanOverlayHandle } from "./ScanOverlay";
import { createScanProxy, type ScanProxy } from "./scanProxy";

interface DigitalScanSceneProps {
  lite: boolean;
  onDone: () => void;
}

/**
 * Единый master-таймлайн (GSAP), который синхронно управляет 3D-роботом
 * (через прокси-объект, читаемый в useFrame) и DOM/SVG-оверлеем поверх
 * первого экрана (линия сканирования, сетка, data-маркеры, надпись).
 */
export function DigitalScanScene({ lite, onDone }: DigitalScanSceneProps) {
  const proxyRef = useRef<ScanProxy>(createScanProxy());
  const overlayRef = useRef<ScanOverlayHandle>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || !overlay.grid || !overlay.scannerLine || !overlay.footprint) return;

    const proxy = proxyRef.current;
    const k = lite ? 0.6 : 1;
    const markers = overlay.markers;
    const tl = gsap.timeline({ onComplete: onDone });

    // На узком портретном экране камера видит гораздо более узкий кадр
    // по горизонтали — точка покоя ближе к центру, иначе робот окажется
    // за пределами видимой области.
    const restX = lite ? 0.6 : 2.5;
    const restY = lite ? 1.2 : 1.55;
    const restZ = lite ? 0.4 : 0.2;

    // Сцена 01 — появление из угла
    tl.to(proxy, { scale: 1, y: -1.6, duration: 1.2 * k, ease: "back.out(1.6)" }, 0)
      // Сцена 02 — выход в пространство Hero
      .to(proxy, { x: restX, y: restY, z: restZ, rotY: -0.3, duration: 1.8 * k, ease: "power2.inOut" }, 1.2 * k)
      // Сцена 03 — подготовка к сканированию (lock target)
      .to(proxy, { sensorGlow: 1.8, duration: 0.8 * k, ease: "power1.in" }, 3.0 * k)
      .to(overlay.grid, { opacity: 0.5, duration: 0.6 * k }, 3.0 * k)
      // Сцена 04 — начало сканирования: объемный луч
      .to(proxy, { beamOpacity: 0.85, beamLength: 1, duration: 0.5 * k, ease: "power2.out" }, 3.8 * k)
      .to(overlay.scannerLine, { opacity: 1, duration: 0.3 * k }, 4.0 * k)
      .to(overlay.scannerLine, { y: "1100%", duration: 2.6 * k, ease: "power1.inOut" }, 4.0 * k)
      .to(markers, { opacity: 1, duration: 0.4 * k, stagger: 0.15 * k }, 4.3 * k)
      .fromTo(overlay.footprint, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 * k }, 5.0 * k)
      .to(overlay.footprint, { opacity: 0, y: -10, duration: 0.5 * k }, 6.2 * k)
      .to(overlay.scannerLine, { opacity: 0, duration: 0.4 * k }, 6.3 * k)
      // Сцена 20 — завершение анализа
      .to(markers, { opacity: 0, duration: 0.6 * k, stagger: 0.1 * k }, 7.2 * k)
      .to(overlay.grid, { opacity: 0, duration: 0.6 * k }, 7.0 * k)
      .to(proxy, { beamOpacity: 0, beamLength: 0.05, sensorGlow: 0.3, duration: 0.6 * k }, 7.0 * k)
      // Сцена 21 — финал: робот улетает обратно в угол
      .to(proxy, { x: 3.2, y: -2.6, z: -1, scale: 0.001, rotY: 0.6, duration: 1.3 * k, ease: "power2.in" }, 7.6 * k);

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden="true">
      <RobotSceneCanvas proxyRef={proxyRef} lite={lite} />
      <ScanOverlay ref={overlayRef} />
    </div>
  );
}
