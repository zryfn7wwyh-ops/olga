# Legal Performance — лендинг «Маркетинг для юристов и адвокатов»

Одностраничный адаптивный сайт по ТЗ «Legal Performance»: оффер, интерактивный кейс адвоката Аксёновой
(317 → 27 → 5, 545 000 ₽ выручки, 57 000 ₽ на рекламу), услуги с блоком «консультации по продажам — уже входят
в пакет», условия, FAQ, формы заявок с серверным обработчиком.

**Стек:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Zod · lucide-react.
Шрифты Cormorant Garamond и Manrope подключены локально (`@fontsource`), без внешних CDN.

## Запуск

```bash
npm install
cp .env.example .env.local   # при необходимости
npm run dev                  # http://localhost:3000
```

Проверки:

```bash
npm run lint
npm run typecheck
npm run build && npm start
```

В development без настроек форма работает в **тестовом режиме**: заявка проходит валидацию, но никуда не
отправляется, а в интерфейсе показывается пометка «Тестовый режим». В production без подключённой доставки
и без утверждённых юридических документов API отвечает `503`, и пользователь видит честное сообщение
«Заявка не отправлена» — ложного «Спасибо» не бывает.

## Развёртывание

Нужен Node.js ≥ 20.9. Подходит любой хостинг с Node.js (VPS, Docker, Vercel, Яндекс Cloud и т. п.):

```bash
npm ci && npm run build && npm start   # порт задаётся через PORT
```

Перед публикацией пройдите [TODO_BEFORE_LAUNCH.md](TODO_BEFORE_LAUNCH.md). Минимум:
1. Задать `LEAD_DELIVERY_MODE` и реквизиты CRM/вебхука.
2. Внести утверждённые тексты в `src/content/legal.ts` и поставить `documentsApproved: true` в `src/content/site.ts`.
3. Задать `NEXT_PUBLIC_SITE_URL` и `NEXT_PUBLIC_SITE_INDEXING=true` на боевом домене.

Rate limit заявок хранится в памяти процесса — при нескольких инстансах замените на Redis или лимит на прокси.

## Где менять контент

| Что | Файл |
| --- | --- |
| Название, контакты, навигация, SEO, текст модели оплаты, флаг юр. документов | `src/content/site.ts` (+ переменные окружения) |
| Цифры кейса, ссылка на сайт, выполненные работы, пути к скриншотам | `src/content/case-aksenova.ts` |
| Тексты всех секций (hero, услуги, консультации по продажам, условия, этапы…) | `src/content/landing.ts` |
| Вопросы и ответы FAQ | `src/content/faq.ts` |
| Политика ПДн и согласие | `src/content/legal.ts` |
| Специализации в форме, источники форм, правила валидации | `src/lib/lead-schema.ts` |
| Доставка заявок (webhook / Битрикс24 / Telegram) | `src/lib/lead-delivery.ts` |
| Цвета и токены | `src/styles/tokens.css`, `src/app/globals.css` (`@theme`) |
| Изображения (только разрешённые) | `public/images/…` и пути в `case-aksenova.ts` → `assets` |

Производные конверсии (8,5% / 18,5% / 1,6%) считаются автоматически из чисел кейса.

### Как добавить скриншот кейса
Положите файл в `public/images/case/`, например `site-desktop.webp`, и укажите в `case-aksenova.ts`:
```ts
siteDesktop: { src: "/images/case/site-desktop.webp", alt: "…", width: 1600, height: 1000 },
```
Скриншот появится в браузерной рамке секции «Показываем работу» и в карточке «Разработали сайт».

## Архитектура

```
src/
  app/            layout, page, privacy, api/leads (POST), robots, sitemap
  components/
    layout/       Header, Footer, Logo, Analytics (Метрика), ContactLinks
    sections/     Hero, CaseStudy, CaseFunnel, Problems, Approach/SystemFlow, Services,
                  SalesConsulting, PaymentModel, Audiences, Process, Proof, LeadSection, FAQ, FinalCTA
    forms/        LeadForm (полная/короткая), LeadModal (нативный <dialog>), CtaButton
    ui/           Button, SectionHeading, AnimatedNumber, RevealObserver, AssetImage
  content/        все тексты и данные
  lib/            lead-schema (Zod), lead-delivery, rate-limit, analytics, utm
```

Расширение: новые кейсы — по образцу `case-aksenova.ts`; страницы услуг/блог — новые маршруты в `src/app/`
с переиспользованием `components/ui` и секций.

### Формы и аналитика
Все CTA открывают одну модальную форму (имя, телефон, специализация, согласие) с собственным `form_source`:
`hero_primary`, `header_cta`, `case_cta`, `sales_consulting_cta`, `payment_cta`, `audience_cta`,
`lead_section` (полная форма), `footer_cta` (`services_cta` зарезервирован для будущих CTA в карточках услуг). В обработчик передаются UTM, URL страницы, referrer, время и согласие.

События Метрики: `hero_cta_click`, `case_view`, `case_cta_click`, `lead_form_open`, `lead_form_start`,
`lead_form_submit_attempt`, `lead_form_success`, `lead_form_error`, `phone_click`, `messenger_click`, `faq_open`.
Персональные данные в события не передаются; Вебвизор выключен.

## Скриншоты
`docs/screenshots/` — desktop (1440), tablet (768), mobile (390), модальное окно.

## Автономная HTML-версия

`static-html/index.html` — один файл без зависимостей (стили, шрифты и скрипты встроены), открывается
двойным кликом. Интерактив повторён на чистом JS (`scripts/static-html/runtime.js`). Отправка заявок в ней
по умолчанию отключена: форма честно сообщает, что заявка не отправлена. Чтобы включить, задайте
`window.LP_LEAD_ENDPOINT` (например, адрес развёрнутого `/api/leads`).

Пересборка после изменения контента:

```bash
npm run build && npx next start -p 3200 &
python3 scripts/static-html/build.py http://localhost:3200/ static-html/index.html
```
