import { Icon } from "@/components/ui/Icon";
import { faq } from "@/content/faq";
import { faqIntro } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

/** Аккордеон на нативных <details>/<summary>: работает с клавиатуры и без JavaScript. */
export function Faq() {
  return (
    <section className={s.section} id="faq" aria-labelledby="faq-title">
      <div className={`container ${s.faqGrid}`}>
        <SectionIntro id="faq" titleId="faq-title" index={faqIntro.index} kicker={faqIntro.kicker} title={faqIntro.title} />
        <div className={s.faqList}>
          {faq.map((item) => (
            <details key={item.id} className={s.faqItem} id={`faq-${item.id}`}>
              <summary>
                <h3 style={{ font: "inherit", letterSpacing: "inherit" }}>{item.q}</h3>
                <span className={s.faqToggle} aria-hidden="true">
                  <Icon name="plus" size={18} />
                </span>
              </summary>
              <p className={s.faqAnswer}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
