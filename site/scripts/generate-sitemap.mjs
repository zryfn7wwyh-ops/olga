// Генерирует public/sitemap.xml и public/robots.txt.
// SITE_URL — домен (до согласования — заглушка); SITE_INDEXABLE=1 открывает индексацию.
import { writeFileSync } from 'node:fs';

const base = (process.env.SITE_URL || 'https://example.com').replace(/\/$/, '');
const indexable = process.env.SITE_INDEXABLE === '1';
const out = (name, text) => writeFileSync(new URL(`../public/${name}`, import.meta.url), text);

// Одностраничный сайт: в sitemap одна страница, подразделы доступны по якорям (#common и т. д.).
out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}/</loc></url>\n</urlset>\n`);
out('robots.txt', indexable ? `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n` : `# Прототип: индексация закрыта до публикации (SITE_INDEXABLE=1 открывает).\nUser-agent: *\nDisallow: /\n`);
console.log(`robots.txt: ${indexable ? 'открыт' : 'закрыт'}`);
