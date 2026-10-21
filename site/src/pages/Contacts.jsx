import { Clock, Mail, MapPin, MapPinned, Phone, Building2 } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import DemoForm from '../components/DemoForm.jsx';
import { contactsPage, org } from '../data/site.js';
import { usePageMeta } from '../lib/usePageMeta.js';

const fields = [
  { name: 'name', label: 'Имя', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Электронная почта', type: 'email', autoComplete: 'email' },
  { name: 'message', label: 'Сообщение', type: 'textarea' },
];

export default function Contacts() {
  usePageMeta({ title: contactsPage.title });
  const items = [
    { icon: Building2, label: 'Организация', value: org.name },
    { icon: MapPin, label: 'Адрес', value: org.address },
    { icon: Phone, label: 'Телефон', value: org.phone },
    { icon: Mail, label: 'E-mail', value: org.email },
    { icon: Clock, label: 'График работы', value: org.schedule },
  ];
  return (
    <>
      <PageHeader title={contactsPage.title} intro={contactsPage.intro} crumbs={[{ label: 'Главная', to: '/' }, { label: 'Контакты' }]} />
      <div className="container-x grid gap-8 py-12 md:py-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <address className="card not-italic">
            <ul className="divide-y divide-line">
              {items.map(({ icon: I, label, value }) => (
                <li key={label} className="flex items-start gap-4 p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-soft text-accent"><I aria-hidden="true" className="h-5 w-5" /></span>
                  <span><span className="block text-sm text-muted">{label}</span><span className="font-medium text-ink">{value}</span></span>
                </li>
              ))}
            </ul>
          </address>
          <div role="img" aria-label="Место для карты" className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-xl2 border border-line bg-soft">
            <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-accent/15" preserveAspectRatio="none" viewBox="0 0 400 300">
              <path d="M0 80h400M0 190h400M120 0v300M290 0v300M0 260 400 30" stroke="currentColor" strokeWidth="14" fill="none" />
            </svg>
            <div className="relative text-center">
              <MapPinned aria-hidden="true" className="mx-auto h-10 w-10 text-accent" />
              <p className="mt-2 font-semibold text-navy">Здесь будет карта</p>
            </div>
          </div>
        </div>
        <section aria-labelledby="feedback-title" className="card p-6 md:p-8">
          <h2 id="feedback-title" className="text-2xl font-bold">Обратная связь</h2>
          <p className="mb-6 mt-2 text-sm text-muted">Демонстрационная форма: сообщения не отправляются.</p>
          <DemoForm fields={fields} submitLabel="Отправить сообщение" successText="Это демонстрационный режим: сообщение никуда не отправлено." />
        </section>
      </div>
    </>
  );
}
