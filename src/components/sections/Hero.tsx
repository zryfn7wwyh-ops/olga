import { ArrowDown, ArrowUpRight } from "lucide-react";
import { hero } from "@/content/landing";
import { caseAksenova, caseMetrics, formatNumber, formatRub } from "@/content/case-aksenova";
import { CtaButton } from "@/components/forms/CtaButton";
import { ButtonLink } from "@/components/ui/Button";

const { funnel, finance } = caseAksenova;

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-navy-deep text-ivory">
      <HeroBackdrop />
      <div className="container-lp relative grid gap-12 pt-10 pb-20 md:pt-16 md:pb-24 lg:grid-cols-12 lg:gap-10 lg:pt-20 lg:pb-32">
        {/* Оффер */}
        <div className="lg:col-span-7 lg:pr-6">
          <p className="eyebrow mb-7">{hero.eyebrow}</p>
          <h1 id="hero-title" className="h1 max-w-[21ch]">
            {hero.titleLead} <em className="font-medium text-gold-soft not-italic sm:italic">{hero.titleAccent}</em>
          </h1>
          <p className="lead mt-7 max-w-[60ch] text-[var(--on-dark-muted)]">{hero.subtitle}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <CtaButton source="hero_primary" event="hero_cta_click" className="w-full sm:w-auto">
              {hero.primaryCta}
            </CtaButton>
            <ButtonLink href="#case" variant="outline-light" className="w-full sm:w-auto">
              <span>{hero.secondaryCta}</span>
              <ArrowDown className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
            </ButtonLink>
          </div>

          <p className="mt-9 flex items-center gap-3 text-[15px] text-ivory/90">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            {hero.trustLine}
          </p>
        </div>

        {/* Панель результатов */}
        <div className="lg:col-span-5">
          <ResultsPanel />
          <p className="mt-4 text-[13px] leading-snug text-[var(--on-dark-muted)]">{hero.footnote}</p>
        </div>
      </div>
    </section>
  );
}

function ResultsPanel() {
  return (
    <figure
      className="relative rounded-[16px] border border-[var(--on-dark-stroke)] bg-[linear-gradient(180deg,rgba(20,35,45,0.92),rgba(20,35,45,0.7))] p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] sm:p-8"
      aria-labelledby="hero-panel-caption"
    >
      <span className="absolute top-0 left-8 h-px w-20 bg-gold" aria-hidden="true" />
      <figcaption
        id="hero-panel-caption"
        className="flex items-center justify-between gap-4 text-[11.5px] font-semibold tracking-[0.16em] text-[var(--on-dark-muted)] uppercase"
      >
        <span>{hero.panelCaption}</span>
      </figcaption>

      <dl className="mt-6 grid grid-cols-1 gap-0 divide-y divide-[var(--on-dark-stroke)]">
        <Stat value={formatNumber(funnel.leads)} label="целевых обращений" />
        <Stat
          value={formatNumber(funnel.contracts)}
          label="договоров"
          note={`из них ${funnel.criminalContracts} — по уголовным делам`}
        />
        <Stat value={formatRub(finance.revenue)} label="выручки" note="общая выручка за тот же месяц" />
      </dl>

      {/* Шкала конверсии: 317 посетителей = 100% */}
      <div className="mt-6 border-t border-[var(--on-dark-stroke)] pt-6">
        <p className="text-[13px] text-[var(--on-dark-muted)]">
          Из {formatNumber(funnel.visitors)} посетителей сайта
        </p>
        <div className="relative mt-3 h-2 rounded-full bg-white/[0.08]" aria-hidden="true">
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-gold/70"
            style={{ width: `${caseMetrics.visitorToLeadRaw}%` }}
          />
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-gold-soft"
            style={{ width: `max(3px, ${caseMetrics.visitorToContractRaw}%)` }}
          />
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ivory/90">
          <li className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-gold/70" aria-hidden="true" />
            {caseMetrics.visitorToLead} обратились
          </li>
          <li className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-gold-soft" aria-hidden="true" />
            {caseMetrics.visitorToContract} заключили договор
          </li>
        </ul>
      </div>

      <div className="mt-6 flex items-baseline justify-between gap-4 rounded-[10px] border border-[var(--on-dark-stroke)] px-4 py-3">
        <span className="text-[14px] text-[var(--on-dark-muted)]">Расходы на рекламу</span>
        <span className="font-serif text-[22px] font-medium lining-nums tabular-nums">{formatRub(finance.adSpend)}</span>
      </div>

      {/* Мини-карточка сайта (без имитации скриншота) */}
      <a
        href={caseAksenova.siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-4 block overflow-hidden rounded-[10px] border border-[var(--on-dark-stroke)] bg-navy-deep/60 transition-colors hover:border-gold/60"
      >
        <span className="flex items-center gap-1.5 border-b border-[var(--on-dark-stroke)] px-3 py-2" aria-hidden="true">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="ml-2 truncate rounded bg-white/[0.06] px-2 py-0.5 text-[11.5px] text-[var(--on-dark-muted)]">
            {caseAksenova.siteLabel}
          </span>
        </span>
        <span className="flex items-center justify-between gap-4 px-4 py-3.5">
          <span>
            <span className="block text-[15px] font-semibold text-ivory">Сайт адвоката Аксёновой</span>
            <span className="block text-[13px] text-[var(--on-dark-muted)]">Действующий проект · открыть в новой вкладке</span>
          </span>
          <ArrowUpRight
            className="size-5 shrink-0 text-gold-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </span>
      </a>
    </figure>
  );
}

function Stat({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <div className="flex flex-col gap-1 py-4 first:pt-0 xs:flex-row xs:items-end xs:justify-between xs:gap-4">
      <dt className="order-2 pb-1 text-[14px] xs:text-right leading-snug text-[var(--on-dark-muted)]">
        <span className="block text-[15px] font-semibold text-ivory">{label}</span>
        {note && <span className="block">{note}</span>}
      </dt>
      <dd className="num order-1 text-[48px] text-ivory sm:text-[60px]">{value}</dd>
    </div>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_85%_10%,rgba(180,154,108,0.10),transparent_60%),radial-gradient(60%_50%_at_0%_100%,rgba(20,35,45,0.9),transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(245,242,236,0.6) 1px, transparent 1px)",
          backgroundSize: "calc(100% / 12) 100%",
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />
    </div>
  );
}
