"use client";

import { useEffect, useRef } from "react";
import { HERO_SITE_TYPES } from "@/content/options";
import { Button } from "@/components/ui/Button";
import { RadioCardGroup } from "@/components/ui/RadioCard";
import { track } from "@/lib/analytics";
import { LeadContactFields } from "./LeadContactFields";
import { useLeadUI } from "./LeadUIProvider";
import { NoScriptNotice, SubmitErrorStatus, SuccessPanel } from "./SuccessPanel";
import { useLeadForm } from "./useLeadForm";
import s from "./forms.module.css";

/** Форма A — расчёт стоимости (source=hero_estimate). */
export function EstimateForm() {
  const ui = useLeadUI();
  const form = useLeadForm("hero_estimate");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track("estimate_form_view");
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={s.estimateCard} ref={cardRef}>
      <div className={s.cardHead}>
        <p className={s.cardKicker}>Предварительный расчёт</p>
        <h2 className={s.cardTitle} id="estimate-title">
          Рассчитать стоимость сайта
        </h2>
        <p className={s.cardText}>Выберите тип сайта и удобный способ связи — уточним задачу и подготовим оценку.</p>
      </div>

      {form.phase === "success" ? (
        <SuccessPanel form={form} onReset={form.reset} />
      ) : (
        <form
          ref={form.formRef}
          className={s.form}
          action="/api/leads"
          method="post"
          noValidate
          aria-labelledby="estimate-title"
          onSubmit={(e) => {
            e.preventDefault();
            void form.submit({ siteType: ui.siteType });
          }}
        >
          <div data-field="siteType">
            <RadioCardGroup
              idPrefix="estimate-site-type"
              name="siteType"
              legend="Тип сайта"
              options={HERO_SITE_TYPES}
              value={ui.siteType}
              onChange={ui.setSiteType}
              error={form.message("siteType")}
            />
          </div>
          <LeadContactFields form={form} idPrefix="estimate" contactRef={ui.estimateContactRef} />
          <SubmitErrorStatus form={form} />
          <Button type="submit" block loading={form.submitting} disabled={form.submitting}>
            {form.submitting ? "Отправляем…" : "Получить предварительный расчёт"}
          </Button>
          <NoScriptNotice />
        </form>
      )}
    </div>
  );
}
