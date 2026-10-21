import { svedenSections } from './sveden.js';

// Перечень публичных маршрутов — используется для sitemap.xml.
export const publicRoutes = ['/', '/sveden', ...svedenSections.map((s) => `/sveden/${s.slug}`), '/contacts', '/privacy'];
