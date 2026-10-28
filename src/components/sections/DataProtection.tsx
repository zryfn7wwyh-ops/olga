import { ConsultationButton } from "@/components/forms/Triggers";
import { approach } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

export function DataProtection() {
  return (
    <section className={`${s.section} ${s.ink}`} id="approach" aria-labelledby="approach-title">
      <div className={`container ${s.approachGrid}`}>
        <div className={s.approachAside}>
          <SectionIntro id="approach" titleId="approach-title" index={approach.index} kicker={approach.kicker} title={approach.title} lead={approach.lead} />
          <div>
            <ConsultationButton>{approach.cta}</ConsultationButton>
          </div>
        </div>
        <div style={{ display: "grid", gap: "var(--space-6)", alignContent: "start" }}>
          <ul className={s.approachList}>
            {approach.items.map((item) => (
              <li key={item.title}>
                <h3 className={s.h3}>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
          <p className={s.approachNote}>{approach.note}</p>
        </div>
      </div>
    </section>
  );
}
