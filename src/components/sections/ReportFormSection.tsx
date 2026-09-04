"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { landingContent } from "@/content/landing";
import { LeadForm } from "@/components/forms/LeadForm";

export function ReportFormSection() {
  const [submitted, setSubmitted] = useState(false);
  const { sectionId, title, text } = landingContent.reportForm;
  const success = landingContent.successState;

  return (
    <section id={sectionId} className="bg-surface py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight text-navy sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-base text-text-secondary">{text}</p>
        </div>

        {submitted ? (
          <div
            role="status"
            className="flex flex-col items-center gap-4 rounded-card border border-success/30 bg-success/5 p-8 text-center sm:p-10"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </span>
            <h3 className="text-xl font-semibold text-navy">{success.title}</h3>
            <p className="text-[15px] leading-relaxed text-text-secondary">{success.text}</p>
            <p className="text-[15px] leading-relaxed text-text-secondary">
              {success.additionalText}
            </p>
          </div>
        ) : (
          <LeadForm onSuccess={() => setSubmitted(true)} />
        )}
      </div>
    </section>
  );
}
