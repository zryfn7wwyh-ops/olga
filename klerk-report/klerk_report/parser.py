"""Извлечение заголовка, просмотров и "читают сейчас" со страницы статьи klerk.ru.

ВАЖНО: сеть до klerk.ru была недоступна из окружения, в котором писался этот
модуль, поэтому эвристики ниже не проверены на реальной странице. Если после
первого запуска `update` числа не находятся (в отчёте будет "н/д"), запустите:

    python -m klerk_report inspect <URL>

Эта команда покажет заголовок страницы и все места, где рядом стоит число и
слово вроде "просмотр"/"читают", а также подскажет CSS-селектор, если удаётся
его определить. Найденный селектор впишите в config.yaml (views_selector /
reading_selector) — тогда парсинг станет точным и не будет зависеть от
эвристик.
"""

import re
from bs4 import BeautifulSoup

VIEWS_CSS_CANDIDATES = [
    ".article-views",
    ".article__views",
    ".views-count",
    ".stats-views",
    ".news-views",
    "[class*='views' i]",
    "[class*='Views' i]",
]

READING_CSS_CANDIDATES = [
    ".reading-now",
    ".article-online",
    ".online-count",
    "[class*='online' i]",
    "[class*='reading' i]",
]

_DIGITS_RE = re.compile(r"\d[\d\s ]*\d|\d")

VIEWS_TEXT_PATTERNS = [
    r'"views?(?:_count)?"\s*:\s*"?(\d+)',
    r'"reads?(?:_count)?"\s*:\s*"?(\d+)',
    r"(\d[\d\s ]{0,8})\s*просмотр\w*",
]

READING_TEXT_PATTERNS = [
    r"(\d+)\s*(?:чел\.?|человек)?\s*(?:читают|смотрят)\s*(?:сейчас|статью сейчас|в данный момент)",
    r"(?:сейчас читают|читают сейчас|читают статью)\D{0,20}?(\d+)",
]


def _text_to_int(text: str) -> int | None:
    if not text:
        return None
    match = _DIGITS_RE.search(text.replace("\xa0", " "))
    if not match:
        return None
    digits = re.sub(r"\D", "", match.group())
    return int(digits) if digits else None


def extract_title(soup: BeautifulSoup) -> str | None:
    h1 = soup.find("h1")
    if h1 and h1.get_text(strip=True):
        return h1.get_text(strip=True)
    if soup.title and soup.title.string:
        return soup.title.string.strip()
    return None


def _extract_by_selector(soup: BeautifulSoup, selector: str) -> int | None:
    el = soup.select_one(selector)
    return _text_to_int(el.get_text()) if el else None


def _extract_by_css_candidates(soup: BeautifulSoup, candidates: list[str]) -> int | None:
    for css in candidates:
        for el in soup.select(css):
            value = _text_to_int(el.get_text())
            if value:
                return value
    return None


def _extract_by_text_patterns(html: str, patterns: list[str]) -> int | None:
    for pattern in patterns:
        match = re.search(pattern, html, re.IGNORECASE)
        if match:
            digits = re.sub(r"\D", "", match.group(1))
            if digits:
                return int(digits)
    return None


def extract_views(html: str, soup: BeautifulSoup, selector: str | None = None) -> int | None:
    if selector:
        value = _extract_by_selector(soup, selector)
        if value is not None:
            return value
    value = _extract_by_css_candidates(soup, VIEWS_CSS_CANDIDATES)
    if value is not None:
        return value
    return _extract_by_text_patterns(html, VIEWS_TEXT_PATTERNS)


def extract_reading_now(html: str, soup: BeautifulSoup, selector: str | None = None) -> int | None:
    if selector:
        value = _extract_by_selector(soup, selector)
        if value is not None:
            return value
    value = _extract_by_css_candidates(soup, READING_CSS_CANDIDATES)
    if value is not None:
        return value
    return _extract_by_text_patterns(html, READING_TEXT_PATTERNS)


def parse_article(
    html: str,
    views_selector: str | None = None,
    reading_selector: str | None = None,
) -> dict:
    soup = BeautifulSoup(html, "html.parser")
    return {
        "title": extract_title(soup),
        "views": extract_views(html, soup, views_selector),
        "reading_now": extract_reading_now(html, soup, reading_selector),
    }


def find_number_context(html: str, keywords: list[str], window: int = 40) -> list[str]:
    """Для команды `inspect`: возвращает фрагменты текста рядом с ключевыми словами."""
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text(" ", strip=True)
    found = []
    for kw in keywords:
        for match in re.finditer(re.escape(kw), text, re.IGNORECASE):
            start = max(0, match.start() - window)
            end = min(len(text), match.end() + window)
            found.append(text[start:end])
    return found
