import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Eye, Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import { mainNav } from '../data/site.js';
import { useA11yMode } from '../lib/a11y.js';

export function useGoToLead() {
  const navigate = useNavigate();
  return () => navigate('/', { state: { scrollTo: 'lead' } });
}

const navCls = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-soft text-accent' : 'text-ink hover:bg-soft hover:text-accent'}`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const goToLead = useGoToLead();
  const [a11y, toggleA11y] = useA11yMode();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="container-x flex h-16 items-center gap-4 lg:h-[72px]">
        <Logo />
        <nav aria-label="Основное меню" className="ml-auto hidden xl:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} className={navCls}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2 xl:ml-2">
          <button
            type="button"
            onClick={toggleA11y}
            aria-pressed={a11y}
            title="Версия для слабовидящих"
            className="grid h-10 w-10 place-items-center rounded-lg text-navy transition hover:bg-soft"
          >
            <Eye aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Версия для слабовидящих</span>
          </button>
          <button type="button" onClick={goToLead} className="btn-primary hidden sm:inline-flex">Оставить заявку</button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg text-navy transition hover:bg-soft xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
            <span className="sr-only">{open ? 'Закрыть меню' : 'Открыть меню'}</span>
          </button>
        </div>
      </div>
      <div id="mobile-menu" hidden={!open} className="border-t border-line bg-surface xl:hidden">
        <nav aria-label="Мобильное меню" className="container-x py-4">
          <ul className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => `${navCls({ isActive })} block py-3 text-base`}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <button type="button" onClick={goToLead} className="btn-primary mt-4 w-full sm:hidden">Оставить заявку</button>
        </nav>
      </div>
    </header>
  );
}
