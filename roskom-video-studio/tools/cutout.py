#!/usr/bin/env python3
"""
Вырезание маскота с однотонного светлого фона (JPG/PNG без прозрачности) → PNG с альфа-каналом.

Удаляется ТОЛЬКО фон, связанный с краями изображения (белки глаз и блики внутри персонажа
не затрагиваются). По краю меха альфа рассчитывается по цвету с «размешиванием» белого фона,
чтобы не было белого ореола. Сам персонаж не перерисовывается.

Использование:
  python3 tools/cutout.py ВХОД.jpg ВЫХОД.png [--max 1400] [--preview превью.png]
Зависимости: pip install pillow numpy
"""
import argparse
import numpy as np
from PIL import Image, ImageDraw, ImageFilter


def cutout(src, max_side=1400):
    im = Image.open(src).convert('RGB')
    a = np.asarray(im).astype(np.float32)
    h, w, _ = a.shape
    # цвет фона — медиана по рамке
    border = np.concatenate([a[:4].reshape(-1, 3), a[-4:].reshape(-1, 3), a[:, :4].reshape(-1, 3), a[:, -4:].reshape(-1, 3)])
    bg = np.median(border, axis=0)
    dist = np.sqrt(((a - bg) ** 2).sum(axis=2))  # отличие от фона
    # 1) «почти фон» и заливка от краёв — фон, связанный с границей
    # фон + серые тени на полу (светлые, без цвета; мех маскота насыщенный, его не задевает)
    chroma = a.max(axis=2) - a.min(axis=2)
    shadow = (a.min(axis=2) > 165) & (chroma < 16)
    near = ((dist < 28) | shadow).astype(np.uint8) * 255
    m = Image.fromarray(near, 'L').copy()  # copy(): иначе floodfill не меняет буфер numpy
    draw_seeds = [(x, 0) for x in range(0, w, 8)] + [(x, h - 1) for x in range(0, w, 8)] + [(0, y) for y in range(0, h, 8)] + [(w - 1, y) for y in range(0, h, 8)]
    for s in draw_seeds:
        if m.getpixel(s) == 255:
            ImageDraw.floodfill(m, s, 128, thresh=0)
    bgmask = np.asarray(m) == 128
    # 2) полоса края: всё в пределах ~2% размера от фона
    band_px = max(9, int(min(w, h) * 0.02) | 1)
    band = np.asarray(Image.fromarray((bgmask * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(band_px))) > 0
    # 3) оценка цвета персонажа у края (медиана непрозрачных пикселей в полосе)
    inner = band & ~bgmask & (dist > 80)
    fg = np.median(a[inner], axis=0) if inner.sum() > 100 else np.array([115, 130, 200], np.float32)
    # альфа по проекции на отрезок фон→цвет персонажа
    v = fg - bg
    t = ((a - bg) @ v) / float(v @ v)
    alpha = np.clip(t, 0, 1)
    alpha = np.where(bgmask, 0.0, alpha)  # фон и тени, связанные с краем, — прозрачные
    alpha = np.where(band | bgmask, alpha, 1.0)               # внутри персонажа — непрозрачно
    # мягкая граница: лёгкое сглаживание только альфы
    alpha_img = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    alpha = np.asarray(alpha_img).astype(np.float32) / 255
    alpha = np.where(band | bgmask, alpha, 1.0)
    # мягкое подтравливание внешней кромки (светлый контровой свет рендера даёт ореол на тёмном фоне)
    edge_r = max(2, min(w, h) / 400)
    g = np.asarray(Image.fromarray((bgmask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(edge_r * 2))).astype(np.float32) / 255
    alpha = alpha * np.clip(1 - 1.8 * g, 0, 1)
    # 4) размешивание цвета: убираем примесь белого фона по краю
    safe = np.maximum(alpha, 0.05)[..., None]
    rgb = np.where(alpha[..., None] < 0.999, (a - (1 - alpha[..., None]) * bg) / safe, a)
    rgb = np.clip(rgb, 0, 255)
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    res = Image.fromarray(out, 'RGBA')
    # 5) обрезка по содержимому с полями
    ys, xs = np.where(alpha > 0.03)
    pad = int(min(w, h) * 0.02)
    box = (max(0, xs.min() - pad), max(0, ys.min() - pad), min(w, xs.max() + pad + 1), min(h, ys.max() + pad + 1))
    res = res.crop(box)
    if max(res.size) > max_side:
        res.thumbnail((max_side, max_side), Image.LANCZOS)
    return res


def preview(png, out):
    """Проверочный лист: на белом, тёмном и цветном фоне."""
    W, H = png.size
    sheet = Image.new('RGB', (W * 3, H))
    for i, col in enumerate([(255, 255, 255), (22, 26, 69), (238, 241, 255)]):
        bgim = Image.new('RGB', (W, H), col)
        bgim.paste(png, (0, 0), png)
        sheet.paste(bgim, (i * W, 0))
    sheet.thumbnail((1800, 1800))
    sheet.save(out)


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('src')
    ap.add_argument('dst')
    ap.add_argument('--max', type=int, default=1400)
    ap.add_argument('--preview')
    args = ap.parse_args()
    img = cutout(args.src, args.max)
    img.save(args.dst, optimize=True)
    if args.preview:
        preview(img, args.preview)
    print(args.dst, img.size)
