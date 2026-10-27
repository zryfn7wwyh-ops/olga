import { useEffect } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Sidebar from './components/Sidebar.jsx';
import InfoTable, { FieldsTable } from './components/InfoTable.jsx';
import DocumentList from './components/DocumentList.jsx';
import TeacherCard from './components/TeacherCard.jsx';
import { blocks } from './data/landing.js';
import { useActiveSection } from './lib/useActiveSection.js';
import { useStickyOffsets } from './lib/useStickyOffsets.js';

const IDS = blocks.map((b) => b.id);

function List({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((t) => (
        <li key={t} className="flex gap-3"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />{t}</li>
      ))}
    </ul>
  );
}

// Официальное уведомление внутри блока.
function Notice({ text }) {
  return (
    <p className="mb-6 flex gap-3 border-l-4 border-accent bg-soft p-4 text-sm text-navy">
      <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
      {text}
    </p>
  );
}

// Содержимое блока по его типу данных.
function BlockBody({ b }) {
  if (b.groups)
    return (
      <div className="grid gap-8 md:grid-cols-2">
        {b.groups.map((g) => (
          <div key={g.title}>
            <h3 className="mb-3 text-lg font-bold">{g.title}</h3>
            {g.text && <p className="text-ink">{g.text}</p>}
            {g.facts && (
              <dl className="mt-4 space-y-1 text-sm">
                {g.facts.map((f) => (
                  <div key={f.label} className="flex flex-wrap gap-x-2"><dt className="font-semibold text-navy">{f.label}:</dt><dd>{f.value}</dd></div>
                ))}
              </dl>
            )}
            {g.items && <List items={g.items} />}
          </div>
        ))}
      </div>
    );
  if (b.id === 'results')
    return (
      <>
        {b.intro && <p className="mb-4 text-muted">{b.intro}</p>}
        <ul className="max-w-4xl space-y-3">
          {b.items.map((t) => (
            <li key={t} className="flex gap-3 border border-line p-4">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              {t}
            </li>
          ))}
        </ul>
      </>
    );
  if (b.teachers) return <div className="space-y-6">{b.teachers.map((t) => <TeacherCard key={t.name} t={t} />)}</div>;
  if (b.columns) return <InfoTable title={b.title} columns={b.columns} rows={b.rows} />;
  if (b.fields) return <FieldsTable rows={b.fields} caption={b.title} />;
  if (b.items) return <DocumentList items={b.items} status={b.status} />;
  return null;
}

const anchorCls = 'scroll-mt-[calc(var(--header-h,93px)+16px)]';

export default function App() {
  useStickyOffsets();
  const active = useActiveSection(IDS);

  // Прямая ссылка вида …/#price открывает нужный блок после отрисовки.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const el = id && document.getElementById(id);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
  }, []);

  const [first, ...rest] = blocks;

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-surface focus:px-4 focus:py-2 focus:ring-2 focus:ring-accent"
      >
        Перейти к содержимому
      </a>
      <Header active={active} />

      <div className="container-x grid flex-1 gap-10 lg:grid-cols-[230px_minmax(0,1fr)]">
        <Sidebar active={active} />
        <main id="main" tabIndex={-1} className="min-w-0 divide-y divide-line focus:outline-none">
          <section id={first.id} aria-labelledby="program-title" className={`py-10 md:py-14 ${anchorCls}`}>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">1. {first.title}</p>
            <h1 id="program-title" className="mt-3 text-2xl font-bold md:text-4xl">{first.programName}</h1>
            <p className="mt-4 max-w-3xl text-lg text-ink">{first.description}</p>
            {first.notice && <div className="mt-6 max-w-3xl"><Notice text={first.notice} /></div>}
          </section>

          {rest.map((b, i) => (
            <section key={b.id} id={b.id} aria-labelledby={`${b.id}-title`} className={`py-10 md:py-12 ${anchorCls}`}>
              <h2 id={`${b.id}-title`} className="mb-6 text-xl font-bold md:text-2xl">
                <span className="mr-2 tabular-nums text-muted">{i + 2}.</span>
                {b.title}
              </h2>
              {b.notice && <Notice text={b.notice} />}
              <BlockBody b={b} />
            </section>
          ))}
        </main>
      </div>

      <Footer />
    </div>
  );
}
