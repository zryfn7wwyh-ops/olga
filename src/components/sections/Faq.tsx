import { Rich } from "@/components/ui/Rich";
import { faq } from "@/content/faq";
import { faqIntro } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

/** Аккордеон на нативных <details>/<summary>: работает с клавиатуры и без JavaScript. */
export function Faq() {
  return (
    <section className={s.section} id="faq" aria-labelledby="faq-title">
      <div className="container">
        <div className={s.split}>
          <div className={s.splitAside}>
            <SectionIntro id="faq" layout="stacked" titleId="faq-title" index={faqIntro.index} kicker={faqIntro.kicker} title={faqIntro.title} />
          </div>
          <div>
            {faq.map((item) => (
              <details key={item.id} className={s.faqItem} id={`faq-${item.id}`}>
                <summary>
                  <h3 className={s.faqQuestion}>{item.q}</h3>
                  <span className={s.faqToggle} aria-hidden="true" />
                </summary>
                <p className={s.faqAnswer}>
                  <Rich text={item.a} />
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
