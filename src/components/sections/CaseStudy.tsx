import { ArrowUpRight, Globe, Megaphone, NotebookPen, MessagesSquare } from "lucide-react";
import { caseSection } from "@/content/landing";
import { caseAksenova, formatRub, type CaseAsset } from "@/content/case-aksenova";
import { CaseFunnel } from "./CaseFunnel";
import { CaseViewTracker } from "./CaseViewTracker";
import { CtaButton } from "@/components/forms/CtaButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AssetImage } from "@/components/ui/AssetImage";
import { cn } from "@/lib/cn";

const icons = { site: Globe, ads: Megaphone, articles: NotebookPen, social: MessagesSquare } as const;
const assetByWork: Record<string, CaseAsset> = {
  site: caseAksenova.assets.siteDesktop,
  ads: caseAksenova.assets.analytics,
  articles: caseAksenova.assets.articles,
  social: caseAksenova.assets.social,
};

export function CaseStudy() {
  return (
    <section id="case" aria-labelledby="case-title" className="section on-light bg-ivory">
      <CaseViewTracker />
      <div className="container-lp">
        <SectionHeading
          id="case-title"
          eyebrow={caseSection.eyebrow}
          title={caseSection.title}
          intro={caseSection.description}
          align="split"
        />

        {/* 2.1 Воронка */}
        <div className="mt-14 lg:mt-20">
          <h3 className="sr-only">{caseSection.funnelTitle}</h3>
          <CaseFunnel />
        </div>

        {/* 2.2 Финансовые итоги */}
        <div className="mt-16 lg:mt-24">
          <h3 className="eyebrow mb-6">{caseSection.financeTitle}</h3>
          <div className="grid gap-4 md:grid-cols-12 md:gap-5">
            <div data-reveal className="on-dark relative overflow-hidden rounded-[14px] bg-navy-deep p-7 text-ivory sm:p-10 md:col-span-7">
              <span className="absolute top-0 left-10 h-px w-24 bg-gold" aria-hidden="true" />
              <p className="text-[15px] text-[var(--on-dark-muted)]">Общая выручка за тот же месяц</p>
              <p className="num mt-4 text-[54px] sm:text-[80px]">{formatRub(caseAksenova.finance.revenue)}</p>
              <p className="mt-3 text-[18px] font-semibold">выручка</p>
            </div>
            <div data-reveal style={{ ["--reveal-delay" as string]: "80ms" }} className="rounded-[14px] border border-stroke bg-paper p-7 sm:p-10 md:col-span-5">
              <p className="text-[15px] text-muted-text">Рекламный бюджет за месяц</p>
              <p className="num mt-4 text-[48px] sm:text-[64px]">{formatRub(caseAksenova.finance.adSpend)}</p>
              <p className="mt-3 text-[18px] font-semibold">расходы на рекламу</p>
            </div>
          </div>
          <p className="mt-5 max-w-[760px] text-[14px] text-muted-text">{caseSection.financeNote}</p>
        </div>

        {/* 2.3 Что сделали */}
        <div className="mt-16 lg:mt-24">
          <h3 className="eyebrow mb-6">{caseSection.worksTitle}</h3>
          <ul className="grid gap-4 md:grid-cols-12 md:gap-5">
            {caseAksenova.works.map((work, i) => {
              const Icon = icons[work.id as keyof typeof icons];
              const wide = i === 0 || i === 3;
              const dark = i === 3;
              const asset = assetByWork[work.id];
              return (
                <li
                  key={work.id}
                  data-reveal
                  style={{ ["--reveal-delay" as string]: `${(i % 2) * 80}ms` }}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-[14px] border",
                    wide ? "md:col-span-7" : "md:col-span-5",
                    dark ? "on-dark border-navy bg-navy text-ivory" : "border-stroke bg-paper",
                  )}
                >
                  {dark && <span className="absolute top-0 left-9 h-px w-16 bg-gold" aria-hidden="true" />}
                  <div className="flex flex-1 flex-col p-7 sm:p-9">
                    <div className="flex items-start justify-between gap-6">
                      <span className={cn("font-serif text-[44px] leading-none lining-nums tabular-nums", dark ? "text-gold-soft" : "text-gold-ink")}>
                        0{i + 1}
                      </span>
                      {Icon && (
                        <Icon className={cn("size-7", dark ? "text-gold-soft" : "text-navy/70")} strokeWidth={1.25} aria-hidden="true" />
                      )}
                    </div>
                    <div className="mt-auto pt-10">
                      <h4 className="h3">{work.title}</h4>
                      <p className={cn("mt-3 max-w-[48ch] text-[16px]", dark ? "text-[var(--on-dark-muted)]" : "text-muted-text")}>
                        {work.text}
                      </p>
                      {work.id === "site" && (
                        <a
                          href={caseAksenova.siteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ink link-underline"
                        >
                          {caseAksenova.siteLabel}
                          <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                          <span className="sr-only">(откроется в новой вкладке)</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <AssetImage asset={asset} className="border-t border-stroke" />
                </li>
              );
            })}
          </ul>
        </div>

        {/* 2.4 Реальные материалы + CTA */}
        <div className="mt-16 grid gap-8 border-t border-navy/15 pt-10 lg:mt-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h3 className="h3">{caseSection.materialsTitle}</h3>
            <p className="mt-3 max-w-[60ch] text-muted-text">
              Сайт адвоката открыт и работает — структуру, тексты и формы обращения можно оценить самостоятельно.
            </p>
            <a
              href={caseAksenova.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-[16px] font-semibold text-ink link-underline"
            >
              {caseSection.siteLinkLabel}
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              <span className="sr-only">(откроется в новой вкладке)</span>
            </a>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <CtaButton source="case_cta" event="case_cta_click" variant="primary-dark" className="w-full sm:w-auto">
              {caseSection.cta}
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
