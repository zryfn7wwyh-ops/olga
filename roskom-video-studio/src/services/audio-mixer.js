// Звуковое оформление: музыка (лицензированная из assets/music или собственная сгенерированная),
// звуковые эффекты на переходах, автоматическое приглушение музыки во время речи, нормализация громкости.
import path from 'node:path';
import fs from 'node:fs';
import { decodeAudio, writeWav, runSync, log } from './util.js';
import { findLicensedMusic } from './asset-manager.js';

const TAU = Math.PI * 2;

// Детерминированный генератор случайных чисел (повторяемость сборки)
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

/**
 * Собственная фоновая музыка (генерируется кодом — без лицензионных ограничений):
 * мягкий пэд на прогрессии I–V–vi–IV, лёгкий арпеджио-«плак» и тихий бит.
 */
export function generateMusic(seconds, sr, seed = 7, mood = 'calm') {
  const n = Math.ceil(seconds * sr);
  const out = new Float32Array(n);
  const bpm = mood === 'energetic' ? 112 : 100;
  const beat = 60 / bpm;
  const bar = beat * 4;
  const keys = [0, 2, 3, 5]; // C, D, Eb, F — разные тональности для разных роликов
  const root = 57 + keys[seed % keys.length]; // A3 + сдвиг
  const prog = [
    [0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12],
  ];
  const r = rng(seed);
  // Пэд
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    const bi = Math.floor(t / bar) % prog.length;
    const tb = t % bar;
    const env = Math.min(1, tb / 0.6) * Math.min(1, (bar - tb) / 0.5);
    let v = 0;
    for (const iv of prog[bi]) {
      const f = midi(root + iv);
      v += Math.sin(TAU * f * t) * 0.5 + Math.sin(TAU * f * 2.003 * t) * 0.12 + Math.sin(TAU * (f / 2) * t) * 0.25;
    }
    out[i] += v * env * 0.05;
  }
  // Арпеджио (восьмые)
  const step = beat / 2;
  for (let k = 0; k * step < seconds; k++) {
    const t0 = k * step;
    const bi = Math.floor(t0 / bar) % prog.length;
    const chord = prog[bi];
    const note = root + 12 + chord[[0, 1, 2, 1, 0, 2, 1, 2][k % 8]];
    const f = midi(note);
    const len = Math.floor(0.35 * sr);
    const off = Math.floor(t0 * sr);
    const vel = 0.6 + 0.4 * r();
    for (let j = 0; j < len && off + j < n; j++) {
      const t = j / sr;
      const e = Math.exp(-t * 9) * Math.min(1, t / 0.004);
      out[off + j] += (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * f * 2 * t)) * e * 0.045 * vel;
    }
  }
  // Мягкий бит: бочка на 1 и 3, шейкер на офф-битах
  for (let k = 0; k * beat < seconds; k++) {
    const off = Math.floor(k * beat * sr);
    if (k % 2 === 0) {
      for (let j = 0; j < 0.25 * sr && off + j < n; j++) {
        const t = j / sr;
        out[off + j] += Math.sin(TAU * (50 + 90 * Math.exp(-t * 30)) * t) * Math.exp(-t * 14) * 0.16;
      }
    }
    const off2 = Math.floor((k + 0.5) * beat * sr);
    for (let j = 0; j < 0.06 * sr && off2 + j < n; j++) {
      const t = j / sr;
      out[off2 + j] += (r() * 2 - 1) * Math.exp(-t * 60) * 0.025;
    }
  }
  // Плавное начало/конец
  const fade = Math.floor(sr * 1.2);
  for (let i = 0; i < fade && i < n; i++) {
    out[i] *= i / fade;
    out[n - 1 - i] *= i / fade;
  }
  return out;
}

