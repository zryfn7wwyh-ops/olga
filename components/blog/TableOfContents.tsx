import { ChevronDownIcon } from "@/components/ui/icons";

type TableOfContentsProps = {
  headings: Array<{ id: string; text: string }>;
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length < 3) return null;

  const list = (
    <ol className="space-y-2.5 text-sm">
      {headings.map((heading, index) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            className="flex gap-2 leading-snug text-text-muted transition-colors hover:text-bronze"
          >
            <span className="text-bronze">{index + 1}.</span>
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Десктоп */}
      <nav
        aria-label="Оглавление статьи"
        className="hidden rounded-2xl border border-line bg-paper p-6 lg:sticky lg:top-28 lg:block"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-bronze">
          Оглавление
        </span>
        <div className="mt-4">{list}</div>
      </nav>

      {/* Мобильная версия — сворачиваемая, без JS */}
      <details className="group rounded-2xl border border-line bg-paper p-5 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-bronze">
          Оглавление
          <ChevronDownIcon className="h-4 w-4 text-text-muted transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="mt-4">{list}</div>
      </details>
    </>
  );
}
