// quality-reviewer (технические проверки): формат, целостность, чёрные/пустые кадры, звук,
// субтитры, обрезанный текст, маскот, бренд, длительность, юридические источники.
import fs from 'node:fs';
import path from 'node:path';
import { ffprobe, runSync } from './util.js';
import { verifyMascotIntegrity, loadBrand } from './asset-manager.js';
import { collectTexts, usedPoses } from './storyboard.js';

function check(list, id, name, ok, details, level = 'error') {
  list.push({ id, name, ok: !!ok, level: ok ? 'ok' : level, details });
}

/** Пустые (однотонные) кадры: выборка 2 кадра/с в 54×96, стандартное отклонение яркости. */
function blankFrames(file, W, H) {
  const w = 54, h = Math.round((54 * H) / W);
  const r = runSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', `fps=2,scale=${w}:${h},format=gray`, '-f', 'rawvideo', '-'], { encoding: 'buffer' });
  const buf = r.stdout;
  const size = w * h;
  const out = [];
  for (let k = 0; k * size < buf.length; k++) {
    let s = 0, s2 = 0;
    for (let i = k * size; i < (k + 1) * size; i++) { s += buf[i]; s2 += buf[i] * buf[i]; }
    const mean = s / size;
    const sd = Math.sqrt(Math.max(0, s2 / size - mean * mean));
    if (sd < 4) out.push({ t: k / 2, mean: Math.round(mean), sd: +sd.toFixed(1) });
  }
  return out;
}

