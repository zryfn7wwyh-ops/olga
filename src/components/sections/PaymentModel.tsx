import { Check, Info } from "lucide-react";
import { payment } from "@/content/landing";
import { site } from "@/content/site";
import { CtaButton } from "@/components/forms/CtaButton";
import { Disclosure } from "@/components/ui/Disclosure";

export function PaymentModel() {
  return (
    <section id="payment" aria-labelledby="payment-title" className="section on-light bg-ivory">
      <div className="container-lp">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7" data-reveal>
            <p className="eyebrow mb-4">{payment.eyebrow}</p>
            <h2 id="payment-title" className="h2">
              {payment.title}
            </h2>
          </div>
          <p className="lead text-ink lg:col-span-5 lg:self-end" data-reveal>
            {payment.text}
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-12 lg:gap-5">
          {/* Три части модели */}
          <ol className="grid gap-px overflow-hidden rounded-[14px] border border-stroke bg-stroke lg:col-span-7">
            {payment.parts.map((part, i) => (
              <li key={part.title} data-reveal className="flex gap-5 bg-paper p-6 sm:p-7">
                <span className="font-serif text-[34px] leading-none text-navy lining-nums">0{i + 1}</span>
                <div>
                  <h3 className="h3 text-[23px]!">{part.title}</h3>
                  <p className="mt-1.5 text-[15.5px] text-muted-text">{part.text}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Критерии целевого обращения */}
          <div data-reveal className="on-dark relative flex flex-col rounded-[14px] bg-navy-deep p-6 text-ivory sm:p-8 lg:col-span-5">
            <span className="absolute top-0 left-8 h-px w-16 bg-gold" aria-hidden="true" />
            <p className="inline-flex w-fit items-center rounded-full border border-gold/60 px-3 py-1 text-[11.5px] font-bold tracking-[0.14em] text-gold-soft uppercase">
              {payment.criteriaBadge}
            </p>
            <h3 className="mt-5 font-serif text-[27px] leading-tight font-semibold">{payment.criteriaTitle}</h3>
            <ul className="mt-5 space-y-3">
              {payment.criteria.map((c) => (
                <li key={c} className="flex gap-3 text-[15.5px] text-ivory/90">
                  <Check className="mt-1 size-4 shrink-0 text-gold-soft" strokeWidth={2} aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-6 text-[13.5px] text-[var(--on-dark-muted)]">{payment.criteriaNote}</p>
          </div>
        </div>

        <PaymentExample />

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="flex max-w-[640px] gap-3 text-[14.5px] text-muted-text">
            <Info className="mt-0.5 size-5 shrink-0 text-gold-ink" strokeWidth={1.5} aria-hidden="true" />
            {site.payment.approvedNote} Суммы и порядок расчёта определяются индивидуально и закрепляются в договоре.
          </p>
          <CtaButton source="payment_cta" variant="primary-dark" className="w-full shrink-0 sm:w-auto">
            {payment.cta}
          </CtaButton>
        </div>
      </div>
    </section>
  );
}

/** «Как понимаем, за какой результат платите» — пример механики без цен и тарифов. */
function PaymentExample() {
  const ex = payment.example;
  return (
    <div data-reveal className="mt-4 rounded-[14px] border border-stroke bg-paper p-5 sm:p-8 lg:mt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="h3 text-[23px]! sm:text-[27px]!">{ex.title}</h3>
        <p className="rounded-full border border-dashed border-gold-ink/60 px-3 py-1 text-[11.5px] font-bold tracking-[0.12em] text-gold-ink uppercase">
          {ex.badge}
        </p>
      </div>
      <Disclosure
        label={ex.toggle}
        closeLabel={ex.toggleClose}
        collapseBelow={1024}
        event="payment_example_expand"
        className="mt-3"
      >
        <ol className="mt-3 grid gap-px overflow-hidden rounded-[12px] border border-stroke bg-stroke md:grid-cols-2 lg:grid-cols-4">
          {ex.steps.map((step, i) => (
            <li key={step.title} className="flex flex-col bg-ivory p-5">
              <span className="font-serif text-[26px] leading-none text-gold-ink lining-nums">{i + 1}</span>
              <p className="mt-3 text-[16px] font-semibold text-ink">{step.title}</p>
              <p className="mt-1 text-[14.5px] text-muted-text">{step.text}</p>
              {"note" in step && step.note && <p className="mt-2 text-[12.5px] text-gold-ink italic">{step.note}</p>}
              {"value" in step && step.value && (
                <p className="mt-auto pt-3">
                  <span className="inline-flex rounded-[8px] bg-navy px-3 py-1.5 text-[13px] font-semibold text-ivory">{step.value}</span>
                </p>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-4 max-w-[860px] text-[15px] text-ink">{ex.text}</p>
      </Disclosure>
    </div>
  );
}
