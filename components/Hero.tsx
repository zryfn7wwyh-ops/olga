import Image from "next/image";
import { contacts } from "@/data/contacts";
import { Container } from "@/components/ui/Container";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { HeroCallButton } from "@/components/HeroCallButton";
import { HeroRatingLink } from "@/components/HeroRatingLink";
import { AchievementBadge } from "@/components/AchievementBadge";
import { CheckIcon } from "@/components/ui/icons";

const highlights = [
  "Адвокатский стаж — 26 лет, с июля 2000 года",
  "Честная статистика — 80% выигранных дел",
  "Личное ведение дела, не отдаю помощникам",
  "Защита на следствии и в суде",
  "Конфиденциальность и адвокатская тайна",
  "Честная оценка ситуации и возможных рисков",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream pt-24 sm:pt-28">
      <Container className="flex min-h-[82dvh] flex-col justify-center gap-12 pb-14 sm:min-h-[85dvh] lg:flex-row lg:items-center lg:gap-16 lg:pb-16">
        <div className="max-w-xl lg:flex-1">
          <HeroRatingLink />

          <span className="mt-7 inline-block rounded-lg bg-bronze/15 px-4 py-2.5 font-signature text-2xl font-semibold italic tracking-wide text-ink sm:mt-8 sm:text-3xl">
            Аксёнова Анита Георгиевна
          </span>

          <h1 className="mt-4 font-display text-3xl font-semibold leading-[1.15] text-ink sm:text-4xl lg:text-[2.75rem]">
            Адвокатская защита в сложных гражданских, уголовных делах и бизнес-спорах
          </h1>

          <p className="mt-5 text-base leading-relaxed text-text-muted sm:text-lg">
            Ведение гражданских и уголовных дел, защита семейных, имущественных и наследственных
            прав, интересов бизнеса и собственников.
          </p>

          <ul className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-text sm:text-[0.95rem]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-9 rounded-2xl border border-line bg-paper/70 p-5 sm:p-6">
            <p className="text-sm leading-relaxed text-text sm:text-base">
              Позвоните адвокату прямо сейчас, чтобы оценить риски и понять, что можно сделать в
              вашей ситуации.
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <HeroCallButton />
              <PhoneLink
                placement="hero"
                className="text-lg font-semibold text-ink transition-colors hover:text-bronze"
              >
                {contacts.phoneDisplay}
              </PhoneLink>
            </div>
          </div>
        </div>

        <div className="relative lg:flex-1">
          <div className="relative mx-auto max-w-sm lg:max-w-none">
            <AchievementBadge className="mb-4 sm:mb-5" />

            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-ink/5">
              <Image
                src="/images/lawyer/anita-aksyonova-hero.jpg"
                alt="Адвокат Аксёнова Анита Георгиевна"
                fill
                priority
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-cover object-top"
              />
            </div>

            <figure className="mt-5 rounded-2xl border border-line bg-paper p-5 shadow-sm sm:p-6">
              <blockquote className="font-display text-[0.95rem] italic leading-relaxed text-ink sm:text-base">
                «В каждом деле нужно владеть законодательством настолько, чтобы уметь им не только
                защищаться, но и нападать. Для этого необходимо видеть всю ситуацию целиком: нюансы
                проблемы и интересы доверителя, возможные риски и последствия каждого решения. Это
                делает своевременный и глубокий аудит обстоятельств дела — самым важным этапом
                работы. Стратегия защиты или взыскания должна быть умной и адаптивной, именно это
                делает её сильной и даёт вам возможность победить».
              </blockquote>
              <figcaption className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-bronze">
                Анита Аксёнова
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
}
