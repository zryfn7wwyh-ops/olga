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

        {/* Desktop: horizontal stepper */}
        <div className="relative mt-14 hidden lg:grid lg:grid-cols-6 lg:gap-5">
          <div className="pointer-events-none absolute inset-x-6 top-6 h-px bg-line" aria-hidden="true" />
          {processSteps.map((step) => (
            <div key={step.id} className="relative flex flex-col items-start pr-2">
              <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-bronze bg-cream font-display text-lg font-semibold text-ink">
                {step.number}
              </span>
              <h3 className="mt-4 text-sm font-semibold leading-snug text-ink">{step.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">{step.text}</p>
            </div>
          ))}
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
