import { landingContent } from "@/content/landing";
import { StatCard } from "@/components/ui/StatCard";

const TONES = ["danger", "navy", "navy"] as const;

export function WhyNowSection() {
  const { sectionId, title, cards } = landingContent.whyNow;

  return (
    <section id={sectionId} className="bg-surface py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-navy sm:text-3xl">
          {title}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <StatCard
              key={card.title}
              accent={card.accent}
              title={card.title}
              text={card.text}
              tone={TONES[i]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
