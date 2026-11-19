import { processSection } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="section-tight on-light bg-ivory">
      <div className="container-lp">
        <SectionHeading id="process-title" eyebrow={processSection.eyebrow} title={processSection.title} />
        <ol className="relative mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-8">
          <span aria-hidden="true" className="absolute top-[27px] right-[25%] left-[28px] hidden h-px bg-gold/50 lg:block" />
          {processSection.steps.map((step, i) => (
            <li key={step.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }} className="relative">
              <span className="relative z-10 grid size-14 place-items-center rounded-full border border-gold/70 bg-ivory font-serif text-[22px] text-navy lining-nums">
                0{i + 1}
              </span>
              <h3 className="h3 mt-5">{step.title}</h3>
              <p className="mt-2 text-[15.5px] text-muted-text">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
