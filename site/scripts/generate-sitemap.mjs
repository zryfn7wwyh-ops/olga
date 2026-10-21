// Генерирует public/sitemap.xml и public/robots.txt из конфигурации маршрутов.
// SITE_URL — домен (до согласования — заглушка); SITE_INDEXABLE=1 открывает индексацию.
import { writeFileSync } from 'node:fs';
import { publicRoutes } from '../src/data/routes.js';

const base = (process.env.SITE_URL || 'https://example.com').replace(/\/$/, '');
const indexable = process.env.SITE_INDEXABLE === '1';
const out = (name, text) => writeFileSync(new URL(`../public/${name}`, import.meta.url), text);

const urls = publicRoutes.map((r) => `  <url><loc>${base}${r}</loc></url>`).join('\n');
out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
out('robots.txt', indexable ? `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n` : `# Прототип: индексация закрыта до публикации (SITE_INDEXABLE=1 открывает).\nUser-agent: *\nDisallow: /\n`);
console.log(`sitemap.xml: ${publicRoutes.length} URL; robots.txt: ${indexable ? 'открыт' : 'закрыт'}`);
