import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/usePageMeta.js';

export default function NotFound({ embedded = false }) {
  usePageMeta({ title: 'Страница не найдена' });
  const H = embedded ? 'h2' : 'h1';
  return (
    <div className={embedded ? '' : 'container-x py-16 md:py-24'}>
      <p className="text-5xl font-bold text-muted">404</p>
      <H className="mt-2 text-2xl font-bold">Страница не найдена</H>
      <p className="mt-2 text-muted">Запрошенная страница не существует или была перемещена.</p>
      <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-6">
        <li><Link to="/" className="link">На главную</Link></li>
        <li><Link to="/sveden" className="link">Сведения об образовательной организации</Link></li>
      </ul>
    </div>
  );
}
