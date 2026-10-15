import { advantages } from "@/data/advantages";
import { contacts } from "@/data/contacts";
import { formatNumber, rating } from "@/data/stats";
import { cn } from "@/lib/cn";
import { RatingDate, SourceLink } from "./RankingFeature";
import { SectionHeading } from "./SectionHeading";

const card =
  "group relative flex flex-col border border-line bg-ivory p-7 transition-[border-color,background-color] duration-200 ease-[var(--ease-premium)] hover:border-steel/50 hover:bg-white sm:p-9";

/** Шкала реестра: позиция 57 из 7550 на линии. */
function RegistryScale() {
  const pct = (rating.position / rating.total) * 100;
  return (
    <div aria-hidden className="mt-10">
      <div className="relative h-8">
        <div className="absolute inset-x-0 top-1/2 h-px bg-slate-2" />
        {Array.from({ length: 21 }).map((_, i) => (
          <span key={i} className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-slate-2" style={{ left: `${i * 5}%` }} />
        ))}
        <span className="absolute top-0 h-8 w-[2px] bg-bronze" style={{ left: `${pct}%` }} />
      </div>
      <div className="tech mt-2 flex justify-between text-mist/70">
        <span>№ 1</span>
        <span>№ {formatNumber(rating.total)}</span>
      </div>
    </div>
  );
}

/** Три дисциплины: право / финансы / оценка. */
function Triad() {
  return (
    <svg aria-hidden viewBox="0 0 240 132" className="mt-auto h-auto w-full max-w-[280px] pt-8 text-steel">
      <circle cx="80" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="120" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="160" cy="50" r="42" fill="none" stroke="#A0835E" strokeWidth="1.25" />
      <circle cx="120" cy="50" r="2.5" fill="#A0835E" />
      <g fontSize="9.5" fontFamily="Manrope Variable, sans-serif" letterSpacing="1.4" textAnchor="middle">
        <text x="58" y="126" fill="#657078">ПРАВО</text>
        <text x="120" y="126" fill="#657078">ФИНАНСЫ</text>
        <text x="184" y="126" fill="#A0835E">ОЦЕНКА</text>
      </g>
    </svg>
  );
}

export function Advantages() {
  const a = Object.fromEntries(advantages.map((x) => [x.kind, x]));
  return (
    <section aria-labelledby="advantages-title" className="section-y bg-stone">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading index="02" label="Практика" id="advantages-title" title="Почему сложные процедуры доверяют Антону Пудовкину" className="lg:col-span-8" />
          <p className="max-w-[420px] text-[16px] text-muted lg:col-span-4 lg:justify-self-end">
            Рейтинг, многолетняя практика торгов и квалификация оценщика — в одном специалисте, который лично ведёт ключевые вопросы.
          </p>
        </div>

        {/* Asymmetric bento-grid */}
        <div className="mt-14 grid gap-4 md:grid-cols-6 lg:mt-20 lg:grid-cols-12 lg:gap-5">
          {/* 1 — большая тёмная */}
          <article className="on-dark group relative flex flex-col overflow-hidden bg-ink p-7 text-ivory sm:p-10 md:col-span-6 lg:col-span-7 lg:row-span-2">
            <div className="flex items-center justify-between gap-4">
              <span className="tech text-bronze">AP / {String(rating.position).padStart(3, "0")} / {rating.total}</span>
              <span className="tech text-mist/70">{rating.source}</span>
            </div>
            <p className="mt-10 flex items-baseline gap-3 font-serif leading-none lg:mt-auto">
              <span className="text-[96px] tracking-[-0.04em] text-ivory sm:text-[140px] xl:text-[168px]">{rating.position}</span>
              <span className="text-[32px] text-mist sm:text-[44px]">/ {formatNumber(rating.total)}</span>
            </p>
            <h3 className="mt-6 max-w-[440px] text-[19px] leading-snug text-ivory sm:text-[22px]">{a.rating.text}</h3>
            <RegistryScale />
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-mist">
              <SourceLink />
              <RatingDate className="text-mist/70" />
            </div>
          </article>

          {/* 2 — 10+ лет */}
          <article className={cn(card, "md:col-span-3 lg:col-span-5")}>
            <span className="tech text-muted">Торги</span>
            <p className="mt-6 font-serif text-[56px] leading-none text-bronze sm:text-[72px]">{a.years.title}</p>
            <h3 className="mt-4 max-w-[300px] text-[17px] text-text">{a.years.text}</h3>
          </article>

          {/* 3 — Управляющий + оценщик */}
          <article className={cn(card, "md:col-span-3 lg:col-span-5")}>
            <span className="tech text-muted">Квалификация</span>
            <h3 className="mt-6 font-serif text-[28px] leading-tight sm:text-[32px]">{a.valuer.title}</h3>
            <p className="mt-3 max-w-[380px] text-[16px] text-muted">{a.valuer.text}</p>
            <Triad />
          </article>

          {/* 4 — горизонтальная: прямой контакт */}
          <article className={cn(card, "md:col-span-6 lg:col-span-6 lg:flex-row lg:items-end lg:gap-10")}>
            <div className="flex-1">
              <span className="tech text-muted">Формат работы</span>
              <h3 className="mt-6 font-serif text-[28px] leading-tight sm:text-[34px]">{a.direct.title}</h3>
            </div>
            <div className="mt-4 flex-1 lg:mt-0">
              <p className="text-[16px] text-muted">{a.direct.text}</p>
              <a href={contacts.phone.href} className="link mt-2 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold tabular">
                {contacts.phone.display} <span className="arrow" aria-hidden>→</span>
              </a>
            </div>
          </article>

          {/* 5 — сложные активы */}
          <article className={cn(card, "md:col-span-3 lg:col-span-3")}>
            <span className="tech text-muted">Активы</span>
            <h3 className="mt-6 font-serif text-[26px] leading-tight">{a.assets.title}</h3>
            <p className="mt-3 text-[16px] text-muted">{a.assets.text}</p>
          </article>

          {/* 6 — Россия */}
          <article className={cn(card, "md:col-span-3 lg:col-span-3")}>
            <span className="tech text-muted">География</span>
            <h3 className="mt-6 font-serif text-[26px] leading-tight">{a.geo.title}</h3>
            <p className="mt-3 text-[16px] text-muted">{a.geo.text}</p>
            <p className="tech mt-auto pt-6 text-steel-deep">{contacts.offices.map((o) => o.city).join(" · ")}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
