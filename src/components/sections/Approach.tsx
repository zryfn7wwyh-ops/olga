import { approach } from "@/content/landing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SystemFlow } from "./SystemFlow";

export function Approach() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="section on-dark relative overflow-hidden bg-navy text-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_100%_0%,rgba(180,154,108,0.08),transparent_70%)]"
      />
      <div className="container-lp relative">
        <SectionHeading id="approach-title" eyebrow={approach.eyebrow} title={approach.title} titleClassName="max-w-[22ch] lg:text-[64px]!" />

        <div className="mt-14 lg:mt-20" data-reveal>
          <SystemFlow />
        </div>

        <ul className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {approach.principles.map((p, i) => (
            <li key={p.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }} className="border-t border-gold/50 pt-6">
              <h3 className="font-serif text-[24px] leading-tight font-semibold">{p.title}</h3>
              <p className="mt-3 text-[15.5px] text-[var(--on-dark-muted)]">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
