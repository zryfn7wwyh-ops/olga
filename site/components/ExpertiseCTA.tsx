import { contacts } from "@/data/contacts";
import { CTAButton } from "./ContactModal";
import { TrackedLink } from "./TrackedLink";

/** Контрастный CTA после блока услуг. */
export function ExpertiseCTA() {
  return (
    <section aria-labelledby="cta-mid-title" className="on-dark bg-steel text-white">
      <div className="container-x grid gap-8 py-14 sm:py-16 lg:grid-cols-12 lg:items-center lg:py-20">
        <div className="lg:col-span-7">
          <h2 id="cta-mid-title" className="h-display text-[28px] sm:text-[38px] lg:text-[44px]">
            Не уверены, относится ли задача к&nbsp;моей практике?
          </h2>
          <p className="mt-5 max-w-[620px] text-[16px] leading-relaxed text-white/85 sm:text-[17px]">
            Позвоните или напишите и кратко опишите ситуацию. После первичного обсуждения станет понятно, смогу ли я подключиться к проекту.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:col-span-5 lg:justify-end">
          <CTAButton placement="mid_cta" className="btn btn-light" />
          <TrackedLink
            goal="phone_click"
            params={{ placement: "mid_cta" }}
            href={contacts.phone.href}
            className="group inline-flex min-h-11 items-center gap-2 font-semibold tabular text-white"
          >
            {contacts.phone.display} <span className="arrow" aria-hidden>→</span>
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
