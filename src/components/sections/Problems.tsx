import { problems } from "@/content/landing";

export function Problems() {
  return (
    <section id="problems" aria-labelledby="problems-title" className="section-tight on-light bg-paper">
      <div className="container-lp">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4" data-reveal>
            <p className="eyebrow mb-4">{problems.eyebrow}</p>
            <h2 id="problems-title" className="h2 text-[30px]! sm:text-[40px]!">
              {problems.title}
            </h2>
          </div>
          <ol className="lg:col-span-8">
            {problems.items.map((item, i) => (
              <li
                key={item.title}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
                className="group relative grid gap-2 border-t border-stroke py-6 last:border-b sm:grid-cols-[56px_1fr] sm:gap-6 sm:py-7"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-[-1px] left-0 h-px w-0 bg-gold transition-[width] duration-500 ease-out group-hover:w-full motion-reduce:transition-none"
                />
                <span className="font-serif text-[30px] leading-none text-gold-ink lining-nums">0{i + 1}</span>
                <div>
                  <h3 className="h3">{item.title}</h3>
                  <p className="mt-2 text-[16px] text-muted-text">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p
          data-reveal
          className="mt-10 border-l-2 border-gold pl-5 font-serif text-[24px] leading-[1.3] font-medium text-ink sm:mt-14 sm:pl-8 sm:text-[32px] lg:ml-[calc(33.333%+16px)]"
        >
          {problems.conclusion}
        </p>
      </div>
    </section>
  );
}
