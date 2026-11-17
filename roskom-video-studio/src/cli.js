#!/usr/bin/env node
// Командная строка студии. Запуск: node src/cli.js <команда> …  (или npm run <команда> -- …)
import fs from 'node:fs';
import path from 'node:path';
import { p, readJSON, writeJSON, slugify, hasCommand, log, ROOT, loadEnv } from './services/util.js';
import { buildMascotManifest } from './services/asset-manager.js';
import { listVideoTypes, loadVideoType, validateStoryboard } from './services/storyboard.js';
import { renderVoiceSamples } from './services/voice-generator.js';
import { createProject, loadProject, checkScript, submitScript, approveScript, renderScript, loadVersion, storyboardFromApproved, migrateLegacy } from './services/script-manager.js';

function assertApprovedOnly(dir) {
  const pr = loadProject(dir);
  if (!pr?.approvedVersion || pr.currentVersion !== pr.approvedVersion) throw new Error(`Сценарий не утверждён (статус ${pr?.status ?? 'нет project.json'}) — раскадровка и производство запрещены`);
}

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
  const isProj = (d) => fs.existsSync(path.join(d, 'project.json')) || fs.existsSync(path.join(d, 'storyboard.json'));
  if (!x) {
    // последний изменённый проект
    const dirs = fs.readdirSync(p('projects')).map((d) => p('projects', d)).filter(isProj);
    if (!dirs.length) throw new Error('Нет проектов в projects/');
    const mt = (d) => Math.max(...['project.json', 'storyboard.json'].map((f) => (fs.existsSync(path.join(d, f)) ? fs.statSync(path.join(d, f)).mtimeMs : 0)));
    dirs.sort((a, b) => mt(b) - mt(a));
    return dirs[0];
  }
  const d = fs.existsSync(x) ? path.resolve(x) : p('projects', x);
  if (!isProj(d)) throw new Error(`Не найден проект ${x} (нет project.json / storyboard.json)`);
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
    // Этап 1: создаётся проект в статусе DRAFT. Раскадровки нет — она появится только после утверждения сценария.
    const topic = args.join(' ').trim();
    if (!topic) throw new Error('Укажите тему: npm run new -- "Тема ролика" [--type explainer] [--duration short|medium|long]');
    const type = loadVideoType(flags.type || 'explainer');
    const date = new Date().toISOString().slice(0, 10);
    const name = flags.name || `${date}-${slugify(topic)}`;
    const dir = p('projects', name);
    if (fs.existsSync(dir)) throw new Error(`Проект уже существует: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
    createProject(dir, { topic, type: type.id, duration: flags.duration, format: flags.format });
    console.log(path.relative(ROOT, dir));
    console.log('Статус: DRAFT. Черновик сценария → scripts/draft.json, затем: npm run script-submit -- ' + name);
  },

  'script-check'() {
    const dir = projectPath(args[0]);
    const draft = readJSON(flags.file || path.join(dir, 'scripts', 'draft.json'));
    const r = checkScript(draft, { dir, proj: loadProject(dir) });
    r.warnings.forEach((w) => console.log('⚠', w));
    r.errors.forEach((e) => console.log('✗', e));
    console.log(`Оценки хуков: ${r.hookTotals.join(' / ')} из 25; ориентировочно ${r.estimate.seconds} с (${r.estimate.words} слов), хук ~${r.estimate.hookSeconds} с; цель ${r.range.min}–${r.range.max} с`);
    if (!r.errors.length) console.log('✓ Сценарий готов к отправке на согласование');
    process.exitCode = r.errors.length ? 1 : 0;
  },

  'script-submit'() {
    const dir = projectPath(args[0]);
    const r = submitScript(dir, flags.file);
    r.check.warnings.forEach((w) => console.error('⚠ ' + w));
    console.error(`✓ Сохранено: scripts/script_v${r.version}.md — статус AWAITING_APPROVAL. Ниже — текст для показа пользователю ЦЕЛИКОМ, без сокращений:\n`);
    console.log(r.text);
    console.log('\nУтверждаем сценарий или внесём правки?');
  },

  'script-show'() {
    const dir = projectPath(args[0]);
    const proj = loadProject(dir);
    const n = +(flags.version || proj.currentVersion);
    const v = loadVersion(dir, n);
    if (!v) throw new Error('Нет версии ' + n);
    console.log(renderScript(v, v.meta));
    if (v.meta.status !== 'APPROVED') console.log('\nУтверждаем сценарий или внесём правки?');
  },

  'approve-script'() {
    const dir = projectPath(args[0]);
    const v = approveScript(dir, { version: flags.version, by: flags.by, message: flags.message });
    console.log(`✓ Сценарий v${v.meta.version} утверждён (${v.meta.approval.at}). Статус APPROVED. Сохранено: scripts/script_approved.md`);
    console.log('Дальше: npm run storyboard-init -- ' + path.basename(dir) + ' → раскадровка → npm run build');
  },

  'storyboard-init'() {
    const dir = projectPath(args[0]);
    const f = path.join(dir, 'storyboard.json');
    if (fs.existsSync(f) && !flags.force) throw new Error('storyboard.json уже есть (--force для пересоздания)');
    assertApprovedOnly(dir);
    writeJSON(f, storyboardFromApproved(dir));
    console.log('✓ Каркас раскадровки создан из утверждённого сценария: ' + path.relative(ROOT, f));
    console.log('Тексты фраз (voice) менять нельзя — только визуал, шаблоны, маскот, переходы.');
  },

  status() {
    const dirs = args.length ? args.map(projectPath) : fs.readdirSync(p('projects')).map((d) => p('projects', d)).filter((d) => fs.existsSync(path.join(d, 'project.json')));
    const next = {
      DRAFT: 'написать сценарий (3 хука, полный текст) и отправить: script-submit',
      AWAITING_APPROVAL: 'ждёт утверждения пользователя («Утверждаю» / «Согласовано» / «Запускай производство»)',
      APPROVED: 'можно запускать производство: storyboard-init → build',
      PRODUCTION: 'идёт производство (или прервано) — можно перезапустить build',
      COMPLETED: 'видео готово',
      FAILED: 'ошибка производства — смотрите history и quality-report.json',
    };
    for (const d of dirs) {
      const pr = loadProject(d);
      if (!pr) continue;
      const last = pr.history.at(-1);
      console.log(`${path.basename(d).padEnd(52)} ${pr.status.padEnd(18)} v${pr.currentVersion}${pr.approvedVersion ? ` (утв. v${pr.approvedVersion})` : ''}`);
      if (args.length) {
        console.log(`  Дальше: ${next[pr.status]}`);
        console.log(`  Последнее событие: ${last.at} — ${last.note}`);
      }
    }
  },

  migrate() {
    for (const d of fs.readdirSync(p('projects'))) {
      const dir = p('projects', d);
      if (!fs.existsSync(path.join(dir, 'storyboard.json'))) continue;
      const r = migrateLegacy(dir);
      if (r) console.log(`✓ ${d}: перенесён в схему согласования (${r.status}, отметка «создан до внедрения согласования»)`);
    }
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
    if (flags.provider === 'yandex') {
      const { renderYandexSamples } = await import('./services/voice-generator.js');
      const out = p('output', 'voice-samples', 'yandex');
      const voices = flags.voices ? String(flags.voices).split(',') : undefined;
      (await renderYandexSamples(out, args.join(' ') || undefined, { voices })).forEach((x) => console.log(x));
      console.log('\nВыбранный голос укажите в config/voice-settings.json → yandex.voice (и role), "provider": "yandex"');
      return;
    }
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
  status [проект]          статусы проектов (DRAFT → AWAITING_APPROVAL → APPROVED → PRODUCTION → COMPLETED/FAILED)
  script-check [проект]    проверить черновик сценария scripts/draft.json (хуки, текст, длительность, редактура)
  script-submit [проект]   новая версия сценария на согласование; печатает ПОЛНЫЙ текст для чата
  script-show [проект] [--version N]   показать версию сценария целиком
  approve-script <проект> --version N --message "дословно слова пользователя" [--by "ФИО"]   утвердить сценарий
  storyboard-init <проект> каркас раскадровки из утверждённого сценария
  migrate                  перевести старые ролики в схему согласования
  approve [проект] [--by "ФИО"]                      юридическое согласование и выпуск финала
  still [проект] [секунды…]                          кадры для визуальной проверки
  voices ["текст"]         образцы голосов RHVoice
  voices --provider yandex [--voices alena,filipp] ["текст"]   образцы голосов Yandex SpeechKit
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
