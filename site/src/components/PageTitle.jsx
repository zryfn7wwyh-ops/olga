import Breadcrumbs from './Breadcrumbs.jsx';

export default function PageTitle({ title, crumbs, children }) {
  return (
    <div className="border-b border-line">
      <div className="container-x py-6 md:py-8">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <h1 className="mt-3 text-2xl font-bold md:text-3xl">{title}</h1>
        {children}
      </div>
    </div>
  );
}
