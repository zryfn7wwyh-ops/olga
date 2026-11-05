import { Rich } from "@/components/ui/Rich";
import { deliverables } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

export function Deliverables() {
  return (
    <section className={s.section} id="deliver" aria-labelledby="deliver-title">
      <div className="container">
        <SectionIntro id="deliver" titleId="deliver-title" index={deliverables.index} kicker={deliverables.kicker} title={deliverables.title} />
        <ol className={s.deliver}>
          {deliverables.items.map((item, i) => (
            <li key={item.title}>
              <span className="mono" aria-hidden="true">
                0{i + 1}
              </span>
              <h3 className={s.deliverTitle}>{item.title}</h3>
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
