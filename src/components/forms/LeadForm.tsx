"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AlertCircle, Check, ChevronDown, Info, ShieldCheck } from "lucide-react";
import { leadPrivacyHint } from "@/content/landing";
import { SPECIALIZATIONS, formatPhoneInput, leadFieldsSchema, type FormSource } from "@/lib/lead-schema";
import { submitLead } from "@/lib/submit-lead";
import { track } from "@/lib/analytics";
import { site } from "@/content/site";
import { Button, Spinner } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Values = { name: string; phone: string; specialization: string; city: string; consent: boolean };
type FieldName = keyof Values;
type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: Values = { name: "", phone: "", specialization: "", city: "", consent: false };
const ORDER: FieldName[] = ["name", "phone", "specialization", "city", "consent"];
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const docHref = (href: string) => (href.startsWith("/") ? `${BASE_PATH}${href}` : href);

const newSubmissionId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

type Props = {
  source: FormSource;
  submitLabel: string;
  onSuccess?: () => void;
};

/**
 * Единая короткая форма (секция и модальное окно): имя и телефон обязательны,
 * специализация и город — по желанию, согласие на ПДн — отдельный неотмеченный чекбокс.
 */
export function LeadForm({ source, submitLabel, onSuccess }: Props) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const inFlightRef = useRef(false);
  const submissionIdRef = useRef<string>("");

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  function validate(v: Values): Partial<Record<FieldName, string>> {
    const result = leadFieldsSchema.safeParse({
      ...v,
      specialization: v.specialization || undefined,
      city: v.city || undefined,
    });
    if (result.success) return {};
    const out: Partial<Record<FieldName, string>> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as FieldName;
      if (key && !out[key]) out[key] = issue.message;
    }
    return out;
  }

  function update<K extends FieldName>(name: K, value: Values[K]) {
    if (!startedRef.current) {
      startedRef.current = true;
      track("lead_form_start", { form_source: source });
    }
    const next = { ...values, [name]: value };
    setValues(next);
    // Изменение данных — новая попытка отправки.
    submissionIdRef.current = "";
    if (touched[name] || errors[name]) setErrors((prev) => ({ ...prev, [name]: validate(next)[name] }));
    if (status === "error") {
      setStatus("idle");
      setServerMessage(null);
    }
  }

  function onBlur(name: FieldName) {
    setTouched((prev) => ({ ...prev, [name]: true }));
    let v = values;
    if (name === "phone") {
      const formatted = formatPhoneInput(values.phone).trim();
      v = { ...values, phone: formatted === "+7" || formatted === "+" ? "" : formatted };
      setValues(v);
    }
    setErrors((prev) => ({ ...prev, [name]: validate(v)[name] }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlightRef.current) return;

    const found = validate(values);
    setTouched(Object.fromEntries(ORDER.map((n) => [n, true])));
    setErrors(found);
    track("lead_form_submit_attempt", { form_source: source });

    const firstInvalid = ORDER.find((n) => found[n]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      track("lead_form_error", { form_source: source, code: "client_validation" });
      return;
    }

    inFlightRef.current = true;
    if (!submissionIdRef.current) submissionIdRef.current = newSubmissionId();
    setStatus("submitting");
    setServerMessage(null);

    const result = await submitLead({
      source,
      fields: values,
      honeypot,
      submissionId: submissionIdRef.current,
    });
    inFlightRef.current = false;

    if (result.status === "success") {
      setDemo(result.mode === "demo");
      setStatus("success");
      // Событие успеха — только при реальной доставке.
      if (result.mode === "live") track("lead_submit_success", { form_source: source });
      onSuccess?.();
      requestAnimationFrame(() => successRef.current?.focus());
      return;
    }
    if (result.fieldErrors) setErrors(result.fieldErrors as Partial<Record<FieldName, string>>);
    setServerMessage(result.message);
    setStatus("error");
    track("lead_form_error", { form_source: source, code: result.code });
  }

  if (status === "success") {
    return demo ? (
      <div ref={successRef} tabIndex={-1} role="status" className="flex flex-col items-start gap-3 py-2 outline-none">
        <span className="grid size-12 place-items-center rounded-full bg-gold/15 text-gold-ink" aria-hidden="true">
          <Info className="size-6" strokeWidth={1.75} />
        </span>
        <p className="h3">Демо: заявка не отправлена</p>
        <p className="text-muted-text">
          Это предпросмотр сайта. Форма проверила данные, но отправка в CRM ещё не подключена — заявка никуда не
          передана.
        </p>
      </div>
    ) : (
      <div ref={successRef} tabIndex={-1} role="status" className="flex flex-col items-start gap-3 py-2 outline-none">
        <span className="grid size-12 place-items-center rounded-full bg-success/10 text-success" aria-hidden="true">
          <Check className="size-6" strokeWidth={1.75} />
        </span>
        <p className="h3">Спасибо! Заявка отправлена.</p>
        <p className="text-muted-text">Мы свяжемся с вами по указанному номеру.</p>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="on-light" aria-busy={submitting}>
      <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
        <Field id={id("name")} label="Имя" required error={touched.name ? errors.name : undefined}>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => onBlur("name")}
            {...a11y(id("name"), touched.name ? errors.name : undefined)}
            className={inputClass(touched.name && errors.name)}
            maxLength={80}
          />
        </Field>

        <Field id={id("phone")} label="Телефон" required error={touched.phone ? errors.phone : undefined}>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            value={values.phone}
            onChange={(e) => {
              const raw = e.target.value;
              update("phone", raw.length < values.phone.length ? raw : formatPhoneInput(raw));
            }}
            onFocus={() => !values.phone && update("phone", "+7 ")}
            onBlur={() => onBlur("phone")}
            {...a11y(id("phone"), touched.phone ? errors.phone : undefined)}
            className={inputClass(touched.phone && errors.phone)}
            maxLength={24}
          />
        </Field>

        <Field id={id("specialization")} label="Специализация" optional>
          <div className="relative">
            <select
              id={id("specialization")}
              name="specialization"
              value={values.specialization}
              onChange={(e) => update("specialization", e.target.value)}
              className={cn(inputClass(false), "appearance-none pr-12", !values.specialization && "text-muted-text")}
            >
              <option value="">Не выбрано</option>
              {SPECIALIZATIONS.map((s) => (
                <option key={s.value} value={s.value} className="text-ink">
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
        </Field>

        <Field id={id("city")} label="Город" optional>
          <input
            id={id("city")}
            name="city"
            type="text"
            autoComplete="address-level2"
            value={values.city}
            onChange={(e) => update("city", e.target.value)}
            className={inputClass(false)}
            maxLength={120}
          />
        </Field>
      </div>

      {/* Honeypot */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor={id("company_url")}>Не заполняйте это поле</label>
        <input
          id={id("company_url")}
          type="text"
          name="company_url"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="mt-5">
        <label htmlFor={id("consent")} className="flex cursor-pointer items-start gap-3.5">
          <span className="relative mt-0.5 grid size-6 shrink-0 place-items-center">
            <input
              id={id("consent")}
              name="consent"
              type="checkbox"
              checked={values.consent}
              onChange={(e) => {
                update("consent", e.target.checked);
                setTouched((p) => ({ ...p, consent: true }));
                setErrors((p) => ({ ...p, consent: e.target.checked ? undefined : p.consent }));
              }}
              {...a11y(id("consent"), touched.consent ? errors.consent : undefined)}
              className={cn(
                "peer absolute inset-0 m-0 size-6 cursor-pointer appearance-none rounded-[6px] border bg-white transition-colors checked:border-navy checked:bg-navy",
                touched.consent && errors.consent ? "border-danger" : "border-[#9aa3a8]",
              )}
            />
            <Check
              className="pointer-events-none relative size-4 text-ivory opacity-0 peer-checked:opacity-100"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </span>
          <span className="text-[13.5px] leading-[1.55] text-muted-text">
            Даю{" "}
            <a href={docHref(site.legal.consentHref)} target="_blank" rel="noopener" className="link-underline text-ink">
              согласие на обработку персональных данных
            </a>{" "}
            в соответствии с{" "}
            <a href={docHref(site.legal.privacyHref)} target="_blank" rel="noopener" className="link-underline text-ink">
              политикой обработки персональных данных
            </a>
            .
          </span>
        </label>
        {touched.consent && errors.consent && (
          <p id={`${id("consent")}-error`} className="mt-2 pl-[38px] text-[14px] text-danger">
            {errors.consent}
          </p>
        )}
      </div>

      {status === "error" && serverMessage && (
        <div role="alert" className="mt-5 flex gap-3 rounded-[10px] border border-danger/30 bg-danger/[0.05] px-4 py-3 text-[15px] text-ink">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-danger" strokeWidth={1.75} aria-hidden="true" />
          <div>
            <p>{serverMessage}</p>
            {site.contacts.phone && (
              <p className="mt-1 text-muted-text">
                Или позвоните нам: <span className="text-ink">{site.contacts.phone}</span>
              </p>
            )}
          </div>
        </div>
      )}

      <Button type="submit" variant="primary-dark" size="lg" className="mt-6 w-full" disabled={submitting} aria-disabled={submitting}>
        {submitting ? (
          <>
            <Spinner />
            <span>Отправляем…</span>
          </>
        ) : (
          submitLabel
        )}
      </Button>
      <p className="mt-3 flex items-start justify-center gap-2 text-center text-[13px] text-muted-text">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold-ink" strokeWidth={1.75} aria-hidden="true" />
        {leadPrivacyHint}
      </p>
      {site.mode === "preview" && (
        <p className="mt-1 text-center text-[12.5px] text-muted-text">Предпросмотр: пока CRM не подключена, заявка не отправляется.</p>
      )}
      <p className="sr-only" aria-live="polite">
        {submitting ? "Отправляем заявку" : ""}
      </p>
    </form>
  );
}

function a11y(fieldId: string, error: string | undefined) {
  return {
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? `${fieldId}-error` : undefined,
  };
}

function inputClass(invalid: unknown) {
  return cn(
    "block w-full min-h-[52px] rounded-[10px] border bg-white px-4 text-[16px] text-ink placeholder:text-[#8a949a] transition-[border-color,box-shadow] duration-150",
    "focus:outline-none focus-visible:outline-none focus:border-navy focus:shadow-[0_0_0_3px_rgba(20,35,45,0.12)]",
    invalid ? "border-danger" : "border-stroke hover:border-[#b9bfbd]",
  );
}

function Field({
  id,
  label,
  required,
  optional,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-3 text-[14px] font-semibold text-ink">
        <span>
          {label}
          {required && (
            <span className="ml-0.5 text-gold-ink" aria-hidden="true">
              *
            </span>
          )}
          {required && <span className="sr-only"> (обязательное поле)</span>}
        </span>
        {optional && <span className="text-[12.5px] font-normal text-muted-text">по желанию</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[14px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
