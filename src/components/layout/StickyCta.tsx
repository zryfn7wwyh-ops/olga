"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLeadModal } from "@/components/forms/LeadModal";
import { stickyCta } from "@/content/landing";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * Мобильная закреплённая кнопка «Получить план».
 * Появляется после первого экрана, скрывается у финальной формы и футера, не показывается на десктопе.
 */
export function StickyCta() {
  const { open } = useLeadModal();
  const [pastHero, setPastHero] = useState(false);
  const [nearForm, setNearForm] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const check = () => setDialogOpen(Boolean(document.querySelector("dialog[open]")));
    const mo = new MutationObserver(check);
    document.querySelectorAll("dialog").forEach((d) => mo.observe(d, { attributes: true, attributeFilter: ["open"] }));
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    const hero = document.getElementById("top");
    const targets = [document.getElementById("lead"), document.querySelector("footer")].filter(Boolean) as Element[];
    if (!hero || !("IntersectionObserver" in window)) return;
    const heroIo = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { threshold: 0 });
    const visible = new Set<Element>();
    const formIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setNearForm(visible.size > 0);
    });
    heroIo.observe(hero);
    targets.forEach((t) => formIo.observe(t));
    return () => {
      heroIo.disconnect();
      formIo.disconnect();
    };
  }, []);

  const shown = pastHero && !nearForm && !dialogOpen;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-[var(--on-dark-stroke)] bg-navy-deep/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 motion-reduce:transition-none lg:hidden",
        shown ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
      aria-hidden={!shown}
      inert={!shown}
    >
      <button
        type="button"
        aria-haspopup="dialog"
        data-form-source="sticky_cta"
        onClick={() => {
          track("mobile_sticky_cta_click");
          open("sticky_cta");
        }}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-gold font-semibold text-navy-deep"
      >
        {stickyCta}
        <ArrowRight className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );
}
