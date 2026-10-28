"use client";

import { Button } from "@/components/ui/Button";
import { FormStatus } from "@/components/ui/FormStatus";
import { Icon } from "@/components/ui/Icon";
import type { LeadFormState } from "./useLeadForm";
import s from "./forms.module.css";

export const SUCCESS_TEXT =
  "Мы свяжемся с вами по указанному контакту, чтобы уточнить задачу и подготовить предварительную оценку.";

export function SuccessPanel({ form, text = SUCCESS_TEXT, onReset }: { form: LeadFormState; text?: string; onReset?: () => void }) {
  return (
    <div className={s.success}>
      <span className={s.successIcon}>
        <Icon name="check" size={24} />
      </span>
      <FormStatus ref={form.statusRef} tone="success" title="Спасибо! Заявка получена." testMode={form.testMode}>
        {text}
      </FormStatus>
      {onReset && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Отправить ещё одну заявку
        </Button>
      )}
    </div>
  );
}

/** Статус ошибки отправки (сеть/сервер) — данные формы при этом сохраняются. */
export function SubmitErrorStatus({ form }: { form: LeadFormState }) {
  return (
    <FormStatus ref={form.phase === "error" ? form.statusRef : undefined} tone={form.phase === "error" ? "error" : "idle"}>
      {form.errorText}
    </FormStatus>
  );
}

export function NoScriptNotice() {
  return (
    <noscript>
      <p className={s.noscript}>
        Для удобной отправки включите JavaScript. Без него форма тоже отправится, но без подсказок при заполнении.
      </p>
    </noscript>
  );
}
