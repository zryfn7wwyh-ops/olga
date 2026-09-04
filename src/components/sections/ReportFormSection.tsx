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
    <section
      id={sectionId}
      className="relative isolate overflow-hidden bg-navy py-16 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1.5px, transparent 1.5px)",
            backgroundSize: "26px 26px",
            opacity: 0.08,
            maskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black, transparent 75%)",
          }}
        />
        <div className="bg-blob left-[-10%] top-[-10%] h-80 w-80 animate-drift bg-primary/30" />
        <div className="bg-blob right-[-12%] bottom-[-12%] h-96 w-96 animate-drift-slow bg-primary/15" />
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="text-lg font-medium text-white/70">{text}</p>
        </div>

        {submitted ? (
          <div
            role="status"
            className="flex flex-col items-center gap-4 rounded-card border border-border bg-surface p-8 text-center shadow-card sm:p-10"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </span>
            <h3 className="font-heading text-2xl font-bold text-navy">{success.title}</h3>
            <p className="text-lg font-medium leading-relaxed text-text-secondary">{success.text}</p>
            <p className="text-lg font-medium leading-relaxed text-text-secondary">
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
