# pudovkinanton.ru — прототип главной страницы (Этап 1)

Персональный сайт арбитражного управляющего Антона Пудовкина: дизайн-система, desktop + mobile, все основные интерактивы.

**Стек:** Next.js 16 (App Router, статический экспорт) · TypeScript · Tailwind CSS 4 · шрифты Literata + Manrope (self-hosted через `@fontsource`, без запросов к Google). Сторонних UI- и анимационных библиотек нет.

```bash
cd site
npm install
npm run dev      # http://localhost:3000
npm run build    # статическая сборка в site/out — её можно залить на любой хостинг
python3 scripts/build-preview.py out preview.html   # автономный HTML для показа (без React, интерактивы на vanilla JS)
```

## Как менять контент

Компоненты править не нужно — весь контент лежит в `data/`:

| Файл | Что внутри |
|---|---|
| `data/stats.ts` | **рейтинг** (`position`, `total`, `source`, `sourceUrl`, `updatedAt`), факты первого экрана и блока «Обо мне» |
| `data/contacts.ts` | телефон, e-mail, Telegram, офисы, координаты для карты |
| `data/site.ts` | title/description, меню, ID Яндекс Метрики, реквизиты, ссылки на политики, флаг `showPlaceholderMarks` |
| `data/profile.ts` | фото Антона, текст «Обо мне», этапы работы |
| `data/advantages.ts` · `expertise.ts` | преимущества (bento), направления экспертизы, «сложные процедуры» |
| `data/cases.ts` | кейсы (`CaseItem[]`) |
| `data/team.ts` · `reviews.ts` · `faq.ts` · `documents.ts` | команда, отзывы, FAQ, документы |

Фото и сканы кладутся в `public/images/…`, а путь прописывается в нужном data-файле (`photos.hero = "/images/anton-hero.jpg"`). Пока путь равен `null`, на странице показывается оформленный placeholder.
Перед публикацией выставьте `site.showPlaceholderMarks = false` — тогда пометки «требует замены» пропадут.

---

## Отчёт

### Сделано

**Секции (в порядке визуального ритма):** фиксированная шапка → тёмный hero с крупным «57» поверх фото → asymmetric bento «02 / Практика» → интерактивная экспертиза «03» → контрастный CTA (Steel Blue) → тёмный блок «04 / Сложные процедуры» → «05 / Обо мне» с фактами и слайдером документов → таймлайн «06 / Процесс» → раскрывающиеся кейсы «07» → команда «08» → крупный отзыв «09» на тёмном фоне → FAQ «10» → компактный переход в B2C → тёмные контакты «11» + Яндекс Карта → футер.

**Компоненты** (`components/`): Header, MobileCTA, Hero, RankingFeature, Advantages, Expertise, ExpertiseCTA, ComplexCases, AboutAnton, DocumentsSlider, Process, Cases, CaseAccordion, Team, Reviews, FAQ, BankruptcyCTA, Contacts, Map, ContactModal (провайдер + CTAButton), Footer. Вспомогательные: SectionHeading, PhotoFrame, PlaceholderMark, SliderNav, TrackedLink, Icons, useSlider.

**Интерактивы** (проверены автотестом в Playwright):
- модальное окно «Обсудить задачу» (нативный `<dialog>`: Escape, клик по подложке, фокус-ловушка);
- экспертиза: вертикальные табы на desktop (стрелки ↑↓/Home/End) и accordion на mobile;
- «Сложные процедуры»: пояснение открывается по hover, фокусу или tap;
- раскрывающиеся кейсы (Ситуация / Задача / Что сделано / Результат);
- FAQ-accordion; слайдер документов + fullscreen lightbox (← →, Esc); слайдер отзывов «01 / 03 ← →»;
- swipe на мобильных (нативный scroll-snap); мобильное меню (Escape, блокировка прокрутки);
- шапка уменьшается при прокрутке; плавный переход по якорям; hover-состояния 180–300 мс; ленивая загрузка карты.
- `prefers-reduced-motion` отключает все анимации.

**Адаптив:** проверено на 320, 360, 375, 390, 430, 768, 1024, 1280, 1440 и 1920 px, горизонтального скролла нет нигде. H1 на мобильных занимает 4–5 строк. На мобильных «57» лежит поверх фото, bento идёт столбцом, услуги собраны в accordion, процесс — в вертикальный timeline, внизу закреплена панель «Позвонить Антону», touch-targets ≥ 44 px.

**Аналитика:** `lib/analytics.ts` → `trackGoal("phone_click", { placement: "hero" })`. Цели: phone_click (hero / header / mobile_bar / modal / contacts / faq…), cta_click, modal_open, telegram_click, email_click, case_open, service_open, document_view, review_interaction, map_interaction, bankruptcy_page_click, faq_open, route_click. Пока счётчик не задан (`site.analytics.yandexMetrikaId = null`), скрипт Метрики не подключается.

**SEO:** title и description из ТЗ, canonical, Open Graph и Twitter (с `public/og.jpg`), favicon (`app/icon.svg`, монограмма AP), `robots.txt`, `sitemap.xml`, JSON-LD (Person + ProfessionalService), семантичные заголовки, alt и aria.

### Использованы реальные материалы
Сайт pudovkinanton.ru из среды разработки был недоступен, поэтому использованы только данные, указанные в ТЗ:
- рейтинг: 57 место из 7 550, регистр ФНС;
- 10+ лет в торгах, 8+ лет в банкротстве, квалификация оценщика, работа по всей России;
- телефон +7 922 699-04-54, e-mail dv7402@yandex.ru;
- офисы: Челябинск, ул. Труда, 84, офис 615; Сочи, ул. Донская, 9А;
- все тексты блоков (H1, «Обо мне», этапы работы, экспертиза, CTA, вопросы FAQ).

### Требуют замены / предоставления заказчиком
- фотографии Антона (hero, «Обо мне»), фото команды, имена и роли специалистов;
- реальные кейсы (сейчас 4 подписанных placeholder);
- реальные отзывы (сейчас 3 подписанных placeholder), видеоотзывы, если есть;
- сканы документов: сведения об АУ, СРО, диплом оценщика, образование, повышение квалификации, сертификаты;
- ссылка на источник рейтинга (`rating.sourceUrl`) и дата его актуальности (`rating.updatedAt`);
- ссылка на Telegram — пока её нет, вместо кнопки Telegram показывается «Написать на e-mail»;
- координаты офисов (пока карта ищет по адресу) и часы работы;
- профессиональные реквизиты: ИНН, рег. номер, СРО;
- ответы FAQ с пометкой `needsReview` (этап подключения, «только торги», стоимость, документы);
- ID счётчика Яндекс Метрики; страницы политик (`/privacy`, `/personal-data`, `/cookie`);
- актуальность всех контактов перед публикацией.

### Файлы
`site/` — новый проект: `app/` (layout, page, globals.css, robots, sitemap, icon), `components/` (28 файлов), `data/` (11 файлов), `lib/` (analytics, schema, cn), `public/og.jpg`, конфиги (`package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`).
