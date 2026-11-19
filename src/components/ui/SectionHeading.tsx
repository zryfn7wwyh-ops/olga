import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "split";
  className?: string;
  titleClassName?: string;
};

/** Заголовок секции: надзаголовок с золотой линией, H2 и вводный текст. */
export function SectionHeading({ id, eyebrow, title, intro, align = "left", className, titleClassName }: Props) {
  if (align === "split") {
    return (
      <div className={cn("grid gap-6 lg:grid-cols-12 lg:gap-10", className)} data-reveal>
        <div className="lg:col-span-7">
          {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
          <h2 id={id} className={cn("h2", titleClassName)}>
            {title}
          </h2>
        </div>
        {intro && (
          <div className="lead text-muted-text lg:col-span-5 lg:self-end [.on-dark_&]:text-[var(--on-dark-muted)]">
            {intro}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className={cn("max-w-[880px]", className)} data-reveal>
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
      <h2 id={id} className={cn("h2", titleClassName)}>
        {title}
      </h2>
      {intro && (
        <div className="lead mt-6 max-w-[720px] text-muted-text [.on-dark_&]:text-[var(--on-dark-muted)]">{intro}</div>
      )}
    </div>
  );
}
