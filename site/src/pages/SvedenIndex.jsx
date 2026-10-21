import { Link } from 'react-router-dom';
import { ChevronRight, Info } from 'lucide-react';
import { svedenMeta, svedenSections } from '../data/sveden.js';
import { usePageMeta } from '../lib/usePageMeta.js';

export default function SvedenIndex() {
  usePageMeta({ title: svedenMeta.title });
  return (
    <>
      <p className="flex gap-3 rounded-xl2 border border-accent/30 bg-soft p-4 text-sm">
        <Info aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
        {svedenMeta.intro}
      </p>
      <ol className="mt-8 grid gap-3 md:grid-cols-2">
        {svedenSections.map((s, i) => (
          <li key={s.slug}>
            <Link to={`/sveden/${s.slug}`} className="group flex h-full items-center gap-4 rounded-xl2 border border-line bg-surface p-4 transition hover:border-accent hover:bg-soft">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-soft text-sm font-bold text-accent group-hover:bg-surface">{i + 1}</span>
              <span className="flex-1 font-medium text-navy">{s.title}</span>
              <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 text-muted group-hover:text-accent" />
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
