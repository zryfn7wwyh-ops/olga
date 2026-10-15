import { team, type TeamMember } from "@/data/team";
import { photos } from "@/data/profile";
import { cn } from "@/lib/cn";
import { PhotoFrame } from "./PhotoFrame";
import { PlaceholderMark } from "./PlaceholderMark";
import { SectionHeading } from "./SectionHeading";

function Member({ m }: { m: TeamMember }) {
  return (
    <article className="group flex flex-col">
      <PhotoFrame
        src={m.photo}
        alt={m.name}
        desaturate
        tone="light"
        label={m.placeholder ? "Специалист" : m.name}
        hint="Фото будет добавлено"
        className="aspect-[4/5] w-full border border-line"
      />
      <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-[22px] leading-tight">{m.name}</h3>
          <p className="mt-1 text-[14px] font-semibold text-steel-deep">{m.position}</p>
        </div>
        {m.placeholder && <PlaceholderMark>данные</PlaceholderMark>}
      </div>
      <p className="mt-3 text-[14px] leading-snug text-muted">{m.specialization}</p>
      <p className="tech mt-4 text-muted">{m.experience}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {m.competencies.map((c, i) => (
          <li key={i} className="border border-line px-2.5 py-1 text-[12px] text-muted">
            {c}
          </li>
        ))}
      </ul>
      {m.personal && <p className="mt-4 text-[13px] italic text-muted">{m.personal}</p>}
    </article>
  );
}

export function Team() {
  const lead = team.find((m) => m.lead)!;
  const rest = team.filter((m) => !m.lead);
  return (
    <section id="team" aria-labelledby="team-title" className="section-y bg-ivory">
      <div className="container-x">
        <SectionHeading index="08" label="Команда" id="team-title" title="Команда для комплексной работы">
          <p className="mt-6 max-w-[620px] text-[16px] text-muted">
            В сложных проектах подключаются профильные специалисты. Стратегию и ключевые решения ведёт Антон Пудовкин лично.
          </p>
        </SectionHeading>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* Лид — Антон, визуально главный */}
          <article className="on-dark group grid overflow-hidden bg-ink text-ivory sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            <PhotoFrame src={lead.photo ?? photos.about} alt={lead.name} label="Руководитель практики" hint="Портрет Антона Пудовкина" className="aspect-[4/5] w-full sm:aspect-auto sm:h-full lg:aspect-[5/4]" />
            <div className="flex flex-col p-7 sm:p-9">
              <span className="tech text-bronze">Ведёт проект лично</span>
              <h3 className="mt-4 font-serif text-[30px] leading-tight sm:text-[34px]">{lead.name}</h3>
              <p className="mt-1 text-[15px] font-semibold text-mist">{lead.position}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-mist">{lead.specialization}</p>
              <p className="tech mt-6 text-ivory/80">{lead.experience}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {lead.competencies.map((c) => (
                  <li key={c} className="border border-slate-2 px-2.5 py-1 text-[12px] text-mist">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </article>
          <div className={cn("grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:col-span-7 xl:grid-cols-3")}>
            {rest.map((m) => (
              <Member key={m.id} m={m} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
