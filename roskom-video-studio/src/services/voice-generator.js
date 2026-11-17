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
  t = t.replace(/[«»"“”]/g, '').replace(/—/g, ', ').replace(/\s+/g, ' ').trim();
  // **слово** — логическое ударение: SpeechKit понимает разметку, остальным движкам она не нужна
  if (settings.provider !== 'yandex') t = t.replace(/\*/g, '');
  return t;
}

/** Ключ кеша озвучки — только параметры, влияющие на звук (комментарии и прочие поля конфига не вызывают повторный синтез). */
function voiceKey(settings) {
  const prov = settings.provider;
  const c = settings[prov] || {};
  const pick = (keys) => Object.fromEntries(keys.filter((k) => c[k] !== undefined && c[k] !== null).map((k) => [k, c[k]]));
  if (prov === 'rhvoice') return { prov, voice: c.voice, rate: rhvoiceRate(c), ...pick(['pitch', 'volume']) };
  if (prov === 'yandex') return { prov, ...pick(['voice', 'role', 'speed', 'pitchShift', 'volume']) };
  if (prov === 'elevenlabs') return { prov, ...pick(['voiceId', 'modelId', 'stability', 'similarityBoost', 'style', 'speed']) };
  return { prov, cfg: c };
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

/**
 * HTTP-запрос через curl: curl учитывает системный прокси (HTTPS_PROXY) и одинаково работает
 * на компьютере пользователя и в облачной среде. Возвращает { status, file }.
 */
function curlRequest({ url, method = 'GET', headers = {}, body, outFile }) {
  const args = ['-sS', '-X', method, '-o', outFile, '-w', '%{http_code}', '--max-time', '120'];
  for (const [k, v] of Object.entries(headers)) args.push('-H', `${k}: ${v}`);
  if (body !== undefined) args.push('--data-binary', '@-');
  args.push(url);
  const r = runSync('curl', args, { input: body, allowFail: true });
  if (r.status !== 0) throw new Error(`Сеть: не удалось обратиться к ${new URL(url).host} (${(r.stderr || '').trim()})`);
  return { status: +r.stdout.trim(), file: outFile };
}

function elevenKey() {
  loadEnv();
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('Нет ELEVENLABS_API_KEY в .env (см. docs/elevenlabs.md)');
  return key;
}

function elevenError(status, file) {
  const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').slice(0, 500) : '';
  const hint = { 401: 'неверный или отключённый API-ключ', 402: 'закончились кредиты/нужен другой тариф', 404: 'неверный voiceId', 422: 'неверные параметры запроса', 429: 'превышен лимит запросов — повторите позже' }[status] || '';
  return new Error(`ElevenLabs: HTTP ${status}${hint ? ' — ' + hint : ''}. ${text}`);
}

async function synthElevenLabs(text, settings, outFile) {
  const key = elevenKey();
  const c = settings.elevenlabs;
  if (!c.voiceId) throw new Error('Не задан elevenlabs.voiceId в config/voice-settings.json (список голосов: npm run voices -- --provider elevenlabs)');
  const mp3 = outFile.replace(/\.wav$/, '.mp3');
  const voiceSettings = { stability: c.stability, similarity_boost: c.similarityBoost, style: c.style ?? 0, use_speaker_boost: true };
  if (c.speed) voiceSettings.speed = c.speed;
  // mp3_44100_128 доступен на всех тарифах (PCM — только на Pro и выше)
  const { status } = curlRequest({
    url: `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(c.voiceId)}?output_format=mp3_44100_128`,
    method: 'POST',
    headers: { 'xi-api-key': key, 'content-type': 'application/json', accept: 'audio/mpeg' },
    body: JSON.stringify({ text, model_id: c.modelId, voice_settings: voiceSettings }),
    outFile: mp3,
  });
  if (status !== 200) {
    const err = elevenError(status, mp3);
    fs.rmSync(mp3, { force: true });
    throw err;
  }
  runSync('ffmpeg', ['-v', 'error', '-y', '-i', mp3, '-ac', '1', '-ar', '48000', outFile]);
  fs.rmSync(mp3, { force: true });
}

/** Голоса из аккаунта ElevenLabs (включая добавленные из библиотеки и клонированные). */
export function listElevenLabsVoices(tmpDir) {
  const key = elevenKey();
  ensureDir(tmpDir);
  const out = path.join(tmpDir, 'voices.json');
  const { status } = curlRequest({ url: 'https://api.elevenlabs.io/v1/voices', headers: { 'xi-api-key': key }, outFile: out });
  if (status !== 200) throw elevenError(status, out);
  return JSON.parse(fs.readFileSync(out, 'utf8')).voices.map((v) => ({
    id: v.voice_id, name: v.name, category: v.category, labels: v.labels || {},
  }));
}

// Голоса SpeechKit (API v3) и доступные амплуа. Источник: документация Yandex SpeechKit «Список голосов».
export const YANDEX_VOICES = {
  male: { filipp: [], ermil: ['neutral', 'good'], zahar: ['neutral', 'good'], madirus: [], alexander: ['neutral', 'good'], kirill: ['neutral', 'strict', 'good'], anton: ['neutral', 'good'] },
  female: { alena: ['neutral', 'good'], jane: ['neutral', 'good', 'evil'], omazh: ['neutral', 'evil'], dasha: ['neutral', 'good', 'friendly'], julia: ['neutral', 'strict'], lera: ['neutral', 'friendly'], masha: ['good', 'strict', 'friendly'], marina: ['neutral', 'whisper', 'friendly'] },
};

async function synthYandex(text, settings, outFile) {
  loadEnv();
  const key = process.env.YANDEX_SPEECHKIT_API_KEY;
  const c = settings.yandex;
  if (!key) throw new Error('Нет YANDEX_SPEECHKIT_API_KEY в .env (в облачной сессии ключ подставляет прокси — достаточно значения proxy-injected)');
  const hints = [{ voice: c.voice }];
  if (c.role) hints.push({ role: c.role });
  if (c.speed && c.speed !== 1) hints.push({ speed: String(c.speed) });
  if (c.pitchShift) hints.push({ pitchShift: String(c.pitchShift) });
  if (c.volume) hints.push({ volume: String(c.volume) });
  const body = {
    text,
    outputAudioSpec: { rawAudio: { audioEncoding: 'LINEAR16_PCM', sampleRateHertz: '48000' } },
    hints,
    loudnessNormalizationType: 'LUFS',
  };
  const raw = outFile.replace(/\.wav$/, '.json');
  const headers = { Authorization: `Api-Key ${key}`, 'content-type': 'application/json' };
  if (process.env.YANDEX_FOLDER_ID) headers['x-folder-id'] = process.env.YANDEX_FOLDER_ID;
  const { status } = curlRequest({ url: 'https://tts.api.cloud.yandex.net/tts/v3/utteranceSynthesis', method: 'POST', headers, body: JSON.stringify(body), outFile: raw });
  const txt = fs.readFileSync(raw, 'utf8');
  fs.rmSync(raw, { force: true });
  if (status !== 200) throw new Error(`Yandex SpeechKit: HTTP ${status} ${txt.slice(0, 300)}`);
  // ответ — поток JSON-объектов {"result":{"audioChunk":{"data":"<base64>"}}}, по одному на строку
  const chunks = [];
  for (const line of txt.split(/\n+/).filter((l) => l.trim())) {
    const obj = JSON.parse(line);
    if (obj.error) throw new Error(`Yandex SpeechKit: ${JSON.stringify(obj.error).slice(0, 300)}`);
    const d = obj.result?.audioChunk?.data;
    if (d) chunks.push(Buffer.from(d, 'base64'));
  }
  if (!chunks.length) throw new Error('Yandex SpeechKit: пустой ответ');
  writeWav(outFile, decodePCM16(Buffer.concat(chunks)), 48000);
}

/** Образцы голосов SpeechKit: каждый голос в нейтральном и в «приветливом» амплуа (если есть). */
export async function renderYandexSamples(outDir, text, { voices } = {}) {
  const settings = loadVoiceSettings();
  ensureDir(outDir);
  const sample = text || 'Здравствуйте! Я маскот Роском Онлайн. Расскажу, какие документы по персональным данным нужны вашему сайту.';
  const results = [];
  for (const [gender, list] of Object.entries(YANDEX_VOICES)) {
    for (const [voice, roles] of Object.entries(list)) {
      if (voices && !voices.includes(voice)) continue;
      const variants = [null, ...['friendly', 'good'].filter((r) => roles.includes(r)).slice(0, 1)];
      for (const role of variants) {
        const s = { ...settings, provider: 'yandex', yandex: { ...settings.yandex, voice, role, speed: settings.yandex.speed } };
        const name = `yandex-${gender}-${voice}${role ? '-' + role : ''}`;
        try {
          const f = await synthesize(sample, s, path.join(outDir, '.cache'));
          const out = path.join(outDir, `${name}.wav`);
          fs.copyFileSync(f, out);
          results.push(out);
        } catch (e) {
          results.push(`${name}: ошибка ${e.message}`);
        }
      }
    }
  }
  return results;
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
  for (const [si, scene] of storyboard.scenes.entries()) {
    const list = [];
    // Подача сцены: scene.voiceStyle, а для хука (первой сцены) — стиль hookStyle из настроек провайдера
    const prov = settings.provider;
    const style = scene.voiceStyle ?? (si === 0 && settings[prov]?.hookStyle?.enabled ? settings[prov].hookStyle : null);
    const sceneSettings = style ? deepMerge(settings, { [prov]: Object.fromEntries(Object.entries(style).filter(([k]) => !['enabled', 'note'].includes(k))) }) : settings;
    for (const ph of scene.voice || []) {
      const phrase = normPhrase(ph);
      const file = await synthesize(phrase.say || phrase.text, sceneSettings, cacheDir);
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

/**
 * Образцы голосов ElevenLabs из аккаунта (тратит кредиты: ~110 символов на голос).
 * ids — конкретные voice_id; иначе первые limit голосов аккаунта.
 */
export async function renderElevenLabsSamples(outDir, text, { ids, limit = 8 } = {}) {
  const settings = loadVoiceSettings();
  ensureDir(outDir);
  const sample = text || 'Здравствуйте! Я маскот Роском Онлайн. Расскажу, какие документы по персональным данным нужны вашему сайту.';
  const all = listElevenLabsVoices(path.join(outDir, '.cache'));
  const chosen = ids?.length ? all.filter((v) => ids.includes(v.id)) : all.slice(0, limit);
  const results = [];
  for (const v of chosen) {
    const s = { ...settings, provider: 'elevenlabs', elevenlabs: { ...settings.elevenlabs, voiceId: v.id } };
    const safe = v.name.replace(/[^\p{L}\p{N}]+/gu, '_').slice(0, 30);
    try {
      const f = await synthesize(sample, s, path.join(outDir, '.cache'));
      const out = path.join(outDir, `elevenlabs-${safe}-${v.id}.wav`);
      fs.copyFileSync(f, out);
      results.push(out);
    } catch (e) {
      results.push(`${v.name} (${v.id}): ошибка ${e.message}`);
    }
  }
  return { voices: all, results };
}
