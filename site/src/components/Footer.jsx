import { org, privacy } from '../data/site.js';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-soft text-navy">
      <div className="container-x flex flex-col gap-6 py-8 text-sm md:flex-row md:justify-between">
        <div className="space-y-1">
          <p className="font-semibold">{org.logo}</p>
          <p>{org.legal}</p>
        </div>
        <dl className="space-y-1">
          <div className="flex gap-2"><dt className="text-muted">Телефон:</dt><dd>{org.phone}</dd></div>
          <div className="flex gap-2"><dt className="text-muted">E-mail:</dt><dd>{org.email}</dd></div>
        </dl>
        <ul className="space-y-1">
          <li><a href="#sveden" className="link">Сведения об образовательной организации</a></li>
          {privacy.enabled && <li><a href="#privacy" className="link">{privacy.title}</a></li>}
        </ul>
      </div>
    </footer>
  );
}
