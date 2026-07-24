"use client";

import { useEffect, useRef, useState } from "react";
import { contacts } from "@/data/contacts";
import { MapPinIcon } from "@/components/ui/icons";

export function YandexMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const mapSrc = `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(
    contacts.address
  )}&z=16&l=map`;

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-cream sm:aspect-[16/9]"
    >
      {isVisible ? (
        <iframe
          title="Офис адвоката Аксёновой Аниты Георгиевны на карте"
          src={mapSrc}
          loading="lazy"
          className="h-full w-full border-0"
          allowFullScreen
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-text-muted">
          <MapPinIcon className="h-8 w-8 text-bronze" />
          <p className="max-w-xs text-center text-sm">{contacts.address}</p>
        </div>
      )}
    </div>
  );
}
