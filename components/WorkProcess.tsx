"use client";

import { processSteps } from "@/data/process";
import { useCallModal } from "@/components/CallModalProvider";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function WorkProcess() {
  const { openModal } = useCallModal();

  return (
    <section id="process" className="scroll-mt-24 bg-cream py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Порядок работы" title="Как проходит работа" />

        {/* Desktop: two rows of three, with a connecting line per row */}
        <div className="mt-14 hidden lg:block">
          <div className="relative grid grid-cols-3 gap-x-10 gap-y-14">
            <div className="pointer-events-none absolute inset-x-0 top-7 hidden h-px bg-line lg:block" aria-hidden="true" />
            {processSteps.slice(0, 3).map((step) => (
              <div key={step.id} className="relative flex flex-col items-start pr-4">
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-bronze bg-cream font-display text-xl font-semibold text-ink">
                  {step.number}
                </span>
                <h3 className="mt-5 text-lg font-semibold leading-snug text-ink">{step.title}</h3>
                <p className="mt-2.5 text-base leading-relaxed text-text-muted">{step.text}</p>
              </div>
            ))}
          </div>
          <div className="relative mt-14 grid grid-cols-3 gap-x-10 gap-y-14">
            <div className="pointer-events-none absolute inset-x-0 top-7 hidden h-px bg-line lg:block" aria-hidden="true" />
            {processSteps.slice(3, 6).map((step) => (
              <div key={step.id} className="relative flex flex-col items-start pr-4">
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-bronze bg-cream font-display text-xl font-semibold text-ink">
                  {step.number}
                </span>
                <h3 className="mt-5 text-lg font-semibold leading-snug text-ink">{step.title}</h3>
                <p className="mt-2.5 text-base leading-relaxed text-text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / tablet: vertical timeline */}
        <ol className="relative mt-12 flex flex-col gap-9 pl-9 lg:hidden">
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-line" aria-hidden="true" />
          {processSteps.map((step) => (
            <li key={step.id} className="relative">
              <span className="absolute -left-9 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-bronze bg-cream font-display text-sm font-semibold text-ink">
                {step.number}
              </span>
              <h3 className="text-base font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex justify-center">
          <Button onClick={() => openModal("process")} size="lg">
            Обсудить ситуацию по телефону
          </Button>
        </div>
      </Container>
    </section>
  );
}
