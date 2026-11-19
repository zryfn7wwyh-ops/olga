import Image from "next/image";
import { site } from "@/content/site";

const initials = site.name
  .split(/\s+/)
  .map((w) => w[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

/** Логотип: файл из site.logoPath или аккуратный текстовый знак. */
export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={`flex min-h-11 items-center gap-3 ${className ?? ""}`} aria-label={`${site.name} — в начало страницы`}>
      {site.logoPath ? (
        <Image src={site.logoPath} alt="" width={160} height={40} className="h-9 w-auto" priority />
      ) : (
        <>
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-[8px] border border-gold/60 font-serif text-[18px] font-semibold tracking-tight text-gold-soft"
          >
            {initials}
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[21px] font-semibold tracking-[0.005em]">{site.name}</span>
            <span className="mt-1 hidden text-[10.5px] font-semibold tracking-[0.16em] text-[var(--on-dark-muted)] uppercase xs:block">
              {site.tagline}
            </span>
          </span>
        </>
      )}
    </a>
  );
}
