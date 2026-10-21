import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MonitorSmartphone } from 'lucide-react';
import { P } from '../data/placeholders.js';

export default function ProgramCard({ program, showFormat = false }) {
  return (
    <article className="card card-hover group relative flex h-full flex-col p-6 focus-within:ring-2 focus-within:ring-accent">
      <div aria-hidden="true" className="mb-5 h-1.5 w-12 rounded-full bg-accent" />
      <h3 className="text-lg font-bold">
        <Link to={`/education/${program.slug}`} className="after:absolute after:inset-0 focus-visible:ring-0">{program.title}</Link>
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{program.short}</p>
      <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex items-center gap-2">
          <Clock aria-hidden="true" className="h-4 w-4 text-accent" />
          <dt className="sr-only">Объём</dt><dd>{program.hours}</dd>
        </div>
        <div className="flex items-center gap-2">
          <MonitorSmartphone aria-hidden="true" className="h-4 w-4 text-accent" />
          <dt className="sr-only">Формат обучения</dt>
          <dd>{showFormat ? program.format : P.format}</dd>
        </div>
      </dl>
      <span aria-hidden="true" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        Подробнее <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </article>
  );
}
