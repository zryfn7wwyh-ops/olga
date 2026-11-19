import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { CaseAsset } from "@/content/case-aksenova";
import { cn } from "@/lib/cn";

/**
 * Изображение-доказательство. Если файл не передан (src === null):
 * - по умолчанию ничего не выводится (не имитируем доказательства);
 * - с showPlaceholder — аккуратный плейсхолдер «материал на согласовании».
 */
export function AssetImage({
  asset,
  className,
  showPlaceholder = process.env.NEXT_PUBLIC_SHOW_ASSET_PLACEHOLDERS === "true",
  sizes = "(min-width: 1024px) 640px, 100vw",
}: {
  asset: CaseAsset;
  className?: string;
  showPlaceholder?: boolean;
  sizes?: string;
}) {
  if (asset.src) {
    return (
      <div className={cn("relative bg-ivory", className)}>
        <Image
          src={asset.src}
          alt={asset.alt}
          width={asset.width ?? 1600}
          height={asset.height ?? 1000}
          sizes={sizes}
          className="h-auto w-full"
        />
      </div>
    );
  }
  if (!showPlaceholder) return null;
  return (
    <div
      className={cn(
        "flex min-h-40 flex-col items-center justify-center gap-2 border-dashed bg-[repeating-linear-gradient(135deg,transparent,transparent_10px,rgba(20,35,45,0.025)_10px,rgba(20,35,45,0.025)_20px)] p-6 text-center text-[13px] text-muted-text",
        className,
      )}
    >
      <ImageIcon className="size-5" strokeWidth={1.5} aria-hidden="true" />
      <span>Материал будет добавлен после согласования с клиентом</span>
    </div>
  );
}
