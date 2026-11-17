// script-manager — этап сценария: версии, статусы, проверка хуков и текста, утверждение,
// сверка озвучки с утверждённым текстом. Озвучка и монтаж возможны только после APPROVED.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { p, readJSON, writeJSON, ensureDir } from './util.js';
import { loadBrand } from './asset-manager.js';

export const STATUSES = ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED', 'PRODUCTION', 'COMPLETED', 'FAILED'];
const BLOCK_ORDER = ['hook', 'problem', 'value', 'conclusion', 'cta'];

export const scriptSettings = () => readJSON(p('config', 'script-settings.json'));
const projectFile = (dir) => path.join(dir, 'project.json');
const scriptsDir = (dir) => path.join(dir, 'scripts');

// ---------- Состояние проекта ----------

export function loadProject(dir) {
  return readJSON(projectFile(dir), null);
}

export function saveProject(dir, proj) {
  writeJSON(projectFile(dir), proj);
}

export function createProject(dir, { topic, type, duration, format }) {
  ensureDir(scriptsDir(dir));
  const proj = {
    id: path.basename(dir),
    topic, type, duration: duration || 'short', format: format || 'vertical',
    createdAt: new Date().toISOString(),
    status: 'DRAFT',
    currentVersion: 0,
    approvedVersion: null,
    approvedHash: null,
    approvals: [],
    history: [{ at: new Date().toISOString(), status: 'DRAFT', note: 'Проект создан' }],
  };
  saveProject(dir, proj);
  return proj;
}

export function setStatus(dir, status, note = '') {
  if (!STATUSES.includes(status)) throw new Error('Неизвестный статус ' + status);
  const proj = loadProject(dir);
  if (!proj) return null;
  proj.status = status;
  proj.history.push({ at: new Date().toISOString(), status, note });
  saveProject(dir, proj);
  return proj;
}

// ---------- Текст сценария ----------

const phraseText = (ph) => (typeof ph === 'string' ? ph : ph.text);

/** Все фразы сценария по порядку блоков. */
export function scriptPhrases(script) {
  return BLOCK_ORDER.flatMap((b) => (script.blocks?.[b] || []).map((ph) => ({ block: b, ...(typeof ph === 'string' ? { text: ph } : ph) })));
}

