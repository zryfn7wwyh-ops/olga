import { useEffect } from 'react';

// Записывает высоту закреплённой шапки (без раскрытого мобильного меню) в --header-h.
export function useStickyOffsets() {
  useEffect(() => {
    const header = document.getElementById('header-bar');
    const update = () => document.documentElement.style.setProperty('--header-h', `${header?.offsetHeight || 0}px`);
    update();
    const ro = new ResizeObserver(update);
    if (header) ro.observe(header);
    return () => ro.disconnect();
  }, []);
}
