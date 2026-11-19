"use client";

import { useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Check, ChevronDown, AlertCircle } from "lucide-react";
import {
  SPECIALIZATIONS,
  formatPhoneInput,
  fullLeadSchema,
  shortLeadSchema,
  type FormSource,
  type LeadApiResponse,
} from "@/lib/lead-schema";
import { track } from "@/lib/analytics";
import { getUtm } from "@/lib/utm";
import { site } from "@/content/site";
import { Button, Spinner } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Variant = "full" | "short";
type Values = {
  name: string;
  phone: string;
  city: string;
  specialization: string;
  website: string;
  comment: string;
  consent: boolean;
};
type FieldName = keyof Values;
type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: Values = { name: "", phone: "", city: "", specialization: "", website: "", comment: "", consent: false };
const ORDER: FieldName[] = ["name", "phone", "city", "specialization", "website", "comment", "consent"];
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Props = {
  variant: Variant;
  source: FormSource;
  submitLabel: string;
  /** Вызывается после успешной отправки (например, чтобы модалка сфокусировала заголовок). */
  onSuccess?: () => void;
  footnote?: ReactNode;
};

export function LeadForm({ variant, source, submitLabel, onSuccess, footnote }: Props) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const inFlightRef = useRef(false);

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const schema = variant === "full" ? fullLeadSchema : shortLeadSchema;
  const isFull = variant === "full";

  function validate(v: Values): Partial<Record<FieldName, string>> {
    const result = schema.safeParse({
      ...v,
      city: isFull ? v.city : v.city || undefined,
      website: v.website || undefined,
      comment: v.comment || undefined,
    });
    if (result.success) return {};
    const out: Partial<Record<FieldName, string>> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as FieldName;
      if (key && !out[key]) out[key] = issue.message;
    }
    return out;
  }

  function markStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    track("lead_form_start", { form_source: source, variant });
  }

  function update<K extends FieldName>(name: K, value: Values[K]) {
    markStarted();
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name] || errors[name]) {
      const fieldError = validate(next)[name];
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
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
    const fieldError = validate(v)[name];
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  }

  function onPhoneChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Форматируем при вводе; при удалении оставляем как есть, чтобы не «застревать» на скобках и дефисах.
    const isDeleting = raw.length < values.phone.length;
    update("phone", isDeleting ? raw : formatPhoneInput(raw));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlightRef.current) return;

    const found = validate(values);
    setTouched(Object.fromEntries(ORDER.map((n) => [n, true])));
    setErrors(found);
    track("lead_form_submit_attempt", { form_source: source, variant });

    const firstInvalid = ORDER.find((n) => found[n]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      track("lead_form_error", { form_source: source, variant, code: "client_validation" });
      return;
    }

    inFlightRef.current = true;
    setStatus("submitting");
    setServerMessage(null);

    try {
      const res = await fetch(`${BASE_PATH}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variant,
          form_source: source,
          fields: {
            name: values.name,
            phone: values.phone,
            city: values.city || undefined,
            specialization: values.specialization,
            website: values.website || undefined,
            comment: values.comment || undefined,
            consent: values.consent,
          },
          utm: getUtm(),
          page_url: window.location.href.split("#")[0],
          referrer: document.referrer || undefined,
          company_url: honeypot || undefined,
        }),
        signal: AbortSignal.timeout(20_000),
      });
      const data = (await res.json().catch(() => null)) as LeadApiResponse | null;

      if (res.ok && data?.ok) {
        setTestMode(data.mode === "test");
        setStatus("success");
        track("lead_form_success", { form_source: source, variant });
        onSuccess?.();
        requestAnimationFrame(() => successRef.current?.focus());
        return;
      }

      if (data && !data.ok && data.fieldErrors) {
        setErrors(data.fieldErrors as Partial<Record<FieldName, string>>);
      }
      setServerMessage(data && !data.ok ? data.message : "Не удалось отправить заявку. Попробуйте ещё раз.");
      setStatus("error");
      track("lead_form_error", { form_source: source, variant, code: data && !data.ok ? data.code : `http_${res.status}` });
    } catch {
      setServerMessage("Не удалось связаться с сервером. Проверьте подключение к интернету и попробуйте ещё раз.");
      setStatus("error");
      track("lead_form_error", { form_source: source, variant, code: "network" });
    } finally {
      inFlightRef.current = false;
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-4 py-4 outline-none"
      >
        <span className="grid size-12 place-items-center rounded-full bg-success/10 text-success" aria-hidden="true">
          <Check className="size-6" strokeWidth={1.75} />
        </span>
        <p className="h3">Спасибо! Заявка отправлена.</p>
        <p className="text-muted-text">Мы свяжемся с вами по указанному номеру.</p>
        {testMode && (
          <p className="rounded-lg border border-dashed border-gold-ink/50 bg-ivory px-4 py-3 text-sm text-ink">
            Тестовый режим разработки: заявка принята обработчиком, но никуда не передана. Подключите доставку
            заявок (LEAD_DELIVERY_MODE) перед публикацией.
          </p>
        )}
      </div>
    );
  }

  const contactLine = site.contacts.phone || site.contacts.email;
  const submitting = status === "submitting";

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="on-light" aria-busy={submitting}>
      <div className={cn("grid gap-x-5 gap-y-5", isFull && "md:grid-cols-2")}>
        <Field id={id("name")} label="Имя" required error={touched.name ? errors.name : undefined}>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => onBlur("name")}
            {...fieldA11y(id("name"), touched.name ? errors.name : undefined)}
            className={inputClass(touched.name && errors.name)}
            maxLength={80}
          />
        </Field>

        <Field
          id={id("phone")}
          label="Телефон"
          required
          error={touched.phone ? errors.phone : undefined}
        >
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            value={values.phone}
            onChange={onPhoneChange}
            onFocus={() => !values.phone && update("phone", "+7 ")}
            onBlur={() => onBlur("phone")}
            {...fieldA11y(id("phone"), touched.phone ? errors.phone : undefined)}
            className={inputClass(touched.phone && errors.phone)}
            maxLength={24}
          />
        </Field>

        {isFull && (
          <Field id={id("city")} label="Город или регион" required error={touched.city ? errors.city : undefined}>
            <input
              id={id("city")}
              name="city"
              type="text"
              autoComplete="address-level2"
              value={values.city}
              onChange={(e) => update("city", e.target.value)}
              onBlur={() => onBlur("city")}
              {...fieldA11y(id("city"), touched.city ? errors.city : undefined)}
              className={inputClass(touched.city && errors.city)}
              maxLength={120}
            />
          </Field>
        )}

        <Field
          id={id("specialization")}
          label="Специализация"
          required
          error={touched.specialization ? errors.specialization : undefined}
        >
          <div className="relative">
            <select
              id={id("specialization")}
              name="specialization"
              value={values.specialization}
              onChange={(e) => {
                update("specialization", e.target.value);
                setTouched((p) => ({ ...p, specialization: true }));
                setErrors((p) => ({ ...p, specialization: undefined }));
              }}
              onBlur={() => onBlur("specialization")}
              {...fieldA11y(id("specialization"), touched.specialization ? errors.specialization : undefined)}
              className={cn(
                inputClass(touched.specialization && errors.specialization),
                "appearance-none pr-12",
                !values.specialization && "text-muted-text",
              )}
            >
              <option value="" disabled>
                Выберите направление
              </option>
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

        {isFull && (
          <Field
            id={id("website")}
            label="Сайт или ссылка на страницу"
            optional
            error={touched.website ? errors.website : undefined}
            className="md:col-span-2"
          >
            <input
              id={id("website")}
              name="website"
              type="text"
              inputMode="url"
              autoComplete="url"
              placeholder="example.ru"
              value={values.website}
              onChange={(e) => update("website", e.target.value)}
              onBlur={() => onBlur("website")}
              {...fieldA11y(id("website"), touched.website ? errors.website : undefined)}
              className={inputClass(touched.website && errors.website)}
              maxLength={300}
            />
          </Field>
        )}

        {isFull && (
          <Field
            id={id("comment")}
            label="Комментарий"
            optional
            hint="Без подробностей дел и сведений о доверителях"
            error={touched.comment ? errors.comment : undefined}
            className="md:col-span-2"
          >
            <textarea
              id={id("comment")}
              name="comment"
              rows={3}
              value={values.comment}
              onChange={(e) => update("comment", e.target.value)}
              onBlur={() => onBlur("comment")}
              {...fieldA11y(id("comment"), touched.comment ? errors.comment : undefined, true)}
              className={cn(inputClass(touched.comment && errors.comment), "min-h-28 resize-y py-3")}
              maxLength={1500}
            />
          </Field>
        )}
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

      <div className="mt-6">
        <label htmlFor={id("consent")} className="group flex cursor-pointer items-start gap-3.5">
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
              {...fieldA11y(id("consent"), touched.consent ? errors.consent : undefined)}
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
          <span className="text-[14px] leading-[1.55] text-muted-text">
            Даю согласие на обработку персональных данных в соответствии с{" "}
            <a
              href={`${BASE_PATH}${site.legal.privacyHref}`}
              target="_blank"
              rel="noopener"
              className="link-underline text-ink"
            >
              политикой обработки персональных данных
            </a>{" "}
            и{" "}
            <a
              href={`${BASE_PATH}${site.legal.consentHref}`}
              target="_blank"
              rel="noopener"
              className="link-underline text-ink"
            >
              согласием на обработку
            </a>
            .
          </span>
        </label>
        {touched.consent && errors.consent && (
          <p id={`${id("consent")}-error`} className="mt-2 flex items-center gap-1.5 pl-[38px] text-[14px] text-danger">
            {errors.consent}
          </p>
        )}
      </div>

      {status === "error" && serverMessage && (
        <div
          role="alert"
          className="mt-6 flex gap-3 rounded-[10px] border border-danger/30 bg-danger/[0.05] px-4 py-3 text-[15px] text-ink"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-danger" strokeWidth={1.75} aria-hidden="true" />
          <div>
            <p>{serverMessage}</p>
            {contactLine && (
              <p className="mt-1 text-muted-text">
                Вы также можете связаться с нами напрямую:{" "}
                {site.contacts.phone && (
                  <a
                    href={`tel:${site.contacts.phone.replace(/[^\d+]/g, "")}`}
                    className="link-underline text-ink"
                    onClick={() => track("phone_click", { place: "form_error" })}
                  >
                    {site.contacts.phone}
                  </a>
                )}
                {site.contacts.phone && site.contacts.email && ", "}
                {site.contacts.email && (
                  <a href={`mailto:${site.contacts.email}`} className="link-underline text-ink">
                    {site.contacts.email}
                  </a>
                )}
                .
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          type="submit"
          variant="primary-dark"
          size="lg"
          className="w-full sm:w-auto"
          disabled={submitting}
          aria-disabled={submitting}
        >
          {submitting ? (
            <>
              <Spinner />
              <span>Отправляем…</span>
            </>
          ) : (
            submitLabel
          )}
        </Button>
        {footnote}
      </div>
      <p className="sr-only" aria-live="polite">
        {submitting ? "Отправляем заявку" : ""}
      </p>
    </form>
  );
}

/* ---------------- helpers ---------------- */

function fieldA11y(fieldId: string, error: string | undefined, hasHint = false) {
  const describedBy = [error ? `${fieldId}-error` : null, hasHint && !error ? `${fieldId}-hint` : null].filter(Boolean);
  return {
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy.length ? describedBy.join(" ") : undefined,
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
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-[14px] font-semibold text-ink">
        <span>
          {label}
          {required && (
            <span className="ml-0.5 text-gold-ink" aria-hidden="true">
              *
            </span>
          )}
          {required && <span className="sr-only"> (обязательное поле)</span>}
        </span>
        {optional && <span className="text-[13px] font-normal text-muted-text">необязательно</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[14px] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-muted-text">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
