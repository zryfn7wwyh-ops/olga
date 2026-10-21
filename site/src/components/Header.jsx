import { useEffect, useState } from 'react';
import { Eye, Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import { blocks } from '../data/landing.js';
import { prototypeNotice } from '../data/site.js';
import { useA11yMode } from '../lib/a11y.js';

// Шапка: на desktop навигация — в боковом оглавлении, на mobile — раскрывающееся меню из 10 якорей.
export default function Header({ active }) {
  const [open, setOpen] = useState(false);
  const [a11y, toggleA11y] = useA11yMode();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div id="header-bar">
        <p className="bg-soft px-4 py-1.5 text-center text-xs text-navy">{prototypeNotice}</p>
        <div className="container-x flex h-16 items-center gap-4">
          <Logo />
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={toggleA11y}
              aria-pressed={a11y}
              className="flex h-10 items-center gap-2 rounded px-2 text-sm text-navy transition hover:bg-soft"
            >
              <Eye aria-hidden="true" className="h-5 w-5" />
              <span className="hidden sm:inline">Версия для слабовидящих</span>
              <span className="sr-only sm:hidden">Версия для слабовидящих</span>
            </button>
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded px-2 text-sm font-medium text-navy transition hover:bg-soft lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
              <span className="hidden sm:inline">Разделы</span>
              <span className="sr-only sm:hidden">{open ? 'Закрыть меню разделов' : 'Открыть меню разделов'}</span>
            </button>
          </div>
        </div>
      </div>
      <nav id="mobile-menu" aria-label="Разделы сайта" hidden={!open} className="max-h-[70vh] overflow-y-auto border-t border-line lg:hidden">
        <ol className="container-x py-2">
          {blocks.map((b, i) => (
            <li key={b.id}>
              <a
                href={`#${b.id}`}
                onClick={() => setOpen(false)}
                aria-current={active === b.id ? 'location' : undefined}
                className={`flex gap-3 rounded px-3 py-3 text-base transition hover:bg-soft hover:text-accent ${active === b.id ? 'font-semibold text-accent' : 'text-navy'}`}
              >
                <span className="w-6 shrink-0 text-right tabular-nums text-muted">{i + 1}.</span>
                {b.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </header>
  );
}
