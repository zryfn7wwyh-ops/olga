"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { LeadForm } from "./LeadForm";
import { track } from "@/lib/analytics";
import type { FormSource } from "@/lib/lead-schema";

type LeadModalContextValue = { open: (source: FormSource) => void };
const LeadModalContext = createContext<LeadModalContextValue | null>(null);

export function useLeadModal() {
  const ctx = useContext(LeadModalContext);
  if (!ctx) throw new Error("useLeadModal must be used inside <LeadModalProvider>");
  return ctx;
}

/**
 * Модальное окно с короткой формой. Построено на нативном <dialog>:
 * - фокус удерживается внутри (остальная страница inert при showModal);
 * - Escape, крестик и клик по подложке закрывают окно;
 * - скролл страницы под окном заблокирован;
 * - фокус возвращается на кнопку, которая открыла окно.
 */
export function LeadModalProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [source, setSource] = useState<FormSource>("hero_primary");
  const [isOpen, setIsOpen] = useState(false);
  // Новый ключ — чистая форма при каждом открытии после успешной отправки.
  const [formKey, setFormKey] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const open = useCallback(
    (src: FormSource) => {
      openerRef.current = document.activeElement as HTMLElement | null;
      setSource(src);
      if (submitted) {
        setSubmitted(false);
        setFormKey((k) => k + 1);
      }
      setIsOpen(true);
      track("lead_form_open", { form_source: src });
    },
    [submitted],
  );

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      // Фокус — на первое поле формы.
      requestAnimationFrame(() => dialog.querySelector<HTMLElement>("input:not([tabindex='-1']), select")?.focus());
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setIsOpen(false);
      document.documentElement.style.overflow = "";
      const opener = openerRef.current;
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  // Закрытие по клику на подложку (но не при выделении текста, начатом внутри панели).
  const downOnBackdrop = useRef(false);

  return (
    <LeadModalContext.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialogRef}
        className="lead-dialog"
        aria-labelledby="lead-modal-title"
        aria-describedby="lead-modal-desc"
        onMouseDown={(e) => {
          downOnBackdrop.current = e.target === e.currentTarget;
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget && downOnBackdrop.current) close();
        }}
      >
        <div className="dialog-panel relative max-h-[calc(100dvh-24px)] overflow-y-auto rounded-[16px] bg-paper px-5 pt-7 pb-7 shadow-[0_30px_80px_-20px_rgba(15,27,36,0.55)] sm:px-9 sm:pt-9 sm:pb-9">
          <span className="absolute top-0 left-9 h-px w-16 bg-gold" aria-hidden="true" />
          <button
            type="button"
            onClick={close}
            className="absolute top-3 right-3 grid size-11 place-items-center rounded-full text-muted-text transition-colors hover:bg-ivory hover:text-ink"
            aria-label="Закрыть окно"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
          <p className="eyebrow mb-4">План продвижения</p>
          <h2 id="lead-modal-title" className="h3 pr-10 text-[28px]! sm:text-[32px]!">
            Получить план привлечения клиентов
          </h2>
          <p id="lead-modal-desc" className="mt-3 mb-7 text-[15px] text-muted-text">
            Оставьте имя и телефон — обсудим специализацию, регион и текущие источники обращений.
          </p>
          {/* Форма остаётся смонтированной: введённые данные не теряются при случайном закрытии. */}
          <LeadForm
            key={formKey}
            source={source}
            submitLabel="Получить персональный план"
            onSuccess={() => setSubmitted(true)}
          />
        </div>
      </dialog>
    </LeadModalContext.Provider>
  );
}
