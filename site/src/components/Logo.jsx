import { Link } from 'react-router-dom';
import { org } from '../data/site.js';

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`rounded text-lg font-bold ${light ? 'text-white' : 'text-navy'}`} aria-label={`${org.logo} — на главную`}>
      {org.logo}
    </Link>
  );
}
