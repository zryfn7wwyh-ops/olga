#!/usr/bin/env node
// Командная строка студии. Запуск: node src/cli.js <команда> …  (или npm run <команда> -- …)
import fs from 'node:fs';
import path from 'node:path';
import { p, readJSON, writeJSON, slugify, hasCommand, log, ROOT, loadEnv } from './services/util.js';
import { buildMascotManifest } from './services/asset-manager.js';
import { listVideoTypes, loadVideoType, validateStoryboard } from './services/storyboard.js';
import { renderVoiceSamples } from './services/voice-generator.js';

loadEnv();
const [, , cmd, ...rest] = process.argv;
const flags = {};
const args = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i].startsWith('--')) {
    const k = rest[i].slice(2);
    flags[k] = rest[i + 1] && !rest[i + 1].startsWith('--') ? rest[++i] : true;
  } else args.push(rest[i]);
}

function projectPath(x) {
  if (!x) {
    // последний изменённый проект
    const dirs = fs.readdirSync(p('projects')).filter((d) => fs.existsSync(p('projects', d, 'storyboard.json')));
    if (!dirs.length) throw new Error('Нет проектов в projects/');
    dirs.sort((a, b) => fs.statSync(p('projects', b, 'storyboard.json')).mtimeMs - fs.statSync(p('projects', a, 'storyboard.json')).mtimeMs);
    return p('projects', dirs[0]);
  }
  const d = fs.existsSync(x) ? path.resolve(x) : p('projects', x);
  if (!fs.existsSync(path.join(d, 'storyboard.json'))) throw new Error(`Не найден storyboard.json в ${d}`);
  return d;
}

