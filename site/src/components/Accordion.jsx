import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
    <div className="divide-y divide-line overflow-hidden rounded-xl2 border border-line bg-surface">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const btnId = `${baseId}-b${i}`;
        const panelId = `${baseId}-p${i}`;
        return (
          <div key={i}>
            <H className="m-0">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-navy transition hover:bg-soft focus-visible:ring-inset md:px-6"
              >
                <span>{item.title}</span>
                {item.meta && <span className="ml-auto hidden shrink-0 text-sm font-normal text-muted sm:inline">{item.meta}</span>}
                <ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 text-accent transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            </H>
            <div id={panelId} role="region" aria-labelledby={btnId} hidden={!isOpen} className="px-5 pb-5 text-ink md:px-6">
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
