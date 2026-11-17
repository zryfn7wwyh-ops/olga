// Синхронизация губ: по озвучке для каждого кадра выбирается форма рта (viseme).
// closed — пауза, м/б/п; e — и/э/с/з/ш (зубы); u — у/ю (узкий круглый); o — о; a — а (широко).
// Признаки по каждому кадру: громкость, «центр тяжести» спектра и доля высоких частот.

function fftMag(frame) {
  // радикс-2 FFT, frame.length — степень двойки
  const n = frame.length;
  const re = Float64Array.from(frame), im = new Float64Array(n);
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const ar = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci, ai = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
        re[i + k + len / 2] = re[i + k] - ar; im[i + k + len / 2] = im[i + k] - ai;
        re[i + k] += ar; im[i + k] += ai;
        const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
      }
    }
  }
  const mag = new Float64Array(n / 2);
  for (let i = 0; i < n / 2; i++) mag[i] = Math.hypot(re[i], im[i]);
  return mag;
}

/** Признаки по кадрам видео: { rms, centroid, high } */
export function voiceFeatures(samples, sr, fps) {
  const N = 2048, per = sr / fps;
  const frames = Math.ceil(samples.length / per);
  const win = Float64Array.from({ length: N }, (_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (N - 1)));
  const bin = sr / N;
  const out = [];
  for (let f = 0; f < frames; f++) {
    const c = Math.floor(f * per + per / 2), s = c - N / 2;
    const fr = new Float64Array(N);
    let e = 0;
    for (let i = 0; i < N; i++) { const v = samples[s + i] || 0; fr[i] = v * win[i]; e += v * v; }
    const mag = fftMag(fr);
    let tot = 0, wsum = 0, hi = 0;
    for (let k = Math.floor(200 / bin); k < Math.floor(5000 / bin); k++) {
      const p = mag[k] * mag[k];
      tot += p; wsum += p * k * bin;
      if (k * bin > 2000) hi += p;
    }
    out.push({ rms: Math.sqrt(e / N), centroid: tot ? wsum / tot : 0, high: tot ? hi / tot : 0 });
  }
  return out;
}

/** Дорожка форм рта по кадрам. Пороги относительные (процентили по самой озвучке) — подходят любому голосу. */
export function visemeTrack(samples, sr, fps, opts = {}) {
  const feats = voiceFeatures(samples, sr, fps);
  const sortedRms = feats.map((x) => x.rms).sort((a, b) => a - b);
  const ref = sortedRms[Math.floor(sortedRms.length * 0.95)] || 1;
  const silence = opts.silence ?? 0.1;
  const voiced = feats.filter((x) => x.rms / ref >= silence);
  const rankOf = (arr) => { const s = [...arr].sort((a, b) => a - b); return (v) => { let lo = 0, hi = s.length; while (lo < hi) { const m = (lo + hi) >> 1; if (s[m] < v) lo = m + 1; else hi = m; } return lo / Math.max(1, s.length); }; };
  const rRms = rankOf(voiced.map((x) => x.rms)), rCen = rankOf(voiced.map((x) => x.centroid)), rHi = rankOf(voiced.map((x) => x.high));
  let raw = feats.map(({ rms, centroid, high }) => {
    if (rms / ref < silence) return 'closed';
    const open = rRms(rms), bright = rCen(centroid), hiss = rHi(high);
    if (hiss > 0.85 && high > 0.12) return 'e';         // шипящие/свистящие, «и»
    if (open > 0.62) return bright > 0.35 ? 'a' : 'o';  // громкие гласные: открыто
    if (open > 0.3) return bright > 0.55 ? 'e' : 'o';
    return 'u';                                          // тихие/переходные — небольшой рот
  });
  for (let i = 1; i < raw.length - 1; i++) if (raw[i] !== raw[i - 1] && raw[i] !== raw[i + 1]) raw[i] = raw[i - 1];
  return { track: raw, feats, ref };
}

// ---------- Синхронизация по тексту ----------
// Текст фразы известен точно: раскладываем его на гласные и «видимые» согласные
// и привязываем гласные к слогам в звуке (пикам громкости).

const VOWEL = { а: 'a', я: 'a', о: 'o', ё: 'o', у: 'u', ю: 'u', и: 'e', ы: 'e', е: 'e', э: 'e' };
const LABIAL = new Set(['м', 'б', 'п']);             // губы смыкаются
const DENTAL = new Set(['ф', 'в', 'с', 'з', 'ш', 'щ', 'ж', 'ч', 'ц']); // зубы/узкая щель
const LATIN = { a: 'эй', b: 'би', c: 'си', d: 'ди', e: 'и', f: 'эф', g: 'джи', h: 'эйч', i: 'ай', j: 'джей', k: 'кей', l: 'эл', m: 'эм', n: 'эн', o: 'оу', p: 'пи', q: 'кью', r: 'ар', s: 'эс', t: 'ти', u: 'ю', v: 'ви', w: 'дабл ю', x: 'экс', y: 'уай', z: 'зед' };

