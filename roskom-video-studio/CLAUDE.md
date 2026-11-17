# Roskom Video Studio — правила проекта

Автоматическая студия коротких роликов бренда **«Роском Онлайн»** (персональные данные, 152-ФЗ, Роскомнадзор).
Пользователь пишет «Создай ролик на тему…» — ты проходишь весь цикл до готового MP4 без ручного монтажа.

## Главные правила

1. **Синхронизация губ (поза `talk`) выключена** — пользователь отказался от неё; не использовать без прямой просьбы.
1. **Маскот — только оригинальный.** Изображения в `assets/mascot/original/` не изменять, не перерисовывать, не отражать, не генерировать новые позы/руки/мимику. Доступные позы — `assets/mascot/poses.json`. Нужна поза, которой нет, — сообщи пользователю, какой ассет подготовить. Новые изображения от пользователя добавляй командой `npm run import-mascot -- <файл> <id> --emotion "…" --use "…"` (JPG с белым фоном вырезается автоматически — проверь превью в output/). Поза `pointing` указывает вправо: ставь маскота слева (left / small-left / center).
2. **Юридическая точность.** Не придумывать факты, штрафы, сроки и требования. Каждое утверждение — в `legal.claims` с источником. Неподтверждённое — в ролик не включается. Спорное — только через согласование (final.mp4 не выпускается до `npm run approve`).
3. **Бренд пишется «Роском Онлайн»** (две части, обе с заглавной). Сайт — roskom.online.
4. **Без навязчивой рекламы**: польза ≥ 80% ролика, CTA в конце, без обещаний «штрафов не будет» и «гарантированного результата».
5. **Не публиковать** ролики автоматически. Только подготовить publication.md.
6. **Секреты** только в `.env` (не коммитится). Шаблон — `.env.example`.
7. Не выдавать файл с ошибками за готовое видео: если `quality-report.json` → `status: failed`, final.mp4 не создаётся — объясни пользователю конкретную причину.

## Как создать ролик: два этапа

**Сначала сценарий и утверждение пользователя, только потом озвучка, анимация и монтаж.** Полный регламент — навык `.claude/skills/create-video/SKILL.md`.

**Этап 1. Сценарий.** Озвучка, TTS, рендер и раскадровка для производства запрещены.

```bash
npm run new -- "Тема" --type explainer      # проект, статус DRAFT
# агенты researcher → scriptwriter → legal-reviewer пишут scripts/draft.json
npm run script-check -- <проект>            # хуки, текст, длительность, редактура
npm run script-submit -- <проект>           # версия script_vN, статус AWAITING_APPROVAL
```

Вывод script-submit показать пользователю **целиком, без сокращений**, спросить «Утверждаем сценарий или внесём правки?» и остановиться. Правки — новая версия и снова весь текст.

**Утверждение** — только явной командой («Утверждаю», «Согласовано», «Запускай производство», «Делай видео по этому тексту»):

```bash
npm run approve-script -- <проект> --version N --message "дословно слова пользователя"
```

**Этап 2. Производство** (только при статусе APPROVED):

```bash
npm run storyboard-init -- <проект>         # раскадровка из утверждённого текста
npm run validate -- <проект>
npm run build -- <проект>                   # сборка сверяет текст с утверждённым; статус PRODUCTION → COMPLETED/FAILED
npm run still -- <проект> 0                 # первый кадр и контрольные кадры
```

**Статусы** (`project.json`, команда `npm run status`): DRAFT → AWAITING_APPROVAL → APPROVED → PRODUCTION → COMPLETED / FAILED. После перезапуска сначала смотри статус. Без утверждения ничего не производить.

**Версии**:
- `scripts/script_vN.md|json` — версии сценария;
- `hooks_vN.json` — оценки хуков;
- `script_approved.md|json` — утверждённая версия; прежние утверждённые сохраняются как `script_approved_vK.md`;
- `script.md` в проекте — копия утверждённой версии.

**Утверждённый текст неприкосновенен.** Можно менять только техническую запись `say` (произношение, ударение `**слово**`). Технические ошибки видео исправляются в монтаже, а не в тексте.

## Архитектура

Агенты (`agents/*.md`, подключены в `.claude/agents/`): content-planner, researcher, scriptwriter, legal-reviewer, storyboard-director, video-director, quality-reviewer.

