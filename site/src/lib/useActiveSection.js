import { useEffect, useState } from 'react';

// Подсвечивает в оглавлении подраздел, заголовок которого последним прошёл под закреплённой шапкой.
export function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 93) + 32;
      let current = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // У конца страницы короткие последние блоки не доходят до линии: берём блок из якоря,
      // если он виден, иначе последний.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        const hash = decodeURIComponent(window.location.hash.slice(1));
        const top = ids.includes(hash) ? document.getElementById(hash).getBoundingClientRect().top : -1;
        current = top >= 0 && top < window.innerHeight ? hash : ids[ids.length - 1];
      }
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hashchange', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ids]);
  return active;
}
