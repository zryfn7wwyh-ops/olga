"use client";

import { useEffect, useRef, useState } from "react";
import { navigation, site } from "@/data/site";
import { contacts } from "@/data/contacts";
import { cn } from "@/lib/cn";
import { CTAButton } from "./ContactModal";
import { TrackedLink } from "./TrackedLink";
import { IconClose, IconPhone, IconTelegram } from "./Icons";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Мобильное меню: блокировка прокрутки, Escape, фокус
  useEffect(() => {
    if (!menuOpen) return;
    document.documentElement.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "on-dark fixed inset-x-0 top-0 z-50 text-ivory transition-[background-color,border-color,height] duration-300 ease-[var(--ease-premium)]",
        scrolled || menuOpen ? "border-b border-slate-2 bg-ink/95 backdrop-blur-md" : "border-b border-transparent bg-ink",
      )}
    >
      <div
        className={cn(
          "container-x flex items-center justify-between gap-3 transition-[height] sm:gap-6 duration-300 ease-[var(--ease-premium)]",
          scrolled ? "h-16" : "h-[72px] lg:h-[88px]",
        )}
      >
        {/* Логотип: основной актив бренда — имя */}
        <a href="#top" className="group flex min-h-11 items-center gap-3" aria-label={`${site.name} — ${site.role}, на главную`}>
          <span
            aria-hidden
            className="hidden h-9 w-9 place-items-center border border-bronze/60 font-serif text-[13px] tracking-[0.04em] text-bronze transition-colors duration-200 group-hover:border-bronze sm:grid"
          >
            AP
          </span>
          <span className="leading-none">
            <span className="block whitespace-nowrap text-[12px] font-bold tracking-[0.12em] xs:text-[13px] xs:tracking-[0.2em] sm:text-[14px]">АНТОН ПУДОВКИН</span>
            <span className="mt-1.5 block whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.14em] xs:text-[10px] xs:tracking-[0.2em] text-mist sm:text-[11px]">
              Арбитражный управляющий
            </span>
          </span>
        </a>

        <nav aria-label="Основная навигация" className="hidden xl:block">
          <ul className="flex items-center gap-5 2xl:gap-7">
            {navigation.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className="relative whitespace-nowrap py-2 text-[14px] text-ivory/80 transition-colors duration-200 hover:text-ivory after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-mist after:transition-transform after:duration-200 hover:after:scale-x-100"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <TrackedLink
            goal="phone_click"
            params={{ placement: "header" }}
            href={contacts.phone.href}
            className="hidden min-h-11 items-center whitespace-nowrap text-[15px] font-semibold tabular tracking-[0.01em] transition-colors duration-200 hover:text-mist md:inline-flex xl:hidden 2xl:inline-flex"
          >
            {contacts.phone.display}
          </TrackedLink>
          {contacts.telegram && (
            <TrackedLink
              goal="telegram_click"
              params={{ placement: "header" }}
              href={contacts.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в Telegram"
              className="hidden h-11 w-11 place-items-center border border-slate-2 text-mist transition-colors duration-200 hover:border-mist hover:text-ivory md:grid"
            >
              <IconTelegram className="h-[18px] w-[18px]" />
            </TrackedLink>
          )}
          <CTAButton placement="header" className="btn btn-primary hidden !min-h-11 !px-5 !text-[14px] lg:inline-flex" />
          {/* Мобильный телефон-иконка */}
          <TrackedLink
            goal="phone_click"
            params={{ placement: "header_mobile" }}
            href={contacts.phone.href}
            aria-label={`Позвонить: ${contacts.phone.display}`}
            className="grid h-11 w-11 place-items-center border border-slate-2 text-ivory md:hidden"
          >
            <IconPhone className="h-5 w-5" />
          </TrackedLink>
          <button
            ref={burgerRef}
            type="button"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center border border-slate-2 xl:hidden"
          >
            {menuOpen ? (
              <IconClose className="h-5 w-5" />
            ) : (
              <span aria-hidden className="flex w-5 flex-col gap-[5px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
                <span className="h-px w-3 bg-current" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!menuOpen}
        className="h-[calc(100dvh-64px)] overflow-y-auto border-t border-slate-2 bg-ink xl:hidden"
      >
        <nav aria-label="Мобильная навигация" className="container-x py-6">
          <ol>
            {navigation.map((n, i) => (
              <li key={n.id} className="border-b border-slate-2">
                <a
                  href={`#${n.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-14 items-baseline gap-5 py-3 transition-colors duration-200 hover:text-mist"
                >
                  <span className="tech w-6 text-bronze">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-[24px]">{n.label}</span>
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-8 grid gap-3 sm:max-w-sm">
            <TrackedLink goal="phone_click" params={{ placement: "mobile_menu" }} href={contacts.phone.href} className="btn btn-light">
              <IconPhone className="h-[18px] w-[18px]" /> {contacts.phone.display}
            </TrackedLink>
            <CTAButton placement="mobile_menu" className="btn btn-ghost-dark" />
          </div>
        </nav>
      </div>
    </header>
  );
}
