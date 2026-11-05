import { Rich } from "@/components/ui/Rich";
import { benefits } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

export function Benefits() {
  return (
    <section className={s.section} id="advantages" aria-labelledby="advantages-title">
      <div className="container">
        <SectionIntro id="advantages" titleId="advantages-title" index={benefits.index} kicker={benefits.kicker} title={benefits.title} />
        <ol className={s.advantages}>
          {benefits.items.map((item, i) => (
            <li key={item.title} className={s.advantage}>
              <span className="mono">0{i + 1}</span>
              <h3 className={s.h3}>{item.title}</h3>
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
