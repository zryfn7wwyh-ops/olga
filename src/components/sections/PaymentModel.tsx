import { payment } from "@/content/landing";
import { CtaButton } from "@/components/forms/CtaButton";
import { Disclosure } from "@/components/ui/Disclosure";

/** Документальное объяснение модели оплаты: три строки как в договоре и условный пример с полями [СОГЛАСОВАТЬ]. */
export function PaymentModel() {
  const ex = payment.example;
  return (
    <section id="payment" aria-labelledby="payment-title" className="on-light bg-paper py-14 md:py-20 xl:py-24">
      <div className="container-lp">
        <div className="max-w-[860px]" data-reveal>
          <p className="eyebrow mb-4">{payment.eyebrow}</p>
          <h2 id="payment-title" className="h2">
            {payment.title}
          </h2>
          <p className="mt-4 text-[16.5px] text-muted-text">{payment.text}</p>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          {/* Три строки — как разделы договора */}
          <dl className="border-b border-navy/15 lg:col-span-7">
            {payment.rows.map((row) => (
              <div key={row.label} className="grid gap-2 border-t border-navy/15 py-5 sm:grid-cols-[200px_1fr] sm:gap-6">
                <dt className="font-serif text-[20px] leading-[1.25] font-semibold text-ink">{row.label}</dt>
                <dd className="text-[15.5px] text-ink">
                  {row.lead && <p className="mb-1.5">{row.lead}</p>}
                  <ul className={row.lead ? "space-y-0.5 text-muted-text" : "space-y-2"}>
                    {row.items.map((it) => (
                      <li key={it} className={row.lead ? "before:mr-2 before:content-['—']" : undefined}>
                        {it}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>

          {/* Условный пример */}
          <aside className="lg:col-span-5" aria-labelledby="payment-example-title">
            <div className="rounded-[4px] border border-dashed border-navy/30 bg-ivory p-5 sm:p-7">
              <p className="text-[12.5px] font-semibold text-gold-ink">{ex.badge}</p>
              <h3 id="payment-example-title" className="mt-1.5 font-serif text-[23px] leading-tight font-semibold">
                {ex.title}
              </h3>
              <Disclosure label={ex.toggle} closeLabel={ex.toggleClose} collapseBelow={1024} event="payment_example_expand" className="mt-2">
                <p className="mt-2 text-[14.5px] text-muted-text">
                  Задача: <span className="text-ink">«{ex.task}»</span>
                </p>
                <dl className="mt-4 text-[15px]">
                  {ex.lines.map((l) => (
                    <div key={l.label} className="flex flex-wrap items-baseline gap-x-2 py-1.5">
                      <dt className="min-w-0 text-ink">{l.label}</dt>
                      <span aria-hidden="true" className="hidden min-w-4 flex-1 translate-y-[-3px] border-b border-dotted border-navy/30 xs:block" />
                      <dd className="ml-auto font-semibold text-ink">{l.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-[14px] text-muted-text">{ex.text}</p>
              </Disclosure>
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <CtaButton source="payment_cta" variant="primary-dark" className="w-full sm:w-auto">
            {payment.cta}
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
