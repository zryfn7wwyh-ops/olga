import { audiences } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaButton } from "@/components/forms/CtaButton";

export function Audiences() {
  return (
    <section id="audience" aria-labelledby="audience-title" className="section on-light bg-paper">
      <div className="container-lp">
        <SectionHeading id="audience-title" eyebrow={audiences.eyebrow} title={audiences.title} />
        <ul className="mt-14 grid border-t border-l border-stroke sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {audiences.items.map((item, i) => (
            <li
              key={item.title}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
              className="group relative flex sm:min-h-[260px] flex-col border-r border-b border-stroke p-7 transition-colors duration-300 hover:bg-ivory sm:p-8"
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 h-px w-0 bg-gold transition-[width] duration-500 group-hover:w-full motion-reduce:transition-none"
              />
              <span className="font-serif text-[18px] text-gold-ink lining-nums tabular-nums">0{i + 1}</span>
              <h3 className="h3 mt-12">{item.title}</h3>
              <p className="mt-3 text-[16px] text-muted-text">{item.text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <CtaButton source="audience_cta" variant="primary-dark" className="w-full sm:w-auto">
            {audiences.cta}
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
