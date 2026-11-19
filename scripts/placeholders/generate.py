#!/usr/bin/env python3
"""
Генерирует демонстрационные макеты (SVG) для режима preview → public/placeholders/.
Это НЕ скриншоты реального проекта: только нейтральные интерфейсы без цифр и статистики.
Замена на реальные материалы — в src/content/siteContent.ts.

    python3 scripts/placeholders/generate.py
"""
import pathlib

OUT = pathlib.Path(__file__).resolve().parents[2] / "public" / "placeholders"
NAVY, DEEP, IVORY, PAPER, GOLD, STROKE, MUTED, INK = (
    "#14232D", "#0F1B24", "#F5F2EC", "#FCFBF8", "#B49A6C", "#D9DCD9", "#9AA3A8", "#1A2A33",
)
SERIF = "Georgia, 'Times New Roman', serif"
SANS = "Arial, Helvetica, sans-serif"


def bar(x, y, w, h=10, fill=STROKE, r=None, op=1):
    r = h / 2 if r is None else r
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" opacity="{op}"/>'


def text(x, y, s, size=16, fill=INK, family=SANS, weight=400, ls=0, anchor="start", op=1, italic=False):
    st = ' font-style="italic"' if italic else ""
    return (f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" '
            f'letter-spacing="{ls}" fill="{fill}" text-anchor="{anchor}" opacity="{op}"{st}>{s}</text>')


def lines(x, y, widths, gap=22, h=10, fill=STROKE):
    return "".join(bar(x, y + i * gap, w, h, fill) for i, w in enumerate(widths))


def svg(w, h, body, defs=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
            f'<defs>{defs}</defs>{body}</svg>')


GRAD = f"""
<linearGradient id="navyGrad" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#1D3240"/><stop offset="1" stop-color="{DEEP}"/>
</linearGradient>
<linearGradient id="goldFade" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="{GOLD}"/><stop offset="1" stop-color="{GOLD}" stop-opacity="0"/>
</linearGradient>
<linearGradient id="ivoryGrad" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="{IVORY}"/><stop offset="1" stop-color="#EDE8DE"/>
</linearGradient>
<filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
  <feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#0F1B24" flood-opacity="0.28"/>
</filter>
"""