Модули (`src/services/`):
- `asset-manager.js` — маскот (манифест с SHA-256 оригиналов), бренд, логотипы, лицензированная музыка;
- `voice-generator.js` — озвучка (RHVoice локально; ElevenLabs/Yandex SpeechKit по ключам), пофразовые тайминги, огибающая громкости;
- `caption-generator.js` — субтитры по фактической речи, SRT;
- `audio-mixer.js` — музыка (лицензированная из assets/music или собственная генеративная), SFX, приглушение под речь, нормализация −14 LUFS;
- `storyboard.js` — проверка раскадровки, тайминги элементов, звуковые события;
- `render-service.js` — покадровый рендер HTML-композиции в Chromium → FFmpeg (H.264), кеш сегментов по сценам, повторная сборка сбойных сцен;
- `quality.js` — автоматический контроль качества;
- `export-manager.js` — script.md, sources.md, publication.md, копия в output/;
- `pipeline.js` — весь конвейер.

Композиция (`src/video/`, `src/animations/`, `src/templates/layouts.js`) — собственный движок: каждый кадр — чистая функция номера кадра (как в Remotion, но без лицензионных ограничений Remotion для компаний).

## Формат storyboard.json

```jsonc
{
  "topic": "…", "title": "…",
  "type": "explainer | three-mistakes | myth-truth | qa | news",
  "format": "vertical | horizontal | square", "duration": "short | medium | long",
  "mode": "auto | approval",              // необязательно
  "service": "documents",                 // ключ из config/brand.json → services
  "highlight": ["слова", "для", "выделения"],
  "voiceSettings": { "rhvoice": { "voice": "elena" } },   // необязательно
  "scenes": [
    {
      "role": "hook", "layout": "hook", "visual": "описание для человека",
      "voice": ["Фраза 1.", { "text": "С 1 сентября 2025 года…", "say": "С первого сентября две тысячи двадцать пятого года…" }],
      "kicker": "152-ФЗ", "title": "Заголовок на экране", "text": "подзаголовок", "icon": "user",
      "highlight": ["заголовок"],
      "items": [{ "title": "Пункт", "text": "пояснение", "icon": "doc", "status": "ok|bad|warn" }],
      "mascot": { "pose": "surprised", "position": "right", "enter": "slide", "action": "jump", "actionAt": 1.2,
                  "poses": [{ "at": 2.5, "pose": "happy" }], "point": true, "say": { "text": "Хм…", "at": 0.5, "until": 2 } },
      "camera": "zoom-in", "transition": "wipe", "hold": 0.5
    }
  ],
  "cover": { "title": "…", "highlight": ["…"], "pose": "documents" },
  "legal": { "checkedAt": "YYYY-MM-DD", "actualAt": "…", "claims": [{ "id": "c1", "text": "…", "status": "confirmed", "norm": "ст. 18.1 152-ФЗ", "usedInVideo": true, "sources": [{ "title": "…", "url": "https://…" }] }] },
  "publication": { "titles": ["…","…","…"], "description": "…", "telegram": "…", "vk": "…", "youtubeTitle": "…", "youtube": "…", "hashtags": ["#…"] }
}
```

Поля шаблонов: `browser` — url, title, fields[{label,value}], consent, button, badges[{type,text,icon}], highlightField (индекс поля для подсветки), highlightFieldAt; `registry` — title, company/query, rows[{label,value}], badges; `cards`/`checklist` — title, items, numbered; `mistake` — number, label, title, text; `myth` — myth, verdict ("false"|"true"), verdictText; `truth` — label, title, text | items; `qa` — asker, question, answer; `news` — tag, ticker, date ("1 сентября"), datePrefix, title, text; `fact` — label, value, title, note; `cta` — title, text, button.

Подача фраз (текст не меняется, только звук): у фразы `compact: true` — убрать паузы внутри (слитно), `riseEnd: {seconds: 0.55, factor: 1.32}` — подъём тона в конце (вопрос), `say` с `**слово**` — логическое ударение; у сцены `phrasePause` — пауза между фразами (с), `voiceStyle` — темп/тон/амплуа сцены. Хук можно разбить на две фразы — сверка с утверждённым текстом идёт по всему тексту.

Тайминг появления элементов привязан к фразам: если фраз больше, чем пунктов, пункт *i* появляется с фразой *(фраз − пунктов + i)*. Переопределение: `itemsAtPhrases: [1,2]` или `itemsAt: [1.5, 3.0]` (секунды). Для myth/qa/mistake/news — `revealAtPhrase`.

Иконки: doc, policy, consent, shield, alert, check, cross, phone, globe, calendar, user, users, lock, form, mail, law, building, clock, search, money, stamp, chat, star, list, eye, server, cookie, bell, arrow, question, send, cart, camera.

## Результат каждого ролика

`projects/<проект>/`: script.md, storyboard.json, sources.md, voice.wav, captions.srt, preview.mp4, final.mp4, cover.png, publication.md, quality-report.json (+ `build/` — кеш, не коммитится). Копия финала — `output/<проект>.mp4`.
