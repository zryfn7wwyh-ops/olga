import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Раскрывающиеся списки (кнопки с aria-expanded).
export default function Accordion({ items, headingLevel = 3 }) {
  const [open, setOpen] = useState(() => new Set());
  const baseId = useId();
  const H = `h${headingLevel}`;
  const toggle = (i) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <div className="divide-y divide-line border border-line">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i}>
            <H className="m-0">
              <button
                id={`${baseId}-b${i}`}
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${baseId}-p${i}`}
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-semibold text-navy transition hover:bg-soft focus-visible:ring-inset"
              >
                {item.title}
                <ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 text-accent transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            </H>
            <div id={`${baseId}-p${i}`} role="region" aria-labelledby={`${baseId}-b${i}`} hidden={!isOpen} className="px-4 pb-4 text-sm">
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
