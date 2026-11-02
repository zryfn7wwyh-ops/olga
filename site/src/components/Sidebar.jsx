import { blocks, groupStartingAt } from '../data/landing.js';

// Якорное оглавление (desktop). Подсвечивает текущий блок.
export default function Sidebar({ active }) {
  return (
    <nav aria-label="Разделы сайта" className="hidden lg:block">
      <div className="sticky top-[calc(var(--header-h,93px)+24px)] max-h-[calc(100vh-var(--header-h,93px)-40px)] overflow-y-auto pb-4">
        <ol className="border-l border-line">
          {blocks.map((b, i) => {
            const on = active === b.id;
            const group = groupStartingAt(b.id);
            return (
              <li key={b.id}>
                {group && <p className={`px-4 pb-1 text-xs font-bold uppercase tracking-wider text-muted ${i ? 'pt-4' : 'pt-1'}`}>{group.title}</p>}
                <a
                  href={`#${b.id}`}
                  aria-current={on ? 'location' : undefined}
                  className={`-ml-px flex gap-2 border-l-2 px-4 py-1.5 text-sm leading-snug transition ${
                    on ? 'border-accent bg-soft font-semibold text-accent' : 'border-transparent text-navy hover:border-line hover:bg-soft hover:text-accent'
                  }`}
                >
                  <span className="w-6 shrink-0 tabular-nums text-muted">{i + 1}.</span>
                  {b.nav}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
