import { ButtonLink } from "@/components/ui/Button";
import { priceFactors } from "@/content/page";
import { SectionIntro } from "./SectionIntro";
import s from "./sections.module.css";

const ICONS = [
  // Объём
  <path key="v" d="M8 8h24v24H8zM14 14h12M14 20h12M14 26h7" />,
  // Контент
  <path key="c" d="M7 30 15 20l6 6 4-5 8 9M7 10h26v20H7zM27 15.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />,
  // Интеграции
  <path key="i" d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM28 32a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 16v6a6 6 0 0 0 6 6h6M28 24v-6a6 6 0 0 0-6-6h-6" />,
  // Логика
  <path key="l" d="M6 20h8l4-8 4 16 4-8h8" />,
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
              <svg className={s.factorIcon} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
                {ICONS[i]}
              </svg>
              <h3 className={s.h3}>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
        <div className={s.factorsFoot}>
          <ButtonLink href="#brief" variant="secondary">
            {priceFactors.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
