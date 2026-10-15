import { processSteps } from "@/data/profile";
import { SectionHeading } from "./SectionHeading";

/** Как проходит работа: горизонтальная editorial-линия (desktop) / вертикальный timeline (mobile). */
export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="section-y bg-ivory">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading index="06" label="Процесс" id="process-title" title="Как проходит работа" className="lg:col-span-7" />
          <p className="max-w-[440px] text-[16px] text-muted lg:col-span-5 lg:justify-self-end">
            Шесть последовательных этапов — от первого разговора до фиксации результата и перехода к следующей стадии процедуры.
          </p>
        </div>

        <ol className="relative mt-14 grid gap-0 sm:grid-cols-2 lg:mt-24 lg:grid-cols-6">
          {/* Горизонтальная линия (desktop) */}
          <span aria-hidden className="absolute left-0 right-0 top-[11px] hidden h-px bg-line lg:block" />
          {processSteps.map((s, i) => (
            <li
              key={s.title}
              className="group relative border-l border-line pb-10 pl-8 last:pb-0 sm:pb-12 lg:border-l-0 lg:pb-0 lg:pl-0 lg:pr-6"
            >
              {/* Узел */}
              <span
                aria-hidden
                className="absolute -left-[6px] top-[6px] h-[11px] w-[11px] border border-bronze bg-ivory transition-colors duration-200 group-hover:bg-bronze lg:left-0 lg:top-[6px]"
              />
              <span className="block font-serif text-[48px] leading-none text-bronze tabular lg:mt-12 lg:text-[64px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-[18px] font-semibold leading-snug lg:mt-8">{s.title}</h3>
              <p className="mt-3 max-w-[360px] text-[15px] leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
