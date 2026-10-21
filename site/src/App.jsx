import { useEffect } from 'react';
import { ArrowDown, Scale } from 'lucide-react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Sidebar from './components/Sidebar.jsx';
import SvedenContent from './components/SvedenContent.jsx';
import Accordion from './components/Accordion.jsx';
import { FieldsTable } from './components/InfoTable.jsx';
import { home, privacy } from './data/site.js';
import { svedenMeta, svedenSections } from './data/sveden.js';
import { P } from './data/placeholders.js';
import { useActiveSection } from './lib/useActiveSection.js';
import { useStickyOffsets } from './lib/useStickyOffsets.js';

const SECTION_IDS = svedenSections.map((s) => s.slug);
// Контакты дублируются из подраздела «Основные сведения» — единый источник данных.
const CONTACT_PROPS = ['fullName', 'address', 'addressPlace', 'workTime', 'telephone', 'email'];
const contactRows = svedenSections[0].blocks[0].rows.filter((r) => CONTACT_PROPS.includes(r.prop));

const anchorCls = 'scroll-mt-[calc(var(--sticky-h,120px)+16px)]';

export default function App() {
  useStickyOffsets();
  const active = useActiveSection(SECTION_IDS);

  // Прямая ссылка вида …#common открывает нужный подраздел после отрисовки.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const el = id && document.getElementById(id);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
  }, []);

  return (
    <div id="top" className="flex min-h-screen flex-col">
      <a
        href="#main"
        onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-surface focus:px-4 focus:py-2 focus:ring-2 focus:ring-accent"
      >
        Перейти к содержимому
      </a>
      <Header />

      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <div className="container-x py-10 md:py-14">
          <h1 className="max-w-3xl text-2xl font-bold md:text-4xl">{home.title}</h1>
          <p className="mt-4 max-w-3xl text-muted">{home.text}</p>
          <a
            href="#sveden"
            className="mt-8 flex items-center justify-between gap-4 border-2 border-navy px-5 py-5 text-lg font-bold text-navy transition hover:bg-navy hover:text-white md:text-xl"
          >
            {svedenMeta.title}
            <ArrowDown aria-hidden="true" className="h-6 w-6 shrink-0" />
          </a>
        </div>

        <section id="sveden" aria-labelledby="sveden-title" className={`border-t border-line ${anchorCls}`}>
          <div className="container-x py-10 md:py-12">
            <h2 id="sveden-title" className="text-2xl font-bold md:text-3xl">{svedenMeta.title}</h2>
            <p className="mt-4 flex max-w-4xl gap-3 border-l-4 border-accent bg-soft p-4 text-sm text-navy">
              <Scale aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              {svedenMeta.disclaimer}
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
              <Sidebar active={active} />
              <div className="min-w-0 space-y-14">
                {svedenSections.map((s, i) => (
                  <section key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-title`} className={anchorCls}>
                    <h2 id={`${s.slug}-title`} className="mb-5 border-b-2 border-navy pb-2 text-xl font-bold md:text-2xl">
                      <span className="mr-2 tabular-nums text-muted">{i + 1}.</span>
                      {s.title}
                    </h2>
                    <SvedenContent blocks={s.blocks} />
                  </section>
                ))}
                <p className="border-t border-line pt-3 text-xs text-muted">Дата последнего обновления сведений: {svedenMeta.updatedAt}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contacts" aria-labelledby="contacts-title" className={`border-t border-line bg-soft/50 ${anchorCls}`}>
          <div className="container-x py-10 md:py-12">
            <h2 id="contacts-title" className="text-2xl font-bold md:text-3xl">Контактная информация</h2>
            <div className="mt-6 max-w-4xl bg-surface">
              <FieldsTable rows={contactRows} caption="Контактная информация" />
            </div>
            <p className="mt-3 text-sm text-muted">Сведения приведены по подразделу <a href="#common" className="link">«Основные сведения»</a>.</p>
          </div>
        </section>

        {privacy.enabled && (
          <section id="privacy" aria-labelledby="privacy-title" className={`border-t border-line ${anchorCls}`}>
            <div className="container-x max-w-4xl py-10 md:py-12">
              <h2 id="privacy-title" className="text-2xl font-bold md:text-3xl">{privacy.title}</h2>
              <p className="mt-3 text-sm text-muted">{P.doc} Редакция от: {P.date}</p>
              <div className="mt-6">
                <Accordion items={privacy.sections.map((t, i) => ({ title: `${i + 1}. ${t}`, content: <p>{P.text}</p> }))} />
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
