"""Загрузка HTML статьи: обычным запросом или через headless-браузер."""

import requests

DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)


class FetchError(RuntimeError):
    pass


def fetch_html(url: str, timeout: int = 15, user_agent: str | None = None) -> str:
    """Обычный HTTP-запрос. Работает, если счётчики просмотров лежат прямо в HTML."""
    headers = {
        "User-Agent": user_agent or DEFAULT_USER_AGENT,
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }
    try:
        resp = requests.get(url, headers=headers, timeout=timeout)
        resp.raise_for_status()
    except requests.RequestException as exc:
        raise FetchError(f"Не удалось загрузить {url}: {exc}") from exc
    return resp.text


def fetch_html_rendered(url: str, timeout: int = 15, user_agent: str | None = None) -> str:
    """Загрузка через Playwright (Chromium) — нужна, если данные подгружаются через JS.

    Требует: pip install playwright && playwright install chromium
    """
    try:
        from playwright.sync_api import sync_playwright
    except ImportError as exc:
        raise FetchError(
            "Для render: true нужен playwright. Установите: "
            "pip install playwright && playwright install chromium"
        ) from exc

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(user_agent=user_agent or DEFAULT_USER_AGENT)
            page.goto(url, timeout=timeout * 1000, wait_until="networkidle")
            html = page.content()
            browser.close()
            return html
    except Exception as exc:  # noqa: BLE001 - хотим единый тип ошибки для CLI
        raise FetchError(f"Не удалось загрузить (render) {url}: {exc}") from exc
