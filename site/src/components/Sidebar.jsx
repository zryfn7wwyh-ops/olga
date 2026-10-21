import { blocks } from '../data/landing.js';

// Якорное оглавление по 10 блокам (desktop). Подсвечивает текущий блок.
export default function Sidebar({ active }) {
  return (
    <nav aria-label="Разделы сайта" className="hidden lg:block">
      <ol className="sticky top-[calc(var(--header-h,93px)+24px)] border-l border-line">
        {blocks.map((b, i) => {
          const on = active === b.id;
          return (
            <li key={b.id}>
              <a
                href={`#${b.id}`}
                aria-current={on ? 'location' : undefined}
                className={`-ml-px flex gap-2 border-l-2 px-4 py-2 text-sm leading-snug transition ${
                  on ? 'border-accent bg-soft font-semibold text-accent' : 'border-transparent text-navy hover:border-line hover:bg-soft hover:text-accent'
                }`}
              >
                <span className="w-5 shrink-0 tabular-nums text-muted">{i + 1}.</span>
                {b.nav}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
