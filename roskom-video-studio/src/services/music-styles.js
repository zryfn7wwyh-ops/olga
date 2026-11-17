// Стили собственной фоновой музыки (генерируется кодом — без лицензионных ограничений).
// Каждый стиль: темп, гармония, тембры и ритм. Выбор: config/video-settings.json → audio.musicStyle
// или "musicStyle" в storyboard.json.
const TAU = Math.PI * 2;
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

export const MUSIC_STYLES = {
  calm:      { name: 'Спокойный',            desc: 'мягкий пэд, лёгкое арпеджио, тихий бит — нейтральный фон для разборов' },
  energetic: { name: 'Энергичный',           desc: 'быстрый ровный бит, бас, яркие синты — для «3 ошибок» и динамичных роликов' },
  corporate: { name: 'Деловой позитив',      desc: 'фортепиано, хлопки, бас — «корпоративный» оптимизм, для CTA и услуг' },
  lofi:      { name: 'Лоу-фай',              desc: 'тёплые электропиано-аккорды, медленный свинг, лёгкий шум пластинки' },
  tech:      { name: 'Технологичный',        desc: 'пульсирующий бас шестнадцатыми, тики, холодный пэд — про сайты и данные' },
  news:      { name: 'Новостной',            desc: 'напряжённая пульсация, акценты литавр — для новостей законодательства' },
};

function env(t, a, d) { return Math.min(1, t / a) * Math.exp(-t * d); }
function addNote(out, sr, t0, len, fn) {
  const off = Math.floor(t0 * sr), L = Math.floor(len * sr);
  for (let j = 0; j < L && off + j < out.length; j++) if (off + j >= 0) out[off + j] += fn(j / sr);
}
const kick = (amp = 0.2) => (t) => Math.sin(TAU * (48 + 110 * Math.exp(-t * 32)) * t) * Math.exp(-t * 11) * amp;
const clap = (r, amp = 0.06) => (t) => (r() * 2 - 1) * Math.exp(-t * 28) * amp * (t < 0.012 || t > 0.02 ? 1 : 0.4);
const hat = (r, amp = 0.025, dec = 70) => (t) => (r() * 2 - 1) * Math.exp(-t * dec) * amp;

