import Image from "next/image";
import type { Replaceable } from "@/content/siteContent";
import { isVisible } from "@/content/siteContent";
import { cn } from "@/lib/cn";

type Props = {
  item: Replaceable<unknown>;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Текст бейджа для заглушки. */
  badge?: string;
  /** Положение бейджа. */
  badgePosition?: "top-left" | "bottom-left" | "top-right";
  rounded?: boolean;
};

/**
 * Изображение с фиксированными пропорциями из siteContent.
 * Реальный файл и заглушка занимают одинаковую область — сетка не ломается при замене.
 * В production заглушки не выводятся (компонент возвращает null).
 */
export function MediaFrame({
  item,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  badge = "Демо / заменить",
  badgePosition = "top-left",
  rounded = true,
}: Props) {
  if (!item.asset || !isVisible(item)) return null;
  const [w, h] = (item.ratio ?? "16/9").split("/").map(Number);
  return (
    <div
      className={cn("relative w-full max-w-full overflow-hidden bg-ivory", rounded && "rounded-[12px]", className)}
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <Image
        src={item.asset}
        alt={item.alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        className={item.fit === "contain" ? "object-contain" : "object-cover object-top"}
      />
      {item.isPlaceholder && <DemoBadge text={badge} position={badgePosition} />}
    </div>
  );
}

export function DemoBadge({
  text = "Демо / заменить",
  position = "top-left",
  className,
}: {
  text?: string;
  position?: "top-left" | "bottom-left" | "top-right";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute z-10 inline-flex items-center gap-1.5 rounded-full bg-navy-deep/85 px-2.5 py-1 text-[10.5px] font-bold tracking-[0.12em] text-gold-soft uppercase backdrop-blur-sm",
        position === "top-left" && "top-3 left-3",
        position === "top-right" && "top-3 right-3",
        position === "bottom-left" && "bottom-3 left-3",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
      {text}
    </span>
  );
}
