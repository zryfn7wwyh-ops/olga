"use client";

import { useEffect, useState } from "react";
import { contacts } from "@/data/contacts";
import { useCallModal } from "@/components/CallModalProvider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { SocialIconLink } from "@/components/ui/SocialIconLink";
import { MaxIcon, MenuIcon, CloseIcon, PhoneIcon, TelegramIcon } from "@/components/ui/icons";

const NAV_LINKS = [
  { href: "#services", label: "Услуги" },
  { href: "#about", label: "Об адвокате" },
  { href: "#process", label: "Как проходит работа" },
  { href: "#cases", label: "Кейсы" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#prices", label: "Стоимость" },
  { href: "#contacts", label: "Контакты" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openModal } = useCallModal();

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 12);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-paper/95 shadow-[0_1px_0_0_var(--color-line)] backdrop-blur-sm"
          : "bg-paper/80 backdrop-blur-sm"
      }`}
    >
      <Container size="wide" className="flex h-16 items-center justify-between gap-4 py-3 sm:h-20">
        <a href="#" className="flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-bronze/50 font-display text-lg text-ink">
            АА
          </span>
          <span className="hidden flex-col leading-tight xl:flex">
            <span className="font-display text-base font-semibold text-ink">Адвокат</span>
            <span className="text-sm text-text-muted whitespace-nowrap">
              Аксёнова Анита Георгиевна
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-3 2xl:gap-4 xl:flex" aria-label="Основная навигация">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-text transition-colors hover:text-bronze"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-4 xl:flex">
          <PhoneLink
            placement="header"
            className="whitespace-nowrap text-sm font-semibold text-ink hover:text-bronze"
          >
            {contacts.phoneDisplay}
          </PhoneLink>
          <Button onClick={() => openModal("header")} size="md" className="whitespace-nowrap">
            Позвонить
          </Button>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <PhoneLink
            placement="header"
            aria-label="Позвонить адвокату"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink"
          >
            <PhoneIcon className="h-5 w-5" />
          </PhoneLink>
          <button
            type="button"
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </Container>

      {isMenuOpen ? (
        <div className="border-t border-line bg-paper xl:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-medium text-text transition-colors hover:bg-cream hover:text-bronze"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex items-center gap-3 border-t border-line pt-4">
              <SocialIconLink
                href={contacts.maxUrl}
                label="Написать в MAX"
                icon={<MaxIcon className="h-4 w-4" />}
                goal="max_click"
                placement="header"
              />
              <SocialIconLink
                href={contacts.telegramUrl}
                label="Написать в Telegram"
                icon={<TelegramIcon className="h-4 w-4" />}
                goal="telegram_click"
                placement="header"
              />
              <PhoneLink placement="header" className="ml-auto text-base font-semibold text-ink">
                {contacts.phoneDisplay}
              </PhoneLink>
            </div>
            <Button
              onClick={() => {
                setIsMenuOpen(false);
                openModal("header");
              }}
              size="lg"
              className="mt-4 w-full"
            >
              Позвонить адвокату
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