/** Нормализация для сравнения текста (пробелы, кавычки, тире, ё). */
export function normText(s) {
  return String(s)
    .replace(/[«»“”„"]/g, '"')
    .replace(/[–—]/g, '—')
    .replace(/ё/g, 'е').replace(/Ё/g, 'Е')
    .replace(/\s+/g, ' ')
    .trim();
}

export function fullText(script) {
  return scriptPhrases(script).map((x) => x.text).join(' ');
}

export function textHash(text) {
  return crypto.createHash('sha256').update(normText(text)).digest('hex');
}

const words = (s) => (String(s).match(/[A-Za-zА-Яа-яЁё0-9]+(?:-[A-Za-zА-Яа-яЁё0-9]+)*/g) || []);

/** Ориентировочная длительность озвучки (секунды). */
export function estimateDuration(script) {
  const S = scriptSettings();
  const phrases = scriptPhrases(script);
  const nWords = phrases.reduce((a, ph) => a + words(ph.say || ph.text).length, 0);
  const scenes = Math.max(5, BLOCK_ORDER.filter((b) => script.blocks?.[b]?.length).length + Math.floor((script.blocks?.value?.length || 0) / 3));
  const speech = nWords / S.wordsPerSecond;
  const pauses = Math.max(0, phrases.length - scenes) * S.pauseBetweenPhrases + scenes * S.sceneOverhead + S.finalHold;
  const hookWords = words(phrases.find((x) => x.block === 'hook')?.say || phrases[0]?.text || '').length;
  return { seconds: Math.round((speech + pauses) * 10) / 10, words: nWords, hookSeconds: Math.round((hookWords / S.wordsPerSecond) * 10) / 10 };
}

export function targetRange(proj, script) {
  const S = scriptSettings();
  if (script?.targetSeconds) return { min: script.targetSeconds[0], max: script.targetSeconds[1] };
  const vs = readJSON(p('config', 'video-settings.json'));
  if (proj?.duration && proj.duration !== 'short') return vs.durations[proj.duration];
  return S.defaultTarget;
}

// ---------- Проверка сценария ----------

function similarity(a, b) {
  const A = new Set(words(a.toLowerCase()).filter((w) => w.length >= 4));
  const B = new Set(words(b.toLowerCase()).filter((w) => w.length >= 4));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / Math.min(A.size, B.size);
}

/** Хуки последних роликов (для запрета повторов). */
export function recentHooks(excludeDir) {
  const root = p('projects');
  if (!fs.existsSync(root)) return [];
  const out = [];
  for (const d of fs.readdirSync(root)) {
    const dir = path.join(root, d);
    if (path.resolve(dir) === path.resolve(excludeDir || '')) continue;
    const proj = readJSON(path.join(dir, 'project.json'), null);
    let hook = null;
    if (proj?.currentVersion) {
      const s = readJSON(path.join(dir, 'scripts', `script_v${proj.currentVersion}.json`), null);
      hook = s ? scriptPhrases(s)[0]?.text : null;
    }
    if (!hook) {
      const sb = readJSON(path.join(dir, 'storyboard.json'), null);
      const v = sb?.scenes?.[0]?.voice?.[0];
      hook = v ? phraseText(v) : null;
    }
    if (hook) out.push({ project: d, hook, mtime: fs.statSync(dir).mtimeMs });
  }
  return out.sort((a, b) => b.mtime - a.mtime);
}

/** Слова обычного текста (без чисел, аббревиатур, латиницы) должны сохраниться в техзаписи say в том же порядке. */
export function checkSay(ph) {
  if (!ph.say) return null;
  const plain = words(ph.text).filter((w) => /^[а-яё-]+$/i.test(w) && w.length > 1 && w !== w.toUpperCase()).map((w) => w.toLowerCase().replace(/ё/g, 'е'));
  const sayW = words(ph.say).map((w) => w.toLowerCase().replace(/ё/g, 'е'));
  let i = 0;
  for (const w of sayW) if (i < plain.length && w === plain[i]) i++;
  if (i < plain.length) return `техническая запись для синтеза меняет текст: «${ph.text}» → «${ph.say}» (пропало/изменено слово «${plain[i]}»)`;
  if (sayW.length > words(ph.text).length * 2 + 8) return `техническая запись для синтеза заметно длиннее текста: «${ph.say}»`;
  return null;
}

/** Полная проверка черновика сценария. Возвращает { errors, warnings, estimate, hookTotals }. */
export function checkScript(script, { dir, proj } = {}) {
  const S = scriptSettings();
  const errors = [], warnings = [];
  for (const k of ['topic', 'audience', 'problem', 'mainIdea']) if (!script[k]) errors.push(`Не заполнено поле «${k}»`);
  if (!script.cta?.text) errors.push('Не указан CTA (cta.text)');
  if (script.cta?.service && !loadBrand().services[script.cta.service]) errors.push(`Неизвестная услуга CTA: ${script.cta.service}`);
  // Хуки
  const hooks = script.hooks || [];
  if (hooks.length !== 3) errors.push(`Нужно ровно 3 варианта хука (сейчас ${hooks.length})`);
  const hookTotals = hooks.map((h) => Object.keys(S.hook.criteria).reduce((a, c) => a + (+h.scores?.[c] || 0), 0));
  hooks.forEach((h, i) => {
    if (!S.hook.types[h.type]) errors.push(`Хук ${i + 1}: неизвестный тип «${h.type}» (допустимы: ${Object.keys(S.hook.types).join(', ')})`);
    for (const c of Object.keys(S.hook.criteria)) {
      const v = +h.scores?.[c];
      if (!(v >= 1 && v <= 5)) errors.push(`Хук ${i + 1}: нет оценки 1–5 по критерию «${S.hook.criteria[c]}» (${c})`);
    }
  });
  if (new Set(hooks.map((h) => h.type)).size < Math.min(3, hooks.length)) warnings.push('Варианты хука лучше делать разных типов');
  const chosen = script.chosenHook;
  if (!(chosen >= 0 && chosen < hooks.length)) errors.push('Не выбран рекомендуемый хук (chosenHook)');
  else {
    const best = Math.max(...hookTotals);
    if (hookTotals[chosen] < best) errors.push(`Выбран хук ${chosen + 1} (${hookTotals[chosen]} баллов), но хук с наибольшей оценкой — ${hookTotals.indexOf(best) + 1} (${best})`);
    if (hookTotals[chosen] < S.hook.minTotal) errors.push(`Лучший хук набрал ${hookTotals[chosen]} из 25 — ниже порога ${S.hook.minTotal}: предложите новые варианты`);
    if (!script.hookRationale) errors.push('Нет краткого объяснения выбора хука (hookRationale)');
  }
  // Блоки
  for (const b of BLOCK_ORDER) if (!script.blocks?.[b]?.length) errors.push(`Пустой блок «${S.blocks[b]}» (blocks.${b})`);
  const phrases = scriptPhrases(script);
  const first = phrases[0]?.text || '';
  if (chosen >= 0 && hooks[chosen] && normText(first) !== normText(hooks[chosen].text)) errors.push('Первая фраза блока hook должна совпадать с выбранным хуком');
  const low = first.toLowerCase().replace(/ё/g, 'е');
  for (const f of S.forbiddenOpenings) if (low.startsWith(f.replace(/ё/g, 'е'))) errors.push(`Запрещённое начало: «${f}…» — начинайте сразу с проблемы, интриги, ошибки или факта`);
  for (const f of S.softForbiddenOpenings) if (low.startsWith(f)) warnings.push(`Начало «${f}…» допустимо, только если дальше неожиданный, а не банальный факт`);
  if (/роском онлайн/i.test(phrases.slice(0, 2).map((x) => x.text).join(' '))) errors.push('Ролик не должен начинаться с рекламы компании: «Роском Онлайн» в первых фразах');
  // Повтор хуков
  if (dir) {
    for (const r of recentHooks(dir).slice(0, S.hook.repeatLookback)) {
      const sim = similarity(first, r.hook);
      if (sim >= S.hook.repeatSimilarity) errors.push(`Хук слишком похож на хук ролика ${r.project}: «${r.hook}»`);
    }
  }
  // Качество текста
  phrases.forEach((ph) => {
    const n = words(ph.text).length;
    if (n > S.maxWordsPerSentence) warnings.push(`Длинная фраза (${n} слов): «${ph.text}» — разбейте`);
    const l = ph.text.toLowerCase();
    for (const b of S.bureaucratese) if (l.includes(b)) warnings.push(`Канцелярит «${b}»: «${ph.text}»`);
    const sayErr = checkSay(ph);
    if (sayErr) errors.push(sayErr);
  });
  if (/\.\.\.|…/.test(fullText(script))) errors.push('В тексте сценария есть многоточие — текст должен быть полным');
  // Длительность
  const est = estimateDuration(script);
  const range = targetRange(proj, script);
  if (est.seconds > range.max) errors.push(`Ориентировочно ${est.seconds} с — больше ${range.max} с. Сократите текст примерно на ${Math.ceil((est.seconds - range.max) * S.wordsPerSecond)} слов (ускорять речь нельзя)`);
  if (est.seconds < range.min) warnings.push(`Ориентировочно ${est.seconds} с — меньше ${range.min} с`);
  if (est.hookSeconds > S.hook.maxSeconds) errors.push(`Хук звучит ~${est.hookSeconds} с — больше ${S.hook.maxSeconds} с. Сократите хук`);
  // Редакторская проверка
  const ed = script.editorial || {};
  S.editorialCriteria.forEach((c, i) => {
    const v = ed[String(i + 1)];
    if (!(v === true || v?.ok === true)) errors.push(`Редакторская проверка: не пройден критерий ${i + 1} «${c}»`);
  });
  // Юридические утверждения
  const claims = script.legal?.claims || [];
  if (!script.legal?.checkedAt) errors.push('Нет даты юридической проверки (legal.checkedAt)');
  for (const c of claims.filter((c) => c.usedInVideo !== false)) {
    if (c.status !== 'confirmed') warnings.push(`Юридическое утверждение не подтверждено (${c.status}): «${c.text}» — предупредите пользователя`);
    if (!c.sources?.length) errors.push(`Нет источника для утверждения «${c.text}»`);
  }
  // Текст, написанный пользователем: ограничения формы — предупреждения (решает пользователь), запреты и юр. проверка — ошибки
  if (script.userAuthored) {
    const soft = /наибольшей оценкой|ниже порога|Сократите текст|Сократите хук|Редакторская проверка|Длинная фраза|Первая фраза блока hook/;
    for (let i = errors.length - 1; i >= 0; i--) if (soft.test(errors[i])) warnings.unshift('(текст пользователя) ' + errors.splice(i, 1)[0]);
  }
  return { errors, warnings, estimate: est, range, hookTotals };
}

// ---------- Представление сценария для чата (полностью, без сокращений) ----------

export function renderScript(script, meta) {
  const S = scriptSettings();
  const brand = loadBrand();
  const est = meta.estimate || estimateDuration(script);
  const chosen = script.hooks[script.chosenHook];
  const paragraphs = BLOCK_ORDER.map((b) => (script.blocks[b] || []).map(phraseText).join(' '));
  const claims = (script.legal?.claims || []).filter((c) => c.usedInVideo !== false);
  const excluded = (script.legal?.claims || []).filter((c) => c.usedInVideo === false);
  const srcLines = [];
  for (const c of claims) {
    srcLines.push(`- ${c.text}${c.norm ? ` (${c.norm})` : ''}${c.status !== 'confirmed' ? ` — ⚠ ${c.status}` : ''}`);
    for (const s of c.sources || []) srcLines.push(`  - ${s.title ? s.title + ': ' : ''}${s.url}`);
  }
  const says = scriptPhrases(script).filter((x) => x.say);
  const svc = brand.services[script.cta?.service];
  const statusLine = meta.status === 'APPROVED' ? `УТВЕРЖДЁН (версия ${meta.version})` : `ОЖИДАЕТ УТВЕРЖДЕНИЯ (версия ${meta.version})`;
  return [
    `**Тема видео:** ${script.topic}`,
    '',
    `**Целевая аудитория:** ${script.audience}`,
    '',
    '**Три варианта хука:**',
    ...script.hooks.map((h, i) => `${i + 1}. ${h.text} *(${S.hook.types[h.type] || h.type})*`),
    '',
    `**Рекомендуемый хук:** «${chosen.text}» — ${script.hookRationale}`,
    '',
    '**ПОЛНЫЙ ТЕКСТ СЦЕНАРИЯ ДЛЯ ОЗВУЧКИ:**',
    '',
    ...paragraphs.flatMap((t) => [t, '']),
    `**Продолжительность:** около ${Math.round(est.seconds)} секунд (${est.words} слов, хук ~${est.hookSeconds} с)`,
    '',
    `**Основная мысль:** ${script.mainIdea}`,
    '',
    `**CTA:** ${script.cta.text}${svc ? ` → услуга «${svc.title}»` : ''}`,
    '',
    '**Юридические источники:**',
    ...(srcLines.length ? srcLines : ['- юридически значимых утверждений нет']),
    ...(excluded.length ? ['', '*Не включено в текст (не подтверждено):* ' + excluded.map((c) => `«${c.text}»`).join('; ')] : []),
    ...((script.legalWarnings || []).length ? ['', '**⚠ Юридические предупреждения:**', ...script.legalWarnings.map((w) => `- ${w}`)] : []),
    ...(says.length ? ['', '*Технические записи для синтеза речи (текст не меняется, только произношение):* ' + says.map((x) => `«${x.text}» → «${x.say}»`).join('; ')] : []),
    '',
    `**Статус:** ${statusLine}`,
  ].join('\n');
}

// ---------- Версии ----------

export function loadVersion(dir, n) {
  return readJSON(path.join(scriptsDir(dir), `script_v${n}.json`), null);
}

export function latestVersionNumber(dir) {
  const d = scriptsDir(dir);
  if (!fs.existsSync(d)) return 0;
  return Math.max(0, ...fs.readdirSync(d).map((f) => +(f.match(/^script_v(\d+)\.json$/)?.[1] || 0)));
}

/**
 * Отправка черновика на согласование: проверка, новая версия script_vN.(json|md), статус AWAITING_APPROVAL.
 * Возвращает { version, text, check } или бросает ошибку со списком проблем.
 */
export function submitScript(dir, draftFile) {
  const proj = loadProject(dir);
  if (!proj) throw new Error('Нет project.json — создайте проект: npm run new -- "тема"');
  const draft = readJSON(draftFile || path.join(scriptsDir(dir), 'draft.json'));
  const check = checkScript(draft, { dir, proj });
  if (check.errors.length) {
    const e = new Error('Сценарий не прошёл проверку — исправьте до показа пользователю:\n- ' + check.errors.join('\n- '));
    e.check = check;
    throw e;
  }
  const n = latestVersionNumber(dir) + 1;
  const prev = n > 1 ? loadVersion(dir, n - 1) : null;
  const text = fullText(draft);
  if (prev && prev.meta.hash === textHash(text) && JSON.stringify(prev.hooks) === JSON.stringify(draft.hooks)) {
    throw new Error(`Текст не изменился относительно версии ${n - 1} — новая версия не создана`);
  }
  const meta = {
    project: proj.id, version: n, createdAt: new Date().toISOString(), status: 'AWAITING_APPROVAL',
    estimate: check.estimate, range: check.range, hook: draft.hooks[draft.chosenHook].text, hash: textHash(text), approval: null,
    warnings: check.warnings, changeNote: draft.changeNote || (n === 1 ? 'Первоначальная версия' : ''),
  };
  const ver = { ...draft, meta };
  writeJSON(path.join(scriptsDir(dir), `script_v${n}.json`), ver);
  const md = `<!-- project: ${proj.id} | version: ${n} | created: ${meta.createdAt} | status: AWAITING_APPROVAL | hash: ${meta.hash} -->\n# Сценарий v${n}\n\n${renderScript(draft, meta)}\n`;
  fs.writeFileSync(path.join(scriptsDir(dir), `script_v${n}.md`), md);
  writeJSON(path.join(scriptsDir(dir), `hooks_v${n}.json`), { hooks: draft.hooks, totals: check.hookTotals, chosen: draft.chosenHook, rationale: draft.hookRationale });
  // предыдущая неутверждённая версия — заменена
  proj.currentVersion = n;
  proj.status = 'AWAITING_APPROVAL';
  proj.history.push({ at: meta.createdAt, status: 'AWAITING_APPROVAL', note: `Версия ${n} отправлена на согласование${meta.changeNote ? ': ' + meta.changeNote : ''}` });
  saveProject(dir, proj);
  return { version: n, text: renderScript(draft, meta), check };
}

/** Утверждение. version — номер версии, которую видел пользователь; должна быть последней. */
export function approveScript(dir, { version, by, message }) {
  const S = scriptSettings();
  const proj = loadProject(dir);
  if (!proj) throw new Error('Нет project.json');
  if (!version) throw new Error('Укажите номер утверждаемой версии: --version N');
  if (+version !== proj.currentVersion) throw new Error(`Утверждать можно только последнюю показанную версию (v${proj.currentVersion}), а не v${version}`);
  if (proj.status !== 'AWAITING_APPROVAL') throw new Error(`Статус проекта ${proj.status} — утверждать нечего (нужен AWAITING_APPROVAL)`);
  if (!message) throw new Error('Укажите дословное сообщение пользователя с утверждением: --message "…"');
  const m = message.toLowerCase().replace(/ё/g, 'е');
  if (/(^|[\s,.!?])не\s+(утвер|соглас|запуск|делай)|пока не|подожд|(^|[\s,.!?])стоп/.test(m) || !S.approvalPhrases.some((ph) => m.includes(ph.replace(/ё/g, 'е')))) {
    throw new Error(`Сообщение «${message}» не является однозначным утверждением. Нужны слова: ${S.approvalPhrases.map((x) => `«${x}»`).join(', ')} или другая явная команда — уточните у пользователя`);
  }
  const ver = loadVersion(dir, version);
  const at = new Date().toISOString();
  ver.meta.status = 'APPROVED';
  ver.meta.approval = { at, by: by || 'пользователь', message };
  writeJSON(path.join(scriptsDir(dir), `script_v${version}.json`), ver);
  // прежняя утверждённая версия не перезаписывается незаметно — сохраняется под своим номером
  const apMd = path.join(scriptsDir(dir), 'script_approved.md');
  if (fs.existsSync(apMd) && proj.approvedVersion) fs.renameSync(apMd, path.join(scriptsDir(dir), `script_approved_v${proj.approvedVersion}.md`));
  const md = `<!-- project: ${proj.id} | version: ${version} | approved: ${at} | by: ${by || 'пользователь'} | message: ${message} | hash: ${ver.meta.hash} -->\n# Утверждённый сценарий (v${version})\n\n${renderScript(ver, { ...ver.meta })}\n\n**Утверждено:** ${at} — «${message}»\n`;
  fs.writeFileSync(apMd, md);
  writeJSON(path.join(scriptsDir(dir), 'script_approved.json'), ver);
  proj.status = 'APPROVED';
  proj.approvedVersion = +version;
  proj.approvedHash = ver.meta.hash;
  proj.approvals.push({ version: +version, at, by: by || 'пользователь', message });
  proj.history.push({ at, status: 'APPROVED', note: `Версия ${version} утверждена: «${message}»` });
  saveProject(dir, proj);
  return ver;
}

export function loadApproved(dir) {
  return readJSON(path.join(scriptsDir(dir), 'script_approved.json'), null);
}

/** Сверка текста раскадровки с утверждённым сценарием. */
export function voiceMatch(sb, approved) {
  const sbPhrases = sb.scenes.flatMap((s) => (s.voice || []).map((v) => (typeof v === 'string' ? { text: v } : v)));
  const a = normText(fullText(approved));
  const b = normText(sbPhrases.map((x) => x.text).join(' '));
  const problems = [];
  if (a !== b) {
    let i = 0;
    while (i < a.length && a[i] === b[i]) i++;
    problems.push(`текст раскадровки отличается от утверждённого с позиции ${i}: утверждено «…${a.slice(Math.max(0, i - 30), i + 50)}…», в раскадровке «…${b.slice(Math.max(0, i - 30), i + 50)}…»`);
  }
  for (const ph of sbPhrases) {
    const e = checkSay(ph);
    if (e) problems.push(e);
  }
  return { ok: problems.length === 0, problems };
}

/** Проверка перед производством. Бросает понятную ошибку, если производство запрещено. */
export function assertProductionAllowed(dir, sb) {
  const proj = loadProject(dir);
  if (!proj) throw new Error('У проекта нет project.json — производство без согласованного сценария запрещено. Создайте сценарий: npm run new, затем script-submit и утверждение.');
  if (!proj.approvedVersion) throw new Error(`Сценарий не утверждён (статус ${proj.status}). Озвучка и монтаж запрещены до утверждения.`);
  if (proj.currentVersion !== proj.approvedVersion) throw new Error(`Есть новая версия сценария v${proj.currentVersion}, которая ещё не утверждена (утверждена v${proj.approvedVersion}). Производство запрещено до её утверждения.`);
  if (!['APPROVED', 'PRODUCTION', 'COMPLETED', 'FAILED'].includes(proj.status)) throw new Error(`Статус ${proj.status} не позволяет производство`);
  const approved = loadApproved(dir);
  if (!approved || approved.meta.hash !== proj.approvedHash || textHash(fullText(approved)) !== proj.approvedHash) throw new Error('Файл утверждённого сценария изменён или отсутствует — нужна повторная отправка и утверждение');
  const vm = voiceMatch(sb, approved);
  if (!vm.ok) throw new Error('Текст раскадровки не совпадает с утверждённым сценарием:\n- ' + vm.problems.join('\n- '));
  return { proj, approved };
}

/** Каркас раскадровки из утверждённого сценария (тексты фраз переносятся без изменений). */
export function storyboardFromApproved(dir) {
  const proj = loadProject(dir);
  const ap = loadApproved(dir);
  if (!ap) throw new Error('Нет утверждённого сценария');
  const brand = loadBrand();
  const scenes = [];
  const add = (role, phrases, layout, extra = {}) => scenes.push({ role, layout, voice: phrases.map((x) => (typeof x === 'string' ? x : x.say ? { text: x.text, say: x.say } : x.text)), title: '', highlight: [], visual: '', ...extra });
  add('hook', ap.blocks.hook, 'hook', { transition: 'none', mascot: { pose: 'surprise', position: 'right', enter: 'slide', enterAt: 0 } });
  add('problem', ap.blocks.problem, 'cards', { transition: 'wipe', mascot: { pose: 'warning', position: 'left' } });
  const val = ap.blocks.value;
  for (let i = 0; i < val.length; i += 3) add('value', val.slice(i, i + 3), 'checklist', { transition: i ? 'slide' : 'zoom', mascot: { pose: 'pointing', position: 'small-left' } });
  add('conclusion', ap.blocks.conclusion, 'truth', { transition: 'wipe', mascot: { pose: 'joy', position: 'small', size: 380 } });
  add('cta', ap.blocks.cta, 'cta', { transition: 'circle', button: brand.siteLabel, hold: 0.8, mascot: { pose: 'goodbye', position: 'center' } });
  return {
    version: 1,
    topic: ap.topic,
    title: ap.title || ap.topic,
    type: proj.type || 'explainer',
    format: proj.format || 'vertical',
    duration: proj.duration || 'short',
    durationRange: ap.userAuthored ? readJSON(p('config', 'video-settings.json')).durations[proj.duration || 'short'] : targetRange(proj, ap),
    audience: ap.audience,
    service: ap.cta?.service || 'consulting',
    scriptVersion: proj.approvedVersion,
    highlight: [],
    scenes,
    cover: { title: ap.title || ap.topic, highlight: [], pose: 'surprise' },
    legal: ap.legal,
    publication: { titles: [], description: '', telegram: '', vk: '', youtube: '', hashtags: [] },
  };
}

/** Перевод ролика, созданного до внедрения согласования, в новую схему (утверждение помечается как «до внедрения»). */
export function migrateLegacy(dir) {
  if (loadProject(dir)) return null;
  const sb = readJSON(path.join(dir, 'storyboard.json'));
  const proj = createProject(dir, { topic: sb.topic, type: sb.type, duration: sb.duration, format: sb.format });
  const blocks = { hook: [], problem: [], value: [], conclusion: [], cta: [] };
  sb.scenes.forEach((s, i) => {
    const b = i === 0 ? 'hook' : s.layout === 'cta' ? 'cta' : i === 1 ? 'problem' : i === sb.scenes.length - 2 ? 'conclusion' : 'value';
    blocks[b].push(...s.voice);
  });
  const text = sb.scenes.flatMap((s) => s.voice.map(phraseText)).join(' ');
  const at = new Date().toISOString();
  const ver = {
    topic: sb.topic, title: sb.title, audience: sb.audience, blocks, legal: sb.legal, cta: { service: sb.service, text: phraseText(sb.scenes.at(-1).voice[0]) },
    meta: { project: proj.id, version: 1, createdAt: at, status: 'APPROVED', legacy: true, hash: textHash(text), approval: { at, by: 'legacy', message: 'Ролик создан до внедрения этапа согласования сценария' } },
  };
  writeJSON(path.join(scriptsDir(dir), 'script_v1.json'), ver);
  writeJSON(path.join(scriptsDir(dir), 'script_approved.json'), ver);
  fs.writeFileSync(path.join(scriptsDir(dir), 'script_approved.md'), `<!-- legacy: ролик создан до внедрения согласования -->\n# Сценарий (до внедрения согласования)\n\n${BLOCK_ORDER.map((b) => blocks[b].map(phraseText).join(' ')).filter(Boolean).join('\n\n')}\n`);
  Object.assign(proj, { currentVersion: 1, approvedVersion: 1, approvedHash: ver.meta.hash, status: fs.existsSync(path.join(dir, 'final.mp4')) ? 'COMPLETED' : 'APPROVED' });
  proj.approvals.push({ version: 1, at, by: 'legacy', message: ver.meta.approval.message });
  proj.history.push({ at, status: proj.status, note: 'Перенесён в схему согласования (ролик создан до её внедрения)' });
  saveProject(dir, proj);
  return proj;
}
