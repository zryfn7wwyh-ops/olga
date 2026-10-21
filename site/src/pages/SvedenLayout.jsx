import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ChevronDown, ListTree } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { getSvedenSection, svedenMeta, svedenSections } from '../data/sveden.js';

function SideNav({ onNavigate }) {
  return (
    <ul className="space-y-0.5">
      <li>
        <NavLink to="/sveden" end onClick={onNavigate} className={linkCls}>Все подразделы</NavLink>
      </li>
      {svedenSections.map((s) => (
        <li key={s.slug}>
          <NavLink to={`/sveden/${s.slug}`} onClick={onNavigate} className={linkCls}>{s.title}</NavLink>
        </li>
      ))}
    </ul>
  );
}

const linkCls = ({ isActive }) =>
  `block rounded-md border-l-2 px-3 py-2 text-sm leading-snug transition ${
    isActive ? 'border-accent bg-soft font-semibold text-accent' : 'border-transparent text-ink hover:bg-soft hover:text-accent'
  }`;

// Строгий информационный шаблон официального раздела.
export default function SvedenLayout() {
  const { pathname } = useLocation();
  const slug = pathname.split('/')[2];
  const current = slug ? getSvedenSection(slug) : null;
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const crumbs = [{ label: 'Главная', to: '/' }, { label: svedenMeta.title, to: '/sveden' }];
  if (current) crumbs.push({ label: current.title });
  else crumbs[1] = { label: svedenMeta.title };

  return (
    <div className="bg-surface">
      <div className="border-b border-line bg-soft">
        <div className="container-x py-8 md:py-10">
          <Breadcrumbs items={crumbs} />
          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-muted">{svedenMeta.title}</p>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">{current ? current.title : svedenMeta.title}</h1>
        </div>
      </div>

      <div className="container-x grid gap-8 py-8 md:py-12 lg:grid-cols-[300px_1fr]">
        <div className="lg:hidden">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="sveden-mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-3 rounded-xl2 border border-line bg-surface px-4 py-3 text-left font-semibold text-navy"
          >
            <span className="flex items-center gap-2"><ListTree aria-hidden="true" className="h-5 w-5 text-accent" />Подразделы</span>
            <ChevronDown aria-hidden="true" className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          <nav id="sveden-mobile-nav" aria-label="Подразделы сведений" hidden={!open} className="mt-2 rounded-xl2 border border-line p-2">
            <SideNav onNavigate={() => setOpen(false)} />
          </nav>
        </div>

        <nav aria-label="Подразделы сведений" className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl2 border border-line p-2">
            <SideNav />
          </div>
        </nav>

        <div className="min-w-0">
          <Outlet />
          <p className="mt-12 border-t border-line pt-4 text-xs text-muted">Дата последнего обновления: {svedenMeta.updatedAt}</p>
        </div>
      </div>
    </div>
  );
}
