import { processSection } from "@/content/landing";

/** Компактный нумерованный список: строгий набор без карточек и таймлайна. */
export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="on-light bg-paper py-14 md:py-20">
      <div className="container-lp grid gap-6 lg:grid-cols-12 lg:gap-12">
        <h2 id="process-title" className="h2 text-[30px]! sm:text-[40px]! lg:col-span-4 lg:self-start" data-reveal>
          {processSection.title}
        </h2>
        <ol className="lg:col-span-8">
          {processSection.steps.map((step, i) => (
            <li
              key={step.title}
              className="grid grid-cols-[32px_1fr] gap-x-3 border-t border-stroke py-4 first:border-t-0 first:pt-0 sm:grid-cols-[48px_200px_1fr] sm:gap-x-6 sm:py-5"
            >
              <span className="text-[16px] font-semibold text-muted-text tabular-nums">{i + 1}.</span>
              <h3 className="text-[18px] font-semibold text-ink">{step.title}</h3>
              <p className="col-start-2 mt-1 text-[16.5px] text-muted-text sm:col-start-3 sm:mt-0">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
