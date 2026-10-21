import { CircleAlert, FileX2 } from 'lucide-react';
import { P } from '../data/placeholders.js';

export function MissingDoc() {
  return (
    <span className="badge border-line bg-soft text-muted">
      <FileX2 aria-hidden="true" className="h-3.5 w-3.5" />
      {P.docStatus}
    </span>
  );
}

export function NeedsConfirm() {
  return (
    <span className="badge border-amber-300 bg-amber-50 text-amber-900">
      <CircleAlert aria-hidden="true" className="h-3.5 w-3.5" />
      Требует подтверждения
    </span>
  );
}
