import PageHeader from '../components/PageHeader.jsx';
import { legalPages } from '../data/site.js';
import { P } from '../data/placeholders.js';
import { usePageMeta } from '../lib/usePageMeta.js';

export default function Legal({ page }) {
  const data = legalPages[page];
  usePageMeta({ title: data.title });
  return (
    <>
      <PageHeader title={data.title} crumbs={[{ label: 'Главная', to: '/' }, { label: data.title }]} />
      <div className="container-x max-w-3xl py-12 md:py-16">
        <p className="rounded-xl2 border border-accent/30 bg-soft p-4 text-sm">Текст документа будет подготовлен юристами. Ниже приведена демонстрационная структура.</p>
        <ol className="mt-8 space-y-8">
          {data.sections.map((s, i) => (
            <li key={s}>
              <h2 className="text-xl font-bold">{i + 1}. {s}</h2>
              <p className="prose-text mt-3">{P.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-sm text-muted">Редакция от: {P.date}</p>
      </div>
    </>
  );
}
