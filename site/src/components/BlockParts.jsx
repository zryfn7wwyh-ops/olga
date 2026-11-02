import { CheckCircle2, Info } from 'lucide-react';
import InfoTable, { FieldsTable } from './InfoTable.jsx';
import DocumentList from './DocumentList.jsx';
import TeacherCard from './TeacherCard.jsx';

// Рендер содержимого блока из массива parts (см. src/data/landing.js).
export default function BlockParts({ parts, caption }) {
  return (
    <div className="space-y-5">
      {parts.map((p, i) => (
        <Part key={i} p={p} caption={caption} />
      ))}
    </div>
  );
}

function Part({ p, caption }) {
  switch (p.type) {
    case 'text':
      return <p className="max-w-4xl text-ink">{p.text}</p>;
    case 'subhead':
      return <h3 className="max-w-4xl pt-2 text-base font-bold md:text-lg">{p.text}</h3>;
    case 'list':
      return (
        <ul className="max-w-4xl space-y-2">
          {p.items.map((t) => (
            <li key={t} className="flex gap-3">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              {t}
            </li>
          ))}
        </ul>
      );
    case 'fields':
      return <FieldsTable rows={p.rows} caption={caption} />;
    case 'table':
      return <InfoTable title={caption} columns={p.columns} rows={p.rows} />;
    case 'docs':
      return <DocumentList items={p.items} status={p.status} />;
    case 'notice':
      return (
        <p className="flex max-w-4xl gap-3 border-l-4 border-accent bg-soft p-4 text-sm text-navy">
          <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          {p.text}
        </p>
      );
    case 'teachers':
      return (
        <div className="space-y-6">
          {p.items.map((t) => (
            <TeacherCard key={t.name} t={t} />
          ))}
        </div>
      );
    case 'groups':
      return (
        <div className="grid gap-8 md:grid-cols-2">
          {p.items.map((g) => (
            <div key={g.title} className="min-w-0">
              <h3 className="mb-3 text-lg font-bold">{g.title}</h3>
              <BlockParts parts={g.parts} caption={g.title} />
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}
