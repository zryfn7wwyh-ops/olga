"use client";

import { prices } from "@/data/prices";
import { useCallModal } from "@/components/CallModalProvider";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function Pricing() {
  const { openModal } = useCallModal();

  return (
    <section id="prices" className="scroll-mt-24 bg-cream py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Стоимость" title="Стоимость адвокатской помощи" />

        <div className="mt-12 overflow-x-auto rounded-2xl border border-line bg-paper">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-ink text-paper">
                <th scope="col" className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.08em] sm:px-8">
                  Услуга
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold uppercase tracking-[0.08em] sm:px-8"
                >
                  Стоимость
                </th>
              </tr>
            </thead>
            <tbody>
              {prices.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-b-0 transition-colors hover:bg-cream/60">
                  <td className="px-6 py-4 align-top sm:px-8">
                    <p className="text-sm font-medium text-ink sm:text-base">{item.service}</p>
                    {item.detail ? (
                      <p className="mt-1 text-xs text-text-muted sm:text-sm">{item.detail}</p>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right align-top font-semibold text-ink sm:px-8 sm:text-base">
                    {item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-text-muted sm:text-base">
          Итоговая стоимость зависит от сложности дела, стадии процесса, объёма документов,
          срочности и необходимости выезда. Объём помощи и размер вознаграждения закрепляются в
          соглашении.
        </p>

        <div className="mt-8">
          <Button onClick={() => openModal("pricing")} size="lg">
            Уточнить стоимость по телефону
          </Button>
        </div>
      </Container>
    </section>
  );
}
