import { CasePreview } from "@/components/showcase/CasePreview";
import { CaseStage } from "@/components/showcase/CaseStage";
import sc from "@/components/showcase/showcase.module.css";
import { Rich } from "@/components/ui/Rich";
import { cases } from "@/content/cases";
import { work } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

export function WorkShowcase() {
  return (
    <section className={s.section} id="work" aria-labelledby="work-title">
      <div className={s.workPanel}>
        <SectionIntro id="work" titleId="work-title" index={work.index} kicker={work.kicker} title={work.title} lead={work.lead} />
        <ol>
          {cases.map((item) => (
            <li key={item.id} className={sc.case}>
              <div className={sc.caseMeta}>
                <p className={`mono ${sc.tag}`}>
                  <span>{item.kind === "concept" ? "Демонстрационный концепт" : "Проект клиента"}</span>
                  <span>{item.format}</span>
                </p>
                <h3 className={sc.caseTitle}>{item.title}</h3>
                <div>
                  <p>
                    <Rich text={item.summary} />
                  </p>
                  <ul className={sc.focus} aria-label="Что показывает концепт">
                    {item.focus.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <CaseStage id={item.id} label={`Макет концепта «${item.title}»: версия для компьютера и для телефона`}>
                <CasePreview item={item} />
              </CaseStage>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
