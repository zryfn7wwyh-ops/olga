import { Info } from "lucide-react";
import { payment } from "@/content/landing";
import { site } from "@/content/site";
import { CtaButton } from "@/components/forms/CtaButton";

export function PaymentModel() {
  return (
    <section id="payment" aria-labelledby="payment-title" className="section on-light bg-ivory">
      <div className="container-lp">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7" data-reveal>
            <p className="eyebrow mb-5">{payment.eyebrow}</p>
            <h2 id="payment-title" className="h2 lg:text-[60px]!">
              {payment.title}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-14" data-reveal>
            <span className="gold-rule mb-6 w-24" aria-hidden="true" />
            <p className="lead text-ink">{payment.text}</p>
          </div>
        </div>

        <ol className="relative mt-14 grid gap-4 md:grid-cols-3 md:gap-5 lg:mt-20">
          {payment.steps.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
              className="relative rounded-[14px] border border-stroke bg-paper p-7 sm:p-8"
            >
              <span className="absolute top-0 left-8 h-px w-14 bg-gold" aria-hidden="true" />
              <span className="font-serif text-[52px] leading-none text-navy lining-nums tabular-nums">0{i + 1}</span>
              <h3 className="h3 mt-6">{step.title}</h3>
              <p className="mt-2 text-[16px] text-muted-text">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-[720px] gap-3 text-[15px] text-muted-text">
            <Info className="mt-0.5 size-5 shrink-0 text-gold-ink" strokeWidth={1.5} aria-hidden="true" />
            <p>
              {site.payment.disclaimer} {site.payment.approvedNote}
            </p>
          </div>
          <CtaButton source="payment_cta" variant="primary-dark" className="w-full shrink-0 sm:w-auto">
            {payment.cta}
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
