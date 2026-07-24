"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { reviews } from "@/data/reviews";
import { trackGoal } from "@/lib/analytics";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRightIcon, ExpandIcon } from "@/components/ui/icons";
import { Lightbox } from "@/components/ui/Lightbox";

export function ReviewsSlider() {
  const [index, setIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = reviews.length;
  const active = reviews[index];

  function goTo(nextIndex: number) {
    setIndex((nextIndex + total) % total);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowLeft") goTo(index - 1);
    if (event.key === "ArrowRight") goTo(index + 1);
  }

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      goTo(delta > 0 ? index - 1 : index + 1);
    }
    touchStartX.current = null;
  }

  return (
    <section id="reviews" className="scroll-mt-24 bg-paper py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Отзывы" title="Отзывы доверителей" />

        <div
          className="mt-12 outline-none"
          tabIndex={0}
          role="group"
          aria-roledescription="карусель"
          aria-label="Отзывы доверителей"
          onKeyDown={handleKeyDown}
        >
          <div
            className="overflow-hidden rounded-2xl border border-line bg-cream"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {reviews.map((review) => (
                <div key={review.id} className="w-full shrink-0 grow-0 basis-full">
                  <div className="grid grid-cols-1 gap-0 sm:grid-cols-[220px_1fr]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLightboxOpen(true);
                        trackGoal("review_view", { placement: "reviews", id: review.id });
                      }}
                      className="group relative aspect-[4/3] w-full overflow-hidden sm:aspect-auto sm:h-full"
                      aria-label={`Открыть отзыв: ${review.signature}`}
                    >
                      <Image
                        src={review.image}
                        alt={`Благодарственное письмо — ${review.signature}`}
                        fill
                        sizes="(min-width: 640px) 220px, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-paper opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <ExpandIcon className="h-4 w-4" />
                      </span>
                    </button>

                    <div className="flex flex-col justify-center gap-3 px-6 py-7 sm:px-8">
                      <span className="w-fit rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-emerald">
                        {review.category}
                      </span>
                      <blockquote className="font-display text-lg italic leading-relaxed text-ink sm:text-xl">
                        «{review.excerpt}»
                      </blockquote>
                      <footer className="text-sm text-text-muted">
                        <p className="font-semibold text-ink">{review.signature}</p>
                        <p>{review.source}</p>
                      </footer>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2" role="tablist" aria-label="Выбор отзыва">
              {reviews.map((review, i) => (
                <button
                  key={review.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Отзыв ${i + 1} из ${total}`}
                  onClick={() => goTo(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-7 bg-bronze" : "w-2.5 bg-ink/15 hover:bg-ink/30"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label="Предыдущий отзыв"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-bronze hover:text-bronze"
              >
                <span className="rotate-180">
                  <ArrowRightIcon />
                </span>
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label="Следующий отзыв"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-bronze hover:text-bronze"
              >
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </Container>

      {isLightboxOpen ? (
        <Lightbox
          src={active.image}
          alt={`Благодарственное письмо — ${active.signature}`}
          title={active.signature}
          subtitle={active.source}
          onClose={() => setIsLightboxOpen(false)}
          onPrev={() => goTo(index - 1)}
          onNext={() => goTo(index + 1)}
        />
      ) : null}
    </section>
  );
}
