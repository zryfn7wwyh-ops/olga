import { BadgeCheck } from "lucide-react";
import { salesConsulting } from "@/content/landing";
import { CtaButton } from "@/components/forms/CtaButton";

/**
 * Акцентный подблок внутри секции «Услуги».
 * Консультации по продажам ВХОДЯТ в пакет продвижения: без цены, без отдельного тарифа и отдельной формы.
 */
export function SalesConsulting() {
  return (
    <div
      data-reveal
      aria-labelledby="sales-consulting-title"
      role="region"
      className="on-dark relative mt-8 overflow-hidden rounded-[16px] bg-navy-deep text-ivory lg:mt-10"
    >
      <span aria-hidden="true" className="absolute top-10 bottom-10 left-0 w-[2px] bg-gold sm:top-12 sm:bottom-12" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_0%_0%,rgba(180,154,108,0.10),transparent_70%)]"
      />
      <div className="relative grid gap-12 px-6 py-10 sm:px-12 sm:py-14 lg:grid-cols-12 lg:gap-12 lg:px-16 lg:py-16">
        <div className="lg:col-span-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-3.5 py-1.5 text-[12px] font-bold tracking-[0.14em] text-gold-soft uppercase">
            <BadgeCheck className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {salesConsulting.badge}
          </p>
          <p className="eyebrow mt-8">{salesConsulting.eyebrow}</p>
          <p className="mt-5 font-serif text-[22px] leading-snug text-ivory/80 italic sm:text-[24px]">
            {salesConsulting.kicker}
          </p>
          <h3 id="sales-consulting-title" className="h2 mt-4 text-[32px]! sm:text-[44px]!">
            {salesConsulting.title}
          </h3>
          <p className="mt-6 text-[16.5px] text-[var(--on-dark-muted)]">{salesConsulting.text}</p>
        </div>

        <div className="flex flex-col lg:col-span-6">
          <ol className="grid gap-px overflow-hidden rounded-[12px] border border-[var(--on-dark-stroke)] bg-[var(--on-dark-stroke)] sm:grid-cols-2">
            {salesConsulting.items.map((item, i) => (
              <li key={item.title} className="bg-navy-deep p-6">
                <span className="font-serif text-[20px] text-gold-soft lining-nums tabular-nums">0{i + 1}</span>
                <h4 className="mt-3 text-[17px] leading-snug font-semibold">{item.title}</h4>
                <p className="mt-2 text-[14.5px] text-[var(--on-dark-muted)]">{item.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 border-l border-gold/60 pl-4 text-[15px] text-ivory/85">{salesConsulting.format}</p>
          <div className="mt-8">
            <CtaButton source="sales_consulting_cta" className="w-full sm:w-auto">
              {salesConsulting.cta}
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  );
}
