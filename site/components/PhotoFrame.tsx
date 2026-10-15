import { cn } from "@/lib/cn";

type Props = {
  src: string | null;
  alt: string;
  label?: string;
  hint?: string;
  className?: string;
  tone?: "dark" | "light";
  priority?: boolean;
  /** Десатурация (для фото команды → цвет на hover группы). */
  desaturate?: boolean;
  /** Подпись-подсказку вывести сверху (если низ кадра занят наложением). */
  hintTop?: boolean;
};

/**
 * Фото с premium editorial-обработкой либо понятный placeholder для новой фотосессии.
 */
export function PhotoFrame({ src, alt, label = "Фото", hint = "Место для фотографии", className, tone = "dark", priority, desaturate, hintTop }: Props) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-[filter,transform] duration-500 ease-[var(--ease-premium)]",
            desaturate ? "grayscale-[85%] group-hover:grayscale-0" : "saturate-[.82] contrast-[1.03]",
            "group-hover:scale-[1.02]",
          )}
        />
      </div>
    );
  }
  const dark = tone === "dark";
  return (
    <div
      role="img"
      aria-label={`${alt} — фотография будет добавлена`}
      className={cn(
        "relative overflow-hidden",
        dark ? "bg-slate text-mist" : "bg-[#E7E3DA] text-muted",
        className,
      )}
    >
      {/* Мягкий световой градиент, имитирующий студийный свет */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: dark
            ? "radial-gradient(120% 80% at 70% 15%, rgb(88 121 142 / .28), transparent 60%), linear-gradient(180deg, transparent 55%, rgb(16 26 34 / .65))"
            : "radial-gradient(120% 80% at 70% 15%, rgb(255 255 255 / .7), transparent 60%)",
        }}
      />
      {/* Силуэт-ориентир для композиции портрета */}
      <svg aria-hidden viewBox="0 0 400 500" preserveAspectRatio="xMidYMax meet" className={cn("absolute inset-x-0 bottom-0 h-[82%] w-full", dark ? "text-[#22343f]" : "text-[#DCD7CC]")}>
        <path fill="currentColor" d="M200 70c-44 0-72 32-72 78 0 34 14 62 34 78v24c-74 16-122 52-140 128-6 26-8 64-8 122h372c0-58-2-96-8-122-18-76-66-112-140-128v-24c20-16 34-44 34-78 0-46-28-78-72-78Z" />
      </svg>
      <div className="absolute left-5 top-5 right-5 flex items-start justify-between gap-4">
        <span className="tech opacity-80">{label}</span>
        <span className="tech hidden text-right opacity-60 sm:inline">{hintTop ? hint : "4 : 5"}</span>
      </div>
      {!hintTop && (
        <div className="absolute bottom-5 left-5 right-5">
          <span className={cn("tech block", dark ? "text-mist/80" : "text-muted")}>{hint}</span>
        </div>
      )}
    </div>
  );
}
