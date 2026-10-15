"use client";

import { reviews } from "@/data/reviews";
import { trackGoal } from "@/lib/analytics";
import { PlaceholderMark } from "./PlaceholderMark";
import { SliderNav } from "./SliderNav";
import { useSlider } from "./useSlider";

/** Один крупный отзыв + мета сбоку; swipe на мобильных. */
export function Reviews() {
  const { ref, index, goTo } = useSlider<HTMLUListElement>();
  const n = reviews.length;
  const go = (i: number) => {
    goTo((i + n) % n);
    trackGoal("review_interaction", { index: (i + n) % n });
  };

  return (
    <section id="reviews" aria-labelledby="reviews-title" aria-roledescription="карусель" className="on-dark section-y bg-ink text-ivory">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <span className="eyebrow">09 / Отзывы</span>
            <h2 id="reviews-title" className="h-section mt-6">
              Что говорят о сотрудничестве
            </h2>
          </div>
          <SliderNav dark label="Навигация по отзывам" index={index} total={n} onPrev={() => go(index - 1)} onNext={() => go(index + 1)} />
        </div>

        <ul ref={ref} className="no-scrollbar mt-14 flex snap-x snap-mandatory overflow-x-auto lg:mt-20" onTouchEnd={() => trackGoal("review_interaction", { type: "swipe" })}>
          {reviews.map((r, i) => (
            <li
              key={r.id}
              className="w-full shrink-0 snap-start"
              aria-roledescription="слайд"
              aria-label={`${i + 1} из ${n}`}
            >
              <figure className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                <blockquote className="relative lg:col-span-8">
                  <svg aria-hidden viewBox="0 0 48 36" className="absolute left-0 top-0 h-7 w-9 text-bronze sm:h-9 sm:w-12">
                    <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M2 34V20C2 9 8 3 18 2M28 34V20c0-11 6-17 16-18M2 20h14v14H2zM28 20h14v14H28z" />
                  </svg>
                  <p className="relative pt-10 font-serif text-[24px] leading-[1.4] text-ivory sm:pt-14 sm:text-[32px] lg:text-[38px]">{r.text}</p>
                </blockquote>
                <figcaption className="border-t border-slate-2 pt-6 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-14">
                  {r.placeholder && <PlaceholderMark className="mb-6">отзыв не предоставлен</PlaceholderMark>}
                  <dl className="space-y-5">
                    <div>
                      <dt className="tech text-mist/70">Автор</dt>
                      <dd className="mt-1 text-[17px] font-semibold">{r.author}</dd>
                    </div>
                    <div>
                      <dt className="tech text-mist/70">Должность / компания</dt>
                      <dd className="mt-1 text-[15px] text-mist">{r.position}</dd>
                    </div>
                    <div>
                      <dt className="tech text-mist/70">Тип задачи</dt>
                      <dd className="mt-1 text-[15px] text-mist">{r.taskType}</dd>
                    </div>
                  </dl>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
