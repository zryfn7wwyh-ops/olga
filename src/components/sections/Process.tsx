import { processSection } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="section-tight on-light bg-ivory">
      <div className="container-lp">
        <SectionHeading id="process-title" eyebrow={processSection.eyebrow} title={processSection.title} />
        <ol className="relative mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:mt-14 lg:grid-cols-4 lg:gap-8">
          <span aria-hidden="true" className="absolute top-[27px] right-[25%] left-[28px] hidden h-px bg-gold/50 lg:block" />
          {processSection.steps.map((step, i) => (
            <li key={step.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }} className="relative flex gap-4 sm:block">
              <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-gold/70 bg-ivory font-serif text-[18px] text-navy lining-nums sm:size-14 sm:text-[22px]">
                0{i + 1}
              </span>
              <div>
                <h3 className="h3 text-[21px]! sm:mt-5 sm:text-[26px]!">{step.title}</h3>
                <p className="mt-1 text-[15px] text-muted-text sm:mt-2 sm:text-[15.5px]">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
