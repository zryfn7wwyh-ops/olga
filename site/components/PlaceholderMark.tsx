import { site } from "@/data/site";

/** Пометка для заменяемого контента. Отключается флагом site.showPlaceholderMarks. */
export function PlaceholderMark({ children = "Требует замены", className = "" }: { children?: React.ReactNode; className?: string }) {
  if (!site.showPlaceholderMarks) return null;
  return <span className={`ph-mark ${className}`}>{children}</span>;
}
