// Раскадровка: загрузка, проверка, расчёт таймингов элементов и звуковых событий.
import fs from 'node:fs';
import path from 'node:path';
import { p, readJSON } from './util.js';
import { loadMascotManifest, resolvePose } from './asset-manager.js';
import { poseVarietyWarnings } from './pose-advisor.js';

export const LAYOUTS = ['hook', 'title', 'browser', 'registry', 'cards', 'checklist', 'mistake', 'myth', 'truth', 'qa', 'news', 'fact', 'cta'];
export const TRANSITIONS = ['none', 'wipe', 'slide', 'zoom', 'fade', 'circle'];
export const CAMERAS = [undefined, null, 'none', 'zoom-in', 'zoom-out', 'pan-left', 'pan-right', 'punch', 'drift'];
export const ACTIONS = [undefined, null, 'jump', 'shake', 'nod', 'tilt', 'zoom', 'wiggle', 'lean'];
export const POSITIONS = ['right', 'left', 'center', 'hero', 'small', 'small-left', 'peek'];

export function listVideoTypes() {
  const dir = p('src', 'templates', 'video-types');
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => readJSON(path.join(dir, f)));
}

export function loadVideoType(id) {
  const file = p('src', 'templates', 'video-types', `${id}.json`);
  if (!fs.existsSync(file)) throw new Error(`Неизвестный тип ролика «${id}». Доступны: ${listVideoTypes().map((t) => t.id).join(', ')}`);
  return readJSON(file);
}

/** Проверяет storyboard.json. Возвращает { errors, warnings }. Позы-состояния (greeting и т.п.) заменяет на реальные. */
export function validateStoryboard(sb) {
  const errors = [], warnings = [];
  const manifest = loadMascotManifest();
  if (!sb.topic) errors.push('Не указана тема (topic)');
  if (!sb.type) errors.push('Не указан тип ролика (type)');
  else try { loadVideoType(sb.type); } catch (e) { errors.push(e.message); }
  if (!Array.isArray(sb.scenes) || sb.scenes.length < 2) errors.push('Нужно минимум 2 сцены');
  const layoutsUsed = new Set();
  (sb.scenes || []).forEach((s, i) => {
    const n = `Сцена ${i + 1}`;
    if (!LAYOUTS.includes(s.layout)) errors.push(`${n}: неизвестный шаблон «${s.layout}». Доступны: ${LAYOUTS.join(', ')}`);
    layoutsUsed.add(s.layout);
    if (!s.voice || !s.voice.length) errors.push(`${n}: нет текста диктора (voice)`);
    if (s.transition && !TRANSITIONS.includes(s.transition)) errors.push(`${n}: неизвестный переход «${s.transition}»`);
    if (!CAMERAS.includes(s.camera)) errors.push(`${n}: неизвестное движение камеры «${s.camera}»`);
    if (s.mascot) {
      for (const k of [s.mascot, ...(s.mascot.poses || [])]) {
        const real = resolvePose(k.pose);
        if (!real) errors.push(`${n}: поза маскота «${k.pose}» не найдена. Доступны: ${Object.keys(manifest.poses).join(', ')}`);
        else k.pose = real;
      }
      if (s.mascot.position && !POSITIONS.includes(s.mascot.position)) errors.push(`${n}: неизвестная позиция маскота «${s.mascot.position}»`);
      if (!ACTIONS.includes(s.mascot.action)) errors.push(`${n}: неизвестное действие маскота «${s.mascot.action}»`);
    }
    const words = (s.voice || []).map((v) => (typeof v === 'string' ? v : v.text)).join(' ').split(/\s+/).length;
    if (words > 70) warnings.push(`${n}: длинный текст (${words} слов) — сцену лучше разбить`);
    if (['cards', 'checklist'].includes(s.layout) && (s.items || []).length > 5) warnings.push(`${n}: больше 5 пунктов — будет мелко`);
  });
  if ((sb.scenes || []).length && sb.scenes[sb.scenes.length - 1].layout !== 'cta') warnings.push('Последняя сцена — не CTA');
  // Первые три секунды: сразу визуал хука, движение маскота, выделенные слова, без заставки
  const s0 = (sb.scenes || [])[0];
  if (s0) {
    const first = [];
    if (s0.transition && s0.transition !== 'none') first.push('первая сцена не должна начинаться с перехода/заставки (transition: "none")');
    if (!s0.mascot) first.push('в первой сцене нужен маскот в движении');
    else if (s0.mascot.enter === 'none' || (s0.mascot.enterAt ?? 0.05) > 0.3) first.push('маскот первой сцены должен появляться сразу (enterAt ≤ 0.3 с, enter ≠ none)');
    if (!(s0.highlight || []).length) first.push('в первой сцене нужно выделить ключевые слова хука (highlight)');
    if (['hook', 'title'].includes(s0.layout) && !s0.icon && !s0.kicker) first.push('хук-сцена без визуального элемента: добавьте icon или kicker, либо используйте browser / registry / cards / mistake / myth');
    if (!s0.visual) first.push('опишите визуал первой сцены (visual): что зритель видит в первые 3 секунды и как это связано с хуком');
    if (s0.layout === 'cta') first.push('ролик не может начинаться с CTA/рекламы');
    (sb.scriptVersion ? errors : warnings).push(...first.map((x) => 'Первые 3 секунды: ' + x));
  }
  // Соседние сцены не должны повторять композицию
  (sb.scenes || []).forEach((s, i) => {
    const prev = sb.scenes[i - 1];
    if (prev && prev.layout === s.layout && prev.layout !== 'mistake' && (prev.mascot?.position === s.mascot?.position)) warnings.push(`Сцены ${i} и ${i + 1}: одинаковая композиция (${s.layout}, маскот ${s.mascot?.position}) — смените шаблон или положение маскота`);
  });
  if (layoutsUsed.size < 3) warnings.push('Мало разнообразия: используется меньше трёх визуальных шаблонов');
  if (Array.isArray(sb.scenes)) warnings.push(...poseVarietyWarnings(sb));
  if (!sb.legal) warnings.push('Нет блока legal — юридическая проверка не отражена');
  return { errors, warnings };
}

