import { programs } from './programs.js';
import { svedenSections } from './sveden.js';

// Перечень публичных маршрутов — используется для sitemap.xml.
export const publicRoutes = [
  '/',
  '/education',
  ...programs.map((p) => `/education/${p.slug}`),
  '/sveden',
  ...svedenSections.map((s) => `/sveden/${s.slug}`),
  '/contacts',
  '/privacy',
  '/consent',
  '/cookies',
];
