import { Rich } from "@/components/ui/Rich";
import { steps } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

export function Process() {
  return (
    <section className={s.section} id="steps" aria-labelledby="steps-title">
      <div className="container">
        <SectionIntro id="steps" titleId="steps-title" index={steps.index} kicker={steps.kicker} title={steps.title} />
        <ol className={s.steps} data-motion="process-line" data-motion-id="process-line">
          {steps.items.map((item, i) => (
            <li key={item.title} className={s.step}>
              <span className={s.stepNum} aria-hidden="true">
                {i + 1}
              </span>
              <h3 className={s.h3sm}>
                <span className="visually-hidden">Этап {i + 1}. </span>
                {item.title}
              </h3>
              <p>
                <Rich text={item.text} />
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
