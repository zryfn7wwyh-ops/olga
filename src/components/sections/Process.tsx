import { steps } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

export function Process() {
  return (
    <section className={s.section} id="steps" aria-labelledby="steps-title">
      <div className="container">
        <SectionIntro id="steps" titleId="steps-title" index={steps.index} kicker={steps.kicker} title={steps.title} />
        <div className={s.stepsWrap}>
          <div className={s.processLine} data-motion="process-line" data-motion-id="process-line" aria-hidden="true">
            <span className={s.processLineInner} data-motion-layer />
          </div>
          <ol className={s.steps}>
          {steps.items.map((item, i) => (
            <li key={item.title} className={s.step}>
              <span className={s.stepDot} aria-hidden="true">
                {i + 1}
              </span>
              <h3 className={s.h3}>
                <span className="visually-hidden">Этап {i + 1}. </span>
                {item.title}
              </h3>
              <p>{item.text}</p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
