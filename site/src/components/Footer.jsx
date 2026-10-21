import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import Logo from './Logo.jsx';
import { footerNav, org } from '../data/site.js';

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_1.2fr]">
        <div>
          <Logo light />
          <p className="mt-4 font-semibold text-white">{org.legalName}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li className="flex gap-2.5"><MapPin aria-hidden="true" className="h-4 w-4 shrink-0 translate-y-0.5" />{org.address}</li>
            <li className="flex gap-2.5"><Phone aria-hidden="true" className="h-4 w-4 shrink-0 translate-y-0.5" />{org.phone}</li>
            <li className="flex gap-2.5"><Mail aria-hidden="true" className="h-4 w-4 shrink-0 translate-y-0.5" />{org.email}</li>
          </ul>
        </div>
        {footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-sm font-semibold uppercase tracking-wider !text-white">{group.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {group.links.map((l) => (
                <li key={l.to}><Link to={l.to} className="rounded hover:text-white hover:underline">{l.label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-white/60 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} {org.legalName}. Прототип сайта, содержимое является демонстрационным.</p>
          <p>Сведения будут проверены юристами до публикации.</p>
        </div>
      </div>
    </footer>
  );
}
