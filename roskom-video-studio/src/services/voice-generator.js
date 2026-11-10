// voice-generator — озвучка сцен. Провайдеры: rhvoice (локально, бесплатно), elevenlabs, yandex.
// Синтез идёт пофразово: так мы знаем точное время каждой фразы и строим по нему монтаж и субтитры.
import fs from 'node:fs';
import path from 'node:path';
import { p, readJSON, hash, runSync, decodeAudio, decodePCM16, writeWav, hasCommand, loadEnv, ensureDir, log } from './util.js';

export const SAMPLE_RATE = 48000;

export function loadVoiceSettings(overrides = {}) {
  const s = readJSON(p('config', 'voice-settings.json'));
  return deepMerge(s, overrides || {});
}

function deepMerge(a, b) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) {
    out[k] = v && typeof v === 'object' && !Array.isArray(v) && a[k] && typeof a[k] === 'object' ? deepMerge(a[k], v) : v;
  }
  return out;
}

/** Текст для синтеза: словарь произношений, чистка символов. */
export function prepareSpeechText(text, settings) {
  let t = String(text);
  const dict = settings.pronunciation || {};
  const keys = Object.keys(dict).sort((a, b) => b.length - a.length);
  for (const k of keys) t = t.split(k).join(dict[k]);
  t = t.replace(/[«»"“”]/g, '').replace(/\*/g, '').replace(/—/g, ', ').replace(/\s+/g, ' ').trim();
  return t;
}

function voiceKey(settings) {
  const prov = settings.provider;
  return { prov, cfg: settings[prov] };
}

/** Скорость голоса: индивидуальная калибровка голоса × общий множитель. */
export function rhvoiceRate(c) {
  return Math.round((c.rates?.[c.voice] ?? c.rate ?? 100) * (c.speedFactor ?? 1));
}

async function synthRHVoice(text, settings, outFile) {
  if (!hasCommand('RHVoice-test')) {
    throw new Error('RHVoice не установлен. Установите: sudo apt-get install rhvoice rhvoice-russian (см. README).');
  }
  const c = settings.rhvoice;
  runSync('RHVoice-test', ['-p', c.voice, '-r', String(rhvoiceRate(c)), '-t', String(c.pitch ?? 100), '-v', String(c.volume ?? 100), '-o', outFile], {
    input: text,
  });
}

async function synthElevenLabs(text, settings, outFile) {
  loadEnv();
  const key = process.env.ELEVENLABS_API_KEY;
  const c = settings.elevenlabs;
  if (!key) throw new Error('Нет ELEVENLABS_API_KEY в .env');
  if (!c.voiceId) throw new Error('Не задан elevenlabs.voiceId в config/voice-settings.json');
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${c.voiceId}?output_format=pcm_44100`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'content-type': 'application/json' },
    body: JSON.stringify({ text, model_id: c.modelId, voice_settings: { stability: c.stability, similarity_boost: c.similarityBoost } }),
  });
  if (!res.ok) throw new Error(`ElevenLabs: ${res.status} ${await res.text()}`);
  const raw = Buffer.from(await res.arrayBuffer());
  writeWav(outFile, decodePCM16(raw), 44100);
}

async function synthYandex(text, settings, outFile) {
  loadEnv();
  const key = process.env.YANDEX_SPEECHKIT_API_KEY;
  const c = settings.yandex;
  if (!key) throw new Error('Нет YANDEX_SPEECHKIT_API_KEY в .env');
  const body = new URLSearchParams({ text, lang: 'ru-RU', voice: c.voice, speed: String(c.speed ?? 1), format: 'lpcm', sampleRateHertz: '48000' });
  if (c.role) body.set('emotion', c.role);
  if (process.env.YANDEX_FOLDER_ID) body.set('folderId', process.env.YANDEX_FOLDER_ID);
  const res = await fetch('https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize', {
    method: 'POST',
    headers: { Authorization: `Api-Key ${key}` },
    body,
  });
  if (!res.ok) throw new Error(`Yandex SpeechKit: ${res.status} ${await res.text()}`);
  writeWav(outFile, decodePCM16(Buffer.from(await res.arrayBuffer())), 48000);
}

const PROVIDERS = { rhvoice: synthRHVoice, elevenlabs: synthElevenLabs, yandex: synthYandex };

export async function synthesize(text, settings, cacheDir) {
  const speech = prepareSpeechText(text, settings);
  const key = hash(voiceKey(settings), speech);
  const file = path.join(ensureDir(cacheDir), `${key}.wav`);
  if (!fs.existsSync(file)) {
    const fn = PROVIDERS[settings.provider];
    if (!fn) throw new Error(`Неизвестный TTS-провайдер: ${settings.provider}`);
    await fn(speech, settings, file);
  }
  return file;
}

/** Обрезает тишину по краям (порог -45 dB), оставляя небольшой запас. */
function trimSilence(samples, sr) {
  const thr = 0.006;
  const win = Math.floor(sr * 0.01);
  let a = 0, b = samples.length;
  const loud = (i) => {
    let m = 0;
    for (let j = i; j < Math.min(samples.length, i + win); j++) m = Math.max(m, Math.abs(samples[j]));
    return m > thr;
  };
  while (a < b && !loud(a)) a += win;
  while (b > a && !loud(Math.max(0, b - win))) b -= win;
  const padA = Math.floor(sr * 0.03), padB = Math.floor(sr * 0.06);
  return samples.subarray(Math.max(0, a - padA), Math.min(samples.length, b + padB));
}

function normPhrase(ph) {
  return typeof ph === 'string' ? { text: ph } : ph;
}

/**
 * Озвучивает все сцены, строит таймлайн по фактической длительности.
 * Возвращает { scenes:[{start,duration,frames,phrases:[{text,start,end}]}], total, voiceFile, envelope }.
 */
export async function generateVoice(storyboard, { buildDir, fps, range }) {
  const settings = loadVoiceSettings(storyboard.voiceSettings);
  const cacheDir = path.join(buildDir, 'voice-cache');
  log(`Озвучка: ${settings.provider} / ${JSON.stringify(settings[settings.provider]?.voice ?? settings[settings.provider]?.voiceId ?? '')}`);

  // 1. Синтез фраз
  const raw = [];
  for (const scene of storyboard.scenes) {
    const list = [];
    for (const ph of scene.voice || []) {
      const phrase = normPhrase(ph);
      const file = await synthesize(phrase.say || phrase.text, settings, cacheDir);
      list.push({ phrase, file });
    }
    raw.push(list);
  }

  // 2. Подбор темпа под заданный диапазон длительности
  const decodeAll = (factor) =>
    raw.map((list) =>
      list.map(({ phrase, file }) => {
        let s = decodeAudio(file, SAMPLE_RATE);
        if (Math.abs(factor - 1) > 0.005) {
          const tmp = file.replace(/\.wav$/, `.tempo${factor.toFixed(3)}.wav`);
          if (!fs.existsSync(tmp)) runSync('ffmpeg', ['-v', 'error', '-y', '-i', file, '-af', `atempo=${factor.toFixed(4)}`, tmp]);
          s = decodeAudio(tmp, SAMPLE_RATE);
        }
        return { phrase, samples: trimSilence(s, SAMPLE_RATE) };
      }),
    );
  const pauses = settings.pauses;
  const estimate = (decoded) =>
    decoded.reduce((acc, list, i) => {
      const extra = storyboard.scenes[i].hold || 0;
      return acc + pauses.sceneStart + pauses.sceneEnd + extra + list.reduce((a, x) => a + x.samples.length / SAMPLE_RATE, 0) + Math.max(0, list.length - 1) * pauses.betweenPhrases;
    }, 0);

  let factor = 1;
  let decoded = decodeAll(1);
  let total = estimate(decoded);
  if (settings.autoRate?.enabled && range) {
    if (total > range.max) {
      factor = Math.min(settings.autoRate.maxFactor, (total - 0.3 * storyboard.scenes.length) / (range.max - 0.3 * storyboard.scenes.length - 0.5));
    } else if (total < range.min) {
      factor = Math.max(0.92, total / range.min);
    }
    if (Math.abs(factor - 1) > 0.01) {
      log(`Темп речи скорректирован ×${factor.toFixed(2)} под диапазон ${range.min}–${range.max} с (было ${total.toFixed(1)} с)`);
      decoded = decodeAll(factor);
      total = estimate(decoded);
    }
  }

  // 3. Раскладка по таймлайну с привязкой к кадрам
  const scenes = [];
  let cursorFrames = 0;
  const pieces = [];
  for (let i = 0; i < decoded.length; i++) {
    const list = decoded[i];
    let t = pauses.sceneStart;
    const phrases = [];
    for (let k = 0; k < list.length; k++) {
      const dur = list[k].samples.length / SAMPLE_RATE;
      phrases.push({ ...list[k].phrase, start: t, end: t + dur });
      pieces.push({ at: cursorFrames / fps + t, samples: list[k].samples });
      t += dur + (k < list.length - 1 ? pauses.betweenPhrases : 0);
    }
    t += pauses.sceneEnd + (storyboard.scenes[i].hold || 0);
    if (storyboard.scenes[i].minDuration) t = Math.max(t, storyboard.scenes[i].minDuration);
    const frames = Math.ceil(t * fps);
    scenes.push({ start: cursorFrames / fps, startFrame: cursorFrames, frames, duration: frames / fps, phrases });
    cursorFrames += frames;
  }
  const totalSec = cursorFrames / fps;
  const voice = new Float32Array(Math.ceil(totalSec * SAMPLE_RATE));
  for (const pc of pieces) {
    const off = Math.round(pc.at * SAMPLE_RATE);
    voice.set(pc.samples.subarray(0, Math.max(0, Math.min(pc.samples.length, voice.length - off))), off);
  }
  // нормализация пика речи
  let peak = 0;
  for (const s of voice) peak = Math.max(peak, Math.abs(s));
  if (peak > 0) for (let i = 0; i < voice.length; i++) voice[i] *= 0.89 / peak;

  const envelope = computeEnvelope(voice, SAMPLE_RATE, fps);
  return { scenes, total: totalSec, totalFrames: cursorFrames, voice, envelope, factor, provider: settings.provider, voiceName: settings[settings.provider]?.voice ?? settings[settings.provider]?.voiceId };
}

/** Огибающая громкости по кадрам 0..1 — для «говорящей» анимации маскота. */
export function computeEnvelope(samples, sr, fps) {
  const per = sr / fps;
  const n = Math.ceil(samples.length / per);
  const env = new Array(n);
  for (let f = 0; f < n; f++) {
    let sum = 0, cnt = 0;
    for (let i = Math.floor(f * per); i < Math.min(samples.length, Math.floor((f + 1) * per)); i++) {
      sum += samples[i] * samples[i];
      cnt++;
    }
    env[f] = cnt ? Math.sqrt(sum / cnt) : 0;
  }
  const sorted = [...env].sort((a, b) => a - b);
  const ref = sorted[Math.floor(sorted.length * 0.95)] || 1;
  // сглаживание: быстрое нарастание, медленный спад
  let prev = 0;
  return env.map((v) => {
    const x = Math.min(1, v / ref);
    prev = x > prev ? prev + (x - prev) * 0.7 : prev + (x - prev) * 0.25;
    return Math.round(prev * 1000) / 1000;
  });
}

/** Образцы всех доступных голосов для выбора постоянного. */
export async function renderVoiceSamples(outDir, text) {
  const settings = loadVoiceSettings();
  ensureDir(outDir);
  const sample = text || 'Здравствуйте! Я маскот Роском Онлайн. Расскажу, какие документы по персональным данным нужны вашему сайту.';
  const voices = [...settings.rhvoice.maleVoices.map((v) => [v, 'м']), ...settings.rhvoice.femaleVoices.map((v) => [v, 'ж'])];
  const results = [];
  for (const [v, g] of voices) {
    const s = { ...settings, provider: 'rhvoice', rhvoice: { ...settings.rhvoice, voice: v } };
    try {
      const f = await synthesize(sample, s, path.join(outDir, '.cache'));
      const out = path.join(outDir, `${g === 'м' ? 'male' : 'female'}-${v}.wav`);
      fs.copyFileSync(f, out);
      results.push(out);
    } catch (e) {
      results.push(`${v}: ошибка ${e.message}`);
    }
  }
  return results;
}