const commands = {
  async doctor() {
    const ok = (c, m) => console.log(`${c ? '✓' : '✗'} ${m}`);
    ok(hasCommand('ffmpeg'), 'FFmpeg');
    ok(hasCommand('RHVoice-test'), 'RHVoice (локальная озвучка): sudo apt-get install rhvoice rhvoice-russian');
    let pw = false;
    try { const { launchBrowser } = await import('./services/render-service.js'); const b = await launchBrowser(); await b.close(); pw = true; } catch (e) { console.log('  ', e.message.split('\n')[0]); }
    ok(pw, 'Chromium через Playwright: npm install && npx playwright install chromium');
    const m = buildMascotManifest();
    ok(Object.keys(m.poses).length >= 8 && !m.problems.length, `Маскот: ${Object.keys(m.poses).length} поз${m.problems.length ? '; проблемы: ' + m.problems.join('; ') : ''}`);
    console.log('\nОграничения ассетов маскота:');
    m.missing.forEach((x) => console.log('  •', x));
    loadEnv();
    console.log(`\nВнешние TTS: ElevenLabs ${process.env.ELEVENLABS_API_KEY ? 'ключ есть' : 'нет ключа'}, Yandex ${process.env.YANDEX_SPEECHKIT_API_KEY ? 'ключ есть' : 'нет ключа'} (необязательно)`);
  },

  async assets() {
    const m = buildMascotManifest();
    console.log(JSON.stringify({ poses: Object.fromEntries(Object.entries(m.poses).map(([k, v]) => [k, `${v.file} — ${v.emotion}`])), states: m.states, problems: m.problems, missing: m.missing }, null, 2));
  },

  async 'import-mascot'() {
    // npm run import-mascot -- <файл.png|jpg> <id> [--emotion "…"] [--use "…"] [--state greeting] [--scale 1.1]
    const [file, id] = args;
    if (!file || !id || !/^[a-z0-9-]+$/.test(id)) throw new Error('Использование: import-mascot <файл> <id латиницей> [--emotion "…"] [--use "…"] [--state имя-состояния] [--scale 1.0]');
    const posesFile = p('assets', 'mascot', 'poses.json');
    const poses = readJSON(posesFile);
    if (poses.poses[id] && !flags.force) throw new Error(`Поза «${id}» уже есть (используйте --force для замены)`);
    const ext = path.extname(file).toLowerCase();
    fs.mkdirSync(p('assets', 'mascot', 'source'), { recursive: true });
    const srcCopy = p('assets', 'mascot', 'source', `${id}${ext}`);
    fs.copyFileSync(file, srcCopy);
    const out = p('assets', 'mascot', 'original', `${id}.png`);
    const { runSync, ffprobe } = await import('./services/util.js');
    const hasAlpha = ext === '.png' && /a/.test(ffprobe(file).streams[0].pix_fmt || '');
    if (hasAlpha) fs.copyFileSync(file, out);
    else {
      log('Нет прозрачности — вырезаю маскота с фона (tools/cutout.py)…');
      runSync('python3', ['-I', p('tools', 'cutout.py'), file, out, '--preview', p('output', `cutout-preview-${id}.png`)]);
      log(`Проверьте качество вырезки: output/cutout-preview-${id}.png`);
    }
    poses.poses[id] = { file: `${id}.png`, color: 'blue', emotion: flags.emotion || id, use: flags.use || '', source: `source/${id}${ext}`, ...(flags.scale ? { scale: +flags.scale } : {}) };
    if (flags.state) poses.states[flags.state] = id;
    writeJSON(posesFile, poses);
    const m = buildMascotManifest();
    log(`Поза «${id}» добавлена. Всего поз: ${Object.keys(m.poses).length}`);
  },

  types() {
    for (const t of listVideoTypes()) console.log(`${t.id.padEnd(15)} ${t.name} — ${t.when}`);
  },

  new() {
    const topic = args.join(' ').trim();
    if (!topic) throw new Error('Укажите тему: npm run new -- "Тема ролика" [--type explainer] [--duration short]');
    const type = loadVideoType(flags.type || 'explainer');
    const date = new Date().toISOString().slice(0, 10);
    const name = flags.name || `${date}-${slugify(topic)}`;
    const dir = p('projects', name);
    if (fs.existsSync(dir)) throw new Error(`Проект уже существует: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
    const sb = {
      version: 1,
      topic,
      title: topic,
      type: type.id,
      format: flags.format || 'vertical',
      duration: flags.duration || 'short',
      audience: 'Собственники бизнеса, руководители, бухгалтеры, кадровики, юристы, маркетологи, ИП',
      service: 'consulting',
      highlight: [],
      scenes: type.structure.map((s, i) => ({
        role: s.role,
        layout: s.layouts[0],
        transition: s.transition,
        voice: [`TODO: текст диктора для «${s.role}»`],
        title: 'TODO',
        highlight: [],
        mascot: { pose: s.mascot, position: i % 2 ? 'left' : 'right', action: null },
        _hint: s.note || '',
      })),
      legal: { checkedAt: null, actualAt: null, claims: [] },
      publication: { titles: [], description: '', telegram: '', vk: '', youtube: '', hashtags: [] },
    };
    writeJSON(path.join(dir, 'storyboard.json'), sb);
    console.log(path.relative(ROOT, dir));
  },

  validate() {
    const dir = projectPath(args[0]);
    const sb = readJSON(path.join(dir, 'storyboard.json'));
    const { errors, warnings } = validateStoryboard(sb);
    warnings.forEach((w) => console.log('⚠', w));
    errors.forEach((e) => console.log('✗', e));
    if (!errors.length) console.log('✓ storyboard.json корректен');
    process.exitCode = errors.length ? 1 : 0;
  },

  async build() {
    const { build } = await import('./services/pipeline.js');
    const dirs = args.length ? args.map(projectPath) : [projectPath()];
    const scenes = flags.scenes ? String(flags.scenes).split(',').map(Number) : [];
    let failed = 0;
    for (const d of dirs) {
      try {
        const r = await build(d, { scenes, mode: flags.mode });
        if (r.status === 'failed') failed++;
      } catch (e) {
        failed++;
        console.error(`✗ ${path.basename(d)}: ${e.message}`);
      }
    }
    process.exitCode = failed ? 1 : 0;
  },

  async 'build-all'() {
    const dirs = fs.readdirSync(p('projects')).filter((d) => fs.existsSync(p('projects', d, 'storyboard.json')));
    args.splice(0, args.length, ...dirs);
    return commands.build();
  },

  async approve() {
    const dir = projectPath(args[0]);
    writeJSON(path.join(dir, 'approval.json'), { approved: true, approvedBy: flags.by || 'специалист', date: new Date().toISOString(), comment: flags.comment || '' });
    log('Согласование записано, собираю финал (неизменённые сцены берутся из кеша)…');
    const { build } = await import('./services/pipeline.js');
    await build(dir, {});
  },

  async still() {
    const dir = projectPath(args[0]);
    const { prepare } = await import('./services/pipeline.js');
    const { renderStill } = await import('./services/render-service.js');
    const { data } = await prepare(dir);
    const times = (args[1] ? args.slice(1) : data.scenes.map((s) => (s.start + s.duration * 0.8).toFixed(2))).map(Number);
    const outDir = path.join(dir, 'build', 'stills');
    fs.mkdirSync(outDir, { recursive: true });
    for (const t of times) {
      const f = path.join(outDir, `t${t.toFixed(2)}.png`);
      await renderStill(data, Math.min(data.totalFrames - 1, Math.round(t * data.fps)), f);
      console.log(path.relative(ROOT, f));
    }
  },

  async voices() {
    if (flags.provider === 'elevenlabs') {
      const { renderElevenLabsSamples } = await import('./services/voice-generator.js');
      const out = p('output', 'voice-samples', 'elevenlabs');
      const ids = flags.ids ? String(flags.ids).split(',') : undefined;
      const { voices, results } = await renderElevenLabsSamples(out, args.join(' ') || undefined, { ids, limit: +(flags.limit || 8) });
      console.log('Голоса в аккаунте ElevenLabs:');
      voices.forEach((v) => console.log(`  ${v.id}  ${v.name}  [${v.category}] ${Object.values(v.labels).join(', ')}`));
      console.log('\nОбразцы:');
      results.forEach((x) => console.log('  ' + x));
      console.log('\nВыбранный voice_id укажите в config/voice-settings.json → elevenlabs.voiceId и поставьте "provider": "elevenlabs"');
      return;
    }
    const out = p('output', 'voice-samples');
    const list = await renderVoiceSamples(out, args.join(' ') || undefined);
    list.forEach((x) => console.log(x));
    console.log('\nВыберите голос и укажите его в config/voice-settings.json → rhvoice.voice');
  },

  list() {
    const dirs = fs.readdirSync(p('projects')).filter((d) => fs.existsSync(p('projects', d, 'storyboard.json')));
    for (const d of dirs) {
      const r = readJSON(p('projects', d, 'quality-report.json'), null);
      console.log(`${d.padEnd(60)} ${r ? r.status + ' ' + r.duration + ' с' : 'не собран'}`);
    }
  },
};

const fn = commands[cmd];
if (!fn) {
  console.log(`Команды:
  doctor                   проверить окружение и ассеты
  assets                   пересканировать маскота (assets/mascot) и показать позы
  import-mascot <файл> <id> [--emotion …] [--use …] [--state …] [--scale …]   добавить позу маскота (PNG/JPG; фон вырезается)
  types                    типы роликов (шаблоны)
  new "<тема>" [--type T] [--duration short|medium|long] [--format vertical|horizontal|square]
  validate [проект]        проверить storyboard.json
  build [проект…] [--scenes 2,3] [--mode approval]   собрать ролик(и)
  build-all                собрать все проекты
  approve [проект] [--by "ФИО"]                      согласовать и выпустить финал
  still [проект] [секунды…]                          кадры для визуальной проверки
  voices ["текст"]         образцы голосов RHVoice
  voices --provider elevenlabs [--limit 8] [--ids id1,id2] ["текст"]   голоса ElevenLabs из аккаунта и образцы
  list                     список проектов и статусы`);
  process.exit(cmd ? 1 : 0);
}
try {
  await fn();
} catch (e) {
  console.error('✗', e.message);
  process.exitCode = 1;
}
