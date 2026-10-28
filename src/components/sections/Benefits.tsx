import { benefits } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

export function Benefits() {
  return (
    <section className={s.section} id="advantages" aria-labelledby="advantages-title">
      <div className="container">
        <SectionIntro id="advantages" titleId="advantages-title" index={benefits.index} kicker={benefits.kicker} title={benefits.title} />
        <ul className={s.cards3} style={{ listStyle: "none" }}>
          {benefits.items.map((item, i) => (
            <li key={item.title} className={s.benefit}>
              <span className={s.benefitNum}>0{i + 1}</span>
              <h3 className={s.h3}>{item.title}</h3>
              <p className={s.muted}>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
