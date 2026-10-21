import { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import ProgramCard from '../components/ProgramCard.jsx';
import { formats, programs } from '../data/programs.js';
import { P } from '../data/placeholders.js';
import { usePageMeta } from '../lib/usePageMeta.js';

const ALL = 'Все форматы';

export default function Education() {
  usePageMeta({ title: 'Образовательные программы' });
  const [format, setFormat] = useState(ALL);
  const list = format === ALL ? programs : programs.filter((p) => p.format === format);

  return (
    <>
      <PageHeader title="Образовательные программы" intro={P.text} crumbs={[{ label: 'Главная', to: '/' }, { label: 'Обучение' }]} />
      <div className="container-x py-12 md:py-16">
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-navy">Формат обучения</legend>
          <div className="flex flex-wrap gap-2">
            {[ALL, ...formats].map((f) => (
              <label key={f} className="cursor-pointer">
                <input type="radio" name="format" value={f} checked={format === f} onChange={() => setFormat(f)} className="peer sr-only" />
                <span className="inline-block rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-accent hover:text-accent peer-checked:border-accent peer-checked:bg-accent peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2">
                  {f}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">Значения формата демонстрационные и будут уточнены.</p>
        </fieldset>

        <p className="mt-8 text-sm text-muted" aria-live="polite">Найдено программ: {list.length}</p>
        <ul className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <li key={p.slug}><ProgramCard program={p} showFormat /></li>)}
        </ul>
      </div>
    </>
  );
}
