import { EstimateButton, QuizButton } from "@/components/forms/Triggers";
import { FormatPreview } from "@/components/showcase/FormatPreview";
import { Icon } from "@/components/ui/Icon";
import { Rich } from "@/components/ui/Rich";
import { formats } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

export function SiteTypes() {
  return (
    <section className={s.section} id="formats" aria-labelledby="formats-title">
      <div className="container">
        <SectionIntro id="formats" titleId="formats-title" index={formats.index} kicker={formats.kicker} title={formats.title} lead={formats.lead} />
        <div className={s.formats}>
          {formats.items.map((item) => (
            <article key={item.id} className={s.format}>
              <FormatPreview kind={item.id} />
              <div className={s.formatBody}>
                <h3 className={s.formatTitle}>{item.title}</h3>
                <p>
                  <Rich text={item.text} />
                </p>
                <ul className={s.checks}>
                  {item.points.map((p) => (
                    <li key={p}>
                      <Icon name="check" />
                      {p}
                    </li>
                  ))}
                </ul>
                <EstimateButton siteType={item.id}>{item.cta}</EstimateButton>
              </div>
            </article>
          ))}
        </div>
        <div className={s.formatsStrip}>
          <span>Не уверены, какой формат выбрать?</span>
          <QuizButton variant="soft" />
        </div>
      </div>
    </section>
  );
}
