import { useEffect, useState } from 'react';
import { storage } from './storage.js';

const KEY = 'kg-a11y';

export function useA11yMode() {
  const [on, setOn] = useState(() => storage.get(KEY) === '1');
  useEffect(() => {
    document.documentElement.classList.toggle('a11y', on);
    storage.set(KEY, on ? '1' : '0');
  }, [on]);
  return [on, () => setOn((v) => !v)];
}
