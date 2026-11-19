import { ChevronRight } from "lucide-react";
import { caseAksenova, caseMetrics, formatNumber, formatRub } from "@/content/case-aksenova";
import { caseSection } from "@/content/landing";
import { Disclosure } from "@/components/ui/Disclosure";

const { funnel, finance } = caseAksenova;

/**
 * Мобильная версия воронки (< 768 px): цепочка 317 → 27 → 5, финансовая карточка
 * и свёрнутые подробности о конверсии. На планшете и десктопе — полная воронка (CaseFunnel).
 */
export function CaseMobileSummary() {
  const chain = [
    { value: funnel.visitors, label: "посетителей" },
    { value: funnel.leads, label: "целевых обращений" },
    { value: funnel.contracts, label: "договоров" },
  ];
  const conversions = [
    `${caseMetrics.visitorToLead} посетителей оставили целевое обращение (${funnel.leads}/${funnel.visitors})`,
    `${caseMetrics.leadToContract} обращений превратились в договоры (${funnel.contracts}/${funnel.leads})`,
    `${caseMetrics.visitorToContract} посетителей заключили договор (${funnel.contracts}/${funnel.visitors})`,
  ];

  return (
    <div className="md:hidden" data-case-mobile>
      <ol className="grid grid-cols-3 gap-2" aria-label="Воронка за отчётный месяц">
        {chain.map((c, i) => (
          <li key={c.label} className="relative flex flex-col rounded-[12px] border border-stroke bg-paper px-2.5 py-3.5">
            <span className="num text-[34px] xs:text-[38px]">{formatNumber(c.value)}</span>
            <span className="mt-1.5 text-[12.5px] leading-tight font-semibold text-ink">{c.label}</span>
            {i < 2 && (
              <span
                aria-hidden="true"
                className="absolute top-1/2 -right-[11px] z-10 grid size-5 -translate-y-1/2 place-items-center rounded-full border border-gold/60 bg-ivory text-gold-ink"
              >
                <ChevronRight className="size-3" strokeWidth={2} />
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="on-dark relative mt-2 overflow-hidden rounded-[12px] bg-navy-deep text-ivory">
        <span className="absolute top-0 left-5 h-px w-12 bg-gold" aria-hidden="true" />
        <div className="px-5 pt-4 pb-4">
          <p className="num text-[40px] whitespace-nowrap">{formatRub(finance.revenue)}</p>
          <p className="mt-1 text-[14px] text-ivory/85">{caseSection.mobileRevenueLabel}</p>
        </div>
        <dl className="grid grid-cols-2 border-t border-[var(--on-dark-stroke)]">
          <div className="flex flex-col gap-0.5 border-r border-[var(--on-dark-stroke)] px-5 py-3">
            <dt className="order-2 text-[12.5px] leading-snug text-ivory/80">договоров — уголовные дела</dt>
            <dd className="order-1 font-serif text-[24px] leading-none text-gold-soft lining-nums">
              {funnel.criminalContracts} из {funnel.contracts}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5 px-5 py-3">
            <dt className="order-2 text-[12.5px] leading-snug text-ivory/80">расходы на рекламу</dt>
            <dd className="order-1 font-serif text-[24px] leading-none whitespace-nowrap lining-nums">
              {formatRub(finance.adSpend)}
            </dd>
          </div>
        </dl>
      </div>

      <Disclosure label={caseSection.conversionToggle} className="mt-2" buttonClassName="w-full justify-between rounded-[10px] border border-stroke bg-paper px-4">
        <ul className="mt-2 space-y-2 rounded-[10px] border border-stroke bg-paper px-4 py-3.5 text-[14px] text-ink">
          {conversions.map((c) => (
            <li key={c} className="flex gap-2.5">
              <span className="mt-[9px] h-px w-3 shrink-0 bg-gold" aria-hidden="true" />
              {c}
            </li>
          ))}
          <li className="pt-1 text-[13px] text-muted-text">{caseSection.conversionNote}</li>
        </ul>
      </Disclosure>
    </div>
  );
}
