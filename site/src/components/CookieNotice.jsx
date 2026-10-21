import { useState } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../lib/storage.js';

const KEY = 'kg-cookie-ok';

export default function CookieNotice() {
  const [show, setShow] = useState(() => storage.get(KEY) !== '1');
  if (!show) return null;
  return (
    <div role="region" aria-label="Уведомление о cookie" className="fixed inset-x-3 bottom-3 z-50 sm:left-auto sm:right-4 sm:max-w-sm">
      <div className="card animate-fade-up p-4 text-sm">
        <p>Сайт использует файлы cookie. Подробнее — в разделе <Link to="/cookies" className="link">«Информация о cookie»</Link>. Текст уведомления будет уточнён.</p>
        <button type="button" className="btn-primary mt-3 w-full py-2" onClick={() => { storage.set(KEY, '1'); setShow(false); }}>Понятно</button>
      </div>
    </div>
  );
}
