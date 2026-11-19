import { ArrowUpRight } from "lucide-react";
import { caseSection } from "@/content/landing";
import { caseAksenova } from "@/content/case-aksenova";
import { CaseFacts, CaseFunnel } from "./CaseFunnel";
import { CaseGallery } from "./CaseGallery";
import { CaseViewTracker } from "./CaseViewTracker";
import { CtaButton } from "@/components/forms/CtaButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ExternalSiteLink } from "@/components/ui/ExternalSiteLink";

export function CaseStudy() {
  return (
    <section id="case" aria-labelledby="case-title" className="section on-light bg-ivory">
      <CaseViewTracker />
      <div className="container-lp">
        <SectionHeading
          id="case-title"
          eyebrow={caseSection.eyebrow}
          title={caseSection.title}
          intro={caseSection.subtitle}
          align="split"
        />

        <div className="mt-10 lg:mt-14">
          <h3 className="sr-only">Воронка за отчётный месяц</h3>
          <CaseFunnel />
        </div>
        <div className="mt-4" data-reveal>
          <CaseFacts />
          <p className="mt-4 max-w-[860px] text-[13.5px] text-muted-text">{caseSection.disclaimer}</p>
        </div>

        <div className="mt-14 lg:mt-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">{caseSection.worksTitle}</p>
              <h3 className="h3 text-[28px]! sm:text-[34px]!">{caseSection.galleryTitle}</h3>
            </div>
            <ExternalSiteLink
              place="case"
              className="inline-flex min-h-11 items-center gap-2 text-[15.5px] font-semibold text-ink link-underline"
            >
              {caseSection.siteLinkLabel}: {caseAksenova.siteLabel}
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </ExternalSiteLink>
          </div>
          <CaseGallery />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-navy/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[52ch] text-[16px] text-muted-text">
            Разберём вашу практику так же: источники обращений, сайт и путь клиента до договора.
          </p>
          <CtaButton source="case_cta" event="case_cta_click" variant="primary-dark" className="w-full shrink-0 sm:w-auto">
            {caseSection.cta}
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
