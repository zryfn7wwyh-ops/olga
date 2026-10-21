import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/usePageMeta.js';

export default function NotFound({ embedded = false }) {
  usePageMeta({ title: 'Страница не найдена' });
  return (
    <div className={embedded ? 'py-6' : 'container-x py-20 text-center md:py-28'}>
      <p className="text-7xl font-extrabold text-accent/25">404</p>
      {embedded ? <h2 className="mt-2 text-2xl font-bold">Страница не найдена</h2> : <h1 className="mt-2 text-3xl font-bold">Страница не найдена</h1>}
      <p className="mt-3 text-muted">Запрошенная страница не существует или была перемещена.</p>
      <div className={`mt-8 flex flex-col gap-3 sm:flex-row ${embedded ? '' : 'justify-center'}`}>
        <Link to="/" className="btn-primary">На главную</Link>
        <Link to="/sveden" className="btn-secondary">Сведения об организации</Link>
      </div>
    </div>
  );
}
