import { team } from "@/content/landing";
import { isPreview, isVisible, siteContent } from "@/content/siteContent";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { cn } from "@/lib/cn";

/**
 * Редакционная заметка о руководителе проекта.
 * Preview — явные поля [ЗАПОЛНИТЬ] и текстовый плейсхолдер фото.
 * Production — без заполненных данных карточка не публикуется, показывается нейтральный текст.
 */
export function Team() {
  const { teamPortrait, teamName, teamRole, teamFacts, clientReview } = siteContent;
  const hasPerson = isVisible(teamName) && isVisible(teamRole);
  const facts = isVisible(teamFacts) ? teamFacts.value : [];
  const experience = facts.slice(0, -1);
  const caseRole = facts.length > 1 ? facts[facts.length - 1] : null;

  return (
    <section id="team" aria-labelledby="team-title" className="on-light bg-ivory py-14 md:py-20 xl:py-24">
      <div className="container-lp">
        {hasPerson ? (
          <div className="grid gap-8 md:grid-cols-12 md:gap-10 lg:gap-14">
            <div className="md:col-span-5 lg:col-span-4">
              <MediaFrame item={teamPortrait} rounded={false} badge="Фото · заменить" sizes="(min-width: 1024px) 380px, (min-width: 768px) 40vw, 100vw" className="max-w-[420px]" />
            </div>
            <div className="md:col-span-7 lg:col-span-7 lg:col-start-6">
              <h2 id="team-title" className="h2 text-[30px]! sm:text-[40px]!">
                {team.title}
              </h2>
              <p className="mt-4 max-w-[60ch] text-[16.5px] text-muted-text">{team.text}</p>

              <div className="mt-8 border-t border-navy pt-6">
                <Field placeholder={teamName.isPlaceholder}>
                  <p className="font-serif text-[28px] leading-tight font-semibold">{teamName.value}</p>
                </Field>
                <Field placeholder={teamRole.isPlaceholder} className="mt-2">
                  <p className="text-[15.5px] text-muted-text">{teamRole.value}</p>
                </Field>
                <ul className="mt-5 space-y-2">
                  {experience.map((f, i) => (
                    <li key={i}>
                      <Field placeholder={teamFacts.isPlaceholder}>
                        <p className="text-[15.5px] text-ink">{f}</p>
                      </Field>
                    </li>
                  ))}
                </ul>
                {caseRole && (
                  <div className="mt-6">
                    <p className="text-[13px] font-semibold text-muted-text">{team.roleInCaseLabel}</p>
                    <Field placeholder={teamFacts.isPlaceholder} className="mt-1.5">
                      <p className="text-[15.5px] text-ink">{caseRole}</p>
                    </Field>
                  </div>
                )}
              </div>

              {/* Видеоотзыв: реальный — показываем; заглушка — только поле в preview, в production ничего */}
              {!clientReview.isPlaceholder && clientReview.asset ? (
                <div className="mt-8 max-w-[520px]">
                  <MediaFrame item={clientReview} rounded={false} />
                </div>
              ) : isPreview ? (
                <p className="mt-8 max-w-[520px] rounded-[4px] border border-dashed border-gold-ink/50 px-4 py-3 text-[13.5px] text-muted-text">
                  {team.videoPlaceholder}
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="max-w-[760px]">
            <h2 id="team-title" className="h2 text-[30px]! sm:text-[40px]!">
              {team.title}
            </h2>
            <p className="mt-4 text-[17px] text-ink">{team.productionFallback}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/** Подсвечивает поле, которое нужно заполнить (только в preview). */
function Field({ placeholder, className, children }: { placeholder: boolean; className?: string; children: React.ReactNode }) {
  if (!placeholder || !isPreview) return <div className={className}>{children}</div>;
  return <div className={cn("rounded-[4px] border border-dashed border-gold-ink/45 bg-paper/70 px-3 py-1.5", className)}>{children}</div>;
}
