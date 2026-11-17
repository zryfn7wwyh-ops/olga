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
