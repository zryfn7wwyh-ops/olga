import { org } from '../data/site.js';

export default function Logo() {
  return (
    <a href="#top" className="rounded text-lg font-bold text-navy" aria-label={`${org.logo} — в начало страницы`}>
      {org.logo}
    </a>
  );
}
