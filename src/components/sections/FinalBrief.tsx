import { BriefForm } from "@/components/forms/BriefForm";
import { Icon } from "@/components/ui/Icon";
import { brief } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

const CHECKLIST = ["Только контакт обязателен", "Тип и объём — если уже понятны", "Описание задачи — в свободной форме"];

export function FinalBrief() {
  return (
    <section className={`${s.section} ${s.paper2}`} id="brief" aria-labelledby="brief-title">
      <div className={`container ${s.briefGrid}`}>
        <div className={s.briefAside}>
          <SectionIntro id="brief" titleId="brief-title" index={brief.index} kicker={brief.kicker} title={brief.title} lead={brief.lead} />
          <ul className={s.briefChecklist}>
            {CHECKLIST.map((c) => (
              <li key={c}>
                <Icon name="check" size={18} />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className={s.briefCard}>
          <BriefForm />
        </div>
      </div>
    </section>
  );
}
