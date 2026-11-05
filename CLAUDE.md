# Правила разработки

- Достоверность: не выдумывать кейсы, отзывы, логотипы клиентов, награды, цены «от», сроки, SLA и гарантии соответствия законам. Плейсхолдеры — только явно помеченные.
- Тексты и данные — в `src/content/`, не в разметке компонентов.
- Формы строятся из `components/ui` (Field, RadioCard, Checkbox, Button, FormStatus) и `LeadContactFields`; отправка — только через `submitLead()`; успех — только после ответа сервера.
- Согласие: чекбокс пустой по умолчанию, не объединять с рекламной подпиской.
- Один H1, стабильные якоря (`#calc`, `#advantages`, `#formats`, `#work`, `#approach`, `#steps`, `#deliver`, `#pricing-factors`, `#faq`, `#brief`).
- Визуальная система — по редизайну заказчика (`docs/design/site-redesign.html`): шрифт Geologica, токены в `src/styles/tokens.css`.
- Анимация — только та, что есть в редизайне, на CSS, без motion-библиотек; выключается `ui.motion` в `src/content/site.ts` и всегда при `prefers-reduced-motion`. Слоты — `data-motion`/`data-motion-id`.
- Адаптив 320–1440 px без горизонтальной прокрутки; кликабельные зоны от 44×44; WCAG 2.2 AA.
- Секреты только на сервере; в аналитику и логи — без персональных данных.
- Перед коммитом: `npm run typecheck && npm test && npm run build && npm run test:e2e`.
