import { useEffect } from 'react';
import { seo } from '../data/site.js';

export function usePageMeta({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} — ${seo.siteName}` : seo.siteName;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description || seo.defaultDescription;
  }, [title, description]);
}
