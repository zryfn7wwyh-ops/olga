import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { svedenSections } from '../data/sveden.js';

const linkCls = ({ isActive }) =>
  `block border-l-2 px-3 py-2 text-sm leading-snug transition ${
    isActive ? 'border-accent bg-soft font-semibold text-accent' : 'border-transparent text-navy hover:bg-soft hover:text-accent'
  }`;

function Links() {
  return (
    <ul>
      <li><NavLink to="/sveden" end className={linkCls}>Оглавление</NavLink></li>
      {svedenSections.map((s) => (
        <li key={s.slug}><NavLink to={`/sveden/${s.slug}`} className={linkCls}>{s.title}</NavLink></li>
      ))}
    </ul>
  );
}

// Боковая навигация по разделу сведений: колонка на desktop, раскрывающийся список на mobile.
export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="sveden-nav-mobile"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 rounded border border-line px-4 py-3 text-left font-semibold text-navy hover:bg-soft"
        >
          Подразделы сведений
          <ChevronDown aria-hidden="true" className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        <nav id="sveden-nav-mobile" aria-label="Подразделы сведений" hidden={!open} className="mt-2 rounded border border-line py-1">
          <Links />
        </nav>
      </div>
      <nav aria-label="Подразделы сведений" className="hidden lg:block">
        <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto border-r border-line pr-2">
          <Links />
        </div>
      </nav>
    </>
  );
}
