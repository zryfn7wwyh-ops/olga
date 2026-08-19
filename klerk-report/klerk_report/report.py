"""Сравнение прироста просмотров между нашей статьёй и статьями конкурентов."""

from dataclasses import dataclass

from .config import Config, SourceConfig
from .storage import History


@dataclass
class SourceResult:
    label: str
    url: str
    prev_date: str | None
    prev_views: int | None
    curr_date: str | None
    curr_views: int | None
    reading_now: int | None
    title: str | None

    @property
    def delta(self) -> int | None:
        if self.prev_views is None or self.curr_views is None:
            return None
        return self.curr_views - self.prev_views


@dataclass
class QueryResult:
    query: str
    our: SourceResult
    competitors: list[SourceResult]

    @property
    def winner(self) -> str | None:
        """Кто прирос больше за период: 'our', 'competitor:<label>' или None, если сравнить нечем."""
        candidates = [("our", self.our)] + [(f"competitor:{c.label}", c) for c in self.competitors]
        scored = [(name, res.delta) for name, res in candidates if res.delta is not None]
        if not scored:
            return None
        scored.sort(key=lambda x: x[1], reverse=True)
        top_name, top_delta = scored[0]
        ties = [n for n, d in scored if d == top_delta]
        if len(ties) > 1:
            return "tie"
        return top_name


def _source_result(source: SourceConfig, history: History) -> SourceResult:
    prev, curr = history.latest_two(source.url)
    return SourceResult(
        label=source.label,
        url=source.url,
        prev_date=prev["date"] if prev else None,
        prev_views=prev["views"] if prev else None,
        curr_date=curr["date"] if curr else None,
        curr_views=curr["views"] if curr else None,
        reading_now=curr["reading_now"] if curr else None,
        title=curr.get("title") if curr else None,
    )


def build_report(config: Config, history: History) -> list[QueryResult]:
    results = []
    for item in config.items:
        our_result = _source_result(item.our, history)
        comp_results = [_source_result(c, history) for c in item.competitors]
        results.append(QueryResult(query=item.query, our=our_result, competitors=comp_results))
    return results


def _fmt_num(n: int | None) -> str:
    return f"{n:,}".replace(",", " ") if n is not None else "н/д"


def _fmt_delta(n: int | None) -> str:
    if n is None:
        return "н/д"
    sign = "+" if n >= 0 else ""
    return f"{sign}{n:,}".replace(",", " ")


def _winner_label(query_result: QueryResult, name: str | None) -> str:
    if name is None:
        return "недостаточно данных (нужен ещё один `update`)"
    if name == "tie":
        return "ничья"
    if name == "our":
        return f"🏆 наша статья ({_fmt_delta(query_result.our.delta)})"
    label = name.split(":", 1)[1]
    comp = next(c for c in query_result.competitors if c.label == label)
    return f"🏆 {label} ({_fmt_delta(comp.delta)})"


def render_markdown(results: list[QueryResult]) -> str:
    lines = ["# Отчёт по контенту klerk.ru\n"]
    for r in results:
        period = ""
        if r.our.prev_date and r.our.curr_date:
            period = f" (период {r.our.prev_date} → {r.our.curr_date})"
        lines.append(f"## {r.query}{period}\n")

        lines.append("| | Статья | Просмотры (тек.) | Прирост за период | Читают сейчас |")
        lines.append("|---|---|---:|---:|---:|")
        lines.append(
            f"| Наша | [{r.our.title or r.our.url}]({r.our.url}) | "
            f"{_fmt_num(r.our.curr_views)} | {_fmt_delta(r.our.delta)} | {_fmt_num(r.our.reading_now)} |"
        )
        for c in r.competitors:
            lines.append(
                f"| {c.label} | [{c.title or c.url}]({c.url}) | "
                f"{_fmt_num(c.curr_views)} | {_fmt_delta(c.delta)} | {_fmt_num(c.reading_now)} |"
            )
        lines.append("")
        lines.append(f"**Победитель за период:** {_winner_label(r, r.winner)}")
        lines.append("")
    return "\n".join(lines)


def render_csv(results: list[QueryResult]) -> str:
    import csv
    import io

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(
        [
            "query",
            "label",
            "url",
            "prev_date",
            "prev_views",
            "curr_date",
            "curr_views",
            "delta",
            "reading_now",
        ]
    )
    for r in results:
        for res in [r.our, *r.competitors]:
            writer.writerow(
                [
                    r.query,
                    res.label,
                    res.url,
                    res.prev_date or "",
                    res.prev_views if res.prev_views is not None else "",
                    res.curr_date or "",
                    res.curr_views if res.curr_views is not None else "",
                    res.delta if res.delta is not None else "",
                    res.reading_now if res.reading_now is not None else "",
                ]
            )
    return buf.getvalue()
