import { useEffect } from 'react';

/*
 * Записывает высоту закреплённой шапки в CSS-переменные:
 *   --header-h — высота шапки (к ней прилипает мобильное оглавление);
 *   --sticky-h — шапка + мобильное оглавление (отступ для якорей).
 */
export function useStickyOffsets() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector('header');
    const toc = document.getElementById('sveden-toc-bar');
    const update = () => {
      const h = header?.offsetHeight || 0;
      const t = toc && getComputedStyle(toc).display !== 'none' ? toc.offsetHeight : 0;
      root.style.setProperty('--header-h', `${h}px`);
      root.style.setProperty('--sticky-h', `${h + t}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    [header, toc].forEach((el) => el && ro.observe(el));
    window.addEventListener('resize', update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, []);
}
