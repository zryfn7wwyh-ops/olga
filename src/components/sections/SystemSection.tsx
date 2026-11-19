import { system } from "@/content/landing";
import { CtaButton } from "@/components/forms/CtaButton";
import { StageDetails } from "./StageDetails";

/**
 * «От первого визита до заключённого договора».
 * Привлечение, личный бренд и сайт — три спокойные текстовые колонки; работа с обращениями — широкий тёмный фрагмент.
 * Консультации по продажам — часть пакета, без отдельной цены, тарифа и формы.
 */
export function SystemSection() {
  const [s1, s2, s3, s4] = system.stages;
  return (
    <section id="system" aria-labelledby="system-title" className="on-light bg-ivory py-14 md:py-20 xl:py-24">
      <div className="container-lp">
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-12" data-reveal>
          <h2 id="system-title" className="h2 lg:col-span-7">
            {system.title}
          </h2>
          <p className="text-[16px] text-muted-text lg:col-span-5 lg:self-end">{system.intro}</p>
        </div>

        {/* 01–03: спокойные колонки без карточек */}
        <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10 lg:mt-14 lg:grid-cols-3">
          {[s1, s2, s3].map((s) => (
            <div key={s.n} className="border-t border-navy pt-5">
              <p className="text-[14px] font-semibold text-muted-text tabular-nums">{s.n}</p>
              <h3 className="mt-2 font-serif text-[25px] leading-[1.15] font-semibold sm:text-[28px]">{s.title}</h3>
              <p className="mt-3 max-w-[52ch] text-[16px] text-ink">{s.lead}</p>
              <StageDetails items={s.details} openLabel={system.detailsOpen} closeLabel={system.detailsClose} title={s.title} tone="light" />
            </div>
          ))}
        </div>

        {/* 04: расширенный тёмный фрагмент */}
        <div className="on-dark mt-10 grid overflow-hidden rounded-[6px] bg-navy-deep text-ivory lg:mt-14 lg:grid-cols-12">
          <div className="p-6 sm:p-10 lg:col-span-7 lg:p-12">
            <p className="text-[14px] font-semibold text-ivory/60 tabular-nums">{s4.n}</p>
            <h3 className="mt-2 font-serif text-[28px] leading-[1.12] font-semibold sm:text-[36px]">{s4.title}</h3>
            <p className="mt-4 max-w-[58ch] text-[16.5px] leading-[1.65] text-ivory/85">{s4.lead}</p>
            <p className="mt-5 inline-block border-b border-gold pb-1 text-[16px] font-semibold text-ivory">{s4.included}</p>
            <StageDetails items={s4.details} openLabel={system.detailsOpen} closeLabel={system.detailsClose} title={s4.title} tone="dark" />
          </div>
          {s4.objection && (
            <figure className="border-t border-[var(--on-dark-stroke)] bg-navy p-6 sm:p-10 lg:col-span-5 lg:border-t-0 lg:border-l lg:p-12">
              <figcaption className="text-[13px] font-semibold text-ivory/60">{s4.objection.title}</figcaption>
              <blockquote className="mt-3 font-serif text-[26px] leading-[1.2] text-ivory italic sm:text-[30px]">
                «{s4.objection.client}»
              </blockquote>
              <p className="mt-6 text-[13px] font-semibold text-ivory/60">{s4.objection.answerTitle}</p>
              <p className="mt-2 text-[15.5px] leading-[1.6] text-ivory/90">{s4.objection.answer}</p>
            </figure>
          )}
        </div>

        {/* Специфика юридического маркетинга: текст + три тезиса строкой */}
        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h3 className="font-serif text-[24px] leading-[1.2] font-semibold sm:text-[28px]">{system.specifics.title}</h3>
            <p className="mt-3 text-[15.5px] text-muted-text">{system.specifics.text}</p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-3 sm:gap-6 lg:col-span-7">
            {system.specifics.points.map((pt) => (
              <div key={pt.title}>
                <dt className="text-[15.5px] font-semibold text-ink">{pt.title}</dt>
                <dd className="mt-1 text-[14.5px] text-muted-text">{pt.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 lg:mt-12">
          <CtaButton source="system_cta" variant="primary-dark" className="w-full sm:w-auto">
            {system.cta}
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
