"""Хранение истории снимков (просмотры/читают-сейчас по датам) в JSON-файле."""

import json
from dataclasses import dataclass
from datetime import date
from pathlib import Path


@dataclass
class Snapshot:
    date: str
    views: int | None
    reading_now: int | None
    title: str | None = None


class History:
    def __init__(self, path: str | Path):
        self.path = Path(path)
        self._data: dict[str, list[dict]] = {}
        if self.path.exists():
            self._data = json.loads(self.path.read_text(encoding="utf-8"))

    def add_snapshot(self, url: str, snapshot: dict, day: str | None = None) -> None:
        day = day or date.today().isoformat()
        entry = dict(snapshot)
        entry["date"] = day
        entries = self._data.setdefault(url, [])
        entries[:] = [e for e in entries if e["date"] != day]
        entries.append(entry)
        entries.sort(key=lambda e: e["date"])

    def snapshots(self, url: str) -> list[dict]:
        return self._data.get(url, [])

    def latest(self, url: str) -> dict | None:
        entries = self.snapshots(url)
        return entries[-1] if entries else None

    def latest_two(self, url: str) -> tuple[dict | None, dict | None]:
        entries = self.snapshots(url)
        if not entries:
            return None, None
        if len(entries) == 1:
            return None, entries[-1]
        return entries[-2], entries[-1]

    def save(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(
            json.dumps(self._data, ensure_ascii=False, indent=2), encoding="utf-8"
        )
