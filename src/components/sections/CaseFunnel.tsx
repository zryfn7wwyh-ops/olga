import { ChevronRight } from "lucide-react";
import { caseAksenova, caseMetrics, formatNumber, formatRub } from "@/content/case-aksenova";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { cn } from "@/lib/cn";

const { funnel, finance } = caseAksenova;

/**
 * Единственная визуализация воронки: 317 → 27 → 5 → 545 000 ₽.
 * Шкала под ступенями — в масштабе доли от посетителей (100% / 8,5% / 1,6%).
 * Выручка показана как финансовый итог, а не как ступень с людьми.
 */
export function CaseFunnel() {
  const steps = [
    {
      value: funnel.visitors,
      label: "посетителей сайта",
      basis: "За один отчётный месяц",
      share: 100,
    },
    {
      value: funnel.leads,
      label: "целевых обращений",
      basis: `${caseMetrics.visitorToLead} от посетителей (${funnel.leads} / ${funnel.visitors})`,
      share: caseMetrics.visitorToLeadRaw,
    },
    {
      value: funnel.contracts,
      label: "заключённых договоров",
      basis: `${caseMetrics.leadToContract} от обращений (${funnel.contracts} / ${funnel.leads})`,
      share: caseMetrics.visitorToContractRaw,
    },
  ];

  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
      {steps.map((s, i) => (
        <li
          key={s.label}
          data-reveal
          style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
          className="relative flex flex-col rounded-[14px] border border-stroke bg-paper p-6 sm:p-7"
        >
          {i > 0 && (
            <span
              aria-hidden="true"
              className="absolute top-1/2 -left-[22px] z-10 hidden size-7 -translate-y-1/2 place-items-center rounded-full border border-gold/60 bg-ivory text-gold-ink lg:grid"
            >
              <ChevronRight className="size-4" strokeWidth={1.75} />
            </span>
          )}
          <p className="text-[12px] font-bold tracking-[0.16em] text-gold-ink uppercase">Шаг {i + 1}</p>
          <p className="mt-4">
            <AnimatedNumber value={s.value} className="num text-[60px] sm:text-[72px]" />
          </p>
          <p className="mt-1 text-[17px] font-semibold">{s.label}</p>
          <p className="mt-1 text-[14px] text-muted-text">{s.basis}</p>
          <div className="mt-auto pt-6" aria-hidden="true">
            <div className="h-1.5 rounded-full bg-navy/[0.07]">
              <div className="h-full rounded-full bg-gold" style={{ width: `max(4px, ${s.share}%)` }} />
            </div>
          </div>
        </li>
      ))}
      <li
        data-reveal
        style={{ ["--reveal-delay" as string]: "210ms" }}
        className="on-dark relative flex flex-col overflow-hidden rounded-[14px] bg-navy-deep p-6 text-ivory sm:p-7"
      >
        <span
          aria-hidden="true"
          className="absolute top-1/2 -left-[22px] z-10 hidden size-7 -translate-y-1/2 place-items-center rounded-full border border-gold/60 bg-ivory text-gold-ink lg:grid"
        >
          <ChevronRight className="size-4" strokeWidth={1.75} />
        </span>
        <span className="absolute top-0 left-7 h-px w-16 bg-gold" aria-hidden="true" />
        <p className="text-[12px] font-bold tracking-[0.16em] text-gold-soft uppercase">Финансовый итог</p>
        <p className="num mt-4 text-[44px] whitespace-nowrap sm:text-[50px] lg:text-[44px] xl:text-[52px]">
          {formatRub(finance.revenue)}
        </p>
        <p className="mt-2 text-[17px] font-semibold">общей выручки</p>
        <p className="mt-1 text-[14px] text-[var(--on-dark-muted)]">за тот же отчётный месяц</p>
      </li>
    </ol>
  );
}

export function CaseFacts() {
  const facts = [
    {
      value: `${funnel.criminalContracts} из ${funnel.contracts}`,
      label: "договоров — уголовные дела",
    },
    { value: formatRub(finance.adSpend), label: "расходы на рекламу за месяц" },
    {
      value: caseMetrics.visitorToContract,
      label: `посетителей заключили договор (${formatNumber(funnel.contracts)} / ${formatNumber(funnel.visitors)})`,
    },
  ];
  return (
    <dl className="grid gap-px overflow-hidden rounded-[14px] border border-stroke bg-stroke sm:grid-cols-3">
      {facts.map((f) => (
        <div key={f.label} className="flex flex-col-reverse gap-1 bg-paper px-6 py-5">
          <dt className="text-[14.5px] text-muted-text">{f.label}</dt>
          <dd className={cn("font-serif text-[32px] leading-none font-medium text-ink")}>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
