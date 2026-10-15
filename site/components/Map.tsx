"use client";

import { useEffect, useRef, useState } from "react";
import { contacts, mapEmbedUrl } from "@/data/contacts";
import { trackGoal } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * Яндекс Карта. Загружается лениво: iframe создаётся только когда блок
 * приближается к viewport. Координаты и адреса — в data/contacts.ts.
 */
export function YandexMap() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const office = contacts.offices[active];

  return (
    <div ref={ref} className="mt-16 lg:mt-24">
      <div role="tablist" aria-label="Офис на карте" className="flex gap-2">
        {contacts.offices.map((o, i) => (
          <button
            key={o.id}
            role="tab"
            aria-selected={active === i}
            onClick={() => {
              setActive(i);
              trackGoal("map_interaction", { office: o.id });
            }}
            className={cn(
              "min-h-11 border px-5 text-[14px] font-semibold transition-colors duration-200",
              active === i ? "border-mist bg-ivory text-ink" : "border-slate-2 text-mist hover:border-mist hover:text-ivory",
            )}
          >
            {o.city}
          </button>
        ))}
      </div>
      <div className="relative mt-4 aspect-[4/5] w-full overflow-hidden bg-slate xs:aspect-[4/3] md:aspect-[21/9]" onPointerDown={() => trackGoal("map_interaction", { type: "pointer" })}>
        {visible ? (
          <iframe
            key={office.id}
            src={mapEmbedUrl(office, contacts.map.zoom)}
            title={`Карта: ${office.city}, ${office.address}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full grayscale-[55%] contrast-[0.95]"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-mist">
            <span className="tech">Карта загружается…</span>
          </div>
        )}
      </div>
    </div>
  );
}
