import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, UserRound } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Accordion from '../components/Accordion.jsx';
import Modal from '../components/Modal.jsx';
import LeadForm from '../components/LeadForm.jsx';
import { DocRow } from '../components/DocStatus.jsx';
import NotFound from './NotFound.jsx';
import { getProgram } from '../data/programs.js';
import { usePageMeta } from '../lib/usePageMeta.js';

function Block({ title, children }) {
  return (
    <section className="border-t border-line pt-8">
      <h2 className="mb-4 text-xl font-bold md:text-2xl">{title}</h2>
      {children}
    </section>
  );
}

export default function Course() {
  const { slug } = useParams();
  const program = getProgram(slug);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  usePageMeta({ title: program?.title || 'Страница не найдена' });
  if (!program) return <NotFound />;

  const facts = [
    ['Длительность', program.duration],
    ['Форма обучения', program.form],
    ['Образовательные технологии', program.technologies],
    ['Язык обучения', program.language],
    ['Аттестация', program.attestation],
    ['Итоговый документ', program.finalDocument],
  ];

  return (
    <>
      <PageHeader
        title={program.title}
        intro={program.description}
        crumbs={[{ label: 'Главная', to: '/' }, { label: 'Обучение', to: '/education' }, { label: program.title }]}
      >
        <button type="button" onClick={() => setOpen(true)} className="btn-primary mt-8">Подать заявку</button>
      </PageHeader>

      <div className="container-x grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          <Block title="Целевая аудитория">
            <ul className="space-y-2">
              {program.audience.map((a) => <li key={a} className="flex gap-3"><CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />{a}</li>)}
            </ul>
          </Block>
          <Block title="Цель программы"><p className="prose-text">{program.goal}</p></Block>
          <Block title="Результаты обучения">
            <ul className="grid gap-3 sm:grid-cols-2">
              {program.results.map((r) => <li key={r} className="rounded-xl2 bg-soft p-4 text-sm">{r}</li>)}
            </ul>
          </Block>
          <Block title="Содержание программы">
            <Accordion
              items={program.modules.map((m) => ({
                title: m.title,
                meta: m.hours,
                content: (
                  <>
                    <p className="mb-2 text-sm text-muted sm:hidden">Объём: {m.hours}</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm">{m.topics.map((t) => <li key={t}>{t}</li>)}</ul>
                  </>
                ),
              }))}
            />
          </Block>
          <Block title="Документы программы">
            <ul className="divide-y divide-line rounded-xl2 border border-line px-4 md:px-5">
              {program.documents.map((d) => <DocRow key={d.title} {...d} />)}
            </ul>
          </Block>
          <Block title="Преподаватели">
            <ul className="grid gap-4 sm:grid-cols-2">
              {program.teachers.map((t, i) => (
                <li key={i} className="card flex items-center gap-4 p-5">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-soft text-accent/60"><UserRound aria-hidden="true" className="h-7 w-7" /></span>
                  <span><span className="block font-semibold text-navy">{t.name}</span><span className="text-sm text-muted">{t.position}</span></span>
                </li>
              ))}
            </ul>
          </Block>
          <Block title="Условия зачисления"><p className="prose-text">{program.admission}</p></Block>
        </div>

        <aside aria-label="Ключевые параметры программы" className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="text-lg font-bold">Параметры программы</h2>
            <dl className="mt-4 divide-y divide-line text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5 py-3">
                  <dt className="text-muted">{k}</dt><dd className="font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-2 rounded-xl bg-soft p-4">
              <p className="text-sm text-muted">Стоимость</p>
              <p className="text-lg font-bold text-navy">{program.price}</p>
            </div>
            <button type="button" onClick={() => setOpen(true)} className="btn-primary mt-5 w-full">Подать заявку</button>
            <Link to="/sveden/paid_edu" className="link mt-3 block text-center text-sm">Платные образовательные услуги</Link>
          </div>
        </aside>
      </div>

      <Modal open={open} onClose={close} title={`Заявка: ${program.title}`}>
        <LeadForm program={program.slug} compact />
      </Modal>
    </>
  );
}
