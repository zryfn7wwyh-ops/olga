import Breadcrumbs from './Breadcrumbs.jsx';

export default function PageHeader({ title, intro, crumbs, children }) {
  return (
    <div className="relative overflow-hidden bg-navy text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
      <div className="container-x relative py-10 md:py-14">
        {crumbs && <Breadcrumbs items={crumbs} light />}
        <h1 className="mt-4 max-w-4xl text-3xl font-bold !text-white md:text-4xl">{title}</h1>
        {intro && <p className="mt-4 max-w-3xl text-white/80">{intro}</p>}
        {children}
      </div>
    </div>
  );
}
