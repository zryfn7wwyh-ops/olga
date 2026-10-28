"use client";

import { useState } from "react";
import { DATA_CATEGORY_OPTIONS } from "@/content/options";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { RadioCardGroup } from "@/components/ui/RadioCard";
import type { DataCategory } from "@/lib/leads/schema";
import { LeadContactFields } from "./LeadContactFields";
import { SubmitErrorStatus, SuccessPanel } from "./SuccessPanel";
import { useLeadForm } from "./useLeadForm";
import s from "./forms.module.css";

type Props = { open: boolean; onClose: () => void; returnFocusTo: HTMLElement | null };

/** Форма C — консультация по работе сайта с персональными данными (source=pdn_consultation). */
export function ConsultationDialog({ open, onClose, returnFocusTo }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      returnFocusTo={returnFocusTo}
      title="Обсудить требования к сайту"
      description="Расскажите, какие данные сайт будет получать от посетителей, — обсудим техническую реализацию форм, согласий и интеграций и оценку работ."
    >
      <ConsultationFlow />
    </Dialog>
  );
}

function ConsultationFlow() {
  const [dataCategory, setDataCategory] = useState<DataCategory | null>(null);
  const form = useLeadForm("pdn_consultation");

  if (form.phase === "success") {
    return (
      <SuccessPanel
        form={form}
        text="Мы свяжемся с вами по указанному контакту, чтобы обсудить требования к сайту и оценку работ."
      />
    );
  }

  return (
    <form
      ref={form.formRef}
      className={s.form}
      noValidate
      aria-label="Заявка на консультацию"
      onSubmit={(e) => {
        e.preventDefault();
        void form.submit({ dataCategory });
      }}
    >
      <div data-field="dataCategory">
        <RadioCardGroup
          idPrefix="consult-data"
          name="dataCategory"
          legend="Какие данные планируете получать через сайт?"
          options={DATA_CATEGORY_OPTIONS}
          value={dataCategory}
          onChange={(v) => {
            setDataCategory(v);
            form.clearError("dataCategory");
          }}
          error={form.message("dataCategory")}
        />
      </div>
      <LeadContactFields form={form} idPrefix="consult" />
      <SubmitErrorStatus form={form} />
      <Button type="submit" block loading={form.submitting} disabled={form.submitting}>
        {form.submitting ? "Отправляем…" : "Обсудить требования и оценку"}
      </Button>
      <p className={s.legalNote}>
        Консультация касается технической реализации сайта и не заменяет юридическую экспертизу. Решения о правовой модели
        обработки данных принимает ваш специалист по персональным данным.
      </p>
    </form>
  );
}
