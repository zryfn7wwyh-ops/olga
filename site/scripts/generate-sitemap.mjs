// Генерирует public/robots.txt и (если задан SITE_URL) public/sitemap.xml.
// SITE_URL — адрес сайта, например https://example.ru; SITE_INDEXABLE=0 закрывает индексацию.
import { existsSync, rmSync, writeFileSync } from 'node:fs';

const base = (process.env.SITE_URL || '').replace(/\/$/, '');
const indexable = process.env.SITE_INDEXABLE !== '0';
const file = (name) => new URL(`../public/${name}`, import.meta.url);

// Одностраничный сайт: в sitemap одна страница, блоки доступны по якорям (#program и т. д.).
if (base) {
  writeFileSync(file('sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}/</loc></url>\n</urlset>\n`);
} else if (existsSync(file('sitemap.xml'))) {
  rmSync(file('sitemap.xml'));
}

const robots = indexable
  ? `User-agent: *\nAllow: /\n${base ? `Sitemap: ${base}/sitemap.xml\n` : ''}`
  : `User-agent: *\nDisallow: /\n`;
writeFileSync(file('robots.txt'), robots);
console.log(`robots.txt: индексация ${indexable ? 'открыта' : 'закрыта'}; sitemap.xml: ${base ? base : 'не создан (SITE_URL не задан)'}`);
