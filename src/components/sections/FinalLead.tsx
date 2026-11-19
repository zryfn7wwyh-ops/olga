import { ShieldCheck } from "lucide-react";
import { finalLead } from "@/content/landing";
import { LeadForm } from "@/components/forms/LeadForm";

/** Финальный захват заявки: та же короткая форма, что и в модальном окне. */
export function FinalLead() {
  return (
    <section id="lead" aria-labelledby="lead-title" className="on-dark relative overflow-hidden bg-navy-deep text-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_100%_100%,rgba(180,154,108,0.10),transparent_70%)]"
      />
      <div className="container-lp relative grid gap-10 py-16 md:py-24 lg:grid-cols-12 lg:items-center lg:gap-14 lg:py-28">
        <div className="lg:col-span-6" data-reveal>
          <p className="eyebrow mb-5">{finalLead.eyebrow}</p>
          <h2 id="lead-title" className="h2">
            {finalLead.title}
          </h2>
          <p className="lead mt-5 text-[var(--on-dark-muted)]">{finalLead.text}</p>
          <p className="mt-8 flex gap-3 text-[14px] text-[var(--on-dark-muted)]">
            <ShieldCheck className="size-5 shrink-0 text-gold-soft" strokeWidth={1.5} aria-hidden="true" />
            {finalLead.privacyNote}
          </p>
        </div>
        <div className="lg:col-span-6" data-reveal>
          <div className="relative rounded-[16px] bg-paper p-6 text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] sm:p-9">
            <span className="absolute top-0 left-9 h-px w-20 bg-gold" aria-hidden="true" />
            <LeadForm source="lead_section" submitLabel={finalLead.cta} />
          </div>
        </div>
      </div>
    </section>
  );
}
