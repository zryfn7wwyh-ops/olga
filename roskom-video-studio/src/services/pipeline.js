// Конвейер сборки ролика: раскадровка → озвучка → субтитры → звук → рендер → экспорт → контроль качества.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { p, readJSON, writeJSON, ensureDir, runSync, writeWav, log, ROOT } from './util.js';
import { loadBrand, loadMascotManifest, findLogo } from './asset-manager.js';
import { validateStoryboard, computeItemTimes, computeSfx, loadVideoType } from './storyboard.js';
import { generateVoice, SAMPLE_RATE } from './voice-generator.js';
import { buildCaptions, writeSRT } from './caption-generator.js';
import { mixAudio } from './audio-mixer.js';
import { renderVideo, renderCover, captionCheck } from './render-service.js';
import { runQuality } from './quality.js';
import { writePublication, writeScriptIfMissing, writeSourcesIfMissing, exportToOutput } from './export-manager.js';

export function loadVideoSettings() {
  return readJSON(p('config', 'video-settings.json'));
}

export function legalState(sb, projectDir) {
  const approvals = readJSON(path.join(projectDir, 'approval.json'), null);
  const claims = (sb.legal?.claims || []).filter((c) => c.usedInVideo !== false);
  const open = claims.filter((c) => c.status !== 'confirmed');
  if (!sb.legal) return { ok: false, details: 'Юридическая проверка не проведена (нет блока legal в storyboard.json)', open: [] };
  if (open.length && !(approvals && approvals.approved)) {
    return { ok: false, details: `Требуют согласования специалистом: ${open.map((c) => `«${c.text}» (${c.status})`).join('; ')}`, open };
  }
  if (sb.legal.requiresApproval && !(approvals && approvals.approved)) return { ok: false, details: 'Ролик помечен для обязательного согласования', open };
  return { ok: true, details: approvals?.approved ? `Согласовано: ${approvals.approvedBy || 'специалист'} ${approvals.date}` : `Все ${claims.length} утверждений подтверждены источниками`, open: [] };
}

/** Подготовка данных композиции (без рендера). */
export async function prepare(projectDir, opts = {}) {
  const sbFile = path.join(projectDir, 'storyboard.json');
  const sb = readJSON(sbFile);
  const { errors, warnings } = validateStoryboard(sb);
  warnings.forEach((w) => log('⚠ ' + w));
  if (errors.length) throw new Error('Ошибки в storyboard.json:\n- ' + errors.join('\n- '));
  const vs = loadVideoSettings();
  const fmt = vs.formats[sb.format || opts.format || vs.defaultFormat];
  const range = sb.durationRange || vs.durations[sb.duration || vs.defaultDuration];
  const fps = vs.fps;
  const buildDir = ensureDir(path.join(projectDir, 'build'));
  const type = loadVideoType(sb.type);

  const tl = await generateVoice(sb, { buildDir, fps, range });
  writeWav(path.join(projectDir, 'voice.wav'), tl.voice, SAMPLE_RATE);
  log(`Озвучка: ${tl.total.toFixed(1)} с, ${tl.scenes.length} сцен`);

  const captions = buildCaptions(sb, tl, vs.captions);
  writeSRT(path.join(projectDir, 'captions.srt'), captions);

  const scenes = sb.scenes.map((s, i) => {
    const ts = tl.scenes[i];
    return { ...s, index: i, start: ts.start, startFrame: ts.startFrame, frames: ts.frames, duration: ts.duration, phrases: ts.phrases, itemTimes: computeItemTimes(s, ts) };
  });
  // фактические тайминги — обратно в раскадровку
  sb.scenes.forEach((s, i) => (s.timing = { start: +scenes[i].start.toFixed(2), end: +(scenes[i].start + scenes[i].duration).toFixed(2) }));
  sb.totalDuration = +tl.total.toFixed(2);
  writeJSON(sbFile, sb);

  const manifest = loadMascotManifest();
  const data = {
    W: fmt.width, H: fmt.height, fps, totalFrames: tl.totalFrames,
    root: pathToFileURL(ROOT).href + '/',
    brand: loadBrand(), logo: findLogo(),
    theme: { ...type.theme, tag: sb.tag ?? type.tag },
    poses: manifest.poses,
    envelope: tl.envelope.slice(0, tl.totalFrames),
    captions, captionFont: (sb.format || 'vertical') === 'vertical' ? vs.captions.fontSize : Math.round(vs.captions.fontSize * 0.8),
    scenes,
  };
  writeJSON(path.join(buildDir, 'timeline.json'), { ...data, envelope: `[${data.envelope.length} значений]` });
  return { sb, data, tl, vs, range, buildDir, type };
}

