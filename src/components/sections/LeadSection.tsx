import { ShieldCheck } from "lucide-react";
import { leadSection } from "@/content/landing";
import { LeadForm } from "@/components/forms/LeadForm";

const points = [
  "Специализация, регион и текущие каналы привлечения",
  "Как обрабатываются обращения и что мешает договорам",
  "Приоритетные шаги и ориентиры для оценки бюджета",
];

export function LeadSection() {
  return (
    <section id="lead" aria-labelledby="lead-title" className="section on-light bg-ivory">
      <div className="container-lp grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5" data-reveal>
          <p className="eyebrow mb-5">{leadSection.eyebrow}</p>
          <h2 id="lead-title" className="h2 lg:text-[46px]!">
            {leadSection.title}
          </h2>
          <p className="lead mt-6 text-muted-text">{leadSection.subtitle}</p>
          <ul className="mt-8 border-t border-navy/15">
            {points.map((p, i) => (
              <li key={p} className="flex gap-4 border-b border-navy/15 py-4 text-[16px]">
                <span className="font-serif text-[18px] text-gold-ink lining-nums tabular-nums">0{i + 1}</span>
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-8 flex gap-3 text-[14px] text-muted-text">
            <ShieldCheck className="size-5 shrink-0 text-gold-ink" strokeWidth={1.5} aria-hidden="true" />
            {leadSection.privacyNote}
          </p>
        </div>

        <div className="lg:col-span-7" data-reveal>
          <div className="relative rounded-[16px] border border-stroke bg-paper p-6 shadow-[0_30px_60px_-45px_rgba(20,35,45,0.45)] sm:p-10">
            <span className="absolute top-0 left-10 h-px w-20 bg-gold" aria-hidden="true" />
            <LeadForm variant="full" source="lead_section" submitLabel={leadSection.cta} />
          </div>
        </div>
      </div>
    </section>
  );
}
