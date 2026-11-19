import { problems } from "@/content/landing";

/** Редакционный список: заголовок и подводка слева, три ситуации справа. */
export function Problems() {
  return (
    <section id="problems" aria-labelledby="problems-title" className="on-light bg-paper py-14 md:py-20 xl:py-24">
      <div className="container-lp grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5 xl:col-span-4" data-reveal>
          <h2 id="problems-title" className="h2 text-[30px]! sm:text-[40px]!">
            {problems.title}
          </h2>
          <p className="mt-4 text-[17px] text-muted-text">{problems.intro}</p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6 xl:col-start-6">
          <ol>
            {problems.items.map((item, i) => (
              <li key={item.title} className="grid gap-1.5 border-t border-stroke py-5 first:border-t-0 first:pt-0 sm:grid-cols-[40px_1fr] sm:gap-4 sm:py-6">
                <span className="text-[15px] font-semibold text-muted-text tabular-nums sm:pt-1.5">{i + 1}.</span>
                <div>
                  <h3 className="font-serif text-[23px] leading-[1.2] font-semibold sm:text-[26px]">{item.title}</h3>
                  <p className="mt-1.5 max-w-[60ch] text-[17px] text-muted-text">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 border-t border-navy pt-5 text-[18px] font-semibold text-ink sm:mt-8">{problems.conclusion}</p>
        </div>
      </div>
    </section>
  );
}
