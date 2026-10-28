"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Icon } from "./Icon";
import s from "./ui.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  /** Элемент, которому вернуть фокус после закрытия. */
  returnFocusTo?: HTMLElement | null;
};

/**
 * Модальный диалог на нативном <dialog>: showModal() делает остальную страницу
 * инертной, Escape закрывает, фокус возвращается на запускающую кнопку.
 */
export function Dialog({ open, onClose, title, description, children, returnFocusTo }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      // Фокус на первый интерактивный элемент содержимого (после кнопки закрытия).
      const first = el.querySelector<HTMLElement>("[data-autofocus]") ?? el.querySelector<HTMLElement>("input, button:not([data-close])");
      first?.focus();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleClose = () => {
      onCloseRef.current();
      returnFocusTo?.focus();
    };
    const handleCancel = (e: Event) => {
      e.preventDefault();
      el.close();
    };
    el.addEventListener("close", handleClose);
    el.addEventListener("cancel", handleCancel);
    return () => {
      el.removeEventListener("close", handleClose);
      el.removeEventListener("cancel", handleCancel);
    };
  }, [returnFocusTo]);

  // Удержание фокуса внутри диалога (Tab / Shift+Tab по кругу).
  const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== "Tab" || !ref.current) return;
    const items = Array.from(
      ref.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((n) => n.offsetParent !== null || n === document.activeElement);
    const radiosSeen = new Set<string>();
    const focusables = items.filter((n) => {
      if (n instanceof HTMLInputElement && n.type === "radio") {
        if (radiosSeen.has(n.name)) return n.checked;
        radiosSeen.add(n.name);
      }
      return true;
    });
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={ref}
      className={s.dialog}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      {open && (
        <div className={s.dialogInner}>
          <div className={s.dialogHeader}>
            <div style={{ display: "grid", gap: 8 }}>
              <h2 className={s.dialogTitle} id={titleId}>
                {title}
              </h2>
              {description && (
                <p id={descId} style={{ color: "var(--color-muted)" }}>
                  {description}
                </p>
              )}
            </div>
            <button type="button" className={s.dialogClose} onClick={() => ref.current?.close()} aria-label="Закрыть" data-close>
              <Icon name="close" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