def desktop_page():
    """Нейтральная главная страница сайта адвоката, 1600×1000."""
    p = [f'<rect width="1600" height="1000" fill="{PAPER}"/>']
    # шапка
    p.append(f'<rect width="1600" height="88" fill="{DEEP}"/>')
    p.append(f'<rect x="96" y="26" width="36" height="36" rx="8" fill="none" stroke="{GOLD}" stroke-width="1.5"/>')
    p.append(text(114, 51, "А", 18, GOLD, SERIF, anchor="middle"))
    p.append(text(150, 52, "АДВОКАТ", 17, IVORY, SERIF, ls=4))
    for i, n in enumerate(["Услуги", "Об адвокате", "Статьи", "Контакты"]):
        p.append(text(760 + i * 135, 50, n, 15, IVORY, op=0.72))
    p.append(f'<rect x="1324" y="24" width="180" height="40" rx="8" fill="{GOLD}"/>')
    p.append(text(1414, 49, "Консультация", 15, DEEP, weight=700, anchor="middle"))
    # первый экран
    p.append(f'<rect y="88" width="1600" height="560" fill="url(#ivoryGrad)"/>')
    p.append(bar(96, 176, 40, 2, GOLD, 0))
    p.append(bar(150, 172, 210, 9, "#C9BFA9"))
    p.append(lines(96, 214, [640, 590, 430], gap=64, h=40, fill=NAVY))
    p.append(lines(96, 428, [560, 600, 520, 340], gap=24, h=10, fill="#C7CCCB"))
    p.append(f'<rect x="96" y="540" width="250" height="58" rx="10" fill="{NAVY}"/>')
    p.append(bar(130, 565, 182, 9, IVORY, op=0.9))
    p.append(f'<rect x="366" y="540" width="200" height="58" rx="10" fill="none" stroke="{NAVY}" stroke-opacity="0.35"/>')
    p.append(bar(398, 565, 136, 9, NAVY, op=0.55))
    # правая иллюстрация (абстрактная, без людей)
    p.append(f'<rect x="900" y="140" width="604" height="456" rx="18" fill="url(#navyGrad)"/>')
    p.append('<clipPath id="heroArt"><rect x="900" y="140" width="604" height="456" rx="18"/></clipPath><g clip-path="url(#heroArt)">')
    for i in range(5):
        r = 120 + i * 46
        p.append(f'<circle cx="1360" cy="560" r="{r}" fill="none" stroke="{GOLD}" stroke-opacity="{0.42 - i*0.07}" stroke-width="1.2"/>')
    p.append('</g>')
    p.append(f'<rect x="944" y="186" width="250" height="132" rx="12" fill="{PAPER}" opacity="0.96"/>')
    p.append(bar(968, 212, 120, 8, GOLD))
    p.append(lines(968, 238, [190, 160, 176], gap=22, h=9, fill="#B8BFC0"))
    # строка доверия
    for i in range(3):
        x = 96 + i * 300
        p.append(bar(x, 690, 34, 34, GOLD, 17, 0.25))
        p.append(lines(x + 50, 694, [170, 120], gap=18, h=9, fill="#B8BFC0"))
    # карточки услуг
    for i in range(3):
        x = 96 + i * 478
        p.append(f'<rect x="{x}" y="770" width="450" height="190" rx="14" fill="#FFFFFF" stroke="{STROKE}"/>')
        p.append(f'<circle cx="{x+44}" cy="816" r="18" fill="none" stroke="{NAVY}" stroke-opacity="0.5"/>')
        p.append(bar(x + 28, 856, 220, 16, NAVY, 8, 0.85))
        p.append(lines(x + 28, 890, [370, 320, 250], gap=20, h=8, fill="#C7CCCB"))
    return "".join(p)


def mobile_page():
    """Нейтральная мобильная версия, 390×823."""
    p = [f'<rect width="390" height="823" fill="{PAPER}"/>']
    p.append(f'<rect width="390" height="64" fill="{DEEP}"/>')
    p.append(f'<rect x="20" y="18" width="28" height="28" rx="6" fill="none" stroke="{GOLD}" stroke-width="1.3"/>')
    p.append(text(34, 37, "А", 14, GOLD, SERIF, anchor="middle"))
    p.append(text(58, 38, "АДВОКАТ", 13, IVORY, SERIF, ls=3))
    for i in range(3):
        p.append(bar(338, 24 + i * 8, 26, 2, IVORY, 1, 0.8))
    p.append(f'<rect y="64" width="390" height="420" fill="url(#ivoryGrad)"/>')
    p.append(bar(20, 98, 28, 2, GOLD, 0))
    p.append(lines(20, 120, [330, 300, 210], gap=40, h=26, fill=NAVY))
    p.append(lines(20, 260, [340, 320, 250], gap=18, h=8, fill="#C7CCCB"))
    p.append(f'<rect x="20" y="330" width="350" height="50" rx="10" fill="{NAVY}"/>')
    p.append(bar(110, 351, 170, 8, IVORY, op=0.9))
    p.append(f'<rect x="20" y="392" width="350" height="50" rx="10" fill="none" stroke="{NAVY}" stroke-opacity="0.35"/>')
    p.append(bar(130, 413, 130, 8, NAVY, op=0.5))
    for i in range(3):
        y = 506 + i * 102
        p.append(f'<rect x="20" y="{y}" width="350" height="88" rx="12" fill="#FFFFFF" stroke="{STROKE}"/>')
        p.append(f'<circle cx="52" cy="{y+44}" r="14" fill="none" stroke="{NAVY}" stroke-opacity="0.45"/>')
        p.append(bar(80, y + 28, 170, 12, NAVY, 6, 0.85))
        p.append(lines(80, y + 52, [240, 190], gap=14, h=7, fill="#C7CCCB"))
    return "".join(p)


