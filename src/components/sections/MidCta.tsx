import { ButtonLink } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { midCta } from "@/content/page";
import s from "./sections.module.css";

export function MidCta() {
  return (
    <section className={s.section} aria-labelledby="mid-cta-title">
      <div className={s.band} data-motion="cta-accent" data-motion-id="cta-accent">
        <div>
          <h2 className={s.bandTitle} id="mid-cta-title">
            {midCta.title}
          </h2>
          <p className={s.bandText}>
            <Rich text={midCta.text} />
          </p>
        </div>
        <ButtonLink href="#brief" variant="light" block size="lg" arrow>
          {midCta.cta}
        </ButtonLink>
      </div>
    </section>
  );
}
