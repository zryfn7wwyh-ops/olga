"use client";

import { useCallback, useRef, useState } from "react";
import { legal } from "@/content/legal";
import { track } from "@/lib/analytics";
import { newIdempotencyKey, submitLead } from "@/lib/leads/client";
import { FIELD_ORDER, parseLeadPayload, type FieldErrors, type LeadPayload, type LeadSource } from "@/lib/leads/schema";
import { readAttribution } from "@/lib/utm";
import { contactErrorMessage, FIELD_ERROR_MESSAGES, type ContactErrorCode, type ContactMethod } from "@/lib/validation";

export type FormPhase = "idle" | "invalid" | "submitting" | "success" | "error";

type Extra = Partial<Pick<LeadPayload, "siteType" | "name" | "description" | "scope" | "answers" | "dataCategory">>;

export const NETWORK_ERROR_TEXT = "Не удалось отправить заявку. Попробуйте ещё раз.";
export const RATE_LIMIT_TEXT = "Слишком много попыток отправки. Попробуйте немного позже.";

/**
 * Общая логика заявки: способ связи, контакт, согласие, honeypot,
 * статусы idle → invalid → submitting → success / error.
 */
export function useLeadForm(source: LeadSource) {
  const [contactMethod, setContactMethodState] = useState<ContactMethod>("phone");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [phase, setPhase] = useState<FormPhase>("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(false);
  const keyRef = useRef<string | null>(null);
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  /** Смена способа связи очищает контакт и его ошибку, остальные ответы сохраняются. */
  const setContactMethod = useCallback((m: ContactMethod) => {
    setContactMethodState(m);
    setContact("");
    setErrors((e) => ({ ...e, contact: undefined }));
  }, []);

  const clearError = useCallback((field: keyof FieldErrors) => {
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  }, []);

  const message = useCallback(
    (field: keyof FieldErrors): string | null => {
      const code = errors[field];
      if (!code) return null;
      if (field === "contact") return contactErrorMessage(code as ContactErrorCode, contactMethod);
      return FIELD_ERROR_MESSAGES[code] ?? FIELD_ERROR_MESSAGES.invalid_option;
    },
    [errors, contactMethod],
  );

  const focusFirstError = (errs: FieldErrors) => {
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (!first || !formRef.current) return;
    requestAnimationFrame(() => {
      const scope = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
      const target =
        scope?.querySelector<HTMLElement>("input:checked") ?? scope?.querySelector<HTMLElement>("input, select, textarea");
      target?.focus();
    });
  };

  const submit = useCallback(
    async (extra: Extra = {}) => {
      if (inFlight.current) return; // защита от двойного клика
      keyRef.current ??= newIdempotencyKey();
      const payload: LeadPayload = {
        source,
        siteType: extra.siteType ?? null,
        contactMethod,
        contact,
        name: extra.name ?? null,
        description: extra.description ?? null,
        scope: extra.scope ?? null,
        answers: extra.answers ?? null,
        dataCategory: extra.dataCategory ?? null,
        consent: { accepted: consent, documentVersion: legal.documentVersion },
        attribution: readAttribution(),
        idempotencyKey: keyRef.current,
        website,
      };

      track("lead_submit_attempt", { source });
      const check = parseLeadPayload(payload);
      if (!check.ok) {
        setErrors(check.errors);
        setPhase("invalid");
        setErrorText(null);
        track("lead_submit_error", { source, reason: "validation" });
        focusFirstError(check.errors);
        return;
      }

      inFlight.current = true;
      setErrors({});
      setErrorText(null);
      setPhase("submitting");
      const result = await submitLead(payload);
      inFlight.current = false;

      if (result.ok) {
        setPhase("success");
        setTestMode(result.testMode);
        keyRef.current = null;
        track("lead_submit_success", { source });
        requestAnimationFrame(() => statusRef.current?.focus());
        return;
      }
      if (result.kind === "validation") {
        setErrors(result.fields);
        setPhase("invalid");
        focusFirstError(result.fields);
      } else {
        setPhase("error");
        setErrorText(result.kind === "rate_limited" ? RATE_LIMIT_TEXT : NETWORK_ERROR_TEXT);
        requestAnimationFrame(() => statusRef.current?.focus());
      }
      track("lead_submit_error", { source, reason: result.kind });
    },
    [source, contactMethod, contact, consent, website],
  );

  const reset = useCallback(() => {
    setContact("");
    setConsent(false);
    setErrors({});
    setPhase("idle");
    setErrorText(null);
    keyRef.current = null;
  }, []);

  return {
    source,
    contactMethod,
    setContactMethod,
    contact,
    setContact,
    consent,
    setConsent,
    website,
    setWebsite,
    errors,
    clearError,
    message,
    phase,
    errorText,
    testMode,
    submit,
    reset,
    formRef,
    statusRef,
    submitting: phase === "submitting",
  };
}

export type LeadFormState = ReturnType<typeof useLeadForm>;
