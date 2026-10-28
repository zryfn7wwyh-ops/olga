import { Rich } from "@/components/ui/Rich";
import { EstimateButton, QuizButton } from "@/components/forms/Triggers";
import { FormatPreview } from "@/components/showcase/FormatPreview";
import { Icon } from "@/components/ui/Icon";
import { formats } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

export function SiteTypes() {
  return (
    <section className={`${s.section} ${s.paper2}`} id="formats" aria-labelledby="formats-title">
      <div className="container">
        <SectionIntro
          split id="formats" titleId="formats-title" index={formats.index} kicker={formats.kicker} title={formats.title} lead={formats.lead} />
        <ul className={s.cards3} style={{ listStyle: "none" }}>
          {formats.items.map((item) => (
            <li key={item.id} className={s.formatCard}>
              <div className={s.formatPreview} aria-hidden="true">
                <FormatPreview kind={item.id} />
              </div>
              <div className={s.formatBody}>
                <h3 className={s.h3}>{item.title}</h3>
                <p className={s.muted}>
                  <Rich text={item.text} />
                </p>
                <ul className={s.points}>
                  {item.points.map((p) => (
                    <li key={p}>
                      <Icon name="check" size={18} />
                      {p}
                    </li>
                  ))}
                </ul>
                <EstimateButton siteType={item.id} block>
                  {item.cta}
                </EstimateButton>
              </div>
            </li>
          ))}
        </ul>
        <div className={s.formatsFoot}>
          <span>Не уверены, какой формат выбрать?</span>
          <QuizButton />
        </div>
      </div>
    </section>
  );
}
