import { Rich } from "@/components/ui/Rich";
import { priceFactors } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

const ICONS = [
  // Объём
  <path key="v" d="M5 2.5h18v23H5zM9.5 8.5h9M9.5 13.5h9M9.5 18.5h5" />,
  // Контент
  <g key="c">
    <path d="M2.5 5h23v18h-23zM2.5 19l7-7 6 6 4-4 6 6" />
    <circle cx="19" cy="10" r="2" />
  </g>,
  // Интеграции
  <path key="i" d="M3 3h8v8H3zM17 17h8v8h-8zM11 7h7a3 3 0 0 1 3 3v7" />,
  // Логика
  <path key="l" d="M1.5 15h7l3-9 5 17 3-8h7" />,
];

export function PriceFactors() {
  return (
    <section className={s.section} id="pricing-factors" aria-labelledby="pricing-title">
      <div className="container">
        <SectionIntro
          id="pricing-factors"
          titleId="pricing-title"
          index={priceFactors.index}
          kicker={priceFactors.kicker}
          title={priceFactors.title}
          lead={priceFactors.lead}
        />
        <ul className={s.factors}>
          {priceFactors.items.map((item, i) => (
            <li key={item.title} className={s.factor}>
              <svg className={s.factorIcon} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                {ICONS[i]}
              </svg>
              <h3 className={s.h3}>{item.title}</h3>
              <p>
                <Rich text={item.text} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