def hero_case_site():
    return svg(1600, 1000, desktop_page(), GRAD)


def case_site_desktop():
    b = [f'<rect width="1600" height="900" fill="url(#ivoryGrad)"/>']
    for i in range(1, 12):
        b.append(f'<line x1="{i*1600/12}" y1="0" x2="{i*1600/12}" y2="900" stroke="{NAVY}" stroke-opacity="0.04"/>')
    # ноутбук
    b.append(f'<g filter="url(#shadow)"><rect x="120" y="96" width="1080" height="686" rx="22" fill="{DEEP}"/></g>')
    b.append(f'<g transform="translate(140,116) scale(0.65)"><clipPath id="scr"><rect width="1600" height="1000" rx="10"/></clipPath>'
             f'<g clip-path="url(#scr)">{desktop_page()}</g></g>')
    b.append(f'<path d="M60 782 H1260 L1230 812 H90 Z" fill="#C9CDCB"/>')
    b.append(f'<rect x="580" y="782" width="160" height="8" rx="4" fill="#AEB4B2"/>')
    # телефон
    b.append(f'<g filter="url(#shadow)"><rect x="1150" y="210" width="330" height="664" rx="48" fill="{DEEP}"/></g>')
    b.append(f'<g transform="translate(1166,226) scale(0.7641)"><clipPath id="ph"><rect width="390" height="823" rx="40"/></clipPath>'
             f'<g clip-path="url(#ph)">{mobile_page()}</g></g>')
    b.append(f'<rect x="1270" y="234" width="90" height="18" rx="9" fill="{DEEP}"/>')
    return svg(1600, 900, "".join(b), GRAD)


def case_site_mobile():
    return svg(390, 823, mobile_page(), GRAD)


def card(x, y, w, h, title, sub=None, dark=False, accent=False):
    fill = NAVY if dark else "#FFFFFF"
    stroke = GOLD if accent else STROKE
    tc = IVORY if dark else INK
    s = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="{stroke}" stroke-width="{1.6 if accent else 1}"/>'
    s += text(x + 22, y + 36, title, 19, tc, SERIF, weight=600)
    if sub:
        s += text(x + 22, y + 62, sub, 14, IVORY if dark else "#5A666E", op=0.85)
    return s


def case_ads():
    b = [f'<rect width="1600" height="1200" fill="{IVORY}"/>']
    b.append(text(96, 120, "СХЕМА РЕКЛАМНЫХ КАМПАНИЙ", 16, "#7A6440", weight=700, ls=3))
    b.append(text(96, 176, "От запроса к обращению", 46, INK, SERIF))
    b.append(card(96, 250, 420, 84, "Спрос в поиске", "Запросы о юридической помощи", dark=True))
    cols = [("Кампания", "Направление практики 1"), ("Кампания", "Направление практики 2"), ("Кампания", "Направление практики 3")]
    for i, (t, s) in enumerate(cols):
        x = 96 + i * 480
        b.append(f'<path d="M306 334 V380 H{x+200} V420" fill="none" stroke="{GOLD}" stroke-width="1.5"/>')
        b.append(card(x, 420, 440, 84, t, s, accent=True))
        for j in range(2):
            y = 548 + j * 104
            b.append(f'<path d="M{x+40} 504 V{y+42} H{x+60}" fill="none" stroke="{STROKE}" stroke-width="1.5"/>')
            b.append(card(x + 60, y, 380, 84, "Группа объявлений", "Ключевые фразы · тексты"))
        b.append(f'<path d="M{x+250} 736 V800 H800 V840" fill="none" stroke="{GOLD}" stroke-width="1.5" stroke-opacity="0.7"/>')
    b.append(card(560, 840, 480, 84, "Посадочная страница", "Услуга · доверие · форма обращения"))
    b.append(f'<path d="M800 924 V964" stroke="{GOLD}" stroke-width="1.5"/>')
    b.append(card(560, 964, 480, 84, "Цель: целевое обращение", "Звонок или заявка", dark=True))
    b.append(text(1504, 1140, "Демонстрационная схема · без статистики", 15, "#5A666E", anchor="end", italic=True))
    return svg(1600, 1200, "".join(b), GRAD)


