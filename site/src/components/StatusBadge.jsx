import { FileClock } from 'lucide-react';

// Нейтральная заглушка для документа, файл которого ещё не загружен.
export function MissingDoc({ label }) {
  return (
    <span className="badge border-line bg-soft text-muted">
      <FileClock aria-hidden="true" className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
