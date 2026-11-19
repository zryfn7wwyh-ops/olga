import { process as processContent } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="section on-light bg-ivory">
      <div className="container-lp grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="process-title"
              eyebrow={processContent.eyebrow}
              title={processContent.title}
              titleClassName="lg:text-[46px]!"
            />
            <div data-reveal className="mt-10 grid grid-cols-2 overflow-hidden rounded-[14px] border border-stroke bg-paper">
              <div className="border-r border-stroke p-5 sm:p-6">
                <p className="text-[12px] font-bold tracking-[0.14em] text-muted-text uppercase">Вы</p>
                <p className="mt-2 font-serif text-[21px] leading-tight font-semibold">Юридическая работа</p>
              </div>
              <div className="on-dark bg-navy p-5 text-ivory sm:p-6">
                <p className="text-[12px] font-bold tracking-[0.14em] text-gold-soft uppercase">Мы</p>
                <p className="mt-2 font-serif text-[21px] leading-tight font-semibold">Маркетинговая инфраструктура</p>
              </div>
            </div>
            <p data-reveal className="mt-5 text-[15.5px] text-muted-text">
              {processContent.note}
            </p>
          </div>
        </div>

        <ol className="relative lg:col-span-7 lg:pl-6">
          <span aria-hidden="true" className="absolute top-3 bottom-3 left-[27px] w-px bg-gold/50 lg:left-[51px]" />
          {processContent.steps.map((step) => (
            <li key={step.n} data-reveal className="relative flex gap-6 pb-10 last:pb-0 sm:gap-8">
              <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full border border-gold/70 bg-ivory font-serif text-[22px] text-navy lining-nums tabular-nums">
                {step.n}
              </span>
              <div className="pt-3">
                <h3 className="h3">{step.title}</h3>
                {step.text && <p className="mt-3 max-w-[56ch] text-[16px] text-muted-text">{step.text}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
