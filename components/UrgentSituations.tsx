"use client";

import { urgentSituations } from "@/data/urgentSituations";
import { useCallModal } from "@/components/CallModalProvider";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function UrgentSituations() {
  const { openModal } = useCallModal();

  return (
    <section id="urgent" className="scroll-mt-24 bg-emerald py-20 text-paper sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-bronze-soft">
            <span className="h-px w-6 bg-bronze-soft" aria-hidden="true" />
            Срочные ситуации
          </span>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            Когда не стоит откладывать обращение
          </h2>
          <p className="mt-4 text-base leading-relaxed text-paper/80 sm:text-lg">
            Обратитесь к адвокату как можно раньше, если:
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {urgentSituations.map((situation, index) => (
            <li
              key={situation}
              className="group flex items-start gap-4 rounded-xl border border-paper/15 bg-paper/5 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-bronze-soft hover:bg-paper/10"
            >
              <span className="font-display text-xl font-semibold text-bronze-soft transition-transform duration-300 group-hover:scale-110">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="pt-0.5 text-sm leading-relaxed text-paper/95 sm:text-[0.95rem]">
                {situation}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex justify-center">
          <Button onClick={() => openModal("urgent")} size="lg" variant="outlineLight">
            Позвонить адвокату
          </Button>
        </div>
      </Container>
    </section>
  );
}
