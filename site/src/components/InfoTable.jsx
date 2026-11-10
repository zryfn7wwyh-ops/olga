import { useId } from 'react';
import { assetUrl } from '../lib/assetUrl.js';

// Значение ячейки: строка или ссылка { text, href } (файл из public/ или внешний адрес).
function Cell({ value }) {
  if (value && typeof value === 'object' && value.href) {
    const external = /^https?:/.test(value.href);
    return (
      <a
        href={external ? value.href : assetUrl(value.href)}
        target="_blank"
        rel="noopener"
        download={external ? undefined : value.href.split('/').pop()}
        className="link"
      >
        {value.text}
      </a>
    );
  }
  return value;
}

// Таблица «поле — значение».
export function FieldsTable({ rows, caption }) {
  return (
    <table className="w-full border-collapse border border-line text-left text-sm">
      {caption && <caption className="sr-only">{caption}</caption>}
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className="flex flex-col border-b border-line md:table-row">
            <th scope="row" className="bg-soft px-4 pb-1 pt-3 align-top font-semibold text-navy md:w-2/5 md:border-r md:border-line md:py-3">{r.label}</th>
            <td className="px-4 pb-3 pt-1 align-top text-ink md:py-3">
              <Cell value={r.value} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Таблица с колонками: полноценная таблица на tablet/desktop, карточки строк на mobile.
export default function InfoTable({ title, columns, rows }) {
  const id = useId();
  return (
    <>
      <div className="hidden md:block">
        <div role="region" aria-labelledby={id} tabIndex={0} className="overflow-x-auto">
          <table style={{ minWidth: Math.max(640, columns.length * 150) }} className="w-full border-collapse border border-line text-left text-sm">
            <caption id={id} className="sr-only">{title}</caption>
            <thead className="bg-soft text-navy">
              <tr>
                {columns.map((c) => <th key={c} scope="col" className="border border-line px-3 py-2.5 align-bottom font-semibold">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) =>
                    j === 0 ? (
                      <th key={j} scope="row" className="border border-line px-3 py-2.5 align-top font-medium text-navy"><Cell value={cell} /></th>
                    ) : (
                      <td key={j} className="border border-line px-3 py-2.5 align-top text-ink"><Cell value={cell} /></td>
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
          <li key={i} className="border border-line">
            <p className="bg-soft px-4 py-2.5 text-sm font-semibold text-navy"><Cell value={row[0]} /></p>
            <dl className="divide-y divide-line px-4 text-sm">
              {row.slice(1).map((cell, j) => (
                <div key={j} className="py-2.5">
                  <dt className="text-muted">{columns[j + 1]}</dt>
                  <dd className="mt-0.5 break-words text-ink"><Cell value={cell} /></dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
