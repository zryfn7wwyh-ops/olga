"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { contacts } from "@/data/contacts";
import { trackGoal } from "@/lib/analytics";
import { IconClose, IconMail, IconPhone, IconTelegram } from "./Icons";

type Ctx = { open: (placement: string) => void };
const ModalContext = createContext<Ctx>({ open: () => {} });
export const useContactModal = () => useContext(ModalContext);

/**
 * Компактное модальное окно «Обсудить задачу».
 * Нативный <dialog>: фокус-ловушка, Escape и inert-фон из коробки.
 */
export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [placement, setPlacement] = useState("unknown");

  const open = useCallback((p: string) => {
    setPlacement(p);
    trackGoal("modal_open", { placement: p });
    ref.current?.showModal();
  }, []);

  const close = () => ref.current?.close();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    // Клик по подложке закрывает окно
    const onClick = (e: MouseEvent) => {
      if (e.target === d) d.close();
    };
    d.addEventListener("click", onClick);
    return () => d.removeEventListener("click", onClick);
  }, []);

  return (
    <ModalContext.Provider value={{ open }}>
      {children}
      <dialog
        ref={ref}
        aria-labelledby="contact-modal-title"
        className="on-dark m-auto w-[calc(100%-32px)] max-w-[560px] bg-ink p-0 text-ivory shadow-[0_40px_120px_-20px_rgb(0_0_0/0.6)] backdrop:backdrop-blur-[2px]"
      >
        <div className="relative border border-slate-2 p-7 sm:p-10">
          <button
            type="button"
            onClick={close}
            aria-label="Закрыть окно"
            className="absolute right-3 top-3 grid h-11 w-11 place-items-center text-mist transition-colors duration-200 hover:text-ivory"
          >
            <IconClose className="h-5 w-5" />
          </button>
          <span className="eyebrow">Прямой контакт</span>
          <h2 id="contact-modal-title" className="h-display mt-5 pr-8 text-[28px] sm:text-[34px]">
            Обсудите задачу напрямую с&nbsp;Антоном Пудовкиным
          </h2>
          <p className="mt-4 text-[16px] text-mist">
            Кратко опишите ситуацию по телефону или свяжитесь удобным способом.
          </p>
          <a
            href={contacts.phone.href}
            onClick={() => trackGoal("phone_click", { placement: `modal:${placement}` })}
            className="group mt-8 block border-y border-slate-2 py-6"
          >
            <span className="tech text-mist/80">Телефон</span>
            <span className="h-display mt-2 block text-[30px] tabular text-ivory transition-colors duration-200 group-hover:text-mist sm:text-[38px]">
              {contacts.phone.display}
            </span>
          </a>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              href={contacts.phone.href}
              onClick={() => trackGoal("phone_click", { placement: `modal:${placement}` })}
              className="btn btn-primary"
            >
              <IconPhone className="h-[18px] w-[18px]" /> Позвонить
            </a>
            {contacts.telegram ? (
              <a
                href={contacts.telegram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGoal("telegram_click", { placement: "modal" })}
                className="btn btn-ghost-dark"
              >
                <IconTelegram className="h-[18px] w-[18px]" /> Написать в&nbsp;Telegram
              </a>
            ) : (
              <a
                href={`mailto:${contacts.email}`}
                onClick={() => trackGoal("email_click", { placement: "modal" })}
                className="btn btn-ghost-dark"
              >
                <IconMail className="h-[18px] w-[18px]" /> Написать на&nbsp;e-mail
              </a>
            )}
          </div>
          <p className="mt-6 text-[13px] leading-relaxed text-mist/70">
            Ключевые вопросы и стратегия обсуждаются лично с&nbsp;Антоном, без передачи менеджерам.
          </p>
        </div>
      </dialog>
    </ModalContext.Provider>
  );
}

/** Кнопка «Обсудить задачу» — открывает модальное окно. */
export function CTAButton({
  placement,
  children = "Обсудить задачу",
  className = "btn btn-primary",
}: {
  placement: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { open } = useContactModal();
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={() => {
        trackGoal("cta_click", { placement });
        open(placement);
      }}
    >
      {children}
    </button>
  );
}
