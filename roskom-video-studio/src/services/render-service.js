// render-service — покадровый рендер композиции в Chromium (Playwright) и кодирование FFmpeg.
// Каждая сцена рендерится в отдельный сегмент и кешируется по хешу содержимого:
// правка одной сцены пересобирает только её; сбойные сцены пересобираются повторно.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { p, hash, ensureDir, log, runSync } from './util.js';

const require = createRequire(import.meta.url);

function loadPlaywright() {
  const tries = ['playwright', 'playwright-core', '/opt/node-tools/node_modules/playwright'];
  for (const t of tries) {
    try { return require(t); } catch {}
  }
  throw new Error('Playwright не найден. Выполните: npm install && npx playwright install chromium');
}

export async function launchBrowser() {
  const { chromium } = loadPlaywright();
  const opts = { args: ['--disable-gpu', '--font-render-hinting=none', '--allow-file-access-from-files', '--disable-web-security'] };
  if (process.env.CHROMIUM_PATH) opts.executablePath = process.env.CHROMIUM_PATH;
  try {
    return await chromium.launch(opts);
  } catch (e) {
    if (!opts.executablePath && fs.existsSync('/opt/pw-browsers/chromium')) {
      const dir = fs.readdirSync('/opt/pw-browsers').find((d) => d.startsWith('chromium-'));
      if (dir) return chromium.launch({ ...opts, executablePath: path.join('/opt/pw-browsers', dir, 'chrome-linux', 'chrome') });
    }
    throw e;
  }
}

/** Версия кода движка — часть ключа кеша сегментов. */
function engineVersion() {
  const files = ['src/video/runtime.js', 'src/video/styles.css', 'src/animations/core.js', 'src/animations/mascot.js', 'src/animations/icons.js', 'src/templates/layouts.js'];
  return hash(...files.map((f) => fs.readFileSync(p(f), 'utf8')));
}

export async function openComposition(browser, data) {
  const page = await browser.newPage({ viewport: { width: data.W, height: data.H }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(pathToFileURL(p('src', 'video', 'page.html')).href);
  await page.evaluate((d) => window.RV.init(d), data);
  const cdp = await page.context().newCDPSession(page);
  return { page, cdp, errors };
}

function startEncoder(outFile, fps, cfg) {
  const args = ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', cfg.codec, '-preset', cfg.preset, '-crf', String(cfg.crf), '-pix_fmt', cfg.pixFmt, '-r', String(fps), '-movflags', '+faststart', outFile];
  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'ignore', 'pipe'] });
  let err = '';
  ff.stderr.on('data', (d) => (err += d));
  const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg: ' + err.slice(-800))))));
  return { ff, done };
}

async function renderScene(comp, data, i, outFile, settings) {
  const { page, cdp } = comp;
  const sc = data.scenes[i];
  await page.evaluate((k) => window.RV.prepareScene(k), i);
  const tmp = outFile + '.part.mp4';
  const enc = startEncoder(tmp, data.fps, settings.video);
  let qa = [];
  const qaFrame = sc.startFrame + Math.max(0, Math.floor(sc.frames - data.fps * 0.45));
  for (let f = sc.startFrame; f < sc.startFrame + sc.frames; f++) {
    await page.evaluate((k) => window.RV.renderFrame(k), f);
    if (f === qaFrame) qa = await page.evaluate((k) => window.RV.qaCheck(k), i);
    const shot = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: settings.render.jpegQuality, optimizeForSpeed: true });
    const buf = Buffer.from(shot.data, 'base64');
    if (!enc.ff.stdin.write(buf)) await new Promise((r) => enc.ff.stdin.once('drain', r));
  }
  enc.ff.stdin.end();
  await enc.done;
  await page.evaluate((k) => window.RV.releaseScene(k), i);
  // проверка кадров сегмента
  const probe = JSON.parse(runSync('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames', '-of', 'json', tmp]).stdout);
  const nb = +probe.streams[0].nb_read_frames;
  if (nb !== sc.frames) throw new Error(`сегмент содержит ${nb} кадров вместо ${sc.frames}`);
  fs.renameSync(tmp, outFile);
  return qa;
}

export function sceneHash(data, i) {
  const sc = data.scenes[i];
  const env = data.envelope.slice(sc.startFrame, sc.startFrame + sc.frames);
  const caps = data.captions.filter((c) => c.end > sc.start && c.start < sc.start + sc.duration);
  return hash(engineVersion(), data.W, data.H, data.fps, data.totalFrames, data.theme, data.brand, data.logo, data.captionFont, sc, env, caps,
    sc.mascot ? [sc.mascot, ...(sc.mascot.poses || [])].map((k) => data.poses[k.pose]?.sha256) : null);
}

