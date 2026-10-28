import { EstimateForm } from "@/components/forms/EstimateForm";
import { QuizButton } from "@/components/forms/Triggers";
import { hero } from "@/content/page";
import s from "./sections.module.css";

export function Hero() {
  return (
    <section className={s.hero} id="calc" aria-labelledby="hero-title">
      <div className={s.heroArt} data-motion="hero-art" data-motion-id="hero-art" aria-hidden="true">
        <div className={s.heroArtLayer} data-motion-layer>
          <HeroGeometry />
        </div>
      </div>
      <div className={`container ${s.heroGrid}`}>
        <div className={s.heroCopy}>
          <p className={s.kicker}>{hero.kicker}</p>
          <h1 className={s.heroTitle} id="hero-title" data-motion="hero-title" data-motion-id="hero-title">
            {hero.titleLines.map((line, i) => (
              <span key={line} className={s.heroLine}>
                <span data-motion-layer className={i === 1 ? s.heroAccent : undefined}>
                  {line}
                </span>{" "}
              </span>
            ))}
          </h1>
          <p className={s.heroLead}>{hero.lead}</p>
          <ul className={s.heroBenefits}>
            {hero.benefits.map((b, i) => (
              <li key={b}>
                <span aria-hidden="true">0{i + 1}</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className={s.heroQuiz}>
            <span>{hero.quizPrompt}</span>
            <QuizButton variant="onInkGhost" />
          </div>
        </div>
        <div className={s.heroForm}>
          <EstimateForm />
        </div>
      </div>
      <div className="container">
        <dl className={s.specs} aria-label="Что проверяем перед запуском">
          {hero.specs.map((item) => (
            <div key={item.label} className={s.spec}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Тонкая конструктивная сетка — фирменная графика первого экрана (статична). */
function HeroGeometry() {
  return (
    <svg viewBox="0 0 800 800" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="400" cy="400" r="399" />
      <circle cx="400" cy="400" r="280" />
      <circle cx="400" cy="400" r="160" />
      <path d="M0 400h800M400 0v800M117 117l566 566M683 117 117 683" strokeDasharray="2 6" />
      <rect x="240" y="240" width="320" height="320" />
    </svg>
  );
}
