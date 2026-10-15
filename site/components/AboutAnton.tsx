import { aboutFacts } from "@/data/stats";
import { aboutText, photos } from "@/data/profile";
import { CTAButton } from "./ContactModal";
import { DocumentsSlider } from "./DocumentsSlider";
import { PhotoFrame } from "./PhotoFrame";

export function AboutAnton() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-y bg-stone">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <PhotoFrame
              src={photos.about}
              alt={photos.alt}
              tone="light"
              label="Антон Пудовкин"
              hint="Портрет в интерьере · новая фотосессия"
              className="aspect-[4/5] w-full lg:sticky lg:top-28"
            />
          </div>
          <div className="lg:col-span-7 lg:pt-4">
            <span className="eyebrow">05 / Обо мне</span>
            <h2 id="about-title" className="h-section mt-6">
              Антон Пудовкин — <span className="italic text-steel-deep">арбитражный управляющий</span>
            </h2>
            <div className="mt-10 space-y-6 text-[17px] leading-[1.75] text-text sm:text-[18px]">
              {aboutText.map((p, i) => (
                <p key={i} className={i === 0 ? "font-serif text-[21px] leading-[1.55] sm:text-[24px]" : undefined}>
                  {p}
                </p>
              ))}
            </div>
            <p className="mt-8 font-serif text-[22px] italic text-muted">— Антон Пудовкин</p>

            <dl className="mt-12 grid grid-cols-2 border-l border-t border-line sm:grid-cols-3">
              {aboutFacts.map((f) => (
                <div key={f.label} className="border-b border-r border-line px-5 py-6 transition-colors duration-200 hover:bg-ivory">
                  <dt className="sr-only">{f.label}</dt>
                  <dd>
                    <span className="block font-serif text-[26px] leading-none text-bronze sm:text-[30px]">{f.value}</span>
                    <span className="mt-2 block text-[13px] leading-snug text-muted">{f.label}</span>
                  </dd>
                </div>
              ))}
              <div className="flex items-center border-b border-r border-line px-5 py-6">
                <CTAButton placement="about" className="group inline-flex min-h-11 items-center gap-2 text-left text-[15px] font-semibold text-steel-deep">
                  Связаться напрямую <span className="arrow" aria-hidden>→</span>
                </CTAButton>
              </div>
            </dl>
          </div>
        </div>
        <DocumentsSlider />
      </div>
    </section>
  );
}
