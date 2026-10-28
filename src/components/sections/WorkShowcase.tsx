import { CasePreview } from "@/components/showcase/CasePreview";
import s2 from "@/components/showcase/showcase.module.css";
import { cases } from "@/content/cases";
import { work } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

export function WorkShowcase() {
  return (
    <section className={s.section} id="work" aria-labelledby="work-title">
      <div className="container">
        <SectionIntro id="work" titleId="work-title" index={work.index} kicker={work.kicker} title={work.title} lead={work.lead} />
        <ol className={s2.cases}>
          {cases.map((item) => (
            <li key={item.id} className={s2.case}>
              <figure className={s2.caseStage} style={{ margin: 0 }} data-motion="case-reveal" data-motion-id={item.id}>
                <div data-motion-layer>
                  <CasePreview item={item} />
                </div>
                <figcaption className="visually-hidden">
                  Макет концепта «{item.title}»: версия для компьютера и для телефона.
                </figcaption>
              </figure>
              <div className={s2.caseMeta}>
                <span className={s2.badge}>{item.kind === "concept" ? "Демонстрационный концепт" : "Проект клиента"}</span>
                <p className={s2.caseFormat}>{item.format}</p>
                <h3 className={s2.caseTitle}>{item.title}</h3>
                <p className={s2.caseSummary}>{item.summary}</p>
                <ul className={s2.focus} aria-label="Что показывает концепт">
                  {item.focus.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
