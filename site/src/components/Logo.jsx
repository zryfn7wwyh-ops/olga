import { Link } from 'react-router-dom';
import { org } from '../data/site.js';

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5 rounded-lg" aria-label={`${org.logo} — на главную`}>
      <span className={`grid h-9 w-9 place-items-center rounded-lg ${light ? 'bg-white text-navy' : 'bg-navy text-white'}`}>
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
          <path d="M9 6v20M9 16l11-10M9 16l11 10" stroke="currentColor" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={`text-lg font-extrabold tracking-wide ${light ? 'text-white' : 'text-navy'}`}>{org.logo}</span>
    </Link>
  );
}