function itemCount(s) {
  switch (s.layout) {
    case 'cards': case 'checklist': return (s.items || []).length;
    case 'truth': return (s.items || []).length || (s.text ? 1 : 0);
    case 'browser': case 'registry': return (s.badges || (s.badge ? [s.badge] : [])).length;
    case 'hook': case 'title': return s.icon ? 1 : 0;
    case 'myth': case 'qa': case 'mistake': case 'news': case 'cta': return 1;
    default: return 0;
  }
}

/** Время появления элементов сцены по фактическим фразам озвучки. */
export function computeItemTimes(scene, ts) {
  const n = itemCount(scene);
  const P = ts.phrases;
  const at = (k) => Math.max(0.35, P[Math.min(k, P.length - 1)].start);
  if (scene.itemsAt) return scene.itemsAt.slice(0, n);
  if (scene.itemsAtPhrases) return scene.itemsAtPhrases.map((k) => at(k));
  if (!n) return [];
  if (['myth', 'qa', 'mistake', 'news'].includes(scene.layout)) {
    const k = scene.revealAtPhrase ?? (P.length > 1 ? 1 : 0);
    return [k === 0 ? Math.min(ts.duration * 0.5, P[0].start + (P[0].end - P[0].start) * 0.6) : at(k)];
  }
  if (scene.layout === 'cta') return [Math.min(ts.duration - 0.8, Math.max(0.7, P.length > 1 ? at(1) : 0.9))];
  if (P.length > n) {
    const off = P.length - n;
    return Array.from({ length: n }, (_, i) => at(off + i));
  }
  if (P.length === n) return Array.from({ length: n }, (_, i) => (i === 0 ? Math.max(0.5, P[0].start + 0.25) : at(i)));
  // фраз меньше, чем пунктов — равномерно
  const a = 0.5, b = Math.max(a + 0.5, ts.duration * 0.72);
  return Array.from({ length: n }, (_, i) => a + ((b - a) * i) / Math.max(1, n - 1));
}

/** Звуковые события (секунды от начала ролика). */
export function computeSfx(storyboard, scenes) {
  const ev = [];
  scenes.forEach((s, i) => {
    const base = s.start;
    if (s.sfx === false) return;
    if (i > 0 && (s.transition || 'wipe') !== 'none') ev.push({ t: base - 0.18, name: 'whoosh', volume: 0.8 });
    if (s.layout === 'mistake') ev.push({ t: base + 0.1, name: 'alert', volume: 0.6 });
    if (s.layout === 'myth') ev.push({ t: base + s.itemTimes[0] + 0.15, name: 'alert', volume: 0.7 });
    if (s.layout === 'cta') ev.push({ t: base + s.itemTimes[0], name: 'ding', volume: 0.7 });
    if (['cards', 'checklist', 'truth', 'browser', 'registry'].includes(s.layout)) s.itemTimes.forEach((t) => ev.push({ t: base + t, name: s.layout === 'checklist' ? 'tick' : 'pop', volume: 0.7 }));
    if (s.layout === 'qa') ev.push({ t: base + s.itemTimes[0], name: 'pop', volume: 0.8 });
    for (const x of s.sfxExtra || []) ev.push({ t: base + x.at, name: x.name, volume: x.volume ?? 1 });
  });
  return ev.filter((e) => e.t >= 0);
}

/** Все тексты ролика (для проверки написания бренда и т.п.). */
export function collectTexts(sb) {
  const out = [];
  const walk = (v) => {
    if (typeof v === 'string') out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => k !== 'say' && walk(x));
  };
  walk(sb.scenes);
  walk(sb.publication);
  walk(sb.title);
  return out;
}

export function usedPoses(sb) {
  const set = new Set();
  for (const s of sb.scenes) if (s.mascot) [s.mascot, ...(s.mascot.poses || [])].forEach((k) => set.add(k.pose));
  if (sb.cover?.pose) set.add(sb.cover.pose);
  return [...set];
}
