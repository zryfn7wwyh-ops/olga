import { caseCategories, cases } from "@/data/cases";
import { CaseAccordion } from "./CaseAccordion";
import { SectionHeading } from "./SectionHeading";

export function Cases() {
  return (
    <section id="cases" aria-labelledby="cases-title" className="section-y bg-stone">
      <div className="container-x">
        <SectionHeading index="07" label="Практика" id="cases-title" title="Практика в сложных процедурах" />
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Категории кейсов">
          {caseCategories.map((c) => (
            <li key={c} className="border border-line px-3 py-1.5 text-[13px] text-muted">
              {c}
            </li>
          ))}
        </ul>
        <div className="mt-12 grid gap-4 lg:mt-16">
          {cases.map((c, i) => (
            <CaseAccordion key={c.id} item={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