export function renderMusicStyle(style, seconds, sr, seed = 7) {
  const n = Math.ceil(seconds * sr);
  const out = new Float32Array(n);
  const r = rng(seed);
  const keyShift = [0, 2, 3, 5, -2][seed % 5];
  const P = {
    calm:      { bpm: 100, root: 57, prog: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]] },
    energetic: { bpm: 122, root: 57, prog: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]] },
    corporate: { bpm: 112, root: 60, prog: [[0, 4, 7, 11], [5, 9, 12, 16], [9, 12, 16, 19], [7, 11, 14, 17]] },
    lofi:      { bpm: 78,  root: 55, prog: [[0, 3, 7, 10], [5, 8, 12, 15], [10, 14, 17, 21], [3, 7, 10, 14]] },
    tech:      { bpm: 116, root: 52, prog: [[0, 3, 7], [0, 3, 7], [8, 12, 15], [10, 14, 17]] },
    news:      { bpm: 96,  root: 50, prog: [[0, 3, 7], [8, 12, 15], [5, 8, 12], [7, 10, 14]] },
  }[style] || null;
  if (!P) throw new Error('Неизвестный стиль музыки: ' + style);
  const root = P.root + keyShift;
  const beat = 60 / P.bpm, bar = beat * 4;
  const chordAt = (t) => P.prog[Math.floor(t / bar) % P.prog.length];

  // Пэд / аккорды
  if (['calm', 'energetic', 'tech', 'news'].includes(style)) {
    const vol = { calm: 0.05, energetic: 0.035, tech: 0.03, news: 0.04 }[style];
    for (let i = 0; i < n; i++) {
      const t = i / sr, tb = t % bar;
      const e = Math.min(1, tb / 0.5) * Math.min(1, (bar - tb) / 0.4);
      let v = 0;
      for (const iv of chordAt(t)) { const f = midi(root + iv); v += Math.sin(TAU * f * t) * 0.5 + Math.sin(TAU * f * 1.006 * t) * 0.3 + Math.sin(TAU * f * 0.5 * t) * 0.2; }
      out[i] += v * e * vol;
    }
  }
  // Фортепиано (corporate) / электропиано (lofi): аккорды на долях
  if (style === 'corporate' || style === 'lofi') {
    const hits = style === 'corporate' ? [0, 1.5, 2, 3, 3.5] : [0, 2.5];
    for (let b = 0; b * bar < seconds; b++) for (const h of hits) {
      const t0 = b * bar + h * beat + (style === 'lofi' ? (r() - 0.5) * 0.03 : 0);
      for (const iv of P.prog[b % P.prog.length]) {
        const f = midi(root + iv + 12);
        const dec = style === 'corporate' ? 3.2 : 1.6;
        const vol = style === 'corporate' ? 0.03 : 0.035;
        addNote(out, sr, t0, 1.6, (t) => (Math.sin(TAU * f * t) + 0.35 * Math.sin(TAU * f * 2 * t) * Math.exp(-t * 6) + (style === 'lofi' ? 0.2 * Math.sin(TAU * f * 1.003 * t) : 0)) * env(t, 0.004, dec) * vol);
      }
    }
  }
  // Арпеджио
  if (['calm', 'energetic', 'corporate'].includes(style)) {
    const step = style === 'energetic' ? beat / 4 : beat / 2;
    const vol = { calm: 0.045, energetic: 0.03, corporate: 0.025 }[style];
    for (let k = 0; k * step < seconds; k++) {
      const t0 = k * step, ch = chordAt(t0);
      const note = root + 24 + ch[[0, 1, 2, 1, 0, 2, 1, 2][k % 8] % ch.length];
      const f = midi(note);
      addNote(out, sr, t0, 0.3, (t) => (style === 'energetic' ? Math.sign(Math.sin(TAU * f * t)) * 0.35 + Math.sin(TAU * f * t) * 0.6 : Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 2 * f * t)) * env(t, 0.003, 12) * vol * (0.7 + 0.3 * r()));
    }
  }
  // Бас
  if (['energetic', 'corporate', 'tech', 'news', 'lofi'].includes(style)) {
    const pattern = { energetic: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], corporate: [0, 1.5, 2, 3], tech: Array.from({ length: 16 }, (_, i) => i / 4), news: [0, 0.75, 2, 2.75], lofi: [0, 2.5] }[style];
    const vol = { energetic: 0.09, corporate: 0.08, tech: 0.07, news: 0.09, lofi: 0.08 }[style];
    for (let b = 0; b * bar < seconds; b++) for (const h of pattern) {
      const t0 = b * bar + h * beat, f = midi(root - 12 + P.prog[b % P.prog.length][0]);
      const len = style === 'tech' ? beat / 4.5 : beat * 0.9;
      addNote(out, sr, t0, len, (t) => (Math.sin(TAU * f * t) + 0.25 * Math.sin(TAU * 2 * f * t)) * Math.min(1, t / 0.005) * Math.min(1, (len - t) / 0.02) * vol);
    }
  }
  // Ударные
  const beats = Math.ceil(seconds / beat);
  for (let k = 0; k < beats; k++) {
    const t0 = k * beat;
    if (style === 'calm' && k % 2 === 0) addNote(out, sr, t0, 0.3, kick(0.14));
    if (style === 'energetic') { addNote(out, sr, t0, 0.3, kick(0.2)); addNote(out, sr, t0 + beat / 2, 0.08, hat(r, 0.035, 55)); }
    if (style === 'corporate') { if (k % 2 === 0) addNote(out, sr, t0, 0.3, kick(0.17)); else addNote(out, sr, t0, 0.15, clap(r, 0.07)); addNote(out, sr, t0 + beat / 2, 0.05, hat(r, 0.02)); }
    if (style === 'lofi') { if (k % 4 === 0 || k % 4 === 2.5) addNote(out, sr, t0, 0.3, kick(0.15)); if (k % 2 === 1) addNote(out, sr, t0, 0.15, clap(r, 0.045)); addNote(out, sr, t0 + beat * 0.6, 0.05, hat(r, 0.018)); }
    if (style === 'tech') { if (k % 2 === 0) addNote(out, sr, t0, 0.3, kick(0.16)); for (let q = 0; q < 4; q++) addNote(out, sr, t0 + (q * beat) / 4, 0.03, hat(r, q % 2 ? 0.012 : 0.022, 120)); }
    if (style === 'news') { if (k % 4 === 0) addNote(out, sr, t0, 0.6, (t) => Math.sin(TAU * (70 + 40 * Math.exp(-t * 8)) * t) * Math.exp(-t * 4) * 0.2); addNote(out, sr, t0 + beat / 2, 0.06, hat(r, 0.02, 60)); }
  }
  // Шум пластинки для lofi
  if (style === 'lofi') for (let i = 0; i < n; i++) { out[i] += (r() * 2 - 1) * 0.004; if (r() < 0.00008) out[i] += (r() - 0.5) * 0.15; }
  // Плавное начало/конец
  const fade = Math.floor(sr * 1.2);
  for (let i = 0; i < fade && i < n; i++) { out[i] *= i / fade; out[n - 1 - i] *= i / fade; }
  // Нормализация до общего уровня
  let rms = 0; for (let i = 0; i < n; i += 7) rms += out[i] * out[i]; rms = Math.sqrt(rms / (n / 7));
  const g = rms > 0 ? 0.07 / rms : 1;
  for (let i = 0; i < n; i++) out[i] = Math.max(-0.95, Math.min(0.95, out[i] * g));
  return out;
}
