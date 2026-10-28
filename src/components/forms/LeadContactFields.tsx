"use client";

import type { Ref } from "react";
import { legal } from "@/content/legal";
import { Checkbox } from "@/components/ui/Checkbox";
import { TextField } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/RadioCard";
import { contactFieldConfig, type ContactMethod } from "@/lib/validation";
import type { LeadFormState } from "./useLeadForm";
import s from "./forms.module.css";

const METHOD_OPTIONS = [
  { value: "phone", label: "Телефон" },
  { value: "email", label: "Email" },
] as const satisfies readonly { value: ContactMethod; label: string }[];

type Props = { form: LeadFormState; idPrefix: string; contactRef?: Ref<HTMLInputElement> };

/** Способ связи, контакт, согласие и скрытые служебные поля — общие для всех форм. */
export function LeadContactFields({ form, idPrefix, contactRef }: Props) {
  const cfg = contactFieldConfig(form.contactMethod);
  return (
    <>
      <input type="hidden" name="source" value={form.source} />
      <input type="hidden" name="consentVersion" value={legal.documentVersion} />
      <div className={s.honeypot} aria-hidden="true">
        <label htmlFor={`${idPrefix}-website`}>Сайт компании</label>
        <input
          id={`${idPrefix}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => form.setWebsite(e.target.value)}
        />
      </div>

      <div data-field="contactMethod">
        <Segmented
          name="contactMethod"
          legend="Как с вами связаться"
          options={METHOD_OPTIONS}
          value={form.contactMethod}
          onChange={form.setContactMethod}
        />
      </div>

      <div data-field="contact">
        <TextField
          ref={contactRef}
          key={form.contactMethod}
          id={`${idPrefix}-contact`}
          name="contact"
          label={cfg.label}
          type={cfg.type}
          inputMode={cfg.inputMode}
          autoComplete={cfg.autoComplete}
          placeholder={cfg.placeholder}
          maxLength={cfg.maxLength}
          required
          value={form.contact}
          onChange={(e) => {
            form.setContact(e.target.value);
            form.clearError("contact");
          }}
          error={form.message("contact")}
        />
      </div>

      {legal.consentRequired && (
        <div data-field="consent">
          <Checkbox
            id={`${idPrefix}-consent`}
            name="consent"
            checked={form.consent}
            onChange={(e) => {
              form.setConsent(e.target.checked);
              form.clearError("consent");
            }}
            error={form.message("consent")}
            label={
              <>
                Даю{" "}
                <a href={legal.consentHref} target="_blank" rel="noopener">
                  согласие на обработку персональных данных
                </a>{" "}
                для ответа на заявку. С{" "}
                <a href={legal.policyHref} target="_blank" rel="noopener">
                  политикой обработки персональных данных
                </a>{" "}
                ознакомлен(а).
              </>
            }
          />
        </div>
      )}
    </>
  );
}
