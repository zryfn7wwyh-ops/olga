import { ArrowDown, ArrowUpRight } from "lucide-react";
import { hero } from "@/content/landing";
import { caseAksenova, formatNumber, formatRub } from "@/content/case-aksenova";
import { isVisible, siteContent } from "@/content/siteContent";
import { CtaButton } from "@/components/forms/CtaButton";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { ExternalSiteLink } from "@/components/ui/ExternalSiteLink";

const { funnel, finance } = caseAksenova;

const stats = [
  { value: formatNumber(funnel.leads), label: "целевых обращений" },
  { value: formatNumber(funnel.contracts), label: "договоров" },
  { value: formatRub(finance.revenue), label: "выручки за месяц" },
];

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-navy-deep text-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_85%_20%,rgba(180,154,108,0.07),transparent_60%)]"
      />
      <div className="container-lp relative grid gap-10 pt-7 pb-14 sm:pt-12 md:pb-20 lg:grid-cols-12 lg:gap-x-14 lg:gap-y-8 lg:pt-10 lg:pb-20">
        {/* Оффер */}
        <div className="order-1 lg:order-none lg:col-span-7 lg:row-start-1 xl:col-span-6">
          <p className="eyebrow mb-4 sm:mb-6">{hero.eyebrow}</p>
          <h1 id="hero-title" className="h1 hero-title max-w-[20ch]">
            {hero.titleLead} <span className="text-gold-soft italic">{hero.titleAccent}</span>
          </h1>
          <p className="mt-4 max-w-[54ch] text-[17px] leading-[1.6] text-[var(--on-dark-muted)] sm:mt-6 sm:text-[17.5px]">
            <span className="sm:hidden">{hero.subtitleShort}</span>
            <span className="hidden sm:inline">{hero.subtitle}</span>
          </p>

          <div className="mt-6 sm:mt-8">
            <CtaButton source="hero_primary" event="hero_cta_click" className="w-full sm:w-auto">
              {hero.primaryCta}
            </CtaButton>
          </div>
          <p className="mt-2 text-[14.5px] leading-snug text-ivory/70 sm:mt-3 sm:text-[15px]">{hero.valueLine.join(" · ")}</p>

          <a href="#case" className="mt-3 inline-flex min-h-11 items-center gap-2 text-[16px] font-semibold text-ivory sm:mt-4">
            {hero.secondaryCta}
            <ArrowDown className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>

        {/* Визуал: сайт проекта */}
        <figure className="relative order-3 lg:order-none lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mt-[54px] lg:self-start xl:col-span-6 xl:col-start-7">
          <HeroVisual />
          <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[14px] text-ivory/70">
            <span>Сайт адвоката Аксёновой. {hero.footnote}</span>
            <ExternalSiteLink place="hero" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ivory hover:text-gold-soft">
              {caseAksenova.siteLabel}
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </ExternalSiteLink>
          </figcaption>
        </figure>

        {/* Результаты кейса: мобильный — сразу после оффера; десктоп — полоса на всю ширину под текстом и макетом */}
        <figure className="order-2 -mt-3 border-t border-[var(--on-dark-stroke)] pt-5 lg:order-none lg:col-span-12 lg:row-start-2 lg:mt-2 lg:pt-8">
          <figcaption className="text-[14px] text-ivory/75">{hero.statsCaption}</figcaption>
          <dl className="mt-3 lg:flex lg:items-end lg:gap-14">
            {/* Главный результат — выручка за месяц */}
            <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
              <dt className="order-2 pb-2 text-[16px] leading-snug font-semibold text-ivory sm:pb-3 sm:text-[18px]">
                {stats[2].label}
              </dt>
              <dd className="num order-1 text-[52px] whitespace-nowrap text-gold-soft xs:text-[58px] sm:text-[76px] lg:text-[84px]">
                {stats[2].value}
              </dd>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[var(--on-dark-stroke)] pt-4 sm:max-w-[420px] lg:mt-0 lg:flex lg:max-w-none lg:gap-12 lg:border-t-0 lg:border-l lg:pt-0 lg:pb-3 lg:pl-14">
              {stats.slice(0, 2).map((s) => (
                <div key={s.label} className="flex items-baseline gap-2.5">
                  <dd className="num text-[36px] text-ivory sm:text-[44px] lg:text-[52px]">{s.value}</dd>
                  <dt className="text-[14.5px] leading-snug text-ivory/80 sm:text-[16px]">{s.label}</dt>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[14px] leading-snug text-ivory/70 lg:mt-0 lg:max-w-[300px] lg:pb-3.5">{hero.caseLine}</p>
          </dl>
        </figure>
      </div>
    </section>
  );
}

function HeroVisual() {
  const image = siteContent.heroCaseImage;
  return (
    <div className="overflow-hidden rounded-[8px] border border-[var(--on-dark-stroke)] bg-navy shadow-[0_40px_90px_-45px_rgba(0,0,0,0.85)] lg:w-[118%] xl:w-[122%]">
      <div className="flex items-center gap-2 border-b border-[var(--on-dark-stroke)] px-4 py-2.5" aria-hidden="true">
        <span className="size-2 rounded-full bg-white/20" />
        <span className="size-2 rounded-full bg-white/20" />
        <span className="size-2 rounded-full bg-white/20" />
        <span className="ml-2 truncate rounded bg-white/[0.07] px-3 py-0.5 text-[12px] text-ivory/70">{caseAksenova.siteLabel}</span>
      </div>
      {isVisible(image) ? (
        <MediaFrame item={image} rounded={false} priority sizes="(min-width: 1024px) 760px, 100vw" badge={hero.demoLabel} badgePosition="bottom-left" />
      ) : (
        <div className="flex aspect-[16/10] flex-col justify-end p-8">
          <p className="font-serif text-[40px] leading-none">{caseAksenova.siteLabel}</p>
        </div>
      )}
    </div>
  );
}
