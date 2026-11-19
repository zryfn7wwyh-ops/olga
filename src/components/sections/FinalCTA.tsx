import { finalCta } from "@/content/landing";
import { CtaButton } from "@/components/forms/CtaButton";

export function FinalCTA() {
  return (
    <section aria-labelledby="final-title" className="on-dark relative overflow-hidden bg-navy-deep text-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_100%_100%,rgba(180,154,108,0.10),transparent_70%)]"
      />
      <div className="container-lp relative py-20 md:py-28 lg:py-36">
        <span className="gold-rule mb-10 w-28" aria-hidden="true" />
        <h2 id="final-title" className="h2 max-w-[28ch] lg:text-[60px]!" data-reveal>
          {finalCta.title}
        </h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end" data-reveal>
          <p className="lead text-[var(--on-dark-muted)] lg:col-span-7">{finalCta.text}</p>
          <div className="lg:col-span-5 lg:justify-self-end">
            <CtaButton source="footer_cta" className="w-full sm:w-auto">
              {finalCta.cta}
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
