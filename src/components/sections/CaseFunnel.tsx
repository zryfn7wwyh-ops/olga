import { ArrowDown, ArrowRight } from "lucide-react";
import { caseAksenova, caseMetrics } from "@/content/case-aksenova";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { cn } from "@/lib/cn";

const { funnel } = caseAksenova;

/**
 * Воронка 317 → 27 → 5 (из них 3 — уголовные дела).
 * Выручка намеренно НЕ является ступенью воронки — она показана отдельно (см. CaseStudy).
 */
export function CaseFunnel() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_128px_minmax(0,1fr)_128px_minmax(0,1fr)] lg:items-stretch">
        <Stage index="01" value={funnel.visitors} label="посетителей сайта" text="Пришли на сайт адвоката за отчётный месяц." />
        <Connector value={caseMetrics.visitorToLead} text="посетителей обратились" />
        <Stage
          index="02"
          value={funnel.leads}
          label="целевых обращений"
          text="Обращения, соответствующие специализации и реальной потребности в юридической помощи."
        />
        <Connector value={caseMetrics.leadToContract} text="целевых обращений завершились договором" />
        <Stage index="03" value={funnel.contracts} label="заключённых договоров" final>
          <div className="mt-6 border-t border-[var(--on-dark-stroke)] pt-5">
            <div className="flex gap-1.5" aria-hidden="true">
              {Array.from({ length: funnel.contracts }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-7 flex-1 rounded-[4px] border",
                    i < funnel.criminalContracts ? "border-gold bg-gold" : "border-[var(--on-dark-stroke)] bg-white/[0.06]",
                  )}
                />
              ))}
            </div>
            <p className="mt-3 text-[15px] text-ivory">
              <span className="font-semibold text-gold-soft">{funnel.criminalContracts} договора</span> — по уголовным
              делам
            </p>
          </div>
        </Stage>
      </div>
      <UnitChart />
    </div>
  );
}

function Stage({
  index,
  value,
  label,
  text,
  final,
  children,
}: {
  index: string;
  value: number;
  label: string;
  text?: string;
  final?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      data-reveal
      className={cn(
        "relative flex flex-col rounded-[14px] border p-6 sm:p-8",
        final ? "on-dark border-navy bg-navy text-ivory" : "border-stroke bg-paper",
      )}
    >
      <p
        className={cn(
          "text-[12px] font-bold tracking-[0.16em] uppercase",
          final ? "text-gold-soft" : "text-gold-ink",
        )}
      >
        {index} · этап
      </p>
      <p className="mt-5 flex flex-col">
        <AnimatedNumber value={value} className="num text-[72px] sm:text-[84px]" />
        <span className={cn("mt-2 text-[18px] font-semibold", final ? "text-ivory" : "text-ink")}>{label}</span>
      </p>
      {text && <p className={cn("mt-3 text-[15px]", final ? "text-[var(--on-dark-muted)]" : "text-muted-text")}>{text}</p>}
      {children}
    </div>
  );
}

function Connector({ value, text }: { value: string; text: string }) {
  return (
    <div className="relative flex items-center py-5 pl-8 lg:flex-col lg:justify-center lg:px-3 lg:py-0 lg:text-center">
      {/* линия */}
      <span aria-hidden="true" className="absolute top-0 bottom-0 left-[15px] w-px bg-gold/60 lg:hidden" />
      <span aria-hidden="true" className="absolute top-1/2 right-2 left-2 hidden h-px bg-gold/60 lg:block" />
      <span
        aria-hidden="true"
        className="absolute left-[7px] grid size-[17px] place-items-center rounded-full border border-gold/70 bg-ivory lg:static lg:hidden"
      >
        <ArrowDown className="size-3 text-gold-ink" strokeWidth={2} />
      </span>
      <p className="relative ml-4 flex items-baseline gap-2 bg-ivory lg:ml-0 lg:flex-col lg:items-center lg:gap-1 lg:px-2 lg:py-2">
        <span className="font-serif text-[30px] leading-none font-semibold text-ink lining-nums tabular-nums">{value}</span>
        <span className="text-[13.5px] leading-snug text-muted-text lg:max-w-[112px]">{text}</span>
        <ArrowRight className="mt-1 hidden size-4 text-gold-ink lg:block" strokeWidth={1.75} aria-hidden="true" />
      </p>
    </div>
  );
}

/** Юнит-чарт: каждая точка — один посетитель. Только реальные числа: 317 / 27 / 5. */
function UnitChart() {
  const cols = 32;
  const gap = 10;
  const r = 3.1;
  const total = funnel.visitors;
  const rows = Math.ceil(total / cols);
  const width = cols * gap;
  const height = rows * gap;

  return (
    <figure data-reveal className="mt-8 rounded-[14px] border border-stroke bg-paper p-6 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
        <figcaption className="lg:col-span-4">
          <p className="h3">Каждая точка — один посетитель сайта</p>
          <ul className="mt-5 space-y-2.5 text-[15px] text-ink">
            <li className="flex items-center gap-3">
              <span className="size-3 rounded-full border border-[#aeb5b3]" aria-hidden="true" />
              {total} посетителей
            </li>
            <li className="flex items-center gap-3">
              <span className="size-3 rounded-full bg-gold" aria-hidden="true" />
              {funnel.leads} целевых обращений
            </li>
            <li className="flex items-center gap-3">
              <span className="size-3 rounded-full bg-navy" aria-hidden="true" />
              {funnel.contracts} из них завершились договором
            </li>
          </ul>
        </figcaption>
        <div className="lg:col-span-8">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-auto w-full"
            role="img"
            aria-label={`${total} посетителей, из них ${funnel.leads} целевых обращений, из них ${funnel.contracts} договоров`}
          >
            {Array.from({ length: total }, (_, i) => {
              const cx = (i % cols) * gap + gap / 2;
              const cy = Math.floor(i / cols) * gap + gap / 2;
              if (i < funnel.contracts) return <circle key={i} cx={cx} cy={cy} r={r} fill="#14232D" />;
              if (i < funnel.leads) return <circle key={i} cx={cx} cy={cy} r={r} fill="#B49A6C" />;
              return <circle key={i} cx={cx} cy={cy} r={r - 0.5} fill="none" stroke="#AEB5B3" strokeWidth={0.9} />;
            })}
          </svg>
        </div>
      </div>
    </figure>
  );
}
