"use client";

import { useState } from "react";
import { cases } from "@/data/cases";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CaseCard } from "@/components/CaseCard";

export function Cases() {
  const [openId, setOpenId] = useState<string | null>(cases[0]?.id ?? null);

  return (
    <section id="cases" className="scroll-mt-24 bg-paper py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Практика" title="Примеры из адвокатской практики" />

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {cases.map((item) => (
            <div key={item.id} className={item.featured ? "lg:col-span-2" : ""}>
              <CaseCard
                item={item}
                isOpen={openId === item.id}
                onToggle={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
              />
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-text-muted">
          Результат каждого дела зависит от его обстоятельств и не гарантирует аналогичного
          результата в другой ситуации.
        </p>
      </Container>
    </section>
  );
}
