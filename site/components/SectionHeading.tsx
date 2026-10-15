import { cn } from "@/lib/cn";

/** Заголовок секции с микроподписью «NN / РАЗДЕЛ». */
export function SectionHeading({
  index,
  label,
  title,
  id,
  className,
  children,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  id: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("max-w-[820px]", className)}>
      <span className="eyebrow">{`${index} / ${label}`}</span>
      <h2 id={id} className="h-section mt-6">
        {title}
      </h2>
      {children}
    </div>
  );
}