/** Звуковые единицы текста: [{ kind: 'V'|'C', vis }] */
export function textUnits(text) {
  let t = String(text).toLowerCase()
    .replace(/sil<\[\d+\]>/g, ' ').replace(/[*+]/g, '')
    .replace(/[a-z]+/g, (w) => (w.length <= 4 ? [...w].map((ch) => LATIN[ch] || '').join(' ') : w));
  const units = [];
  for (const ch of t) {
    if (VOWEL[ch]) units.push({ kind: 'V', vis: VOWEL[ch] });
    else if (LABIAL.has(ch)) units.push({ kind: 'C', vis: 'closed' });
    else if (DENTAL.has(ch)) units.push({ kind: 'C', vis: 'e' });
    else if (/[a-z]/.test(ch)) units.push({ kind: 'V', vis: 'e' }); // длинные латинские слова — грубо
  }
  return units;
}

/**
 * Дорожка ртов по тексту фраз.
 * phrases: [{ start, end, text }] — глобальное время (с), text — то, что реально произнесено (с учётом say/словаря).
 */
export function visemeTrackAligned(samples, sr, fps, phrases, opts = {}) {
  const base = visemeTrack(samples, sr, fps, opts); // признаки и запасной вариант
  const { feats, ref } = base;
  const n = feats.length;
  const track = new Array(n).fill('closed');
  const silence = opts.silence ?? 0.1;
  const lead = opts.lead ?? 1; // опережение на кадр
  const energy = feats.map((x) => x.rms / ref);
  // сглаженная громкость для поиска слогов
  const sm = energy.map((_, i) => (energy[i - 1] ?? energy[i]) * 0.25 + energy[i] * 0.5 + (energy[i + 1] ?? energy[i]) * 0.25);
  for (const ph of phrases) {
    const f0 = Math.max(0, Math.floor(ph.start * fps)), f1 = Math.min(n - 1, Math.ceil(ph.end * fps));
    const units = textUnits(ph.text);
    const vowels = units.map((u, i) => (u.kind === 'V' ? i : -1)).filter((i) => i >= 0);
    if (!vowels.length || f1 - f0 < 3) { for (let f = f0; f <= f1; f++) track[f] = base.track[f]; continue; }
    // 1) центры гласных: равные доли «речевой массы» фразы, затем подтяжка к ближайшему пику громкости
    const mass = [];
    let acc = 0;
    for (let f = f0; f <= f1; f++) { acc += Math.max(0, sm[f] - silence * 0.5); mass.push(acc); }
    const centers = vowels.map((_, k) => {
      const target = ((k + 0.5) / vowels.length) * acc;
      let f = f0;
      while (f < f1 && mass[f - f0] < target) f++;
      let best = f;
      for (let d = -2; d <= 2; d++) { const g = f + d; if (g >= f0 && g <= f1 && sm[g] > sm[best]) best = g; }
      return best;
    });
    for (let k = 1; k < centers.length; k++) if (centers[k] <= centers[k - 1]) centers[k] = Math.min(f1, centers[k - 1] + 1);
    // 2) кадры между центрами — форма ближайшей гласной
    for (let f = f0; f <= f1; f++) {
      let k = 0;
      while (k + 1 < centers.length && Math.abs(centers[k + 1] - f) < Math.abs(centers[k] - f)) k++;
      track[f] = units[vowels[k]].vis;
    }
    // 3) граница слогов: видимые согласные (м/б/п — смыкание, с/ш/ф… — зубы), иначе рот на кадр «прикрывается»
    const smaller = { a: 'o', o: 'u', u: 'closed', e: 'closed', closed: 'closed' };
    for (let k = 0; k < vowels.length; k++) {
      const from = k === 0 ? -1 : vowels[k - 1], to = vowels[k];
      const between = units.slice(from + 1, to);
      const cons = between.filter((u) => u.kind === 'C');
      const left = k === 0 ? Math.max(f0, centers[0] - 2) : centers[k - 1], right = centers[k];
      if (right - left < 2) continue;
      const mid = Math.max(f0, Math.min(f1, Math.round((left + right) / 2)));
      if (cons.length) {
        const pick = cons.find((u) => u.vis === 'closed') || cons[0]; // смыкание губ видно лучше всего
        const prevVis = k > 0 ? units[vowels[k - 1]].vis : 'closed';
        // согласная выглядит так же, как соседние гласные (например «с» между «е» и «и») — рот прикрывается
        track[mid] = pick.vis === units[to].vis && pick.vis === prevVis ? smaller[units[to].vis] : pick.vis;
      } else if (k > 0 && right - left >= 3) {
        track[mid] = smaller[units[to].vis]; // невидимые согласные (т, д, к, л, н, р…) — рот чуть прикрывается
      }
    }
    // 4) настоящие паузы внутри фразы — рот закрыт
    for (let f = f0; f <= f1; f++) if (energy[f] < silence * 0.8) track[f] = 'closed';
    // громкость: тихая «а» выглядит как «о»
    for (let f = f0; f <= f1; f++) if (track[f] === 'a' && energy[f] < 0.35) track[f] = 'o';
  }
  // опережение: форма рта на кадр раньше звука
  const out = track.slice(lead).concat(new Array(lead).fill('closed'));
  return { track: out, feats, ref, mode: 'text' };
}
