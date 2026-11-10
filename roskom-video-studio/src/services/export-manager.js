// export-manager — файлы проекта: script.md, sources.md, publication.md, копия финала в output/.
import fs from 'node:fs';
import path from 'node:path';
import { p, ensureDir } from './util.js';
import { loadBrand } from './asset-manager.js';

const phraseText = (v) => (typeof v === 'string' ? v : v.text);

export function writeScriptIfMissing(dir, sb) {
  const f = path.join(dir, 'script.md');
  if (fs.existsSync(f)) return;
  const lines = [`# ${sb.title}`, '', `Тема: ${sb.topic}`, `Тип: ${sb.type}`, `Аудитория: ${sb.audience || '—'}`, ''];
  sb.scenes.forEach((s, i) => {
    lines.push(`## ${i + 1}. ${s.role || s.layout}${s.timing ? ` (${s.timing.start}–${s.timing.end} с)` : ''}`, '', ...s.voice.map((v) => `> ${phraseText(v)}`), '');
  });
  fs.writeFileSync(f, lines.join('\n'));
}

export function writeSourcesIfMissing(dir, sb) {
  const f = path.join(dir, 'sources.md');
  if (fs.existsSync(f) || !sb.legal) return;
  const L = sb.legal;
  const lines = [`# Источники: ${sb.title}`, '', `Дата проверки: ${L.checkedAt || '—'}`, `Актуальность информации: ${L.actualAt || L.checkedAt || '—'}`, ''];
  for (const c of L.claims || []) {
    lines.push(`- **${c.text}** — ${c.status}${c.usedInVideo === false ? ' (в ролик не включено)' : ''}`);
    for (const s of c.sources || []) lines.push(`  - ${s.title || ''} ${s.url}`);
  }
  fs.writeFileSync(f, lines.join('\n') + '\n');
}

export function writePublication(dir, sb) {
  const brand = loadBrand();
  const pub = sb.publication || {};
  const svc = brand.services[sb.service] || brand.services.consulting;
  const titles = pub.titles || [sb.title];
  const tags = (pub.hashtags || ['#персональныеданные', '#152ФЗ', '#РоскомОнлайн']).join(' ');
  const md = `# Материалы для публикации

> Публикация не выполняется автоматически. Разместите вручную или дайте отдельное разрешение.

**Ролик:** final.mp4 · **Обложка:** cover.png · **Субтитры:** captions.srt

## Варианты заголовка
${titles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

## Краткое описание
${pub.description || sb.topic}

## Telegram
${pub.telegram || pub.description || ''}

${tags}

## VK Клипы
${pub.vk || pub.description || ''}

${tags}

## YouTube Shorts
**Заголовок:** ${pub.youtubeTitle || titles[0]}

${pub.youtube || pub.description || ''}

${tags}

## Хештеги
${tags}

## Ссылка на услугу
${svc.title}: ${svc.url}
`;
  fs.writeFileSync(path.join(dir, 'publication.md'), md);
}

export function exportToOutput(dir) {
  const out = ensureDir(p('output'));
  const name = path.basename(dir);
  fs.copyFileSync(path.join(dir, 'final.mp4'), path.join(out, `${name}.mp4`));
  fs.copyFileSync(path.join(dir, 'cover.png'), path.join(out, `${name}.png`));
}
