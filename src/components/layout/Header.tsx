"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/content/site";
import { CtaButton } from "@/components/forms/CtaButton";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";

export function Header() {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!menuRef.current?.contains(target) && !toggleRef.current?.contains(target)) setMenuOpen(false);
    };
    const onResize = () => window.innerWidth >= 1024 && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "on-dark sticky top-0 z-50 text-ivory transition-[background-color,border-color,box-shadow] duration-300",
        compact || menuOpen
          ? "border-b border-[var(--on-dark-stroke)] bg-navy-deep/95 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.6)] backdrop-blur-md"
          : "border-b border-transparent bg-navy-deep",
      )}
    >
      <a
        href="#main"
        className="sr-only z-[60] rounded-md bg-gold px-4 py-2 font-semibold text-navy-deep focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Перейти к содержанию
      </a>
      <div
        className={cn(
          "container-lp flex items-center justify-between gap-6 transition-[height] duration-300",
          compact ? "h-[var(--header-h-compact)]" : "h-[var(--header-h)]",
        )}
      >
        <Logo />

        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative py-2 text-[15px] font-medium text-[var(--on-dark-muted)] transition-colors hover:text-ivory after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <CtaButton source="header_cta" size="md" arrow={false}>
              {site.headerCta}
            </CtaButton>
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="grid size-12 place-items-center rounded-[10px] text-ivory transition-colors hover:bg-white/5 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!menuOpen}
        className="border-t border-[var(--on-dark-stroke)] bg-navy-deep lg:hidden"
      >
        <nav aria-label="Мобильная навигация" className="container-lp py-4">
          <ul className="flex flex-col">
            {site.nav.map((item) => (
              <li key={item.href} className="border-b border-[var(--on-dark-stroke)] last:border-b-0">
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-14 items-center font-serif text-[24px] text-ivory transition-colors hover:text-gold-soft"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="pt-4 pb-2 sm:hidden" onClick={() => setMenuOpen(false)}>
            <CtaButton source="header_cta" className="w-full">
              {site.headerCta}
            </CtaButton>
          </div>
        </nav>
      </div>
    </header>
  );
}