export async function build(projectDir, opts = {}) {
  projectDir = path.resolve(projectDir);
  const t0 = Date.now();
  log(`Проект: ${path.relative(ROOT, projectDir)}`);
  const { sb, data, tl, vs, range, buildDir, type } = await prepare(projectDir, opts);

  // Звук
  const mixFile = path.join(buildDir, 'mix.wav');
  const events = computeSfx(sb, data.scenes);
  const music = mixAudio({ voice: tl.voice, sr: SAMPLE_RATE, totalSec: data.totalFrames / data.fps, events, outFile: mixFile, settings: vs.audio,
    seed: [...sb.topic].reduce((a, c) => a + c.charCodeAt(0), 0), sfxDir: p('assets', 'sfx'), envelope: data.envelope, fps: data.fps, mood: type.mood });

  writeScriptIfMissing(projectDir, sb);
  writeSourcesIfMissing(projectDir, sb);
  // Видео (+ автоматическая пересборка проблемных сцен)
  let force = (opts.scenes || []).map((n) => n - 1);
  let result, report;
  const captionIssues = await captionCheck(data);
  for (let attempt = 0; attempt < 2; attempt++) {
    result = await renderVideo(data, { buildDir, settings: vs, force });
    const master = path.join(buildDir, 'master.mp4');
    runSync('ffmpeg', ['-v', 'error', '-y', '-i', result.videoFile, '-i', mixFile, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', master]);
    const legal = legalState(sb, projectDir);
    report = runQuality({ finalFile: master, mixFile, storyboard: sb, data, range, sceneQa: result.qa, captionIssues, legalState: legal, projectDir });
    const broken = report.checks.filter((c) => !c.ok && ['black-frames', 'blank-frames', 'integrity'].includes(c.id));
    if (!broken.length || attempt === 1) break;
    // определяем сцены с проблемными кадрами и пересобираем их
    const times = broken.flatMap((c) => [...String(c.details).matchAll(/([\d.]+)\s*[–с]/g)].map((m) => +m[1]));
    force = [...new Set(times.map((t) => data.scenes.findIndex((s) => t >= s.start && t < s.start + s.duration)).filter((i) => i >= 0))];
    if (!force.length) force = data.scenes.map((_, i) => i);
    log(`Найдены проблемные кадры — пересобираю сцены: ${force.map((i) => i + 1).join(', ')}`);
  }
  const master = path.join(buildDir, 'master.mp4');

  // Превью (всегда) и финал (если нет ошибок и юридически согласовано)
  const preview = path.join(projectDir, 'preview.mp4');
  const pw = Math.round((data.W * vs.preview.scale) / 2) * 2, ph = Math.round((data.H * vs.preview.scale) / 2) * 2;
  runSync('ffmpeg', ['-v', 'error', '-y', '-i', master, '-vf', `scale=${pw}:${ph}`, '-c:v', 'libx264', '-preset', vs.preview.preset, '-crf', String(vs.preview.crf), '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', preview]);

  const finalFile = path.join(projectDir, 'final.mp4');
  const mode = opts.mode || sb.mode || vs.mode;
  const approved = readJSON(path.join(projectDir, 'approval.json'), null)?.approved;
  const technicalOk = report.status !== 'failed';
  const legalOk = report.checks.find((c) => c.id === 'legal').ok;
  let finalStatus;
  if (!technicalOk) {
    if (fs.existsSync(finalFile)) fs.unlinkSync(finalFile);
    finalStatus = 'failed';
  } else if (!legalOk || (mode === 'approval' && !approved)) {
    if (fs.existsSync(finalFile)) fs.unlinkSync(finalFile);
    finalStatus = 'awaiting-approval';
  } else {
    fs.copyFileSync(master, finalFile);
    finalStatus = 'ready';
  }
  report.status = finalStatus;

  // Обложка, публикация, сценарий, источники
  const cover = { title: sb.cover?.title || sb.title, highlight: sb.cover?.highlight || sb.scenes[0].highlight || [], pose: sb.cover?.pose || sb.scenes[0].mascot?.pose || 'surprised' };
  await renderCover(data, cover, path.join(projectDir, 'cover.png'));
  writeScriptIfMissing(projectDir, sb);
  writeSourcesIfMissing(projectDir, sb);
  writePublication(projectDir, sb);

  report.generatedAt = new Date().toISOString();
  report.project = path.basename(projectDir);
  report.duration = +(data.totalFrames / data.fps).toFixed(2);
  report.format = `${data.W}x${data.H}@${data.fps}`;
  report.voice = { provider: tl.provider, voice: tl.voiceName, tempo: +tl.factor.toFixed(3) };
  report.music = music;
  report.render = { scenes: data.scenes.length, rerendered: result.rendered, seconds: Math.round((Date.now() - t0) / 1000) };
  report.files = ['script.md', 'storyboard.json', 'sources.md', 'voice.wav', 'captions.srt', 'preview.mp4', 'final.mp4', 'cover.png', 'publication.md', 'quality-report.json'].map((f) => ({ file: f, exists: fs.existsSync(path.join(projectDir, f)) }));
  writeJSON(path.join(projectDir, 'quality-report.json'), report);
  if (finalStatus === 'ready') exportToOutput(projectDir);

  log(`Контроль качества: ${report.summary}`);
  for (const c of report.checks.filter((x) => !x.ok)) log(`  ✗ [${c.level}] ${c.name}: ${c.details}`);
  log(finalStatus === 'ready' ? `Готово: ${path.relative(ROOT, finalFile)} (${report.duration} с)` : finalStatus === 'awaiting-approval' ? `Превью готово, финал ждёт согласования: npm run approve -- ${path.relative(ROOT, projectDir)}` : 'Финальный файл НЕ создан — см. ошибки выше и quality-report.json');
  return report;
}
