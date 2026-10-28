"use client";

import { useState } from "react";
import { BRIEF_SITE_TYPES, SCOPE_OPTIONS } from "@/content/options";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import type { Scope, SiteType } from "@/lib/leads/schema";
import { LIMITS } from "@/lib/validation";
import { LeadContactFields } from "./LeadContactFields";
import { NoScriptNotice, SubmitErrorStatus, SuccessPanel } from "./SuccessPanel";
import { useLeadForm } from "./useLeadForm";
import s from "./forms.module.css";

/** Форма D — подробный бриф (source=final_brief). */
export function BriefForm() {
  const form = useLeadForm("final_brief");
  const [siteType, setSiteType] = useState<SiteType>("unknown");
  const [scope, setScope] = useState<Scope>("unknown");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");

  if (form.phase === "success") {
    return (
      <SuccessPanel
        form={form}
        onReset={() => {
          form.reset();
          setDescription("");
          setName("");
        }}
      />
    );
  }

  return (
    <form
      ref={form.formRef}
      className={s.form}
      action="/api/leads"
      method="post"
      noValidate
      aria-labelledby="brief-title"
      onSubmit={(e) => {
        e.preventDefault();
        void form.submit({ siteType, scope, description, name });
      }}
    >
      <div className={s.briefGrid}>
        <div data-field="siteType">
          <SelectField
            id="brief-site-type"
            name="siteType"
            label="Тип сайта"
            options={BRIEF_SITE_TYPES}
            value={siteType}
            onChange={(e) => setSiteType(e.target.value as SiteType)}
            error={form.message("siteType")}
          />
        </div>
        <div data-field="scope">
          <SelectField
            id="brief-scope"
            name="scope"
            label="Объём"
            optional
            options={SCOPE_OPTIONS}
            value={scope}
            onChange={(e) => setScope(e.target.value as Scope)}
            error={form.message("scope")}
          />
        </div>
        <div className={s.span2} data-field="description">
          <TextAreaField
            id="brief-description"
            name="description"
            label="Описание задачи"
            optional
            hint={`Чем занимается компания, для чего нужен сайт, есть ли примеры, которые нравятся. До ${LIMITS.description} символов.`}
            maxLength={LIMITS.description}
            rows={5}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              form.clearError("description");
            }}
            error={form.message("description")}
          />
        </div>
        <div className={s.span2} data-field="name">
          <TextField
            id="brief-name"
            name="name"
            label="Как к вам обращаться"
            optional
            autoComplete="name"
            maxLength={LIMITS.name}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              form.clearError("name");
            }}
            error={form.message("name")}
          />
        </div>
      </div>
      <LeadContactFields form={form} idPrefix="brief" />
      <SubmitErrorStatus form={form} />
      <Button type="submit" loading={form.submitting} disabled={form.submitting}>
        {form.submitting ? "Отправляем…" : "Получить предварительный расчёт"}
      </Button>
      <NoScriptNotice />
    </form>
  );
}
