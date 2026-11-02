import { useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Sidebar from './components/Sidebar.jsx';
import BlockParts from './components/BlockParts.jsx';
import { PROGRAM_NAME, blocks, groupStartingAt } from './data/landing.js';
import { useActiveSection } from './lib/useActiveSection.js';
import { useStickyOffsets } from './lib/useStickyOffsets.js';

const IDS = blocks.map((b) => b.id);
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

      <div className="container-x grid flex-1 gap-10 lg:grid-cols-[250px_minmax(0,1fr)]">
        <Sidebar active={active} />
        <main id="main" tabIndex={-1} className="min-w-0 focus:outline-none">
          {blocks.map((b, i) => {
            const group = groupStartingAt(b.id);
            const first = i === 0;
            return (
              <div key={b.id}>
                {group && !first && (
                  <p className="mt-6 border-y-2 border-navy bg-soft px-4 py-3 text-sm font-bold uppercase tracking-wider text-navy">{group.title}</p>
                )}
                <section id={b.id} aria-labelledby={`${b.id}-title`} className={`${first ? 'py-10 md:py-14' : 'border-t border-line py-10 md:py-12'} ${anchorCls}`}>
                  {first ? (
                    <>
                      <p className="text-sm font-semibold uppercase tracking-wider text-accent">1. {b.title}</p>
                      <h1 id={`${b.id}-title`} className="mb-5 mt-3 text-2xl font-bold md:text-4xl">{PROGRAM_NAME}</h1>
                    </>
                  ) : (
                    <h2 id={`${b.id}-title`} className="mb-6 text-xl font-bold md:text-2xl">
                      <span className="mr-2 tabular-nums text-muted">{i + 1}.</span>
                      {b.title}
                    </h2>
                  )}
                  <BlockParts parts={b.parts} caption={b.title} />
                </section>
              </div>
            );
          })}
        </main>
      </div>

      <Footer />
    </div>
  );
}
