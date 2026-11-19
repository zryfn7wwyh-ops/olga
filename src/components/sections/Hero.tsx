import { ArrowDown, ArrowUpRight } from "lucide-react";
import { hero } from "@/content/landing";
import { caseAksenova, formatNumber, formatRub } from "@/content/case-aksenova";
import { isVisible, siteContent } from "@/content/siteContent";
import { CtaButton } from "@/components/forms/CtaButton";
import { ButtonLink } from "@/components/ui/Button";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { ExternalSiteLink } from "@/components/ui/ExternalSiteLink";
import { cn } from "@/lib/cn";

const { funnel, finance } = caseAksenova;

const stats = [
  { value: formatNumber(funnel.leads), label: "целевых обращений" },
  { value: formatNumber(funnel.contracts), label: "договоров" },
  { value: formatRub(finance.revenue), label: "выручки за месяц" },
];

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-navy-deep text-ivory">
      <HeroBackdrop />
      <div className="container-lp relative grid gap-10 pt-7 pb-14 sm:pt-12 md:pb-20 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pt-16 lg:pb-24">
        {/* Оффер */}
        <div className="lg:col-span-6">
          <p className="eyebrow mb-4 sm:mb-6">{hero.eyebrow}</p>
          <h1 id="hero-title" className="h1 hero-title max-w-[20ch]">
            {hero.titleLead} <span className="text-gold-soft italic">{hero.titleAccent}</span>
          </h1>
          <p className="mt-4 max-w-[52ch] text-[16px] leading-[1.55] text-[var(--on-dark-muted)] sm:mt-6 sm:text-[18px]">
            <span className="sm:hidden">{hero.subtitleShort}</span>
            <span className="hidden sm:inline">{hero.subtitle}</span>
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <CtaButton source="hero_primary" event="hero_cta_click" className="w-full sm:w-auto">
              {hero.primaryCta}
            </CtaButton>
            <div className="hidden sm:block">
              <ButtonLink href="#case" variant="ghost-light" className="sm:ml-2">
                <span>{hero.secondaryCta}</span>
                <ArrowDown className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>

          {/* Цифры: на мобильном и планшете — строкой; на десктопе — поверх визуала */}
          <dl className="mt-7 grid grid-cols-3 gap-2 border-t border-[var(--on-dark-stroke)] pt-5 lg:hidden">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <dt className="order-2 text-[12.5px] leading-snug text-[var(--on-dark-muted)] sm:text-[14px]">{s.label}</dt>
                <dd className="num order-1 text-[28px] whitespace-nowrap text-ivory xs:text-[32px] sm:text-[44px]">{s.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 text-[13.5px] leading-snug text-ivory/85 sm:text-[14.5px] lg:mt-9">
            <span className="mr-2 inline-block h-px w-6 translate-y-[-4px] bg-gold" aria-hidden="true" />
            {hero.caseLine}
          </p>
          <a href="#case" className="mt-3 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-gold-soft sm:hidden">
            {hero.secondaryCta}
            <ArrowDown className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>

        {/* Визуал кейса */}
        <div className="relative lg:col-span-6">
          <HeroVisual />
          <p className="mt-4 text-[12.5px] leading-snug text-[var(--on-dark-muted)] lg:mt-10">{hero.footnote}</p>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  const image = siteContent.heroCaseImage;
  const showImage = isVisible(image);
  return (
    <figure className="relative lg:pr-4 lg:pb-8 lg:pl-8">
      <div className="overflow-hidden rounded-[14px] border border-[var(--on-dark-stroke)] bg-navy shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)]">
        <div className="flex items-center gap-2 border-b border-[var(--on-dark-stroke)] px-4 py-2.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/20" />
          <span className="ml-2 truncate rounded bg-white/[0.07] px-3 py-0.5 text-[12px] text-[var(--on-dark-muted)]">
            {caseAksenova.siteLabel}
          </span>
        </div>
        {showImage ? (
          <MediaFrame
            item={image}
            rounded={false}
            priority
            sizes="(min-width: 1024px) 600px, 100vw"
            badge={hero.demoLabel}
            badgePosition="top-right"
          />
        ) : (
          <div className="flex aspect-[16/10] flex-col justify-end p-8">
            <p className="text-[12px] font-bold tracking-[0.16em] text-gold-soft uppercase">Действующий проект</p>
            <p className="mt-3 font-serif text-[40px] leading-none">{caseAksenova.siteLabel}</p>
          </div>
        )}
      </div>

      {/* Карточки результатов поверх визуала (десктоп) */}
      <OverlayCard className="top-[18%] -left-2" value={stats[0].value} label={stats[0].label} />
      <OverlayCard
        className="top-[46%] -right-1"
        value={stats[1].value}
        label={stats[1].label}
        note={`${funnel.criminalContracts} — по уголовным делам`}
      />
      <OverlayCard className="bottom-0 left-[14%]" value={stats[2].value} label={stats[2].label} accent />

      <figcaption className="mt-3 flex items-center justify-between gap-4 text-[13px] text-[var(--on-dark-muted)] lg:hidden">
        <span>Сайт адвоката Аксёновой</span>
        <ExternalSiteLink place="hero" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-gold-soft">
          Открыть сайт <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </ExternalSiteLink>
      </figcaption>
    </figure>
  );
}

function OverlayCard({
  value,
  label,
  note,
  accent,
  className,
}: {
  value: string;
  label: string;
  note?: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute hidden min-w-[190px] rounded-[12px] border px-5 py-4 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md lg:block",
        accent ? "border-gold/50 bg-navy-deep/92" : "border-[var(--on-dark-stroke)] bg-navy/92",
        className,
      )}
    >
      <p className={cn("num text-[44px]", accent ? "text-gold-soft" : "text-ivory")}>{value}</p>
      <p className="mt-1.5 text-[14px] font-semibold text-ivory">{label}</p>
      {note && <p className="text-[12.5px] text-[var(--on-dark-muted)]">{note}</p>}
    </div>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_85%_20%,rgba(180,154,108,0.10),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(245,242,236,0.6) 1px, transparent 1px)",
          backgroundSize: "calc(100% / 12) 100%",
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />
    </div>
  );
}
