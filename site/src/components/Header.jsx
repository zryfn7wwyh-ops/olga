import { useEffect, useState } from 'react';
import { Eye, Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import { mainNav, prototypeNotice } from '../data/site.js';
import { useA11yMode } from '../lib/a11y.js';

const navCls = 'block rounded px-3 py-2 text-sm font-medium text-navy transition hover:text-accent hover:underline underline-offset-8';

export default function Header() {
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
      <p className="bg-soft px-4 py-1.5 text-center text-xs text-navy">{prototypeNotice}</p>
      <div className="container-x flex h-16 items-center gap-4">
        <Logo />
        <nav aria-label="Основное меню" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.id}><a href={`#${item.id}`} className={navCls}>{item.label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <button type="button" onClick={toggleA11y} aria-pressed={a11y} className="flex h-10 items-center gap-2 rounded px-2 text-sm text-navy transition hover:bg-soft">
            <Eye aria-hidden="true" className="h-5 w-5" />
            <span className="hidden sm:inline">Версия для слабовидящих</span>
            <span className="sr-only sm:hidden">Версия для слабовидящих</span>
          </button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded text-navy transition hover:bg-soft lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
            <span className="sr-only">{open ? 'Закрыть меню' : 'Открыть меню'}</span>
          </button>
        </div>
      </div>
      <nav id="mobile-menu" aria-label="Мобильное меню" hidden={!open} className="border-t border-line lg:hidden">
        <ul className="container-x flex flex-col py-2">
          {mainNav.map((item) => (
            <li key={item.id}><a href={`#${item.id}`} onClick={() => setOpen(false)} className={`${navCls} py-3 text-base`}>{item.label}</a></li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
