"use client";

import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { landingContent } from "@/content/landing";
import { leadFormSchema, type LeadFormSchema } from "@/lib/validation/leadFormSchema";
import { formatPhoneInput } from "@/lib/format/formatPhone";
import { captureAndGetUtmParams } from "@/lib/lead-submit/getUtmParams";
import { submitLead } from "@/lib/lead-submit/submitLead";
import { trackEvent } from "@/lib/analytics/events";
import type { LeadFormData } from "@/types/lead";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ConsentLabel } from "@/components/forms/ConsentLabel";

interface LeadFormProps {
  onSuccess: () => void;
}

export function LeadForm({ onSuccess }: LeadFormProps) {
  const content = landingContent.form;
  const hasStartedRef = useRef(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormSchema>({
    resolver: zodResolver(leadFormSchema),
    mode: "onSubmit",
    defaultValues: {
      inn: "",
      phone: "",
      email: "",
      websiteUrl: "",
      personalDataConsent: false,
      marketingConsent: false,
      website: "",
    },
  });

  const hasWebsite = watch("hasWebsite");

  useEffect(() => {
    trackEvent("report_form_view");
    const utm = captureAndGetUtmParams();
    if (utm.utmSource) setValue("utmSource", utm.utmSource);
    if (utm.utmMedium) setValue("utmMedium", utm.utmMedium);
    if (utm.utmCampaign) setValue("utmCampaign", utm.utmCampaign);
    if (utm.utmContent) setValue("utmContent", utm.utmContent);
    if (utm.utmTerm) setValue("utmTerm", utm.utmTerm);
    if (utm.referrer) setValue("referrer", utm.referrer);
    setValue("pageUrl", utm.pageUrl || window.location.href);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFirstInteraction = () => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackEvent("report_form_start");
    }
  };

  const onSubmit = async (data: LeadFormSchema) => {
    // Honeypot: если скрытое поле заполнено — это бот. Молча
    // показываем успех, не отправляя данные.
    if (data.website) {
      onSuccess();
      return;
    }

    trackEvent("report_form_submit");

    const payload: LeadFormData = {
      inn: data.inn,
      phone: data.phone,
      email: data.email,
      hasWebsite: data.hasWebsite as LeadFormData["hasWebsite"],
      websiteUrl: data.websiteUrl || undefined,
      employees: data.employees as LeadFormData["employees"],
      legalForm: data.legalForm as LeadFormData["legalForm"],
      personalDataConsent: data.personalDataConsent,
      marketingConsent: data.marketingConsent,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      utmContent: data.utmContent,
      utmTerm: data.utmTerm,
      referrer: data.referrer,
      pageUrl: data.pageUrl,
    };

    try {
      const result = await submitLead(payload);
      if (result.success) {
        trackEvent("report_form_success");
        onSuccess();
      } else {
        throw new Error("submitLead returned success: false");
      }
    } catch {
      trackEvent("report_form_error");
      setError("root", { message: content.errors.submit });
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      onFocusCapture={handleFirstInteraction}
      className="relative flex flex-col gap-5 rounded-card border border-border bg-surface p-5 shadow-card sm:p-8"
    >
      {/* Honeypot: скрыто от людей, оставлено доступным ботам-краулерам */}
      <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Оставьте это поле пустым</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          control={control}
          name="inn"
          render={({ field }) => (
            <Input
              label={content.inn.label}
              placeholder={content.inn.placeholder}
              inputMode="numeric"
              autoComplete="off"
              required
              error={errors.inn?.message}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 12))}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <Input
              label={content.phone.label}
              placeholder={content.phone.placeholder}
              inputMode="tel"
              autoComplete="tel"
              required
              error={errors.phone?.message}
              value={field.value}
              onChange={(e) => field.onChange(formatPhoneInput(e.target.value))}
              onFocus={(e) => {
                if (!e.target.value) field.onChange("+7");
              }}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />
      </div>

      <Input
        label={content.email.label}
        placeholder={content.email.placeholder}
        type="email"
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register("email")}
      />

      <Controller
        control={control}
        name="hasWebsite"
        render={({ field }) => (
          <div className="flex flex-col gap-5">
            <SegmentedControl
              legend={content.hasWebsite.question}
              name={field.name}
              options={content.hasWebsite.options as unknown as { value: string; label: string }[]}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                trackEvent("has_website_selected", { value });
              }}
              error={errors.hasWebsite?.message}
              required
            />
            {hasWebsite === "yes" && (
              <Input
                label={content.websiteUrl.label}
                placeholder={content.websiteUrl.placeholder}
                autoComplete="url"
                {...register("websiteUrl")}
              />
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name="employees"
        render={({ field }) => (
          <SegmentedControl
            legend={content.employees.question}
            name={field.name}
            options={content.employees.options as unknown as { value: string; label: string }[]}
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              trackEvent("employees_selected", { value });
            }}
            error={errors.employees?.message}
            required
          />
        )}
      />

      <Select
        label={content.legalForm.question}
        options={content.legalForm.options as unknown as { value: string; label: string }[]}
        required
        error={errors.legalForm?.message}
        {...register("legalForm", {
          onChange: (e) => trackEvent("legal_form_selected", { value: e.target.value }),
        })}
      />

      <div className="flex flex-col gap-4 border-t border-border pt-5">
        <Checkbox
          label={<ConsentLabel segments={content.consent1} />}
          error={errors.personalDataConsent?.message}
          {...register("personalDataConsent")}
        />
        <Checkbox
          label={<ConsentLabel segments={content.consent2} />}
          error={errors.marketingConsent?.message}
          {...register("marketingConsent")}
        />
      </div>

      {errors.root?.message && (
        <p role="alert" className="text-base font-semibold text-danger">
          {errors.root.message}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="w-full">
        {isSubmitting ? content.submit.loading : content.submit.default}
      </Button>
    </form>
  );
}
