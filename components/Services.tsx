"use client";

import { useState } from "react";
import { services } from "@/data/services";
import { contacts } from "@/data/contacts";
import { useCallModal } from "@/components/CallModalProvider";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { ServiceCard } from "@/components/ServiceCard";

export function Services() {
  const [openId, setOpenId] = useState<string | null>(services[0]?.id ?? null);
  const { openModal } = useCallModal();

  return (
    <section id="services" className="scroll-mt-24 bg-cream py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Услуги"
          title="К Аните Георгиевне обращаются в следующих случаях"
        />

        <div className="mt-12 flex flex-col gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isOpen={openId === service.id}
              onToggle={() => setOpenId((prev) => (prev === service.id ? null : service.id))}
            />
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-bronze/30 bg-ink px-6 py-9 text-paper sm:px-10 sm:py-11">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h3 className="font-display text-xl font-semibold sm:text-2xl">
                Не уверены, относится ли ситуация к специализации адвоката?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/80 sm:text-base">
                Позвоните и кратко расскажите, что произошло. Анита Георгиевна уточнит
                обстоятельства и объяснит, какая помощь вам может потребоваться.
              </p>
              <PhoneLink
                placement="services"
                className="mt-4 inline-block text-lg font-semibold text-paper hover:text-bronze-soft"
              >
                {contacts.phoneDisplay}
              </PhoneLink>
            </div>
            <Button
              onClick={() => openModal("services")}
              size="lg"
              variant="primaryOnDark"
              className="shrink-0"
            >
              Обсудить ситуацию
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
