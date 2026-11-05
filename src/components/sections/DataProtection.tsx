import { ConsultationButton } from "@/components/forms/Triggers";
import { Rich } from "@/components/ui/Rich";
import { approach } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

export function DataProtection() {
  return (
    <section className={s.section} id="approach" aria-labelledby="approach-title">
      <div className="container">
        <div className={s.approach}>
          <div className={s.approachMain}>
            <SectionIntro
              id="approach"
              layout="stacked"
              size="sm"
              titleId="approach-title"
              index={approach.index}
              kicker={approach.kicker}
              title={approach.title}
              lead={approach.lead}
            />
            <ConsultationButton variant="light">{approach.cta}</ConsultationButton>
          </div>
          <div className={s.approachSide}>
            <ul className={s.approachList}>
              {approach.items.map((item) => (
                <li key={item.title}>
                  <h3 className={s.h3sm}>{item.title}</h3>
                  <p>
                    <Rich text={item.text} />
                  </p>
                </li>
              ))}
            </ul>
            <p className={s.approachNote}>
              <Rich text={approach.note} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
