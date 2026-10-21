import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { home } from '../data/site.js';
import { svedenMeta, svedenSections } from '../data/sveden.js';
import { usePageMeta } from '../lib/usePageMeta.js';

// Главная — только навигация по официальным сведениям.
export default function Home() {
  usePageMeta({ title: 'Главная' });
  return (
    <div className="container-x py-10 md:py-14">
      <h1 className="max-w-3xl text-2xl font-bold md:text-4xl">{home.title}</h1>
      <p className="mt-4 max-w-3xl text-muted">{home.text}</p>

      <Link
        to="/sveden"
        className="mt-8 flex items-center justify-between gap-4 border-2 border-navy px-5 py-5 text-lg font-bold text-navy transition hover:bg-navy hover:text-white md:text-xl"
      >
        {svedenMeta.title}
        <ArrowRight aria-hidden="true" className="h-6 w-6 shrink-0" />
      </Link>

      <section aria-labelledby="sections-title" className="mt-10">
        <h2 id="sections-title" className="text-lg font-bold md:text-xl">Подразделы официальных сведений</h2>
        <ol className="mt-4 grid border-t border-line md:grid-cols-2 md:gap-x-10">
          {svedenSections.map((s, i) => (
            <li key={s.slug} className="border-b border-line">
              <Link to={`/sveden/${s.slug}`} className="flex gap-3 py-3 text-navy hover:text-accent hover:underline">
                <span className="w-6 shrink-0 text-right tabular-nums text-muted">{i + 1}.</span>
                <span>{s.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
