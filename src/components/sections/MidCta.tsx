import { Rich } from "@/components/ui/Rich";
import { ButtonLink } from "@/components/ui/Button";
import { midCta } from "@/content/page";
import s from "./sections.module.css";

export function MidCta() {
  return (
    <section className={s.sectionTight} aria-labelledby="mid-cta-title">
      <div className="container">
        <div className={s.cta}>
          <div className={s.ctaAccent} data-motion="cta-accent" data-motion-id="cta-accent" aria-hidden="true">
            <div className={s.ctaAccentLayer} data-motion-layer />
          </div>
          <div className={s.ctaText}>
            <h2 className={s.h2} id="mid-cta-title">
              {midCta.title}
            </h2>
            <p>
              <Rich text={midCta.text} />
            </p>
          </div>
          <div>
            <ButtonLink href="#brief" variant="onInk">
              {midCta.cta}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
