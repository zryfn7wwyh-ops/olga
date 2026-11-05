import { EstimateForm } from "@/components/forms/EstimateForm";
import { QuizButton } from "@/components/forms/Triggers";
import { Rich } from "@/components/ui/Rich";
import { hero } from "@/content/page";
import s from "./sections.module.css";

export function Hero() {
  return (
    <section id="calc" aria-labelledby="hero-title">
      <div className="container">
        <div className={s.hero}>
          <div className={s.heroMain}>
            <p className={`mono ${s.heroKicker}`}>{hero.kicker}</p>
            <h1 className={s.h1} id="hero-title" data-motion="hero-title" data-motion-id="hero-title">
              {hero.titleLines.map((line, i) => (
                <span key={line} className={`${s.line} ${i === hero.accentLine ? s.lineAccent : ""}`}>
                  <span data-motion-layer>{i === hero.accentLine ? <em>{line}</em> : line}</span>{" "}
                </span>
              ))}
            </h1>
            <p className={s.lede}>
              <Rich text={hero.lead} />
            </p>
            <ol className={s.points}>
              {hero.benefits.map((b, i) => (
                <li key={b}>
                  <span className="mono" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className={s.heroForm}>
            <EstimateForm />
          </div>

          <dl className={s.specs} aria-label="Что проверяем перед запуском">
            {hero.specs.map((item, i) => (
              <div key={item.label} className={s.spec}>
                <dt className="mono">{item.label}</dt>
                <dd>{item.value}</dd>
                {i === 0 && (
                  <div className={s.scale} aria-hidden="true" data-motion="hero-art" data-motion-id="hero-art">
                    <i data-motion-layer />
                    <span>320</span>
                    <span>1440 px</span>
                  </div>
                )}
              </div>
            ))}
          </dl>

          <div className={s.quizStrip}>
            <span>{hero.quizPrompt}</span>
            <QuizButton variant="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}
