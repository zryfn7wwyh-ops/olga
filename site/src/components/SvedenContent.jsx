import { Info, Scale, UserRound } from 'lucide-react';
import InfoTable, { FieldsTable } from './InfoTable.jsx';
import DocumentList from './DocumentList.jsx';
import Accordion from './Accordion.jsx';
import { P } from '../data/placeholders.js';

function Persons({ items }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p, i) => (
        <li key={i} className="border border-line p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-soft text-muted"><UserRound aria-hidden="true" className="h-6 w-6" /></span>
            <div><p className="font-semibold text-navy">{P.person}</p><p className="text-sm text-muted">{p.role}</p></div>
          </div>
          <dl className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
            <div className="flex flex-wrap gap-x-2"><dt className="text-muted">Телефон:</dt><dd>{P.phone}</dd></div>
            <div className="flex flex-wrap gap-x-2"><dt className="text-muted">E-mail:</dt><dd>{P.email}</dd></div>
          </dl>
        </li>
      ))}
    </ul>
  );
}

function Review({ items }) {
  return (
    <div className="space-y-3 border border-dashed border-muted/60 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-navy">
        <Scale aria-hidden="true" className="h-4 w-4 text-accent" />
        Позиции справки юридического отдела — до заключения ЮО
      </p>
      <FieldsTable caption="Позиции, ожидающие заключения юридического отдела" rows={items.map((label) => ({ label, value: P.tbd }))} />
    </div>
  );
}

// Рендер блоков подраздела из конфигурации src/data/sveden.js.
export default function SvedenContent({ blocks }) {
  return (
    <div className="space-y-8">
      {blocks.map((b, i) => (
        <section key={i} data-prop={b.prop} aria-label={b.title || undefined}>
          {b.title && <h3 className="mb-3 text-base font-bold md:text-lg">{b.title}</h3>}
          {b.type === 'fields' && <FieldsTable rows={b.rows} caption={b.title} />}
          {b.type === 'table' && <InfoTable title={b.title} columns={b.columns} rows={b.rows} />}
          {b.type === 'files' && <DocumentList items={b.items} />}
          {b.type === 'persons' && <Persons items={b.items} />}
          {b.type === 'modules' && (
            <Accordion headingLevel={4} items={b.items.map((p) => ({ title: p.title, content: <ul className="list-disc space-y-1 pl-5">{p.modules.map((m) => <li key={m}>{m}</li>)}</ul> }))} />
          )}
          {b.type === 'review' && <Review items={b.items} />}
          {b.type === 'note' && (
            <p className="flex gap-2 text-sm text-muted">
              <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              {b.text}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