def case_articles():
    b = [f'<rect width="1600" height="1200" fill="{PAPER}"/>']
    b.append(f'<rect width="1600" height="84" fill="{DEEP}"/>')
    b.append(text(96, 52, "АДВОКАТ", 18, IVORY, SERIF, ls=4))
    for i, n in enumerate(["Услуги", "Статьи", "Контакты"]):
        b.append(text(1120 + i * 130, 50, n, 15, IVORY, op=0.7))
    b.append(text(96, 150, "Статьи  /  Уголовное право", 15, "#5A666E"))
    b.append(lines(96, 196, [860, 720], gap=70, h=46, fill=NAVY))
    b.append(text(96, 370, "Время чтения: 6 минут", 15, "#7A6440"))
    b.append(lines(96, 420, [930, 900, 940, 880, 600], gap=30, h=12, fill="#C7CCCB"))
    b.append(f'<rect x="96" y="590" width="4" height="120" fill="{GOLD}"/>')
    b.append(lines(126, 606, [760, 700, 560], gap=34, h=18, fill="#8C969B"))
    b.append(lines(96, 760, [930, 910, 860, 940, 900, 720], gap=30, h=12, fill="#C7CCCB"))
    b.append(lines(96, 960, [520], gap=0, h=26, fill=NAVY))
    b.append(lines(96, 1012, [920, 880, 640], gap=30, h=12, fill="#C7CCCB"))
    # сайдбар
    b.append(f'<rect x="1120" y="196" width="384" height="360" rx="16" fill="{NAVY}"/>')
    b.append(bar(1152, 232, 60, 2, GOLD, 0))
    b.append(text(1152, 284, "Нужна консультация", 26, IVORY, SERIF))
    b.append(text(1152, 316, "по вашей ситуации?", 26, IVORY, SERIF))
    b.append(lines(1152, 352, [300, 260], gap=22, h=9, fill="#5B6B75"))
    b.append(f'<rect x="1152" y="460" width="320" height="56" rx="10" fill="{GOLD}"/>')
    b.append(text(1312, 494, "Задать вопрос", 17, DEEP, weight=700, anchor="middle"))
    b.append(f'<rect x="1120" y="590" width="384" height="300" rx="16" fill="#FFFFFF" stroke="{STROKE}"/>')
    b.append(text(1152, 636, "Другие статьи", 20, INK, SERIF, weight=600))
    for i in range(3):
        b.append(lines(1152, 672 + i * 70, [300, 220], gap=20, h=9, fill="#C7CCCB"))
    return svg(1600, 1200, "".join(b), GRAD)


