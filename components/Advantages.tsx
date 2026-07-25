import { advantages } from "@/data/advantages";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const cardBase =
  "group relative flex flex-col justify-start overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 sm:p-7";

const toneByIndex = [
  "border-transparent bg-ink text-paper hover:border-bronze",
  "border-line bg-paper text-ink hover:border-bronze",
  "border-line bg-paper text-ink hover:border-bronze",
  "border-line bg-cream text-ink hover:border-bronze",
  "border-transparent bg-emerald text-paper hover:border-bronze",
];

// Явные спаны на 5 карточек: ряд 1 = 2+1+1 колонки, ряд 2 = 2+2 — без пустот и без row-span.
const spanByIndex = ["lg:col-span-2", "lg:col-span-1", "lg:col-span-1", "lg:col-span-2", "lg:col-span-2"];

export function Advantages() {
  return (
    <section id="advantages" className="scroll-mt-24 bg-paper py-20 sm:py-28">
      <Container>
        <SectionHeading title="Почему обращаются к Аните Георгиевне" />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((item, index) => {
            const tone = toneByIndex[index % toneByIndex.length];
            const isDark = index === 0 || index === 4;
            return (
              <article
                key={item.id}
                className={`${cardBase} ${tone} ${spanByIndex[index]}`}
              >
                <span
                  className={`font-display text-2xl font-semibold transition-transform duration-300 group-hover:scale-105 ${
                    isDark ? "text-bronze-soft" : "text-bronze"
                  }`}
                >
                  {item.number}
                </span>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold leading-snug sm:text-xl">{item.title}</h3>
                  <p
                    className={`mt-2.5 text-sm leading-relaxed sm:text-[0.95rem] ${
                      isDark ? "text-paper/80" : "text-text-muted"
                    }`}
                  >
                    {item.text}
                  </p>
                </div>
                <span
                  className={`absolute -right-6 -top-6 h-24 w-24 rounded-full transition-transform duration-300 group-hover:scale-110 ${
                    isDark ? "bg-paper/5" : "bg-bronze/5"
                  }`}
                  aria-hidden="true"
                />
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
