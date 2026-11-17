// Тесты этапа согласования: версии, статусы, блокировка производства, сверка текста, проверка хуков.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  createProject, loadProject, checkScript, submitScript, approveScript, assertProductionAllowed,
  storyboardFromApproved, voiceMatch, loadApproved, renderScript, checkSay,
} from '../src/services/script-manager.js';

const ok = (n) => Object.fromEntries(Array.from({ length: 12 }, (_, i) => [String(i + 1), true]));
const scores = (v) => ({ attention: v, clarity: v, specificity: v, fit: v, speakable: v });

function draft(over = {}) {
  return {
    topic: 'Тест: копирование политики с чужого сайта',
    title: 'Чужая политика на вашем сайте',
    audience: 'Владельцы сайтов',
    problem: 'Политика не описывает реальную обработку',
    hooks: [
      { type: 'warning', text: 'Не копируйте чужую политику конфиденциальности.', scores: scores(5) },
      { type: 'question', text: 'Чья политика висит у вас на сайте?', scores: scores(4) },
      { type: 'fact', text: 'Политика обязана описывать именно вашу обработку данных.', scores: scores(3) },
    ],
    chosenHook: 0,
    hookRationale: 'Конкретное предупреждение',
    blocks: {
      hook: ['Не копируйте чужую политику конфиденциальности.'],
      problem: ['В ней чужие цели и чужие данные.'],
      value: ['Опишите, какие данные собирает ваш сайт.', 'Укажите, зачем они вам нужны.', { text: 'Проверьте требования 152-ФЗ.', say: 'Проверьте требования сто пятьдесят два эф зэ.' }],
      conclusion: ['Политика должна совпадать с реальной работой сайта.'],
      cta: ['Закажите политику под ваш сайт на roskom.online.'],
    },
    mainIdea: 'Политика — про вашу обработку',
    cta: { service: 'policy', text: 'Заказать политику' },
    legal: { checkedAt: '2026-11-17', claims: [{ id: 'c1', text: 'Политику нужно опубликовать', status: 'confirmed', sources: [{ url: 'https://example.org' }] }] },
    editorial: ok(),
    targetSeconds: [5, 60],
    ...over,
  };
}

function tmpProject() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rvs-'));
  createProject(dir, { topic: 'Тест', type: 'explainer' });
  return dir;
}

test('черновик без 3 хуков, с запрещённым началом и без редактуры не проходит проверку', () => {
  const d = draft({
    hooks: draft().hooks.slice(0, 2),
    blocks: { ...draft().blocks, hook: ['Здравствуйте! Сегодня поговорим о политике.'] },
    editorial: {},
  });
  const r = checkScript(d, {});
  assert.ok(r.errors.some((e) => /ровно 3 варианта/.test(e)));
  assert.ok(r.errors.some((e) => /Запрещённое начало/.test(e)));
  assert.ok(r.errors.some((e) => /Редакторская проверка/.test(e)));
});

test('нельзя выбрать хук с меньшей оценкой', () => {
  const r = checkScript(draft({ chosenHook: 1, blocks: { ...draft().blocks, hook: ['Чья политика висит у вас на сайте?'] } }), {});
  assert.ok(r.errors.some((e) => /наибольшей оценкой/.test(e)));
});

test('техническая запись say не может менять смысл', () => {
  assert.equal(checkSay({ text: 'Проверьте требования 152-ФЗ.', say: 'Проверьте требования сто пятьдесят два эф зэ.' }), null);
  assert.match(checkSay({ text: 'Проверьте требования 152-ФЗ.', say: 'Срочно закажите аудит.' }), /меняет текст/);
});

test('полный цикл: черновик → v1 → правка v2 → утверждение только последней версии → производство', () => {
  const dir = tmpProject();
  // до утверждения производство запрещено
  assert.throws(() => assertProductionAllowed(dir, { scenes: [] }), /не утверждён/);
  fs.writeFileSync(path.join(dir, 'scripts', 'draft.json'), JSON.stringify(draft()));
  const v1 = submitScript(dir);
  assert.equal(v1.version, 1);
  assert.equal(loadProject(dir).status, 'AWAITING_APPROVAL');
  // полный текст присутствует целиком, без многоточий
  for (const ph of ['Не копируйте чужую политику', 'Укажите, зачем они вам нужны.', 'Закажите политику под ваш сайт на roskom.online.']) assert.ok(v1.text.includes(ph), ph);
  assert.ok(!/\.\.\.|…/.test(v1.text));
  // нейтральный ответ — не утверждение
  assert.throws(() => approveScript(dir, { version: 1, message: 'Спасибо, посмотрю' }), /не является однозначным/);
  // правка → v2
  const d2 = draft({ changeNote: 'Хук сильнее' });
  d2.blocks.problem = ['В ней чужие цели, чужие данные и чужие риски.'];
  fs.writeFileSync(path.join(dir, 'scripts', 'draft.json'), JSON.stringify(d2));
  assert.equal(submitScript(dir).version, 2);
  // утвердить устаревшую v1 нельзя
  assert.throws(() => approveScript(dir, { version: 1, message: 'Утверждаю' }), /последнюю показанную/);
  approveScript(dir, { version: 2, message: 'Утверждаю', by: 'Тест' });
  const proj = loadProject(dir);
  assert.equal(proj.status, 'APPROVED');
  assert.equal(proj.approvedVersion, 2);
  assert.ok(fs.existsSync(path.join(dir, 'scripts', 'script_approved.md')));
  // раскадровка из утверждённого текста проходит сверку
  const sb = storyboardFromApproved(dir);
  assert.equal(voiceMatch(sb, loadApproved(dir)).ok, true);
  assertProductionAllowed(dir, sb);
  // любое изменение текста в раскадровке блокирует производство
  sb.scenes[1].voice[0] = 'В ней чужие цели.';
  assert.throws(() => assertProductionAllowed(dir, sb), /не совпадает с утверждённым/);
  // новая версия после утверждения снова требует согласования
  const d3 = draft();
  d3.blocks.conclusion = ['Политика должна описывать реальную работу сайта.'];
  fs.writeFileSync(path.join(dir, 'scripts', 'draft.json'), JSON.stringify(d3));
  submitScript(dir);
  assert.throws(() => assertProductionAllowed(dir, storyboardFromApproved(dir)), /ещё не утверждена/);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('сценарий длиннее заданного диапазона не отправляется — нужно сокращение', () => {
  const r = checkScript(draft({ targetSeconds: [5, 8] }), {});
  assert.ok(r.errors.some((e) => /Сократите текст/.test(e)));
});

test('вывод сценария содержит все разделы формата', () => {
  const d = draft();
  const text = renderScript(d, { version: 1, status: 'AWAITING_APPROVAL' });
  for (const h of ['Тема видео', 'Целевая аудитория', 'Три варианта хука', 'Рекомендуемый хук', 'ПОЛНЫЙ ТЕКСТ СЦЕНАРИЯ ДЛЯ ОЗВУЧКИ', 'Продолжительность', 'Основная мысль', 'CTA', 'Юридические источники', 'ОЖИДАЕТ УТВЕРЖДЕНИЯ']) assert.ok(text.includes(h), h);
});
