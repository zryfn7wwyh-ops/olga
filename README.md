# Создание сайтов для бизнеса — посадочная страница

Одностраничный адаптивный сайт услуги «Создание сайтов» с главным оффером «Рассчитать стоимость сайта», четырьмя сценариями заявок и настоящей серверной отправкой.

Стек: **Next.js 15 (App Router) + TypeScript + CSS Modules / CSS-переменные**. Без UI-китов и анимационных библиотек. Шрифты Manrope, Inter, IBM Plex Mono (лицензия OFL) подключены локально через `@fontsource` — без запросов к Google Fonts.

## Запуск

```bash
npm install
cp .env.example .env.local   # заполнить переменные
npm run dev                  # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Проверки:

```bash
npm run typecheck
npm test            # unit (Vitest)
npm run build && npm run test:e2e   # E2E (Playwright, поднимает next start на :3100 в тестовом режиме)
```

## Переменные окружения

| Переменная | Назначение |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Публичный адрес сайта: canonical, Open Graph, sitemap, robots |
| `LEAD_DELIVERY_MODE` | `webhook` — production-канал; `test` — запись в файл (только разработка/приёмка) |
| `LEAD_WEBHOOK_URL` | Адрес приёма заявок (CRM, интеграционная платформа, свой backend). В production только HTTPS |
| `LEAD_WEBHOOK_SECRET` | Передаётся как `Authorization: Bearer …`. Только на сервере |
| `LEAD_WEBHOOK_TIMEOUT_MS` | Тайм-аут доставки, по умолчанию 8000 |
| `LEAD_TEST_FILE` | Файл тестового режима, по умолчанию `.data/leads.jsonl` (в `.gitignore`) |
| `LEAD_ALLOW_TEST_MODE_IN_PRODUCTION` | `true` разрешает тестовый режим в production-сборке — только для закрытой приёмки |
| `LEAD_RATE_LIMIT_MAX`, `LEAD_RATE_LIMIT_WINDOW_MS` | Лимит заявок с одного IP (по умолчанию 5 за 10 минут) |

Если канал не настроен, в production форма **не показывает успех**: сервер отвечает 503, пользователь видит «Не удалось отправить заявку. Попробуйте ещё раз».

## Доставка заявок

Единый вход — `POST /api/leads` (`src/app/api/leads/route.ts`).

Payload (`src/lib/leads/schema.ts`, тип `LeadPayload`):

```json
{
  "source": "hero_estimate | quiz | pdn_consultation | final_brief",
  "siteType": "unknown | landing | corporate | catalog | other",
  "contactMethod": "phone | email",
  "contact": "<контакт>",
  "name": null, "description": null, "scope": null,
  "answers": { "goal": "…", "current": "…", "launch": "…", "recommendation": "catalog" },
  "dataCategory": null,
  "consent": { "accepted": true, "documentVersion": "<версия из content/legal.ts>" },
  "attribution": { "utm_source": null, "utm_medium": null, "utm_campaign": null },
  "idempotencyKey": "<uuid черновика формы>",
  "website": ""
}
```

Ответы: `201 {"success":true,"requestId":"…"}` — только после записи/успешной передачи в канал; `400/422` — ошибки (по полям в `fields`); `413` — слишком большой запрос; `429` — лимит; `503` — канал недоступен.

Что делает сервер:

- общая с клиентом схема проверки (`parseLeadPayload`), нормализация телефона (`+7…`, международные номера допускаются) и email, лимиты длины (имя 100, email 254, описание 2000);
- отбрасывает поля, не относящиеся к сценарию; UTM — по белому списку, до 100 символов;
- ограничение размера тела (16 КБ), rate limiting по IP, honeypot-поле `website`;
- защита от дублей: `idempotencyKey` + хэш содержимого; параллельные повторы получают тот же `requestId`, неудачная доставка не кэшируется;
- в webhook уходит заявка с `requestId`, `receivedAt` и заголовком `Idempotency-Key`; ответ не 2xx или тайм-аут → 503 клиенту;
- журнал — только `requestId`, источник и статус, без персональных данных.

Форма работает и без JavaScript: обычный POST на `/api/leads` → переадресация на `/lead?status=…`.

> Rate limit и защита от дублей хранятся в памяти одного процесса. При нескольких инстансах заменить на общее хранилище (Redis и т. п.).

## Структура

```
src/
  app/            page.tsx, layout.tsx, globals.css, api/leads/route.ts,
                  privacy/, consent/, lead/, robots.ts, sitemap.ts, icon.svg
  components/
    layout/       Header, Footer, StructuredData
    sections/     Hero, Benefits, SiteTypes, WorkShowcase, DataProtection, Process,
                  Deliverables, PriceFactors, MidCta, Faq, FinalBrief, SectionIntro
    forms/        EstimateForm, QuizDialog, ConsultationDialog, BriefForm,
                  LeadContactFields, LeadUIProvider, Triggers, useLeadForm, SuccessPanel
    showcase/     FormatPreview, CasePreview (макеты интерфейсов собраны кодом)
    ui/           Button, Field, RadioCard (+Segmented), Checkbox, FormStatus, Dialog, Icon
    legal/        LegalPage
  content/        page.ts, cases.ts, faq.ts, options.ts, legal.ts, site.ts
  lib/            validation.ts, quiz.ts, analytics.ts, utm.ts, leads/{schema,client,server,form-data}.ts
  styles/         tokens.css
  animations/     README.md, index.ts
