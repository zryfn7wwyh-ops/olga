"use client";

import { contacts } from "@/data/contacts";
import { trackGoal } from "@/lib/analytics";
import { ArrowRightIcon, StarIcon } from "@/components/ui/icons";

export function HeroRatingLink() {
  return (
    <a
      href={contacts.yandexReviewsUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackGoal("yandex_reviews_click", { placement: "hero" })}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-bronze"
    >
      <StarIcon className="h-4 w-4 text-bronze" />
      5.0
      <span className="font-normal text-text-muted">Отзывы на Яндекс Картах</span>
      <ArrowRightIcon className="h-3.5 w-3.5 text-text-muted" />
    </a>
  );
}
