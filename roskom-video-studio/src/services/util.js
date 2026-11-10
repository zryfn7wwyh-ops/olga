// Общие утилиты: пути, JSON, запуск процессов, .env, WAV.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const p = (...parts) => path.join(ROOT, ...parts);

export function readJSON(file, fallback) {
  if (!fs.existsSync(file)) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Файл не найден: ${file}`);
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    throw new Error(`Ошибка JSON в ${file}: ${e.message}`);
  }
}

export function writeJSON(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function hash(...values) {
  const h = crypto.createHash('sha1');
  for (const v of values) h.update(typeof v === 'string' ? v : JSON.stringify(v));
  return h.digest('hex').slice(0, 16);
}

export function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

export function loadEnv() {
  const file = p('.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

export function runSync(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: opts.encoding ?? 'utf8', maxBuffer: 1 << 28, ...opts });
  if (r.error) throw new Error(`Не удалось запустить ${cmd}: ${r.error.message}`);
  if (r.status !== 0 && !opts.allowFail) {
    throw new Error(`${cmd} завершился с кодом ${r.status}: ${(r.stderr || '').toString().slice(-1500)}`);
  }
  return r;
}

export function run(cmd, args, { input, ...opts } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'], ...opts });
    let stderr = '';
    let stdout = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${cmd} завершился с кодом ${code}: ${stderr.slice(-1500)}`));
    });
    if (input !== undefined) child.stdin.end(input);
  });
}

export function hasCommand(cmd) {
  return spawnSync('sh', ['-c', `command -v ${cmd}`]).status === 0;
}

export function ffprobe(file) {
  const r = runSync('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', file]);
  return JSON.parse(r.stdout);
}

export function mediaDuration(file) {
  return parseFloat(ffprobe(file).format.duration);
}

// ---------- WAV (PCM16 mono) ----------

/** Декодирует любой аудиофайл в Float32Array mono с нужной частотой через ffmpeg. */
export function decodeAudio(file, sampleRate = 48000) {
  const r = runSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 's16le', '-ac', '1', '-ar', String(sampleRate), '-'], {
    encoding: 'buffer',
  });
  const buf = r.stdout;
  const out = new Float32Array(buf.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = buf.readInt16LE(i * 2) / 32768;
  return out;
}

export function decodePCM16(buf) {
  const out = new Float32Array(Math.floor(buf.length / 2));
  for (let i = 0; i < out.length; i++) out[i] = buf.readInt16LE(i * 2) / 32768;
  return out;
}

export function writeWav(file, samples, sampleRate = 48000, channels = 1) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(channels, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * channels * 2, 28);
  buf.writeUInt16LE(channels * 2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buf);
}

export function log(...args) {
  console.log('•', ...args);
}

export function slugify(text) {
  const map = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' };
  return text
    .toLowerCase()
    .split('')
    .map((c) => (map[c] ?? c))
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .split('-')
    .slice(0, 7)
    .join('-');
}