/**
 * Рендерит все сцены (с кешем), склеивает видео. Возвращает { videoFile, qa: {sceneIndex: issues}, rendered, cached }.
 */
export async function renderVideo(data, { buildDir, settings, force = [] }) {
  const segDir = ensureDir(path.join(buildDir, 'segments'));
  const jobs = [];
  const segFiles = data.scenes.map((_, i) => {
    const f = path.join(segDir, `scene-${String(i + 1).padStart(2, '0')}-${sceneHash(data, i)}.mp4`);
    if (!fs.existsSync(f) || force.includes(i)) jobs.push(i);
    return f;
  });
  // удаляем устаревшие сегменты
  const keep = new Set(segFiles.map((f) => path.basename(f)));
  for (const f of fs.readdirSync(segDir)) if (!keep.has(f) && f.endsWith('.mp4')) fs.unlinkSync(path.join(segDir, f));

  const qaFile = path.join(buildDir, 'scene-qa.json');
  const qa = fs.existsSync(qaFile) ? JSON.parse(fs.readFileSync(qaFile, 'utf8')) : {};
  log(`Рендер: сцен ${data.scenes.length}, к пересборке ${jobs.length}, из кеша ${data.scenes.length - jobs.length}`);
  if (jobs.length) {
    const browser = await launchBrowser();
    const workers = Math.max(1, Math.min(settings.render.workers, jobs.length));
    const queue = [...jobs];
    const failures = [];
    const t0 = Date.now();
    await Promise.all(
      Array.from({ length: workers }, async () => {
        let comp = await openComposition(browser, data);
        while (queue.length) {
          const i = queue.shift();
          let ok = false;
          let lastErr;
          for (let attempt = 0; attempt <= settings.render.retries && !ok; attempt++) {
            try {
              if (attempt > 0) { log(`Повторная сборка сцены ${i + 1} (попытка ${attempt + 1})`); await comp.page.close(); comp = await openComposition(browser, data); }
              qa[path.basename(segFiles[i])] = await renderScene(comp, data, i, segFiles[i], settings);
              ok = true;
              log(`  сцена ${i + 1}/${data.scenes.length} готова (${data.scenes[i].frames} кадров)`);
            } catch (e) {
              lastErr = e;
            }
          }
          if (!ok) failures.push(`Сцена ${i + 1} («${data.scenes[i].layout}»): ${lastErr?.message}${comp.errors.length ? ' | ошибки страницы: ' + comp.errors.join('; ') : ''}`);
        }
        await comp.page.close();
      }),
    );
    await browser.close();
    fs.writeFileSync(qaFile, JSON.stringify(qa, null, 2));
    if (failures.length) throw new Error('Не удалось отрендерить сцены:\n' + failures.join('\n'));
    log(`Рендер занял ${((Date.now() - t0) / 1000).toFixed(0)} с`);
  }
  // склейка
  const list = path.join(buildDir, 'concat.txt');
  fs.writeFileSync(list, segFiles.map((f) => `file '${f.replace(/'/g, "'\\''")}'`).join('\n'));
  const videoFile = path.join(buildDir, 'video.mp4');
  runSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', videoFile]);
  const sceneQa = Object.fromEntries(segFiles.map((f, i) => [i, qa[path.basename(f)] || []]));
  return { videoFile, qa: sceneQa, rendered: jobs.length };
}

export async function renderCover(data, cover, outFile) {
  const browser = await launchBrowser();
  try {
    const comp = await openComposition(browser, data);
    await comp.page.evaluate((c) => window.RV.renderCover(c), cover);
    await comp.page.screenshot({ path: outFile, type: 'png' });
    if (comp.errors.length) throw new Error(comp.errors.join('; '));
  } finally {
    await browser.close();
  }
}

/** Снимок отдельного кадра (для проверки агентом quality-reviewer). */
export async function renderStill(data, frame, outFile) {
  const browser = await launchBrowser();
  try {
    const comp = await openComposition(browser, data);
    const i = data.scenes.findIndex((s) => frame >= s.startFrame && frame < s.startFrame + s.frames);
    await comp.page.evaluate((k) => window.RV.prepareScene(k), i < 0 ? data.scenes.length - 1 : i);
    await comp.page.evaluate((k) => window.RV.renderFrame(k), frame);
    await comp.page.screenshot({ path: outFile, type: 'png' });
  } finally {
    await browser.close();
  }
}

export async function captionCheck(data) {
  const browser = await launchBrowser();
  try {
    const comp = await openComposition(browser, data);
    return await comp.page.evaluate(() => window.RV.captionCheck());
  } finally {
    await browser.close();
  }
}
