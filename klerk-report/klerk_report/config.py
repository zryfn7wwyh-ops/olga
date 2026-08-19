from dataclasses import dataclass, field
from pathlib import Path
import yaml


@dataclass
class SourceConfig:
    """Одна отслеживаемая статья (наша или конкурента)."""

    label: str
    url: str
    views_selector: str | None = None
    reading_selector: str | None = None


@dataclass
class TrackedQuery:
    query: str
    our: SourceConfig
    competitors: list[SourceConfig] = field(default_factory=list)


@dataclass
class Settings:
    user_agent: str | None = None
    timeout: int = 15
    render: bool = False
    views_selector: str | None = None
    reading_selector: str | None = None


@dataclass
class Config:
    settings: Settings
    items: list[TrackedQuery]


def load_config(path: str | Path) -> Config:
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(
            f"Файл конфигурации не найден: {path}\n"
            "Скопируйте config.example.yaml в config.yaml и заполните его."
        )
    raw = yaml.safe_load(path.read_text(encoding="utf-8")) or {}

    settings_raw = raw.get("settings") or {}
    settings = Settings(
        user_agent=settings_raw.get("user_agent"),
        timeout=int(settings_raw.get("timeout", 15)),
        render=bool(settings_raw.get("render", False)),
        views_selector=settings_raw.get("views_selector"),
        reading_selector=settings_raw.get("reading_selector"),
    )

    items = []
    for raw_item in raw.get("items") or []:
        query = raw_item["query"]
        our_url = raw_item["our_url"]
        our = SourceConfig(
            label="Наша статья",
            url=our_url,
            views_selector=raw_item.get("views_selector"),
            reading_selector=raw_item.get("reading_selector"),
        )
        competitors = []
        for comp in raw_item.get("competitors") or []:
            if isinstance(comp, str):
                competitors.append(SourceConfig(label="Конкурент", url=comp))
            else:
                competitors.append(
                    SourceConfig(
                        label=comp.get("label", "Конкурент"),
                        url=comp["url"],
                        views_selector=comp.get("views_selector"),
                        reading_selector=comp.get("reading_selector"),
                    )
                )
        if not competitors:
            raise ValueError(f"У запроса '{query}' не указан ни один конкурент (competitors: [])")
        items.append(TrackedQuery(query=query, our=our, competitors=competitors))

    if not items:
        raise ValueError("В конфигурации нет ни одного элемента 'items'")

    return Config(settings=settings, items=items)
