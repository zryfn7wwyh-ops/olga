import { deliverables } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

export function Deliverables() {
  return (
    <section className={`${s.section} ${s.paper2}`} id="deliver" aria-labelledby="deliver-title">
      <div className="container">
        <SectionIntro
          split id="deliver" titleId="deliver-title" index={deliverables.index} kicker={deliverables.kicker} title={deliverables.title} />
        <ul className={s.deliverList}>
          {deliverables.items.map((item, i) => (
            <li key={item.title}>
              <span className={s.deliverNum} aria-hidden="true">
                0{i + 1}
              </span>
              <h3 className={s.h3}>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
