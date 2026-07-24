"use client";

import { contacts } from "@/data/contacts";
import { trackGoal } from "@/lib/analytics";
import { useCallModal } from "@/components/CallModalProvider";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { SocialIconLink } from "@/components/ui/SocialIconLink";
import { MapPinIcon, MaxIcon, RouteIcon, TelegramIcon } from "@/components/ui/icons";
import { YandexMap } from "@/components/YandexMap";

export function Contacts() {
  const { openModal } = useCallModal();

  return (
    <section id="contacts" className="scroll-mt-24 bg-ink py-20 text-paper sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Контакты"
          title="Свяжитесь непосредственно с адвокатом"
          tone="dark"
        />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h3 className="font-display text-2xl font-semibold text-paper">{contacts.fullName}</h3>
            <p className="mt-1 text-sm text-paper/70">
              Рег. № {contacts.regNumber} · {contacts.chamber}
            </p>

            <PhoneLink
              placement="contacts"
              className="mt-6 block text-3xl font-semibold text-paper hover:text-bronze-soft"
            >
              {contacts.phoneDisplay}
            </PhoneLink>

            <dl className="mt-6 space-y-3 text-sm text-paper/80 sm:text-base">
              <div className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-bronze-soft" />
                <div>
                  <dt className="sr-only">Адрес</dt>
                  <dd>{contacts.address}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Приём</dt>
                  <dd>{contacts.receptionHours}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-6 flex items-center gap-3">
              <SocialIconLink
                href={contacts.maxUrl}
                label="Написать в MAX"
                icon={<MaxIcon className="h-4 w-4" />}
                goal="max_click"
                placement="contacts"
                tone="dark"
              />
              <SocialIconLink
                href={contacts.telegramUrl}
                label="Написать в Telegram"
                icon={<TelegramIcon className="h-4 w-4" />}
                goal="telegram_click"
                placement="contacts"
                tone="dark"
              />
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button onClick={() => openModal("contacts")} size="lg" variant="primaryOnDark">
                Позвонить адвокату
              </Button>
              <Button
                href={contacts.yandexMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGoal("route_build", { placement: "contacts" })}
                variant="outlineLight"
                size="lg"
                icon={<RouteIcon className="h-4 w-4" />}
              >
                Построить маршрут
              </Button>
              <Button
                href={contacts.yandexReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGoal("yandex_reviews_click", { placement: "contacts" })}
                variant="ghostLight"
                size="lg"
              >
                Отзывы на Яндексе
              </Button>
            </div>
          </div>

          <YandexMap />
        </div>
      </Container>
    </section>
  );
}
