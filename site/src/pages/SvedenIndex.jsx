import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { svedenMeta, svedenSections } from '../data/sveden.js';
import { usePageMeta } from '../lib/usePageMeta.js';

export default function SvedenIndex() {
  usePageMeta({ title: svedenMeta.title });
  return (
    <>
      <p className="flex gap-3 border-l-4 border-accent bg-soft p-4 text-sm text-navy">
        <Scale aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        {svedenMeta.disclaimer}
      </p>
      <h2 className="mt-8 text-lg font-bold">Оглавление</h2>
      <ol className="mt-3 border-t border-line">
        {svedenSections.map((s, i) => (
          <li key={s.slug} className="border-b border-line">
            <Link to={`/sveden/${s.slug}`} className="flex gap-3 py-3 text-navy hover:text-accent hover:underline">
              <span className="w-6 shrink-0 text-right tabular-nums text-muted">{i + 1}.</span>
              <span>{s.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
