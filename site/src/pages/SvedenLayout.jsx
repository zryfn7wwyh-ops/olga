import { Link, Outlet, useLocation } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { getSvedenSection, svedenMeta } from '../data/sveden.js';

export default function SvedenLayout() {
  const slug = useLocation().pathname.split('/')[2];
  const current = slug ? getSvedenSection(slug) : null;
  const crumbs = current
    ? [{ label: 'Главная', to: '/' }, { label: svedenMeta.title, to: '/sveden' }, { label: current.title }]
    : [{ label: 'Главная', to: '/' }, { label: svedenMeta.title }];

  return (
    <>
      <div className="border-b border-line">
        <div className="container-x py-6 md:py-8">
          <Breadcrumbs items={crumbs} />
          {current && <p className="mt-3 text-sm text-muted"><Link to="/sveden" className="hover:underline">{svedenMeta.title}</Link></p>}
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">{current ? current.title : svedenMeta.title}</h1>
        </div>
      </div>
      <div className="container-x grid gap-6 py-6 md:py-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
        <Sidebar />
        <div className="min-w-0">
          <Outlet />
          <p className="mt-10 border-t border-line pt-3 text-xs text-muted">Дата последнего обновления сведений: {svedenMeta.updatedAt}</p>
        </div>
      </div>
    </>
  );
}
