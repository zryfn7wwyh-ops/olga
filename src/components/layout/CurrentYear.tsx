"use client";

/** Динамический год (на клиенте), чтобы копирайт не «застывал» на годе сборки. */
export function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
