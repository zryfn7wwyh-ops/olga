"""Собирает автономный HTML-превью (out/index.html + CSS + шрифты + vanilla runtime).
Запуск: python3 scripts/build-preview.py out <путь-результата>"""
import base64, os, re, sys
out, dest = sys.argv[1], sys.argv[2]
html = open(os.path.join(out, "index.html"), encoding="utf-8").read()
css_path = re.search(r'href="(/_next/static/chunks/[^"]+\.css)"', html).group(1)
css = open(os.path.join(out, css_path.lstrip("/")), encoding="utf-8").read()
# Оставляем только кириллицу и латиницу, остальные подмножества шрифтов выкидываем
def keep_face(m):
    face = m.group(0)
    if re.search(r"(greek|vietnamese|cyrillic-ext|latin-ext)", face): return ""
    def inline(u):
        p = os.path.normpath(os.path.join(out, os.path.dirname(css_path.lstrip("/")), u.group(1)))
        return "url(data:font/woff2;base64,%s)" % base64.b64encode(open(p, "rb").read()).decode()
    return re.sub(r"url\(([^)]+\.woff2)\)", inline, face)
css = re.sub(r"@font-face\s*{[^}]*}", keep_face, css)
body = re.search(r"<body>(.*)</body>", html, re.S).group(1)
body = re.sub(r"<script\b[^>]*>.*?</script>", "", body, flags=re.S)
body = body.replace('<a href="/bankrotstvo"', '<a href="https://pudovkinanton.ru/bankrotstvo" target="_blank" rel="noopener noreferrer"')
runtime = open(os.path.join(os.path.dirname(__file__), "preview-runtime.js"), encoding="utf-8").read()
page = f"""<title>Сайт Антона Пудовкина</title>
<meta name="description" content="Прототип главной страницы pudovkinanton.ru">
<style>{css}
:root{{color-scheme:light}} body{{background:#F3F0E9}}</style>
{body}
<script>{runtime}</script>
"""
open(dest, "w", encoding="utf-8").write(page)
print(dest, round(len(page) / 1024), "KB")
