// Адрес файла из public/. Автономная копия сайта (один HTML-файл) подставляет
// встроенные файлы через window.__ASSETS__ = { 'docs/x.pdf': 'data:…' }.
export const assetUrl = (path) => (typeof window !== 'undefined' && window.__ASSETS__?.[path]) || path;
