import Image from "next/image";
import { contacts } from "@/data/contacts";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AboutCallButton } from "@/components/AboutCallButton";
import { DocumentsSlider } from "@/components/DocumentsSlider";

export function AboutLawyer() {
  return (
    <section id="about" className="scroll-mt-24 bg-paper py-20 sm:py-28">
      <Container>
        <SectionHeading title="Ваш адвокат — Анита Георгиевна Аксёнова" />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
          <div className="mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/lawyer/anita-aksyonova-about.jpg"
                alt="Аксёнова Анита Георгиевна — адвокат"
                fill
                sizes="(min-width: 1024px) 320px, 80vw"
                className="object-cover object-top"
              />
            </div>
            <p className="mt-4 text-sm font-semibold text-ink">{contacts.fullName}</p>
            <p className="text-sm text-text-muted">
              Рег. № {contacts.regNumber} в реестре адвокатов
            </p>
          </div>

          <div className="min-w-0">
            <div className="space-y-4 text-base leading-relaxed text-text sm:text-[1.05rem]">
              <p>
                Практикующий адвокат, член Адвокатской палаты Краснодарского края.
                Регистрационный номер в Едином государственном реестре адвокатов — {contacts.regNumber}.
              </p>
              <p>
                Адвокатский стаж — 26 лет, с июля 2000 года. Анита Георгиевна ведёт гражданские и
                уголовные дела, защищает интересы доверителей на стадии следствия и в суде,
                помогает в семейных, имущественных, наследственных спорах и корпоративных
                конфликтах.
              </p>
              <p>
                Дело ведётся лично адвокатом — от изучения документов и разработки стратегии до
                переговоров, судебных заседаний и обжалования принятых решений.
              </p>
            </div>

            <div className="mt-7">
              <AboutCallButton />
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <h3 className="text-lg font-semibold text-ink sm:text-xl">Документы и сертификаты</h3>
          <p className="mt-1 text-sm text-text-muted sm:text-base">
            Подтверждение квалификации: образование, повышение квалификации и практика.
          </p>
          <div className="mt-6">
            <DocumentsSlider />
          </div>
        </div>
      </Container>
    </section>
  );
}
