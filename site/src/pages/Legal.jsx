import PageTitle from '../components/PageTitle.jsx';
import NotFound from './NotFound.jsx';
import { privacy } from '../data/site.js';
import { P } from '../data/placeholders.js';
import { usePageMeta } from '../lib/usePageMeta.js';

export default function Legal() {
  usePageMeta({ title: privacy.enabled ? privacy.title : 'Страница не найдена' });
  if (!privacy.enabled) return <NotFound />;
  return (
    <>
      <PageTitle title={privacy.title} crumbs={[{ label: 'Главная', to: '/' }, { label: privacy.title }]} />
      <div className="container-x max-w-3xl py-8 md:py-10">
        <p className="border-l-4 border-accent bg-soft p-4 text-sm">{P.doc} Ниже приведена структура документа.</p>
        <ol className="mt-6 space-y-6">
          {privacy.sections.map((s, i) => (
            <li key={s}>
              <h2 className="text-lg font-bold">{i + 1}. {s}</h2>
              <p className="mt-2 text-ink">{P.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-muted">Редакция от: {P.date}</p>
      </div>
    </>
  );
}