// ---- Звуковые эффекты (синтез) ----
function sfxWhoosh(sr) {
  const len = Math.floor(0.45 * sr);
  const out = new Float32Array(len);
  const r = rng(3);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const t = i / len;
    const cutoff = 0.02 + 0.25 * Math.sin(Math.PI * t);
    lp += cutoff * ((r() * 2 - 1) - lp);
    out[i] = lp * Math.sin(Math.PI * t) ** 2 * 0.9;
  }
  return out;
}
function sfxPop(sr) {
  const len = Math.floor(0.12 * sr);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    out[i] = Math.sin(TAU * (620 + 500 * Math.exp(-t * 40)) * t) * Math.exp(-t * 38) * 0.5;
  }
  return out;
}
function sfxDing(sr) {
  const len = Math.floor(0.9 * sr);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    out[i] = (Math.sin(TAU * 1320 * t) * 0.5 + Math.sin(TAU * 1980 * t) * 0.25 + Math.sin(TAU * 2640 * t) * 0.1) * Math.exp(-t * 5) * 0.45;
  }
  return out;
}
function sfxAlert(sr) {
  const len = Math.floor(0.5 * sr);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    const f = t < 0.18 ? 880 : 660;
    out[i] = Math.sign(Math.sin(TAU * f * t)) * 0.12 * Math.exp(-((t % 0.18) * 10));
  }
  return out;
}
function sfxTick(sr) {
  const len = Math.floor(0.08 * sr);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    out[i] = Math.sin(TAU * 1800 * t) * Math.exp(-t * 80) * 0.45;
  }
  return out;
}
const SFX = { whoosh: sfxWhoosh, pop: sfxPop, ding: sfxDing, alert: sfxAlert, tick: sfxTick };

/** Загружает пользовательский эффект из assets/sfx/<name>.wav, если есть, иначе синтезирует. */
function getSfx(name, sr, sfxDir) {
  const f = path.join(sfxDir, `${name}.wav`);
  if (fs.existsSync(f)) return decodeAudio(f, sr);
  return (SFX[name] || sfxPop)(sr);
}

/**
 * Сводит voice + music + sfx в mix.wav.
 * events: [{ t: секунды, name: 'whoosh' | 'pop' | ... }]
 */
export function mixAudio({ voice, sr, totalSec, events, outFile, settings, seed, sfxDir, envelope, fps, mood }) {
  const n = Math.ceil(totalSec * sr);
  const mix = new Float32Array(n);
  // Музыка
  let music;
  let musicInfo;
  const licensed = findLicensedMusic();
  if (licensed.length) {
    const track = licensed[seed % licensed.length];
    const src = decodeAudio(track.file, sr);
    music = new Float32Array(n);
    for (let i = 0; i < n; i++) music[i] = src[i % src.length];
    musicInfo = { source: 'licensed', file: path.basename(track.file), license: track.license };
  } else {
    music = generateMusic(totalSec, sr, seed, mood);
    musicInfo = { source: 'generated', license: 'Собственная музыка, сгенерированная кодом студии — ограничений на коммерческое использование нет' };
  }
  // Приглушение музыки во время речи (по огибающей речи, сглаженной на ~0.4 с)
  const duckCurve = new Float32Array(envelope.length);
  let d = 0;
  for (let f = 0; f < envelope.length; f++) {
    // смотрим немного вперёд, чтобы музыка уходила до начала фразы
    let speaking = 0;
    for (let k = 0; k < 6 && f + k < envelope.length; k++) speaking = Math.max(speaking, envelope[f + k] > 0.08 ? 1 : 0);
    d = speaking ? Math.min(1, d + 0.25) : Math.max(0, d - 0.04);
    duckCurve[f] = d;
  }
  const hi = settings.musicVolume, lo = settings.musicDuckedVolume;
  for (let i = 0; i < n; i++) {
    const f = Math.min(duckCurve.length - 1, Math.floor((i / sr) * fps));
    const g = hi + (lo - hi) * (duckCurve[f] || 0);
    mix[i] += music[i] * g * 3.0;
  }
  // Речь
  for (let i = 0; i < Math.min(n, voice.length); i++) mix[i] += voice[i];
  // Эффекты
  for (const ev of events) {
    const s = getSfx(ev.name, sr, sfxDir);
    const off = Math.round(ev.t * sr);
    const vol = settings.sfxVolume * (ev.volume ?? 1);
    for (let j = 0; j < s.length && off + j < n; j++) if (off + j >= 0) mix[off + j] += s[j] * vol;
  }
  // Защита от клиппинга
  let peak = 0;
  for (const v of mix) peak = Math.max(peak, Math.abs(v));
  if (peak > 0.97) for (let i = 0; i < n; i++) mix[i] *= 0.97 / peak;
  const tmp = outFile.replace(/\.wav$/, '.raw.wav');
  writeWav(tmp, mix, sr);
  // Нормализация громкости для соцсетей
  runSync('ffmpeg', ['-v', 'error', '-y', '-i', tmp, '-af', `loudnorm=I=${settings.loudnessLUFS}:TP=-1.5:LRA=11`, '-ar', String(sr), '-ac', '1', outFile]);
  fs.unlinkSync(tmp);
  log(`Звук: музыка — ${musicInfo.source === 'generated' ? 'сгенерированная' : musicInfo.file}, эффектов: ${events.length}`);
  return musicInfo;
}
