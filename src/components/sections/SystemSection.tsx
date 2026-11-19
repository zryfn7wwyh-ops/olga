import { ArrowRight, BadgeCheck } from "lucide-react";
import { system } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaButton } from "@/components/forms/CtaButton";
import { StageDetails } from "./StageDetails";
import { cn } from "@/lib/cn";

/**
 * Объединённый раздел «Подход + Услуги + Консультации по продажам».
 * Консультации — часть третьего этапа комплексного продвижения, без отдельной цены и заявки.
 */
export function SystemSection() {
  return (
    <section id="system" aria-labelledby="system-title" className="section on-dark relative overflow-hidden bg-navy text-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_100%_0%,rgba(180,154,108,0.09),transparent_70%)]"
      />
      <div className="container-lp relative">
        <SectionHeading id="system-title" eyebrow={system.eyebrow} title={system.title} titleClassName="max-w-[24ch]" />

        <ol className="relative mt-10 grid gap-4 lg:mt-16 lg:grid-cols-3 lg:items-start lg:gap-6">
          <span aria-hidden="true" className="absolute top-[27px] right-[16%] left-[16%] hidden h-px bg-gold/45 lg:block" />
          {system.stages.map((stage, i) => {
            const last = "included" in stage;
            return (
              <li
                key={stage.n}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
                className="relative flex flex-col"
              >
                <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                  <span
                    className={cn(
                      "relative z-10 grid size-[54px] shrink-0 place-items-center rounded-full border font-serif text-[22px] lining-nums",
                      last ? "border-gold bg-gold text-navy-deep" : "border-gold/70 bg-navy text-gold-soft",
                    )}
                  >
                    {stage.n}
                  </span>
                  {i < 2 && (
                    <ArrowRight
                      aria-hidden="true"
                      className="absolute top-[18px] -right-[19px] z-10 hidden size-5 text-gold/80 lg:block"
                      strokeWidth={1.5}
                    />
                  )}
                </div>
                <div
                  className={cn(
                    "mt-4 flex flex-1 flex-col rounded-[14px] border p-6 sm:p-7 lg:mt-6",
                    last ? "border-gold/50 bg-navy-deep" : "border-[var(--on-dark-stroke)] bg-white/[0.03]",
                  )}
                >
                  <h3 className="font-serif text-[25px] leading-[1.15] font-semibold sm:text-[27px]">{stage.title}</h3>
                  <p className="mt-3 text-[15.5px] text-[var(--on-dark-muted)]">{stage.lead}</p>
                  {last && (
                    <p className="mt-5 flex gap-3 rounded-[10px] bg-ivory px-4 py-3.5 text-[14.5px] leading-snug font-semibold text-navy-deep">
                      <BadgeCheck className="mt-0.5 size-5 shrink-0 text-gold-ink" strokeWidth={1.75} aria-hidden="true" />
                      {stage.included}
                    </p>
                  )}
                  {"objection" in stage && stage.objection && <ObjectionExample data={stage.objection} />}
                  <StageDetails
                    items={stage.details}
                    openLabel={system.detailsOpen}
                    closeLabel={system.detailsClose}
                    title={stage.title}
                  />
                </div>
              </li>
            );
          })}
        </ol>

        <Specifics />

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:mt-12">
          <p className="max-w-[56ch] text-[15.5px] text-[var(--on-dark-muted)]">
            Один подрядчик отвечает за весь путь клиента: от первого запроса до разговора о договоре.
          </p>
          <CtaButton source="system_cta" className="w-full shrink-0 sm:w-auto">
            {system.cta}
          </CtaButton>
        </div>
      </div>
    </section>
  );
}

type Objection = NonNullable<(typeof system.stages)[2]["objection"]>;

/** Мини-диалог «Как работаем с возражениями» — пример разговора внутри третьего этапа, не отдельная услуга. */
function ObjectionExample({ data }: { data: Objection }) {
  return (
    <figure className="mt-5" aria-label={data.title}>
      <figcaption className="flex items-center justify-between gap-3 text-[12px] font-bold tracking-[0.14em] uppercase">
        <span className="text-gold-soft">{data.title}</span>
        <span className="font-semibold tracking-normal text-ivory/60 normal-case">{data.label}</span>
      </figcaption>
      <div className="mt-3 space-y-2">
        <div className="mr-6 rounded-[14px] rounded-tl-[4px] bg-ivory px-4 py-3 text-navy-deep">
          <p className="text-[11.5px] font-bold tracking-[0.1em] text-gold-ink uppercase">{data.clientLabel}</p>
          <p className="mt-1 text-[14.5px] leading-snug font-medium">«{data.client}»</p>
        </div>
        <div className="ml-6 rounded-[14px] rounded-tr-[4px] border border-gold/40 bg-navy px-4 py-3">
          <p className="text-[11.5px] font-bold tracking-[0.1em] text-gold-soft uppercase">{data.answerLabel}</p>
          <p className="mt-1 text-[14px] leading-snug text-ivory/90">{data.answer}</p>
        </div>
      </div>
    </figure>
  );
}

/** Короткий блок о специфике юридического маркетинга — в подвале раздела, без отдельного экрана. */
function Specifics() {
  const sp = system.specifics;
  return (
    <div data-reveal className="mt-12 grid gap-6 border-t border-[var(--on-dark-stroke)] pt-10 lg:mt-16 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-5">
        <h3 className="font-serif text-[26px] leading-[1.15] font-semibold sm:text-[30px]">{sp.title}</h3>
        <p className="mt-3 text-[15.5px] text-[var(--on-dark-muted)]">{sp.text}</p>
      </div>
      <ul className="grid gap-5 sm:grid-cols-3 lg:col-span-7 lg:gap-6">
        {sp.points.map((pt) => (
          <li key={pt.title} className="border-t border-gold/60 pt-4">
            <p className="text-[16px] font-semibold">{pt.title}</p>
            <p className="mt-1.5 text-[14.5px] text-[var(--on-dark-muted)]">{pt.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
