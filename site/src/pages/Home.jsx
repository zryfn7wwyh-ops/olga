import { Link } from 'react-router-dom';
import { ArrowRight, FileText, UserRound } from 'lucide-react';
import Section from '../components/Section.jsx';
import Accordion from '../components/Accordion.jsx';
import ProgramCard from '../components/ProgramCard.jsx';
import LeadForm from '../components/LeadForm.jsx';
import HeroIllustration from '../components/HeroIllustration.jsx';
import Icon from '../components/Icon.jsx';
import { DocBadge } from '../components/DocStatus.jsx';
import { home } from '../data/home.js';
import { programs } from '../data/programs.js';
import { usePageMeta } from '../lib/usePageMeta.js';

export default function Home() {
  usePageMeta({ title: 'Главная' });
  return (
    <>
      <section aria-labelledby="hero-title" className="relative overflow-hidden bg-navy text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
        <div className="container-x relative grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div className="animate-fade-up">
            <p className="eyebrow !text-sky-300">Образовательный портал · прототип</p>
            <h1 id="hero-title" className="mt-4 text-3xl font-extrabold leading-tight !text-white sm:text-4xl lg:text-5xl">{home.hero.title}</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">{home.hero.text}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/education" className="btn-primary">Выбрать программу <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
              <Link to="/sveden" className="btn-ghost-light">Сведения об организации</Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md lg:max-w-none"><HeroIllustration /></div>
        </div>
      </section>

      <Section id="about" eyebrow="Об образовательном направлении" title={home.about.title}>
        <div className="grid gap-6 text-muted md:grid-cols-2">
          {home.about.paragraphs.map((p, i) => <p key={i} className="leading-relaxed">{p}</p>)}
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {home.about.advantages.map((a) => (
            <li key={a.title} className="card card-hover p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-soft text-accent"><Icon name={a.icon} className="h-6 w-6" /></span>
              <h3 className="mt-4 text-lg font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm text-muted">{a.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="programs" tone="soft" eyebrow="Обучение" title="Образовательные программы">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {programs.slice(0, 3).map((p) => <li key={p.slug}><ProgramCard program={p} /></li>)}
        </ul>
        <Link to="/education" className="btn-secondary mt-8">Все программы <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
      </Section>

      <Section id="audience" eyebrow="Для кого" title="Кому подходит обучение">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {home.audience.map((a) => (
            <li key={a.title} className="card card-hover p-6">
              <Icon name={a.icon} className="h-8 w-8 text-accent" />
              <h3 className="mt-4 font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm text-muted">{a.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="steps" tone="soft" eyebrow="Порядок" title="Как проходит обучение">
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {home.steps.map((s, i) => (
            <li key={s.title} className="relative rounded-xl2 bg-surface p-6 shadow-card">
              <span className="text-4xl font-extrabold text-accent/25">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="teachers" eyebrow="Команда" title="Преподаватели">
        <ul className="grid gap-5 md:grid-cols-3">
          {home.teachers.map((t, i) => (
            <li key={i} className="card p-6 text-center">
              <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-soft text-accent/60">
                <UserRound aria-hidden="true" className="h-12 w-12" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{t.name}</h3>
              <p className="text-sm font-medium text-accent">{t.position}</p>
              <p className="mt-3 text-sm text-muted">{t.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="documents" tone="soft" eyebrow="Официальная информация" title="Документы и лицензия">
        <ul className="grid gap-4 md:grid-cols-2">
          {home.documents.map((d) => (
            <li key={d.title} className="card flex flex-col gap-3 p-5 xl:flex-row xl:items-center xl:justify-between">
              <span className="flex items-start gap-3">
                <FileText aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>
                  <span className="block font-medium">{d.title}</span>
                  <Link to={d.to} className="link text-sm">Перейти к официальным сведениям</Link>
                </span>
              </span>
              <DocBadge />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq" eyebrow="FAQ" title="Вопросы и ответы">
        <div className="max-w-3xl">
          <Accordion items={home.faq.map((f) => ({ title: f.q, content: <p className="text-sm leading-relaxed">{f.a}</p> }))} />
        </div>
      </Section>

      <Section id="lead" tone="soft">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="eyebrow">Заявка</p>
            <h2 id="lead-title" className="mt-3 text-2xl font-bold md:text-3xl">Оставьте заявку на обучение</h2>
            <p className="mt-4 text-muted">Демонстрационный текст: после утверждения здесь будет описан порядок обработки заявок и сроки ответа.</p>
          </div>
          <div className="card p-6 md:p-8"><LeadForm /></div>
        </div>
      </Section>
    </>
  );
}
