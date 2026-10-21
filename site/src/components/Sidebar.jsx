import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { svedenSections } from '../data/sveden.js';

const linkCls = (isActive) =>
  `block border-l-2 px-3 py-2 text-sm leading-snug transition ${
    isActive ? 'border-accent bg-soft font-semibold text-accent' : 'border-transparent text-navy hover:bg-soft hover:text-accent'
  }`;

function Links({ active, onNavigate }) {
  return (
    <ol>
      {svedenSections.map((s, i) => (
        <li key={s.slug}>
          <a href={`#${s.slug}`} onClick={onNavigate} aria-current={active === s.slug ? 'location' : undefined} className={linkCls(active === s.slug)}>
            {i + 1}. {s.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

// Оглавление подразделов: закреплённая колонка на desktop, раскрывающийся список на mobile.
export default function Sidebar({ active }) {
  const [open, setOpen] = useState(false);
  const current = svedenSections.find((s) => s.slug === active);

  return (
    <>
      <div id="sveden-toc-bar" className="sticky top-[var(--header-h,104px)] z-30 -mx-4 border-b border-line bg-surface px-4 py-2 sm:-mx-6 sm:px-6 lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="sveden-nav-mobile"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 rounded border border-line px-3 py-2.5 text-left text-sm font-semibold text-navy hover:bg-soft"
        >
          <span className="truncate">{current ? current.title : 'Подразделы сведений'}</span>
          <ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        <nav id="sveden-nav-mobile" aria-label="Подразделы сведений" hidden={!open} className="absolute inset-x-4 top-full mt-1 max-h-[60vh] overflow-y-auto rounded border border-line bg-surface py-1 shadow-lg sm:inset-x-6">
          <Links active={active} onNavigate={() => setOpen(false)} />
        </nav>
      </div>
      <nav aria-label="Подразделы сведений" className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h,93px)+16px)] max-h-[calc(100vh-var(--header-h,93px)-32px)] overflow-y-auto border-r border-line pr-2">
          <Links active={active} />
        </div>
      </nav>
    </>
  );
}
