import { useId } from 'react';
import { DocBadge } from './DocStatus.jsx';

const renderCell = (cell) => (cell && typeof cell === 'object' && cell.doc ? <DocBadge /> : cell);

// Таблица на планшете/десктопе и карточки на мобильном.
export default function DataTable({ title, columns, rows, prop }) {
  const id = useId();
  return (
    <div data-prop={prop}>
      <div className="hidden md:block">
        <div role="region" aria-labelledby={title ? id : undefined} aria-label={title ? undefined : 'Таблица'} tabIndex={0} className="overflow-x-auto rounded-xl2 border border-line">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            {title && <caption id={id} className="sr-only">{title}</caption>}
            <thead className="bg-soft text-navy">
              <tr>
                {columns.map((c) => <th key={c} scope="col" className="border-b border-line px-4 py-3 align-bottom font-semibold">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="odd:bg-surface even:bg-soft/40 hover:bg-soft">
                  {row.map((cell, j) =>
                    j === 0 ? (
                      <th key={j} scope="row" className="border-b border-line px-4 py-3 align-top font-medium text-ink">{renderCell(cell)}</th>
                    ) : (
                      <td key={j} className="border-b border-line px-4 py-3 align-top text-ink">{renderCell(cell)}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ul className="space-y-3 md:hidden" aria-label={title}>
        {rows.map((row, i) => (
          <li key={i} className="rounded-xl2 border border-line bg-surface p-4">
            <p className="font-semibold text-navy">{renderCell(row[0])}</p>
            <dl className="mt-3 space-y-2 text-sm">
              {row.slice(1).map((cell, j) => (
                <div key={j} className="grid grid-cols-[minmax(0,45%)_1fr] gap-3 border-t border-line pt-2">
                  <dt className="text-muted">{columns[j + 1]}</dt>
                  <dd className="break-words text-ink">{renderCell(cell)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
