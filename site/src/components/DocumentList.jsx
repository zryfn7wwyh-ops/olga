import { Download, FileText } from 'lucide-react';
import { MissingDoc } from './StatusBadge.jsx';

// Перечень документов: с файлом — ссылка на скачивание, без файла — заглушка (без имитации скачивания).
export default function DocumentList({ items, status }) {
  return (
    <ul className="divide-y divide-line border border-line">
      {items.map((d) => (
        <li key={d.title} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <span className="flex min-w-0 items-start gap-3">
            <FileText aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <span className="min-w-0 break-words">
              <span className="block font-medium text-navy">{d.title}</span>
              {d.date && <span className="text-xs text-muted">Дата: {d.date}</span>}
            </span>
          </span>
          <span className="shrink-0 pl-8 sm:pl-0">
            {d.file ? (
              <a href={d.file} target="_blank" rel="noopener" download className="link inline-flex items-center gap-1.5 text-sm">
                <Download aria-hidden="true" className="h-4 w-4" />
                Скачать{d.format || d.size ? ` (${[d.format, d.size].filter(Boolean).join(', ')})` : ''}
                <span className="sr-only">: {d.title}</span>
              </a>
            ) : (
              <MissingDoc label={status} />
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
