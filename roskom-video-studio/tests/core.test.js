// Юнит-тесты: субтитры, тайминги элементов, валидация раскадровки, произношение, бренд.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCaptions, isHighlighted } from '../src/services/caption-generator.js';
import { computeItemTimes, validateStoryboard } from '../src/services/storyboard.js';
import { prepareSpeechText, loadVoiceSettings, computeEnvelope } from '../src/services/voice-generator.js';
import { verifyMascotIntegrity, loadMascotManifest } from '../src/services/asset-manager.js';

const ts = (phrases, start = 0, duration = 10) => ({ start, duration, phrases });

test('субтитры: фразы режутся на короткие куски и не выходят за время фразы', () => {
  const sb = { scenes: [{ highlight: ['политика'], voice: [] }] };
  const tl = { scenes: [ts([{ text: 'Первое — политика обработки персональных данных. Закон требует опубликовать её на сайте.', start: 0.2, end: 6.2 }])] };
  const caps = buildCaptions(sb, tl, { maxWordsPerChunk: 5, maxCharsPerChunk: 34 });
  assert.ok(caps.length >= 3);
  for (const c of caps) {
    assert.ok(c.text.length <= 40, c.text);
    assert.ok(c.start >= 0.2 - 1e-9 && c.end <= 6.2 + 1e-9);
  }
  assert.ok(caps.some((c) => c.words.some((w) => w.hl && /политика/.test(w.w))));
  // субтитр не заканчивается предлогом
  for (const c of caps.slice(0, -1)) assert.ok(!/\s(на|в|с|и)$/.test(c.text), c.text);
});

test('выделение ключевых слов учитывает словоформы', () => {
  assert.ok(isHighlighted('персональных', ['персональные данные']));
  assert.ok(isHighlighted('ИП', ['ИП']));
  assert.ok(!isHighlighted('и', ['ИП']));
});

test('пункты списка появляются вместе со своими фразами', () => {
  const scene = { layout: 'cards', items: ['a', 'b'] };
  const t = computeItemTimes(scene, ts([{ start: 0.2, end: 1 }, { start: 1.5, end: 3 }, { start: 3.4, end: 5 }]));
  assert.deepEqual(t, [1.5, 3.4]);
});

test('валидатор ловит неизвестный шаблон и неизвестную позу маскота', () => {
  const { errors } = validateStoryboard({
    topic: 't', type: 'explainer',
    scenes: [{ layout: 'nope', voice: ['a'] }, { layout: 'cta', voice: ['b'], mascot: { pose: 'dragon' } }],
  });
  assert.ok(errors.some((e) => /nope/.test(e)));
  assert.ok(errors.some((e) => /dragon/.test(e)));
});

test('состояния из ТЗ (greeting, warning, goodbye…) отображаются на позы', () => {
  const sb = { topic: 't', type: 'explainer', legal: {}, scenes: [
    { layout: 'hook', voice: ['a'], mascot: { pose: 'greeting' } },
    { layout: 'cards', voice: ['b'], mascot: { pose: 'warning' } },
    { layout: 'cta', voice: ['c'], mascot: { pose: 'goodbye' } },
  ] };
  const { errors } = validateStoryboard(sb);
  assert.deepEqual(errors, []);
  assert.equal(sb.scenes[0].mascot.pose, 'happy');
  assert.equal(sb.scenes[2].mascot.pose, 'love');
});

test('словарь произношения применяется к тексту озвучки', () => {
  const s = loadVoiceSettings();
  assert.match(prepareSpeechText('Заходите на roskom.online', s), /роском точка онлайн/);
  assert.doesNotMatch(prepareSpeechText('«Роском Онлайн»', s), /[«»]/);
});

test('огибающая речи нормирована 0..1 и по длине = числу кадров', () => {
  const sr = 48000, fps = 30;
  const x = new Float32Array(sr * 2);
  for (let i = sr / 2; i < sr * 1.5; i++) x[i] = Math.sin(i / 10) * 0.5;
  const env = computeEnvelope(x, sr, fps);
  assert.equal(env.length, 60);
  assert.ok(Math.max(...env) <= 1 && Math.max(...env) > 0.5);
  assert.ok(env[2] < 0.05);
});

test('оригиналы маскота не изменены', () => {
  const m = loadMascotManifest();
  assert.ok(Object.keys(m.poses).length >= 8);
  assert.deepEqual(verifyMascotIntegrity(Object.keys(m.poses)), []);
});
