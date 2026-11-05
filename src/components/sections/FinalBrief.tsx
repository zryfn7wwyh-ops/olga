import { BriefForm } from "@/components/forms/BriefForm";
import { Icon } from "@/components/ui/Icon";
import { brief } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

const CHECKLIST = ["Только контакт обязателен", "Тип и объём — если уже понятны", "Описание задачи — в свободной форме"];

export function FinalBrief() {
  return (
    <section className={s.section} id="brief" aria-labelledby="brief-title">
      <div className="container">
        <div className={s.split}>
          <div className={s.splitAside}>
            <SectionIntro id="brief" layout="stacked" titleId="brief-title" index={brief.index} kicker={brief.kicker} title={brief.title} lead={brief.lead} />
            <ul className={`${s.checks} ${s.briefChecks}`}>
              {CHECKLIST.map((c) => (
                <li key={c}>
                  <Icon name="check" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className={s.briefCard}>
            <BriefForm />
          </div>
        </div>
      </div>
    </section>
  );
}
