import { heroFacts } from "@/data/stats";
import { contacts } from "@/data/contacts";
import { photos } from "@/data/profile";
import { CTAButton } from "./ContactModal";
import { PhotoFrame } from "./PhotoFrame";
import { RankingFeature } from "./RankingFeature";
import { TrackedLink } from "./TrackedLink";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="on-dark relative overflow-hidden bg-ink pt-[72px] text-ivory lg:pt-[88px]">
      {/* Координатная сетка — 12 колонок */}
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 hidden lg:block" />

      <div className="relative mx-auto grid max-w-[1920px] lg:min-h-[max(720px,min(900px,calc(100svh-88px)))] lg:grid-cols-12">
        {/* Левая часть */}
        <div className="container-x relative z-10 flex flex-col justify-center pb-12 pt-10 sm:pt-14 lg:col-span-7 lg:!max-w-none lg:pb-12 lg:pr-10 lg:pt-12 xl:pl-[max(48px,calc((100vw-1360px)/2+48px))] 3xl:pl-[max(48px,calc((1920px-1360px)/2+48px))]">
          <div className="flex items-center gap-4">
            <span className="eyebrow">Арбитражный управляющий</span>
          </div>
          <p className="mt-4 font-serif text-[22px] italic text-mist sm:text-[24px]">Антон Пудовкин</p>
          <h1 id="hero-title" className="h-display mt-3 max-w-[760px] text-[27px] xs:text-[30px] sm:text-[46px] lg:text-[44px] xl:text-[54px] 3xl:text-[64px]">
            Сопровождение сложных процедур банкротства, торгов и&nbsp;реализации активов
          </h1>
          <p className="mt-5 max-w-[580px] text-[16px] leading-relaxed text-mist sm:text-[17px]">
            Финансовое управление на судебной стадии, организация торгов, оценка и реализация имущества, работа со сложными и залоговыми активами.
          </p>

          {/* Факты */}
          <dl className="mt-8 grid max-w-[620px] grid-cols-2 gap-x-6 gap-y-5 border-t border-slate-2 pt-6 sm:grid-cols-[auto_auto_1fr] sm:gap-x-10">
            {heroFacts.map((f, i) => (
              <div key={f.label} className={i === 2 ? "col-span-2 sm:col-span-1" : undefined}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block whitespace-nowrap font-serif text-[21px] leading-tight text-ivory sm:text-[24px]">{f.value}</span>
                  <span className="mt-1 block text-[13px] text-mist">{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <CTAButton placement="hero" className="btn btn-primary self-start" />
            <TrackedLink
              goal="phone_click"
              params={{ placement: "hero" }}
              href={contacts.phone.href}
              className="group inline-flex min-h-11 items-center gap-2 text-[17px] font-semibold tabular text-ivory transition-colors duration-200 hover:text-mist"
            >
              Позвонить {contacts.phone.display} <span className="arrow text-bronze" aria-hidden>→</span>
            </TrackedLink>
          </div>
          <p className="mt-4 max-w-[500px] text-[14px] leading-relaxed text-mist/80">
            Опишите ситуацию напрямую Антону Пудовкину — обсудим задачу, возможные риски и&nbsp;формат дальнейшей работы.
          </p>
        </div>

        {/* Правая часть: крупное фото + рейтинг поверх */}
        <div className="relative lg:col-span-5">
          <PhotoFrame
            src={photos.hero}
            alt={photos.alt}
            priority
            hintTop
            label="AP / 057 / 7550"
            hint="Место для портрета · новая фотосессия"
            className="aspect-[4/5] w-full xs:aspect-[5/6] sm:aspect-[16/11] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
          />
          <div className="absolute bottom-4 left-4 right-4 z-10 sm:bottom-8 sm:left-8 sm:right-auto sm:w-[460px] lg:bottom-10 lg:left-6 lg:right-6 lg:w-auto xl:left-10 xl:right-auto xl:w-[480px]">
            <RankingFeature />
          </div>
        </div>
      </div>
    </section>
  );
}
