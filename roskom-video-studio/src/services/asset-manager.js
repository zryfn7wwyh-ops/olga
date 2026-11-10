// asset-manager — фирменные материалы: маскот, шрифты, логотипы, музыка.
import fs from 'node:fs';
import path from 'node:path';
import { p, readJSON, writeJSON, sha256File, ffprobe } from './util.js';

const MASCOT_DIR = p('assets', 'mascot');

export function loadBrand() {
  return readJSON(p('config', 'brand.json'));
}

export function loadPoses() {
  return readJSON(path.join(MASCOT_DIR, 'poses.json'));
}

/** Сканирует assets/mascot/original и строит manifest.json с хешами оригиналов. */
export function buildMascotManifest() {
  const poses = loadPoses();
  const origDir = path.join(MASCOT_DIR, 'original');
  const files = fs.existsSync(origDir) ? fs.readdirSync(origDir).filter((f) => /\.(png|svg|webp)$/i.test(f)) : [];
  const manifest = { generatedAt: new Date().toISOString(), poses: {}, unmapped: [], problems: [] };
  const used = new Set();
  for (const [id, info] of Object.entries(poses.poses)) {
    const file = path.join(origDir, info.file);
    if (!fs.existsSync(file)) {
      manifest.problems.push(`Поза ${id}: файл ${info.file} не найден`);
      continue;
    }
    used.add(info.file);
    let width = null, height = null, hasAlpha = null;
    if (!/\.svg$/i.test(file)) {
      const s = ffprobe(file).streams[0];
      width = s.width; height = s.height; hasAlpha = /a/.test(s.pix_fmt || '');
      if (!hasAlpha) manifest.problems.push(`Поза ${id}: у ${info.file} нет прозрачности — нужен PNG с альфа-каналом`);
    }
    manifest.poses[id] = { ...info, path: `assets/mascot/original/${info.file}`, sha256: sha256File(file), width, height, hasAlpha };
  }
  for (const f of files) if (!used.has(f)) manifest.unmapped.push(f);
  manifest.states = poses.states;
  manifest.missing = poses.missing;
  // Проверка состояний из ТЗ
  for (const [state, pose] of Object.entries(poses.states)) {
    if (!manifest.poses[pose]) manifest.problems.push(`Состояние «${state}» ссылается на отсутствующую позу ${pose}`);
  }
  // Поддержка липсинка: assets/mascot/layers/<pose>/{body.png, mouth-*.png}
  const layersDir = path.join(MASCOT_DIR, 'layers');
  manifest.lipsync = fs.existsSync(layersDir) && fs.readdirSync(layersDir).length > 0;
  writeJSON(path.join(MASCOT_DIR, 'manifest.json'), manifest);
  return manifest;
}

export function loadMascotManifest() {
  const file = path.join(MASCOT_DIR, 'manifest.json');
  if (!fs.existsSync(file)) return buildMascotManifest();
  return readJSON(file);
}

/** Проверяет, что оригиналы маскота не изменены (хеши совпадают с манифестом). */
export function verifyMascotIntegrity(usedPoses) {
  const manifest = loadMascotManifest();
  const errors = [];
  for (const id of usedPoses) {
    const info = manifest.poses[id];
    if (!info) { errors.push(`Поза «${id}» отсутствует в манифесте`); continue; }
    const file = p(info.path);
    if (!fs.existsSync(file)) errors.push(`Файл позы «${id}» отсутствует: ${info.path}`);
    else if (sha256File(file) !== info.sha256) errors.push(`Файл позы «${id}» изменён относительно оригинала`);
  }
  return errors;
}

export function resolvePose(name) {
  const manifest = loadMascotManifest();
  if (manifest.poses[name]) return name;
  if (manifest.states[name]) return manifest.states[name];
  return null;
}

/** Музыка: assets/music/*.mp3|wav + license.json c {"file": {"license": "...", "commercial": true}} */
export function findLicensedMusic() {
  const dir = p('assets', 'music');
  const licFile = path.join(dir, 'license.json');
  if (!fs.existsSync(licFile)) return [];
  const lic = readJSON(licFile);
  return Object.entries(lic)
    .filter(([f, info]) => info && info.commercial === true && fs.existsSync(path.join(dir, f)))
    .map(([f, info]) => ({ file: path.join(dir, f), ...info }));
}

export function findLogo() {
  const brand = loadBrand();
  if (brand.logo && fs.existsSync(p(brand.logo))) return brand.logo;
  const dir = p('assets', 'logos');
  if (!fs.existsSync(dir)) return null;
  const f = fs.readdirSync(dir).find((x) => /\.(svg|png)$/i.test(x));
  return f ? `assets/logos/${f}` : null;
}