def case_social():
    b = [f'<rect width="1600" height="1200" fill="{IVORY}"/>']
    styles = [
        ("dark", "«"), ("light", None), ("gold", None),
        ("light", None), ("dark", None), ("light", "?"),
    ]
    W, H, G = 448, 500, 40
    x0, y0 = 96, 90
    for i, (kind, glyph) in enumerate(styles):
        x = x0 + (i % 3) * (W + G)
        y = y0 + (i // 3) * (H + G)
        bg = {"dark": NAVY, "light": "#FFFFFF", "gold": "#E9DFCB"}[kind]
        fg = IVORY if kind == "dark" else NAVY
        b.append(f'<g filter="url(#shadow)" opacity="0.98"><rect x="{x}" y="{y}" width="{W}" height="{H}" rx="18" fill="{bg}"/></g>')
        if kind == "light":
            b.append(f'<rect x="{x}" y="{y}" width="{W}" height="{H}" rx="18" fill="none" stroke="{STROKE}"/>')
        # шапка поста
        b.append(f'<circle cx="{x+40}" cy="{y+42}" r="16" fill="none" stroke="{GOLD}" stroke-width="1.5"/>')
        b.append(bar(x + 66, y + 30, 120, 9, fg, op=0.55))
        b.append(bar(x + 66, y + 46, 70, 7, fg, op=0.3))
        # контент
        if glyph:
            b.append(text(x + 36, y + 200, glyph, 120, GOLD, SERIF))
        b.append(lines(x + 36, y + (230 if glyph else 150), [360, 330, 250], gap=44, h=28, fill=fg))
        b.append(lines(x + 36, y + 390, [340, 280], gap=20, h=9, fill=fg if kind != "light" else "#C7CCCB"))
        # нижняя строка
        b.append(f'<path d="M{x+36} {y+H-40} l8 -8 a6 6 0 0 1 8 8 l-8 8 l-8 -8 a6 6 0 0 1 8 -8" fill="none" stroke="{fg}" stroke-opacity="0.5"/>')
        b.append(f'<rect x="{x+76}" y="{y+H-52}" width="18" height="14" rx="3" fill="none" stroke="{fg}" stroke-opacity="0.5"/>')
        b.append(bar(x + W - 110, y + H - 50, 74, 9, fg, op=0.25))
    return svg(1600, 1200, "".join(b), GRAD)


def team_portrait():
    b = [f'<rect width="900" height="1200" fill="url(#navyGrad)"/>']
    for i in range(4):
        b.append(f'<circle cx="760" cy="180" r="{140 + i*70}" fill="none" stroke="{GOLD}" stroke-opacity="{0.22 - i*0.04}"/>')
    # нейтральный силуэт без лица
    b.append('<circle cx="450" cy="470" r="150" fill="#2A3F4D"/>')
    b.append('<path d="M150 1200 C150 900 290 720 450 720 C610 720 750 900 750 1200 Z" fill="#2A3F4D"/>')
    b.append(f'<path d="M150 1200 C150 900 290 720 450 720 C610 720 750 900 750 1200" fill="none" stroke="{GOLD}" stroke-opacity="0.45" stroke-width="2"/>')
    b.append(f'<circle cx="450" cy="470" r="150" fill="none" stroke="{GOLD}" stroke-opacity="0.45" stroke-width="2"/>')
    return svg(900, 1200, "".join(b), GRAD)


def video_cover():
    b = [f'<rect width="1600" height="900" fill="url(#navyGrad)"/>']
    for i in range(1, 8):
        b.append(f'<line x1="{i*200}" y1="0" x2="{i*200}" y2="900" stroke="{IVORY}" stroke-opacity="0.035"/>')
    c = f'stroke="{GOLD}" stroke-width="2" fill="none" stroke-opacity="0.8"'
    for (x, y, dx, dy) in [(80, 80, 1, 1), (1520, 80, -1, 1), (80, 820, 1, -1), (1520, 820, -1, -1)]:
        b.append(f'<path d="M{x} {y + 70*dy} V{y} H{x + 70*dx}" {c}/>')
    return svg(1600, 900, "".join(b), GRAD)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    files = {
        "hero-case-site.svg": hero_case_site(),
        "case-site-desktop.svg": case_site_desktop(),
        "case-site-mobile.svg": case_site_mobile(),
        "case-ads.svg": case_ads(),
        "case-articles.svg": case_articles(),
        "case-social.svg": case_social(),
        "team-portrait.svg": team_portrait(),
        "video-cover.svg": video_cover(),
    }
    for name, content in files.items():
        (OUT / name).write_text(content, "utf-8")
        print(f"{name}: {len(content)//1024} KB")


if __name__ == "__main__":
    main()
