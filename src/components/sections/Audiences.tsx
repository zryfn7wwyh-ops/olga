import { audiences } from "@/content/landing";

/** «С кем работаем» — одна типографская строка, без карточек. */
export function Audiences() {
  return (
    <section aria-label={audiences.label} className="on-light border-t border-navy/10 bg-ivory">
      <div className="container-lp py-8 md:py-10">
        <p className="text-[16px] leading-[1.7] text-ink md:text-[17px]">
          <span className="mr-2 font-semibold">{audiences.label}:</span>
          {audiences.items.map((a, i) => (
            <span key={a.title}>
              {a.title.toLowerCase()} <span className="text-muted-text">{a.text}</span>
              {i < audiences.items.length - 1 ? "; " : "."}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
