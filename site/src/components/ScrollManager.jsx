import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Прокрутка вверх при переходе; state.scrollTo — к якорю (работает с любым роутером).
export default function ScrollManager() {
  const location = useLocation();
  useEffect(() => {
    const target = location.state?.scrollTo;
    if (target) {
      requestAnimationFrame(() => {
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ block: 'start' });
          el.querySelector('input, select, textarea')?.focus({ preventScroll: true });
        }
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.key]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
