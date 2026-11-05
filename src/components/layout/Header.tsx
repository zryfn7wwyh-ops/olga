"use client";

import { useEffect, useRef, useState } from "react";
import { useLeadUI } from "@/components/forms/LeadUIProvider";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { company, nav } from "@/content/site";
import s from "./layout.module.css";

export function Header() {
  const { requestEstimate } = useLeadUI();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth > 860 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className={s.header}>
      <div className={s.bar}>
        <a className={s.logo} href="#top">
          <span className={s.mark} aria-hidden="true" />
          {company.shortBrand}
          <span className="visually-hidden"> — в начало страницы</span>
        </a>
        <nav className={s.nav} aria-label="Основная навигация">
          {nav.map((item) => (
            <a key={item.href} className={s.navLink} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={s.actions}>
          <Button className={s.ctaDesktop} onClick={() => requestEstimate()}>
            Рассчитать стоимость
          </Button>
          <button
            ref={btnRef}
            type="button"
            className={s.menuBtn}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
      <nav id="mobile-menu" className={s.mobileMenu} hidden={!open} aria-label="Мобильная навигация">
        {nav.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
