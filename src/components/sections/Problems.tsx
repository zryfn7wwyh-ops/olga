import { problems } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Problems() {
  return (
    <section id="problems" aria-labelledby="problems-title" className="section on-light bg-paper">
      <div className="container-lp">
        <SectionHeading id="problems-title" eyebrow={problems.eyebrow} title={problems.title} intro={problems.intro} />

        <ol className="mt-14 border-t border-stroke lg:mt-20">
          {problems.items.map((item, i) => (
            <li
              key={item.title}
              data-reveal
              className="grid gap-3 border-b border-stroke py-7 sm:grid-cols-12 sm:gap-8 sm:py-9"
            >
              <span className="font-serif text-[22px] leading-none text-gold-ink lining-nums tabular-nums sm:col-span-1 sm:pt-1.5">
                0{i + 1}
              </span>
              <h3 className="h3 sm:col-span-6 lg:col-span-6">{item.title}</h3>
              <p className="text-[16.5px] text-muted-text sm:col-span-5 sm:pt-1.5">{item.text}</p>
            </li>
          ))}
        </ol>

        <div data-reveal className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-12">
          <span className="gold-rule mt-5 hidden lg:col-span-2 lg:block" aria-hidden="true" />
          <p className="font-serif text-[27px] leading-[1.25] font-medium text-ink sm:text-[34px] lg:col-span-10">
            {problems.conclusion}
          </p>
        </div>
      </div>
    </section>
  );
}
