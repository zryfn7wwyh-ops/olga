import { Info, UserRound } from 'lucide-react';
import DataTable from './DataTable.jsx';
import { DocRow } from './DocStatus.jsx';
import { P } from '../data/placeholders.js';

function Fields({ rows }) {
  return (
    <div className="overflow-hidden rounded-xl2 border border-line">
      <table className="w-full border-collapse text-left text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} data-prop={r.prop} className="flex flex-col border-b border-line last:border-0 md:table-row">
              <th scope="row" className="bg-soft px-4 pb-1 pt-3 align-top font-semibold text-navy md:w-2/5 md:py-3">{r.label}</th>
              <td className="px-4 pb-3 pt-1 align-top text-ink md:py-3">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Persons({ items }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p, i) => (
        <li key={i} className="card p-5">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-soft text-accent/70">
              <UserRound aria-hidden="true" className="h-9 w-9" />
            </span>
            <div>
              <p className="font-semibold text-navy">{P.person}</p>
              <p className="text-sm text-muted">{p.role}</p>
            </div>
          </div>
          <dl className="mt-4 space-y-1.5 border-t border-line pt-3 text-sm">
            <div className="flex gap-2"><dt className="text-muted">Телефон:</dt><dd>{P.phone}</dd></div>
            <div className="flex gap-2"><dt className="text-muted">E-mail:</dt><dd>{P.email}</dd></div>
          </dl>
        </li>
      ))}
    </ul>
  );
}

function Scheme() {
  const box = 'rounded-lg border-2 border-accent/40 bg-surface px-3 py-2.5 text-center text-sm font-medium text-navy';
  return (
    <figure className="rounded-xl2 border border-line bg-soft p-5 md:p-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <div className={`${box} border-accent bg-accent !text-white`}>[Высший орган управления]</div>
        <div aria-hidden="true" className="h-6 w-0.5 bg-accent/40" />
        <div className={box}>[Единоличный исполнительный орган]</div>
        <div aria-hidden="true" className="h-6 w-0.5 bg-accent/40" />
        <div className="grid w-full gap-3 border-t-2 border-accent/40 pt-6 sm:grid-cols-3">
          {[1, 2, 3].map((n) => <div key={n} className={box}>[Структурное подразделение № {n}]</div>)}
        </div>
      </div>
      <figcaption className="mt-5 text-center text-xs text-muted">Условная схема. Фактическая структура будет добавлена после утверждения.</figcaption>
    </figure>
  );
}

export default function SvedenBlocks({ blocks }) {
  return (
    <div className="space-y-10">
      {blocks.map((b, i) => (
        <section key={i} data-prop={b.prop} aria-label={b.title || undefined}>
          {b.title && <h2 className="mb-4 text-xl font-bold">{b.title}</h2>}
          {b.type === 'fields' && <Fields rows={b.rows} />}
          {b.type === 'table' && <DataTable title={b.title} columns={b.columns} rows={b.rows} />}
          {b.type === 'docs' && (
            <ul className="divide-y divide-line rounded-xl2 border border-line bg-surface px-4 md:px-5">
              {b.items.map((d) => <DocRow key={d.title} {...d} status={P.fileMissing} />)}
            </ul>
          )}
          {b.type === 'persons' && <Persons items={b.items} />}
          {b.type === 'text' && <p className="prose-text max-w-3xl">{b.text}</p>}
          {b.type === 'scheme' && <Scheme />}
          {b.type === 'note' && (
            <p className="flex gap-3 rounded-xl2 border border-accent/30 bg-soft p-4 text-sm">
              <Info aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
              {b.text}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