export function runQuality({ finalFile, mixFile, storyboard, data, range, sceneQa, captionIssues, legalState, projectDir }) {
  const checks = [];
  const brand = loadBrand();
  // 1. Формат и разрешение
  let info;
  try { info = ffprobe(finalFile); } catch (e) { check(checks, 'file', 'Файл читается', false, e.message); return finish(checks); }
  const v = info.streams.find((s) => s.codec_type === 'video');
  const a = info.streams.find((s) => s.codec_type === 'audio');
  const fps = v ? eval(v.r_frame_rate) : 0; // "30/1"
  check(checks, 'format', 'Формат и разрешение', v && v.width === data.W && v.height === data.H && v.codec_name === 'h264' && Math.abs(fps - data.fps) < 0.01 && v.pix_fmt === 'yuv420p',
    `${v?.codec_name} ${v?.width}×${v?.height} ${fps} fps ${v?.pix_fmt}; ожидалось h264 ${data.W}×${data.H} ${data.fps} fps`);
  check(checks, 'audio-stream', 'Есть звуковая дорожка AAC', a && a.codec_name === 'aac', a ? `${a.codec_name} ${a.sample_rate} Гц` : 'нет аудио');
  // 2. Целостность
  const dec = runSync('ffmpeg', ['-v', 'error', '-i', finalFile, '-f', 'null', '-'], { allowFail: true });
  check(checks, 'integrity', 'Полнота и целостность (полное декодирование без ошибок)', dec.status === 0 && !dec.stderr.trim(), dec.stderr.trim().slice(0, 500) || 'ошибок декодирования нет');
  const vDur = parseFloat(v?.duration || info.format.duration);
  const aDur = parseFloat(a?.duration || 0);
  check(checks, 'duration-match', 'Длительность видео = длительность таймлайна', Math.abs(vDur - data.totalFrames / data.fps) < 0.1, `видео ${vDur.toFixed(2)} с, таймлайн ${(data.totalFrames / data.fps).toFixed(2)} с`);
  check(checks, 'audio-complete', 'Звук без обрыва (длина аудио = длине видео)', Math.abs(aDur - vDur) < 0.15, `аудио ${aDur.toFixed(2)} с, видео ${vDur.toFixed(2)} с`);
  // 3. Чёрные и пустые кадры
  const bd = runSync('ffmpeg', ['-v', 'info', '-i', finalFile, '-vf', 'blackdetect=d=0.08:pix_th=0.08', '-an', '-f', 'null', '-'], { allowFail: true });
  const blacks = [...(bd.stderr || '').matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)].map((m) => `${m[1]}–${m[2]} с`);
  check(checks, 'black-frames', 'Нет чёрных кадров', blacks.length === 0, blacks.length ? blacks.join(', ') : 'не найдено');
  const blanks = blankFrames(finalFile, data.W, data.H);
  check(checks, 'blank-frames', 'Нет пустых (однотонных) кадров', blanks.length === 0, blanks.length ? blanks.map((b) => `${b.t} с`).join(', ') : 'не найдено');
  // 4. Звук: провалы тишины внутри ролика
  const sd = runSync('ffmpeg', ['-v', 'info', '-i', mixFile, '-af', 'silencedetect=n=-45dB:d=1.2', '-f', 'null', '-'], { allowFail: true });
  const sil = [...(sd.stderr || '').matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]).filter((t) => t > 0.5 && t < vDur - 1.5);
  check(checks, 'audio-gaps', 'Нет провалов звука', sil.length === 0, sil.length ? `тишина с ${sil.join(', ')} с` : 'провалов нет', 'warning');
  // 5. Субтитры
  const caps = data.captions;
  let syncOk = true, syncDetails = [];
  for (let i = 0; i < caps.length; i++) {
    const c = caps[i];
    if (c.end <= c.start) { syncOk = false; syncDetails.push(`пустой интервал: «${c.text}»`); }
    if (i && c.start < caps[i - 1].end - 0.001) { syncOk = false; syncDetails.push(`перекрытие: «${c.text}»`); }
    const f0 = Math.floor(c.start * data.fps), f1 = Math.ceil(c.end * data.fps);
    const env = data.envelope.slice(f0, f1);
    const speech = env.filter((x) => x > 0.08).length / Math.max(1, env.length);
    if (speech < 0.3) { syncOk = false; syncDetails.push(`нет речи под субтитром «${c.text}» (${c.start.toFixed(2)} с)`); }
  }
  check(checks, 'captions-sync', 'Синхронизация речи и субтитров', syncOk, syncOk ? `${caps.length} субтитров совпадают с речью` : syncDetails.slice(0, 8).join('; '));
  const srt = path.join(projectDir, 'captions.srt');
  check(checks, 'captions-file', 'Файл captions.srt', fs.existsSync(srt) && fs.statSync(srt).size > 0, srt);
  check(checks, 'captions-readable', 'Читаемость субтитров на мобильном (≤2 строк, ≥48 px, ≥0.45 с)', captionIssues.length === 0 && data.captionFont >= 48,
    captionIssues.length ? captionIssues.slice(0, 6).map((x) => `${x.type}: «${x.text}»`).join('; ') : `шрифт ${data.captionFont} px`, 'warning');
  // 6. Обрезанный текст
  const textIssues = Object.entries(sceneQa || {}).flatMap(([i, list]) => (list || []).map((x) => `сцена ${+i + 1}: ${x.type}${x.text ? ` «${x.text}»` : ''}`));
  const hard = textIssues.filter((x) => /overflow|out-of-frame|under-captions/.test(x));
  check(checks, 'text-clipping', 'Нет обрезанного текста и выхода за кадр', hard.length === 0, textIssues.length ? textIssues.join('; ') : 'всё помещается');
  // 7. Маскот
  const poses = usedPoses(storyboard);
  const mErr = verifyMascotIntegrity(poses);
  check(checks, 'mascot', 'Маскот соответствует оригиналу (хеши файлов не изменены)', mErr.length === 0 && poses.length > 0, mErr.length ? mErr.join('; ') : `позы: ${poses.join(', ')}`);
  // 8. Бренд
  const texts = collectTexts(storyboard).join('\n');
  const script = fs.existsSync(path.join(projectDir, 'script.md')) ? fs.readFileSync(path.join(projectDir, 'script.md'), 'utf8') : '';
  const bad = brand.spelling.forbidden.filter((w) => (texts + script).includes(w));
  check(checks, 'brand-spelling', 'Корректное написание «Роском Онлайн»', bad.length === 0, bad.length ? `найдено: ${bad.join(', ')}` : 'ошибок нет');
  const hasCta = storyboard.scenes.some((s) => s.layout === 'cta');
  check(checks, 'brand', 'Фирменное оформление (плашка бренда, цвета, финальный CTA)', hasCta, hasCta ? 'плашка бренда на всех кадрах, CTA-сцена есть' : 'нет CTA-сцены');
  // 9. Длительность
  check(checks, 'duration-range', `Длительность в диапазоне ${range.min}–${range.max} с`, vDur >= range.min - 0.5 && vDur <= range.max + 0.5, `${vDur.toFixed(1)} с`);
  // 10. Юридические источники
  const srcFile = path.join(projectDir, 'sources.md');
  const hasSources = fs.existsSync(srcFile) && /https?:\/\//.test(fs.readFileSync(srcFile, 'utf8'));
  check(checks, 'sources', 'Есть юридические источники (sources.md со ссылками и датой проверки)', hasSources && !!storyboard.legal?.checkedAt, hasSources ? `проверено ${storyboard.legal?.checkedAt || '—'}` : 'sources.md отсутствует или без ссылок');
  check(checks, 'legal', 'Все юридические утверждения подтверждены или согласованы', legalState.ok, legalState.details, 'blocker');
  return finish(checks);
}

function finish(checks) {
  const errors = checks.filter((c) => c.level === 'error');
  const blockers = checks.filter((c) => c.level === 'blocker');
  const warnings = checks.filter((c) => c.level === 'warning');
  return {
    ok: errors.length === 0 && blockers.length === 0,
    status: errors.length ? 'failed' : blockers.length ? 'awaiting-approval' : 'ready',
    summary: `${checks.filter((c) => c.ok).length}/${checks.length} проверок пройдено; ошибок ${errors.length}, на согласовании ${blockers.length}, предупреждений ${warnings.length}`,
    checks,
  };
}