tests/            unit/, e2e/
docs/             acceptance.md, lighthouse/
```

## Контент

Все тексты — в `src/content/`:

- `page.ts` — тексты секций; `faq.ts` — вопросы; `options.ts` — варианты полей;
- `cases.ts` — блок «Работы». Сейчас три **демонстрационных концепта** (`kind: "concept"`), они так и подписаны на странице. Реальный проект добавляется с `kind: "client"` только после согласования прав на публикацию;
- `site.ts` — бренд, контакты, реквизиты, SEO. Пока `confirmed: false`, контакты и JSON-LD не выводятся;
- `legal.ts` — модель согласия, версия документа, ссылки. Пока `approved: false`, страницы `/privacy` и `/consent` показывают помеченный черновик.

## Цветовые палитры

Цвета заданы токенами в `src/styles/tokens.css`. Палитра выбирается в `src/content/site.ts` (`company.palette`):

- `emerald` — «Изумруд»: тёмно-зелёный графит, тёплая бумага, изумрудный акцент (по умолчанию, выбрана заказчиком);
- `emerald-sand` — «Изумруд на угле и песке»: тот же акцент, тёплый угольный графит, песочная бумага;
- `graphite` — графит и синий, исходный вариант из дизайн-ТЗ.

Обе палитры проверены на контраст WCAG AA. Новая палитра — блок `[data-palette="…"]` с переопределением цветовых токенов.

## Аналитика

`src/lib/analytics.ts` — события `estimate_form_view`, `site_type_select`, `quiz_open`, `quiz_step_complete`, `quiz_result_view`, `pdn_consultation_open`, `lead_submit_attempt`, `lead_submit_success`, `lead_submit_error`, `case_view` (зарезервировано на случай перехода к реальному кейсу). Параметры — только категориальные; ключи `contact/phone/email/name/description` и значения, похожие на email/телефон, отбрасываются. Счётчик не подключён: события пишутся в `window.dataLayer` (если он есть) и в DOM-событие `site:analytics`.

## Motion-слоты

См. `src/animations/README.md`. Слоты размечены `data-motion` / `data-motion-id`, анимаций в первой версии нет.

## Перед публичным релизом (блокеры)

| Что | Где | Статус |
|---|---|---|
| Бренд, логотип, контакты, реквизиты | `src/content/site.ts` | не предоставлены |
| Портфолио или разрешённые концепты | `src/content/cases.ts` | сейчас концепты, нужно согласовать |
| Домен, хостинг | `NEXT_PUBLIC_SITE_URL`, инфраструктура | не согласованы |
| Канал приёма лидов | `LEAD_DELIVERY_MODE=webhook`, `LEAD_WEBHOOK_URL` | **блокер production** |
| Тексты политики и согласия, основание, версия | `src/content/legal.ts`, `src/app/privacy`, `src/app/consent` | **блокер production** |
| Аналитика и сторонние интеграции | `src/lib/analytics.ts` | не выбраны |
| Регламент ответа на заявку | — | не подтверждён (сроки ответа на сайте не указаны) |
