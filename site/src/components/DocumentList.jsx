import { FileText } from 'lucide-react';
import { MissingDoc } from './StatusBadge.jsx';

// Перечень документов. Пока file = null, выводится статус без имитации скачивания.
export default function DocumentList({ items }) {
  return (
    <ul className="divide-y divide-line border border-line">
      {items.map((d) => (
        <li key={d.title} data-prop={d.prop} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex min-w-0 items-start gap-3">
            <FileText aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <span>
              <span className="block font-medium text-navy">{d.title}</span>
              <span className="text-xs text-muted">Дата: {d.date}</span>
            </span>
          </span>
          <span className="shrink-0 pl-8 sm:pl-0">
            {d.file ? (
              <a href={d.file} className="link text-sm">Открыть документ{d.format ? ` (${d.format})` : ''}</a>
            ) : (
              <MissingDoc />
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
