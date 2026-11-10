// caption-generator — субтитры по фактической озвучке: короткие фразы, выделение ключевых слов, SRT.
import fs from 'node:fs';

function splitChunks(text, maxWords, maxChars) {
  const words = text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const chunks = [];
  let cur = [];
  const len = (arr) => arr.join(' ').length;
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (cur.length && (cur.length >= maxWords || len([...cur, w]) > maxChars)) {
      chunks.push(cur);
      cur = [];
    }
    cur.push(w);
    // разрыв после знаков препинания, если чанк уже не короткий
    if (/[.!?;:]$/.test(w) || (/,$/.test(w) && cur.length >= 3)) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  // не заканчивать субтитр предлогом/союзом — переносим его в следующий
  const weak = /^(в|во|на|с|со|по|и|а|к|ко|о|об|у|за|до|от|из|не|для|при|без|что|как|но|или)$/i;
  for (let i = 0; i < chunks.length - 1; i++) {
    while (chunks[i].length > 1 && weak.test(chunks[i][chunks[i].length - 1])) chunks[i + 1].unshift(chunks[i].pop());
  }
  // слить «висячие» чанки из одного короткого слова
  for (let i = chunks.length - 1; i > 0; i--) {
    if (chunks[i].length === 1 && chunks[i][0].length <= 4 && len([...chunks[i - 1], ...chunks[i]]) <= maxChars + 6) {
      chunks[i - 1] = [...chunks[i - 1], ...chunks[i]];
      chunks.splice(i, 1);
    }
  }
  return chunks.map((c) => c.join(' '));
}

const norm = (w) => w.toLowerCase().replace(/[^a-zа-яё0-9-]/gi, '');

export function isHighlighted(word, highlights) {
  const w = norm(word);
  if (w.length < 2) return false;
  return highlights.some((h) => {
    const parts = String(h).split(/\s+/).map(norm).filter(Boolean);
    return parts.some((hp) => {
      if (/\d/.test(hp) || hp.length <= 4) return w === hp;
      const stem = hp.slice(0, Math.max(4, hp.length - 2));
      return w.startsWith(stem);
    });
  });
}

/** Строит список субтитров { start, end, text, words:[{w,hl}] } в секундах от начала ролика. */
export function buildCaptions(storyboard, timeline, opts) {
  const { maxWordsPerChunk = 5, maxCharsPerChunk = 34 } = opts || {};
  const caps = [];
  storyboard.scenes.forEach((scene, si) => {
    const ts = timeline.scenes[si];
    const highlights = [...(scene.highlight || []), ...(storyboard.highlight || [])];
    for (const ph of ts.phrases) {
      const display = ph.caption || ph.text;
      const chunks = splitChunks(display, maxWordsPerChunk, maxCharsPerChunk);
      const weights = chunks.map((c) => c.length + 4);
      const sum = weights.reduce((a, b) => a + b, 0);
      let t = ts.start + ph.start;
      const dur = ph.end - ph.start;
      chunks.forEach((c, i) => {
        const d = (dur * weights[i]) / sum;
        caps.push({
          start: +t.toFixed(3),
          end: +(t + d).toFixed(3),
          scene: si,
          text: c,
          words: c.split(' ').map((w) => ({ w, hl: isHighlighted(w, highlights) })),
        });
        t += d;
      });
    }
  });
  // небольшое удержание субтитра до следующего, чтобы не мигали в паузах
  for (let i = 0; i < caps.length - 1; i++) {
    const gap = caps[i + 1].start - caps[i].end;
    if (gap > 0 && gap < 0.45) caps[i].end = caps[i + 1].start;
  }
  return caps;
}

const srtTime = (s) => {
  const ms = Math.round(s * 1000);
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), sec = Math.floor((ms % 60000) / 1000), r = ms % 1000;
  const pad = (n, k = 2) => String(n).padStart(k, '0');
  return `${pad(h)}:${pad(m)}:${pad(sec)},${pad(r, 3)}`;
};

export function writeSRT(file, captions) {
  const body = captions.map((c, i) => `${i + 1}\n${srtTime(c.start)} --> ${srtTime(c.end)}\n${c.text}\n`).join('\n');
  fs.writeFileSync(file, body, 'utf8');
}
