# Roskom Video Studio — правила проекта

Автоматическая студия коротких роликов бренда **«Роском Онлайн»** (персональные данные, 152-ФЗ, Роскомнадзор).
Пользователь пишет «Создай ролик на тему…» — ты проходишь весь цикл до готового MP4 без ручного монтажа.

## Главные правила

1. **Маскот — только оригинальный.** Изображения в `assets/mascot/original/` не изменять, не перерисовывать, не отражать, не генерировать новые позы/руки/мимику. Доступные позы — `assets/mascot/poses.json`. Нужна поза, которой нет, — сообщи пользователю, какой ассет подготовить.
2. **Юридическая точность.** Не придумывать факты, штрафы, сроки и требования. Каждое утверждение — в `legal.claims` с источником. Неподтверждённое — в ролик не включается. Спорное — только через согласование (final.mp4 не выпускается до `npm run approve`).
3. **Бренд пишется «Роском Онлайн»** (две части, обе с заглавной). Сайт — roskom.online.
4. **Без навязчивой рекламы**: польза ≥ 80% ролика, CTA в конце, без обещаний «штрафов не будет» и «гарантированного результата».
5. **Не публиковать** ролики автоматически. Только подготовить publication.md.
6. **Секреты** только в `.env` (не коммитится). Шаблон — `.env.example`.
7. Не выдавать файл с ошибками за готовое видео: если `quality-report.json` → `status: failed`, final.mp4 не создаётся — объясни пользователю конкретную причину.

## Как создать ролик (полный цикл)

Подробная инструкция — навык `.claude/skills/create-video/SKILL.md`. Кратко:

```bash
npm run new -- "Тема" --type explainer      # каркас projects/<дата>-<slug>/storyboard.json
# агенты: researcher → scriptwriter → legal-reviewer → storyboard-director → video-director
npm run validate -- <проект>
npm run build -- <проект>                   # озвучка, субтитры, звук, рендер, QA, обложка, публикация
npm run still -- <проект>                   # контрольные кадры → смотри PNG
```

Режимы: `auto` (по умолчанию) — сразу final.mp4; `approval` (`--mode approval` или `"mode": "approval"` в storyboard) — сначала preview.mp4 и показ сценария/раскадровки пользователю, final после `npm run approve -- <проект> --by "ФИО"`.

## Типовые команды пользователя → действия

| Запрос | Что делать |
|---|---|
| «Сделай видео о … на 45 секунд» | `duration: "short"` (30–60) и ~100 слов; при 61–90 с — `medium`, до 180 — `long` |
| «Сделай ролик в формате три ошибки» | `--type three-mistakes` |
| «Создай пять видео о …» | content-planner → 5 проектов → `npm run build -- p1 p2 p3 p4 p5` (или `build-all`) |
| «Измени начало последнего ролика» | правка `scenes[0]` в последнем проекте → `npm run build` (пересоберётся только изменённая сцена) |
| «Поменяй голос маскота» | `npm run voices` → выбрать → `config/voice-settings.json` (`rhvoice.voice`) или `voiceSettings` в storyboard |
| «Сделай видео более динамичным» | агент video-director |
| «Убери коммерческую вставку» | заменить CTA-сцену на нейтральную (layout `cta` с `title` «Подписывайтесь…» без услуги) или удалить её |
| «Пересобери видео с новыми субтитрами» | `config/video-settings.json → captions` или `highlight` в сценах → `npm run build` |
| Горизонтальное / квадратное видео | `"format": "horizontal"` / `"square"` |

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

Поля шаблонов: `browser` — url, title, fields[{label,value}], consent, button, badges[{type,text,icon}]; `cards`/`checklist` — title, items, numbered; `mistake` — number, label, title, text; `myth` — myth, verdict ("false"|"true"), verdictText; `truth` — label, title, text | items; `qa` — asker, question, answer; `news` — tag, ticker, date ("1 сентября"), datePrefix, title, text; `fact` — label, value, title, note; `cta` — title, text, button.

Тайминг появления элементов привязан к фразам: если фраз больше, чем пунктов, пункт *i* появляется с фразой *(фраз − пунктов + i)*. Переопределение: `itemsAtPhrases: [1,2]` или `itemsAt: [1.5, 3.0]` (секунды). Для myth/qa/mistake/news — `revealAtPhrase`.

Иконки: doc, policy, consent, shield, alert, check, cross, phone, globe, calendar, user, users, lock, form, mail, law, building, clock, search, money, stamp, chat, star, list, eye, server, cookie, bell, arrow, question, send, cart, camera.

## Результат каждого ролика

`projects/<проект>/`: script.md, storyboard.json, sources.md, voice.wav, captions.srt, preview.mp4, final.mp4, cover.png, publication.md, quality-report.json (+ `build/` — кеш, не коммитится). Копия финала — `output/<проект>.mp4`.
