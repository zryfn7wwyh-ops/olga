#!/usr/bin/env python3
"""
Импорт набора «говорящих» кадров маскота (одна поза, разные формы рта) для синхронизации губ с речью.

Основа — первый кадр (рот закрыт). Из остальных берётся только область рта (находится автоматически
по различиям) и вклеивается в основу с мягкой растушёвкой — мех и контур во всех кадрах одинаковые,
поэтому при смене рта ничего не «мерцает». Фон вырезается один раз по основе (tools/cutout.py).

Использование:
  python3 tools/lipsync_import.py ИМЯ_НАБОРА closed=1.jpg e=2.jpg u=3.jpg o=4.jpg a=5.jpg [--out assets/mascot/original] [--max 1400]
Формы рта (visemes): closed — пауза/м/б/п, e — и/э/с/з (зубы), u — у/ю, o — о, a — а (широко).
"""
import argparse, os, sys
import numpy as np
from PIL import Image, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cutout import cutout, preview

ap = argparse.ArgumentParser()
ap.add_argument('name')
ap.add_argument('frames', nargs='+', help='viseme=файл; первый — основа (рот закрыт)')
ap.add_argument('--out', default='assets/mascot/original')
ap.add_argument('--max', type=int, default=1400)
ap.add_argument('--preview')
ap.add_argument('--full', action='store_true', help='сохранять кадры ртов целиком, а не накладками')
args = ap.parse_args()

pairs = [f.split('=', 1) for f in args.frames]
base_v, base_f = pairs[0]
base_rgb = np.asarray(Image.open(base_f).convert('RGB')).astype(np.float32)
H, W, _ = base_rgb.shape
others = [(v, np.asarray(Image.open(f).convert('RGB').resize((W, H))).astype(np.float32)) for v, f in pairs[1:]]

# 1) область рта — где кадры сильнее всего отличаются от основы
acc = np.zeros((H, W), np.float32)
for _, im in others: acc += np.abs(im - base_rgb).sum(2)
acc /= max(1, len(others))
blur = np.asarray(Image.fromarray(np.clip(acc / acc.max() * 255, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(W / 80))).astype(np.float32)
cy, cx = np.unravel_index(np.argmax(blur), blur.shape)
strong = blur > blur.max() * 0.35
ys, xs = np.where(strong)
rx = max(W * 0.06, (xs.max() - xs.min()) / 2 * 1.25)
ry = max(H * 0.05, (ys.max() - ys.min()) / 2 * 1.35)
cx, cy = (xs.max() + xs.min()) / 2, (ys.max() + ys.min()) / 2
yy, xx = np.mgrid[0:H, 0:W]
r = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
feather = 0.35
mask = np.clip((1 + feather - r) / feather, 0, 1)[..., None]   # 1 внутри эллипса, плавный спад к краю
print(f'рот: центр ({cx:.0f}, {cy:.0f}), радиусы {rx:.0f}×{ry:.0f} px')

# 2) фон вырезается один раз по основе — альфа общая для всех кадров
base_cut = cutout(base_f, max_side=10**6, crop=False)
alpha = np.asarray(base_cut)[..., 3:4].astype(np.float32)
base_col = np.asarray(base_cut)[..., :3].astype(np.float32)
a = alpha[..., 0] / 255
ys2, xs2 = np.where(a > 0.03)
pad = int(min(W, H) * 0.02)
box = (max(0, xs2.min() - pad), max(0, ys2.min() - pad), min(W, xs2.max() + pad + 1), min(H, ys2.max() + pad + 1))

def save(v, rgb, overlay=False):
    # overlay: кадр рта — прозрачно всё, кроме области рта (кладётся поверх основы, без двойного контура меха)
    a_out = alpha * mask if overlay else alpha
    out = np.dstack([rgb, a_out]).astype(np.uint8)
    img = Image.fromarray(out, 'RGBA').crop(box)
    if max(img.size) > args.max: img = img.resize((round(img.width * args.max / max(img.size)), round(img.height * args.max / max(img.size))), Image.LANCZOS)
    path = os.path.join(args.out, f'{args.name}-{v}.png')
    img.save(path, optimize=True)
    return path, img

made = [save(base_v, base_col)]
for v, im in others:
    rgb = base_col * (1 - mask) + im * mask   # рот из кадра, остальное — основа
    made.append(save(v, rgb, overlay=True))
for path, img in made: print(path, img.size)
if args.preview:
    imgs = [m[1] for m in made]
    w = sum(i.width for i in imgs) // 3; h = imgs[0].height // 3
    sheet = Image.new('RGB', (w, h * 2), 'white')
    x = 0
    for i in imgs:
        t = i.resize((i.width // 3, i.height // 3))
        sheet.paste(t, (x, 0), t)
        dark = Image.new('RGB', t.size, (22, 26, 69)); dark.paste(t, (0, 0), t); sheet.paste(dark, (x, h))
        x += t.width
    sheet.save(args.preview)
