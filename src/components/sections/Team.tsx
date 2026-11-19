import { team } from "@/content/landing";
import { isPreview, isVisible, siteContent } from "@/content/siteContent";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

/**
 * «Кто будет работать над продвижением». В preview — явные поля для заполнения.
 * В production заглушки не публикуются: показывается нейтральный текст без лиц и имён.
 */
export function Team() {
  const { teamPortrait, teamName, teamRole, teamFacts, clientReview } = siteContent;
  const hasPerson = isVisible(teamName) && isVisible(teamRole);
  const facts = isVisible(teamFacts) ? teamFacts.value : [];

  return (
    <section id="team" aria-labelledby="team-title" className="section on-light bg-paper">
      <div className="container-lp">
        <SectionHeading id="team-title" eyebrow={team.eyebrow} title={team.title} intro={team.text} align="split" />

        {hasPerson ? (
          <div className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-12">
            <article data-reveal className="grid overflow-hidden rounded-[14px] border border-stroke bg-ivory sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:col-span-7">
              <MediaFrame item={teamPortrait} rounded={false} sizes="(min-width: 1024px) 320px, (min-width: 640px) 40vw, 100vw" badge="Фото · заменить" className="sm:h-full" />
              <div className="flex flex-col p-6 sm:p-8">
                <Field placeholder={teamName.isPlaceholder}>
                  <p className="font-serif text-[30px] leading-tight font-semibold">{teamName.value}</p>
                </Field>
                <Field placeholder={teamRole.isPlaceholder} className="mt-2">
                  <p className="text-[15.5px] font-semibold text-gold-ink">{teamRole.value}</p>
                </Field>
                <ul className="mt-6 space-y-2.5 border-t border-stroke pt-5">
                  {facts.slice(0, -1).map((f, i) => (
                    <li key={i}>
                      <Field placeholder={teamFacts.isPlaceholder}>
                        <p className="flex gap-3 text-[15px] text-ink">
                          <span className="mt-[11px] h-px w-3 shrink-0 bg-gold" aria-hidden="true" />
                          {f}
                        </p>
                      </Field>
                    </li>
                  ))}
                </ul>
                {facts.length > 1 && (
                  <div className="mt-auto pt-6">
                    <p className="text-[12px] font-bold tracking-[0.14em] text-muted-text uppercase">{team.roleInCaseLabel}</p>
                    <Field placeholder={teamFacts.isPlaceholder} className="mt-2">
                      <p className="text-[15px] text-ink">{facts[facts.length - 1]}</p>
                    </Field>
                  </div>
                )}
              </div>
            </article>

            {isVisible(clientReview) && (
              <figure data-reveal className="flex flex-col lg:col-span-5">
                <div className="relative overflow-hidden rounded-[14px] bg-navy-deep">
                  <MediaFrame item={clientReview} rounded={false} badge="Видео · заменить" sizes="(min-width: 1024px) 480px, 100vw" />
                  {clientReview.isPlaceholder && (
                    <div className="on-dark absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-ivory">
                      <p className="font-serif text-[26px] leading-tight">{team.videoPlaceholder}</p>
                      <p className="mt-2 max-w-[34ch] text-[13.5px] text-[var(--on-dark-muted)]">
                        Здесь появится отзыв адвоката о работе маркетинговой команды — после согласования.
                      </p>
                    </div>
                  )}
                </div>
                <figcaption className="mt-3 text-[14px] text-muted-text">{team.videoTitle}</figcaption>
              </figure>
            )}
          </div>
        ) : (
          <p data-reveal className="mt-8 max-w-[64ch] border-l-2 border-gold pl-5 text-[17px] text-ink">
            {team.productionFallback}
          </p>
        )}
      </div>
    </section>
  );
}

/** Подсвечивает поле, которое нужно заполнить (только в preview). */
function Field({ placeholder, className, children }: { placeholder: boolean; className?: string; children: React.ReactNode }) {
  if (!placeholder || !isPreview) return <div className={className}>{children}</div>;
  return (
    <div className={cn("relative rounded-[8px] border border-dashed border-gold-ink/45 bg-paper/70 px-3 py-2", className)}>
      {children}
    </div>
  );
}

