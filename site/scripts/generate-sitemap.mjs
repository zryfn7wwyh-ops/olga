// Генерирует public/sitemap.xml из конфигурации маршрутов.
// Домен задаётся переменной SITE_URL (до публикации — заглушка).
import { writeFileSync } from 'node:fs';
import { publicRoutes } from '../src/data/routes.js';

const base = (process.env.SITE_URL || 'https://example.com').replace(/\/$/, '');
const urls = publicRoutes.map((r) => `  <url><loc>${base}${r}</loc></url>`).join('\n');
writeFileSync(
  new URL('../public/sitemap.xml', import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(`sitemap.xml: ${publicRoutes.length} URL`);
