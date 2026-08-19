import argparse
import sys
from datetime import date
from pathlib import Path

from bs4 import BeautifulSoup

from .config import Config, SourceConfig, load_config
from .fetcher import FetchError, fetch_html, fetch_html_rendered
from .parser import find_number_context, parse_article
from .report import build_report, render_csv, render_markdown
from .storage import History

DEFAULT_CONFIG = "config.yaml"
DEFAULT_DATA = "data/history.json"


def _fetch(source: SourceConfig, config: Config) -> str:
    timeout = config.settings.timeout
    ua = config.settings.user_agent
    if config.settings.render:
        return fetch_html_rendered(source.url, timeout=timeout, user_agent=ua)
    return fetch_html(source.url, timeout=timeout, user_agent=ua)


def cmd_update(args: argparse.Namespace) -> int:
    config = load_config(args.config)
    history = History(args.data)

    all_sources: list[SourceConfig] = []
    seen_urls = set()
    for item in config.items:
        for src in [item.our, *item.competitors]:
            if src.url not in seen_urls:
                seen_urls.add(src.url)
                all_sources.append(src)

    today = args.date or date.today().isoformat()
    ok, failed, missing = 0, 0, 0

    for src in all_sources:
        print(f"→ {src.label}: {src.url}")
        try:
            html = _fetch(src, config)
        except FetchError as exc:
            print(f"   ошибка загрузки: {exc}")
            failed += 1
            continue

        views_sel = src.views_selector or config.settings.views_selector
        reading_sel = src.reading_selector or config.settings.reading_selector
        parsed = parse_article(html, views_sel, reading_sel)

        if parsed["views"] is None:
            print("   не удалось найти число просмотров (будет 'н/д'). "
                  "Запустите: python -m klerk_report inspect <URL>")
            missing += 1
        if parsed["reading_now"] is None:
            print("   не удалось найти 'читают сейчас' (будет 'н/д')")

        history.add_snapshot(src.url, parsed, day=today)
        print(f"   просмотры: {parsed['views']}, читают сейчас: {parsed['reading_now']}")
        ok += 1

    history.save()
    print(f"\nГотово: {ok} обработано, {failed} ошибок загрузки, "
          f"{missing} без найденных просмотров. Снимок сохранён в {args.data} за {today}.")
    return 0 if failed == 0 else 1


def cmd_report(args: argparse.Namespace) -> int:
    config = load_config(args.config)
    history = History(args.data)
    results = build_report(config, history)

    if args.format == "csv":
        output = render_csv(results)
    else:
        output = render_markdown(results)

    if args.out:
        Path(args.out).write_text(output, encoding="utf-8")
        print(f"Отчёт сохранён в {args.out}")
    else:
        print(output)
    return 0


def cmd_inspect(args: argparse.Namespace) -> int:
    config = load_config(args.config) if Path(args.config).exists() else None
    timeout = config.settings.timeout if config else 15
    ua = config.settings.user_agent if config else None
    render = args.render or (config.settings.render if config else False)

    try:
        html = fetch_html_rendered(args.url, timeout=timeout, user_agent=ua) if render \
            else fetch_html(args.url, timeout=timeout, user_agent=ua)
    except FetchError as exc:
        print(f"Ошибка загрузки: {exc}")
        return 1

    soup = BeautifulSoup(html, "html.parser")
    title = soup.find("h1")
    print(f"Заголовок (h1): {title.get_text(strip=True) if title else 'не найден'}\n")

    parsed = parse_article(html)
    print(f"Найденные просмотры (эвристика): {parsed['views']}")
    print(f"Найдено 'читают сейчас' (эвристика): {parsed['reading_now']}\n")

    print("Контекст вокруг слова 'просмотр':")
    for ctx in find_number_context(html, ["просмотр"])[:5]:
        print(f"  … {ctx} …")

    print("\nКонтекст вокруг слов 'читают' / 'смотрят' / 'онлайн':")
    for ctx in find_number_context(html, ["читают", "смотрят", "онлайн"])[:5]:
        print(f"  … {ctx} …")

    print(
        "\nЕсли числа найдены правильно — можно ничего не делать, эвристика справится.\n"
        "Если нет — откройте страницу в браузере, найдите нужный элемент через "
        "'Инспектировать элемент' и впишите его CSS-класс в config.yaml как "
        "views_selector / reading_selector."
    )
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="klerk_report",
        description="Отчёт по контенту klerk.ru: просмотры нашей статьи vs статьи конкурента.",
    )
    parser.add_argument("--config", default=DEFAULT_CONFIG, help="Путь к config.yaml")
    parser.add_argument("--data", default=DEFAULT_DATA, help="Путь к файлу истории (JSON)")
    sub = parser.add_subparsers(dest="command", required=True)

    p_update = sub.add_parser("update", help="Загрузить текущие показатели и сохранить снимок")
    p_update.add_argument("--date", help="Дата снимка (YYYY-MM-DD), по умолчанию сегодня")
    p_update.set_defaults(func=cmd_update)

    p_report = sub.add_parser("report", help="Построить отчёт по сохранённой истории")
    p_report.add_argument("--format", choices=["md", "csv"], default="md")
    p_report.add_argument("--out", help="Сохранить отчёт в файл вместо вывода в консоль")
    p_report.set_defaults(func=cmd_report)

    p_inspect = sub.add_parser(
        "inspect", help="Отладка: посмотреть, что парсер находит на конкретной странице"
    )
    p_inspect.add_argument("url")
    p_inspect.add_argument("--render", action="store_true", help="Загрузить через Playwright")
    p_inspect.set_defaults(func=cmd_inspect)

    return parser


def main(argv: list[str] | None = None) -> None:
    parser = build_parser()
    args = parser.parse_args(argv)
    sys.exit(args.func(args))


if __name__ == "__main__":
    main()
