import { audiences } from "@/content/landing";

/** Компактная строка «Для кого» между системой продвижения и оплатой. */
export function Audiences() {
  return (
    <section aria-label={audiences.label} className="on-light border-b border-stroke bg-paper">
      <div className="container-lp grid gap-6 py-10 md:py-12 lg:grid-cols-12 lg:items-center lg:gap-10">
        <p className="eyebrow lg:col-span-2">{audiences.label}</p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-6 lg:col-span-10 lg:grid-cols-4">
          {audiences.items.map((a) => (
            <li key={a.title} data-reveal className="border-l border-gold/60 pl-4">
              <p className="font-serif text-[21px] leading-tight font-semibold">{a.title}</p>
              <p className="mt-1 text-[14px] text-muted-text">{a.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
