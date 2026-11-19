#!/usr/bin/env python3
"""
Собирает автономную HTML-версию лендинга (один файл, без внешних зависимостей).

Использование:
    npm run build && npx next start -p 3200 &
    python3 scripts/static-html/build.py http://localhost:3200/ static-html/index.html

Что делает:
  - берёт отрендеренный сервером HTML;
  - убирает скрипты Next.js/React и подставляет лёгкий runtime.js (интерактив без фреймворка);
  - встраивает CSS и шрифты (base64, только latin/latin-ext/cyrillic);
  - ссылки на /privacy заменяет на встроенный блок с тем же текстом.
"""
import base64
import json
import pathlib
import re
import sys
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
KEEP_SUBSETS = ("-latin-", "-latin-ext-", "-cyrillic-")
DROP_SUBSETS = ("-cyrillic-ext-", "-greek-", "-vietnamese-")


def fetch_bytes(url: str) -> bytes:
    with urllib.request.urlopen(url) as r:
        return r.read()


def fetch(url: str) -> str:
    return fetch_bytes(url).decode("utf-8")


def inline_css(css: str, css_url: str) -> str:
    def font_face(m: re.Match) -> str:
        block = m.group(0)
        url = re.search(r"url\(([^)]+\.woff2)\)", block)
        if not url:
            return ""
        name = url.group(1)
        if any(s in name for s in DROP_SUBSETS) or not any(s in name for s in KEEP_SUBSETS):
            return ""
        data = base64.b64encode(fetch_bytes(urllib.parse.urljoin(css_url, name))).decode()
        # оставляем только woff2-источник
        src = re.search(r"src:[^;}]*", block).group(0)
        fmt = "woff2-variations" if "variations" in src else "woff2"
        return block.replace(src, f'src:url(data:font/woff2;base64,{data}) format("{fmt}")')

    return re.sub(r"@font-face\{[^}]*\}", font_face, css)


def main(url: str, out: str) -> None:
    html = fetch(url)

    css_parts = []
    for href in re.findall(r'<link rel="stylesheet" href="([^"]+)"', html):
        css_url = urllib.parse.urljoin(url, href)
        css_parts.append(inline_css(fetch(css_url), css_url))
    css = "\n".join(css_parts)
    css += """
/* Встроенные документы (вместо отдельной страницы /privacy) */
.lp-doc{display:none}
.lp-doc:target{display:block}
"""

    # Убираем скрипты Next.js, preload/stylesheet-ссылки, служебные теги
    html = re.sub(r"<script\b[^>]*>.*?</script>", "", html, flags=re.S)
    html = re.sub(r"<link [^>]*(rel=\"(preload|stylesheet|preconnect|modulepreload)\")[^>]*/?>", "", html)
    html = re.sub(r"<!--\$-->|<!--/\$-->|<!-- -->", "", html)
    html = re.sub(r'<meta name="next-size-adjust"[^>]*>', "", html)

    # Год в подвале — обновляется скриптом
    html = html.replace('<span>2026</span>', '<span data-current-year="">2026</span>')
    html = re.sub(r"<span>(\d{4})</span>( ?Legal)", r'<span data-current-year="">\1</span>\2', html)

    # Ссылки на документы → встроенный блок
    html = html.replace('href="/privacy#consent" target="_blank" rel="noopener"', 'href="#consent"')
    html = html.replace('href="/privacy" target="_blank" rel="noopener"', 'href="#privacy"')
    html = html.replace('href="/privacy#consent"', 'href="#consent"').replace('href="/privacy"', 'href="#privacy"')

    docs = """
<section id="privacy" class="lp-doc on-light bg-paper"><div class="container-lp py-16">
<h2 class="h2">Политика обработки персональных данных</h2>
<p class="mt-6 max-w-[62ch] text-muted-text">Документ проходит юридическое согласование и будет опубликован оператором персональных данных до начала приёма заявок.</p>
<p class="mt-6"><a href="#top" class="link-underline">Вернуться к началу страницы</a></p></div></section>
<section id="consent" class="lp-doc on-light bg-paper"><div class="container-lp py-16">
<h2 class="h2">Согласие на обработку персональных данных</h2>
<p class="mt-6 max-w-[62ch] text-muted-text">Документ проходит юридическое согласование и будет опубликован оператором персональных данных до начала приёма заявок.</p>
<p class="mt-6"><a href="#top" class="link-underline">Вернуться к началу страницы</a></p></div></section>
"""
    html = html.replace("</main>", docs + "</main>", 1)

    # Тексты этапов для схемы «путь до договора»
    landing = (ROOT / "src/content/landing.ts").read_text("utf-8")
    approach = landing.split("export const approach")[1].split("principles:")[0]
    steps = [
        {"title": t, "text": x}
        for t, x in re.findall(r'title: "([^"]+)",\s*text:\s*"([^"]+)"', approach)
    ]

    runtime = (pathlib.Path(__file__).parent / "runtime.js").read_text("utf-8")
    head_extra = (
        f"<style>{css}</style>"
        "<script>document.documentElement.classList.add('js')</script>"
    )
    body_extra = (
        "<script>window.LP_LEAD_ENDPOINT='';"
        f"window.LP_STEPS={json.dumps(steps, ensure_ascii=False)};</script>"
        f"<script>{runtime}</script>"
    )
    html = html.replace("</head>", head_extra + "</head>", 1)
    html = html.replace("</body>", body_extra + "</body>", 1)

    out_path = pathlib.Path(out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(html, "utf-8")
    print(f"{out_path} — {out_path.stat().st_size // 1024} KB, steps: {len(steps)}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3200/",
         sys.argv[2] if len(sys.argv) > 2 else str(ROOT / "static-html" / "index.html"))
