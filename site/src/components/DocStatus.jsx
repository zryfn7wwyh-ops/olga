import { FileText, FileX2 } from 'lucide-react';
import { P } from '../data/placeholders.js';

// Документ без файла: показываем статус, а не имитацию скачивания.
export function DocBadge({ label = P.docStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-soft px-2.5 py-1 text-xs font-medium text-muted ring-1 ring-line">
      <FileX2 aria-hidden="true" className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export function DocRow({ title, file, prop, status = P.docStatus, updatedAt }) {
  return (
    <li data-prop={prop} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="flex min-w-0 items-start gap-3">
        <FileText aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <span>
          <span className="font-medium text-ink">{title}</span>
          {updatedAt !== undefined && <span className="block text-xs text-muted">Дата размещения: {updatedAt || P.date}</span>}
        </span>
      </span>
      {file ? (
        <a href={file} className="link text-sm">Открыть документ</a>
      ) : (
        <span className="shrink-0 pl-8 sm:pl-0"><DocBadge label={status} /></span>
      )}
    </li>
  );
}
