"use client";

import { useEffect, useRef } from "react";
import { contacts } from "@/data/contacts";
import { trackGoal, type AnalyticsPlacement } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { CloseIcon, PhoneIcon } from "@/components/ui/icons";

type CallModalProps = {
  isOpen: boolean;
  onClose: () => void;
  placement: AnalyticsPlacement;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function CallModal({ isOpen, onClose, placement }: CallModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="call-modal-title"
        aria-describedby="call-modal-description"
        className="relative w-full max-w-md rounded-2xl border border-bronze/30 bg-paper p-7 shadow-2xl animate-rise sm:p-9"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Закрыть окно"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-cream hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze"
        >
          <CloseIcon />
        </button>

        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald text-paper">
          <PhoneIcon className="h-5 w-5" />
        </span>

        <h2 id="call-modal-title" className="mt-5 text-2xl font-semibold text-ink">
          Обсудите ситуацию лично с адвокатом
        </h2>
        <p id="call-modal-description" className="mt-3 text-base leading-relaxed text-text-muted">
          Позвоните Аните Георгиевне, кратко опишите проблему и договоритесь о консультации или
          личной встрече.
        </p>

        <a
          href={`tel:${contacts.phone}`}
          onClick={() => trackGoal("call_modal_phone_click", { placement })}
          className="mt-6 block text-2xl font-semibold text-ink transition-colors hover:text-bronze sm:text-3xl"
        >
          {contacts.phoneDisplay}
        </a>

        <Button
          href={`tel:${contacts.phone}`}
          onClick={() => trackGoal("call_modal_phone_click", { placement })}
          size="lg"
          className="mt-6 w-full"
        >
          Позвонить сейчас
        </Button>
      </div>
    </div>
  );
}
