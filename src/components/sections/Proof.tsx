import { ArrowUpRight, Check } from "lucide-react";
import { proof } from "@/content/landing";
import { caseAksenova, formatNumber, formatRub } from "@/content/case-aksenova";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AssetImage } from "@/components/ui/AssetImage";
import { buttonClass } from "@/components/ui/Button";

export function Proof() {
  const screenshot = caseAksenova.assets.siteDesktop;
  return (
    <section id="proof" aria-labelledby="proof-title" className="section on-dark bg-navy-deep text-ivory">
      <div className="container-lp">
        <SectionHeading id="proof-title" eyebrow={proof.eyebrow} title={proof.title} />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* Браузерная рамка: реальный скриншот, если он разрешён; иначе — текстовая презентация проекта */}
          <figure data-reveal className="lg:col-span-7">
            <div className="overflow-hidden rounded-[14px] border border-[var(--on-dark-stroke)] bg-navy shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-2 border-b border-[var(--on-dark-stroke)] px-4 py-3" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="ml-3 flex-1 truncate rounded-md bg-white/[0.06] px-3 py-1 text-[12.5px] text-[var(--on-dark-muted)]">
                  https://{caseAksenova.siteLabel}
                </span>
              </div>
              {screenshot.src ? (
                <AssetImage asset={screenshot} sizes="(min-width: 1024px) 720px, 100vw" />
              ) : (
                <div className="relative px-6 py-12 sm:px-12 sm:py-16">
                  <p className="text-[12px] font-bold tracking-[0.16em] text-gold-soft uppercase">Действующий проект</p>
                  <p className="mt-5 font-serif text-[40px] leading-[1.02] font-medium break-words sm:text-[60px]">
                    {caseAksenova.siteLabel}
                  </p>
                  <p className="mt-4 max-w-[44ch] text-[16px] text-[var(--on-dark-muted)]">
                    Сайт {caseAksenova.lawyerGenitive} — разработан в рамках комплексного продвижения.
                  </p>
                  <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-[var(--on-dark-stroke)] pt-6">
                    <div className="flex flex-col-reverse gap-1">
                      <dt className="text-[13px] text-[var(--on-dark-muted)]">обращений</dt>
                      <dd className="num text-[34px] sm:text-[44px]">{formatNumber(caseAksenova.funnel.leads)}</dd>
                    </div>
                    <div className="flex flex-col-reverse gap-1">
                      <dt className="text-[13px] text-[var(--on-dark-muted)]">договоров</dt>
                      <dd className="num text-[34px] sm:text-[44px]">{formatNumber(caseAksenova.funnel.contracts)}</dd>
                    </div>
                    <div className="flex flex-col-reverse gap-1">
                      <dt className="text-[13px] text-[var(--on-dark-muted)]">выручка</dt>
                      <dd className="num text-[24px] sm:text-[34px]">{formatRub(caseAksenova.finance.revenue)}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-[13px] text-[var(--on-dark-muted)]">За один отчётный месяц.</p>
                </div>
              )}
            </div>
          </figure>

          <div data-reveal className="flex flex-col lg:col-span-5">
            <p className="lead text-ivory/90">{proof.text}</p>
            <ul className="mt-8 space-y-4">
              {proof.points.map((p) => (
                <li key={p} className="flex gap-3 text-[16px] text-ivory/90">
                  <Check className="mt-1 size-4 shrink-0 text-gold-soft" strokeWidth={2} aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <a
                href={caseAksenova.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("outline-light", "lg", "w-full sm:w-auto")}
              >
                <span>{proof.linkLabel}</span>
                <ArrowUpRight className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
                <span className="sr-only">(откроется в новой вкладке)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
