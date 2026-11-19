import { ArrowUpRight } from "lucide-react";
import { caseSection } from "@/content/landing";
import { caseAksenova } from "@/content/case-aksenova";
import { CaseResults } from "./CaseFunnel";
import { CaseGallery } from "./CaseGallery";
import { CaseMobileSummary } from "./CaseMobileSummary";
import { CaseViewTracker } from "./CaseViewTracker";
import { CtaButton } from "@/components/forms/CtaButton";
import { ExternalSiteLink } from "@/components/ui/ExternalSiteLink";

/** Кейс в формате editorial case study: проект → цифры → материалы. */
export function CaseStudy() {
  const aside = (
    <div className="flex h-full flex-col">
      <dl className="divide-y divide-navy/12 border-y border-navy/12">
        {caseSection.meta.map((m) => (
          <div key={m.label} className="grid grid-cols-[110px_1fr] gap-4 py-3.5 lg:grid-cols-1 lg:gap-1">
            <dt className="text-[14px] font-semibold text-muted-text">{m.label}</dt>
            <dd className="text-[16.5px] text-ink">{m.value}</dd>
          </div>
        ))}
      </dl>
      <ExternalSiteLink place="case" className="mt-5 inline-flex min-h-11 items-center gap-2 text-[16.5px] font-semibold text-ink link-underline">
        {caseSection.siteLinkLabel}
        <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
      </ExternalSiteLink>
      <p className="text-[14px] text-muted-text">{caseAksenova.siteLabel}</p>
    </div>
  );

  return (
    <section id="case" aria-labelledby="case-title" className="on-light bg-ivory py-11 md:py-20 xl:py-24">
      <CaseViewTracker />
      <div className="container-lp">
        <div className="max-w-[920px]" data-reveal>
          <p className="eyebrow mb-4">{caseSection.eyebrow}</p>
          <h2 id="case-title" className="h2">
            {caseSection.title}
          </h2>
          <p className="mt-4 max-w-[68ch] text-[17px] text-muted-text md:mt-5 md:text-[17.5px] md:leading-[1.65]">
            <span className="md:hidden">{caseSection.subtitleShort}</span>
            <span className="hidden md:inline">{caseSection.subtitle}</span>
          </p>
        </div>

        <div className="mt-6 md:hidden">
          <CaseMobileSummary />
        </div>

        <div className="mt-6 md:mt-12">
          <CaseGallery aside={aside} results={<CaseResults />} />
          <ExternalSiteLink place="case_mobile" className="mt-4 inline-flex min-h-11 items-center gap-2 text-[16px] font-semibold text-ink link-underline md:hidden">
            {caseSection.siteLinkLabel}: {caseAksenova.siteLabel}
            <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </ExternalSiteLink>
        </div>

        <p className="mt-6 max-w-[860px] text-[14px] text-muted-text md:mt-8">{caseSection.disclaimer}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 md:mt-8">
          <CtaButton source="case_cta" event="case_cta_click" variant="primary-dark" className="w-full sm:w-auto">
            {caseSection.cta}
          </CtaButton>
          <p className="text-[15.5px] text-muted-text">Посмотрим источники обращений, сайт и путь клиента до договора.</p>
        </div>
      </div>
    </section>
  );
}
