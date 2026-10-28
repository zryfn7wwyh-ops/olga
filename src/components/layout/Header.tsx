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
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const estimate = () => {
    setOpen(false);
    requestEstimate();
  };

  return (
    <header className={s.header}>
      <div className={`container ${s.bar}`}>
        <a className={s.logo} href="#top">
          <span className={s.logoMark} aria-hidden="true" />
          {company.shortBrand}
          <span className="visually-hidden"> — в начало страницы</span>
        </a>
        <nav className={s.nav} aria-label="Основная навигация">
          <ul className={s.navList}>
            {nav.map((item) => (
              <li key={item.href}>
                <a className={s.navLink} href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={s.actions}>
          <Button className={s.ctaDesktop} size="sm" onClick={estimate}>
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
      <div id="mobile-menu" className={s.mobileMenu} hidden={!open}>
        <nav className="container" aria-label="Мобильная навигация">
          <ul className={s.mobileList}>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Button block onClick={estimate}>
            Рассчитать стоимость
          </Button>
        </nav>
      </div>
    </header>
  );
}
