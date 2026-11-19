import { caseAksenova, caseMetrics, formatNumber, formatRub } from "@/content/case-aksenova";
import { caseSection } from "@/content/landing";

const { funnel, finance } = caseAksenova;

/**
 * Итоги кейса для планшета и десктопа: одна типографская воронка 317 → 27 → 5
 * и отдельно финансовый итог. Без карточек и без повторения цифр.
 */
export function CaseResults() {
  const steps = [
    { value: funnel.visitors, label: "посетителей сайта" },
    { value: funnel.leads, label: "целевых обращений", conv: `${caseMetrics.visitorToLead} · ${funnel.leads} из ${funnel.visitors}` },
    { value: funnel.contracts, label: "договоров", conv: `${caseMetrics.leadToContract} · ${funnel.contracts} из ${funnel.leads}` },
  ];
  return (
    <div className="mt-12 grid gap-10 border-t border-navy/15 pt-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-8">
        <h3 className="text-[13px] font-semibold text-muted-text">Воронка за месяц</h3>
        <ol className="mt-4 flex items-start gap-4 lg:gap-6">
          {steps.map((s, i) => (
            <li key={s.label} className="flex items-start gap-4 lg:gap-6">
              {i > 0 && (
                <span aria-hidden="true" className="mt-[26px] font-serif text-[30px] leading-none text-navy/30">
                  →
                </span>
              )}
              <div>
                <p className="num text-[72px] lg:text-[88px]">{formatNumber(s.value)}</p>
                <p className="mt-2 text-[16px] font-semibold text-ink">{s.label}</p>
                {s.conv && <p className="mt-0.5 text-[13.5px] text-muted-text">{s.conv}</p>}
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-[13.5px] text-muted-text">{caseSection.funnelNote}.</p>
      </div>
      <div className="lg:col-span-4 lg:border-l lg:border-navy/15 lg:pl-10">
        <h3 className="text-[13px] font-semibold text-muted-text">Финансовый итог</h3>
        <p className="num mt-4 text-[60px] whitespace-nowrap text-gold-ink lg:text-[64px]">{formatRub(finance.revenue)}</p>
        <p className="mt-2 text-[16px] text-ink">{caseSection.revenueLabel}</p>
        <ul className="mt-5 space-y-1.5 text-[14.5px] text-ink">
          <li>{caseSection.criminalNote}</li>
          <li>{caseSection.adSpendNote}</li>
        </ul>
      </div>
    </div>
  );
}
