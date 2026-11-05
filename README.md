# Вестник Онлайн — локальная копия по исходной теме WordPress

Рабочая локальная копия прежнего vestnic.online, собранная из архива темы `vestniconline.zip`.
Тема лежит в `wp-content/themes/vestniconline` (первый коммит — копия из архива без изменений,
все последующие правки темы вынесены в отдельные коммиты и перечислены в отчёте).

Отчёт о сверке, карта URL и список недостающих материалов: **[docs/REPORT.md](docs/REPORT.md)**.

## Запуск

Требования: Ubuntu/Debian (проверено на Ubuntu 24.04) с `sudo` или root, git, доступ к github.com.
Скрипт сам поставит недостающее через apt: PHP ≥ 8.1 (mysqli, gd, mbstring, xml, curl, zip, intl) и MariaDB.

```bash
scripts/setup.sh
```

```bash
scripts/serve.sh
```

Сайт: http://127.0.0.1:8080/ (адрес берётся из запроса, поэтому сайт открывается и через прокси/предпросмотр) · админка: http://127.0.0.1:8080/wp-admin/ (`admin` / `admin`).

Полная пересборка с нуля (удаляет `.build/`, плагины и базу `vestnic_local`):

```bash
scripts/setup.sh --reset
```

## Что ставится

| Компонент | Версия | Источник |
|---|---|---|
| WordPress | 7.1.4 | github.com/WordPress/WordPress, коммит в `scripts/versions.env` |
| Contact Form 7 | 6.2.4.1 | github.com/rocklobster-in/contact-form-7 |
| Advanced Custom Fields | 6.8.11 | github.com/AdvancedCustomFields/acf |
| PHP | 8.3.6 (проверено) | apt |
| MariaDB | 10.11 | apt |
| Vue 2.7.8, Swiper, Bootstrap 5.3, Inputmask 5.0.6 | из темы | `wp-content/themes/vestniconline/js` |

Версии WordPress и плагинов на исходном сайте неизвестны: в архиве нет ядра, базы и плагинов.

## Устройство

```
wp-content/themes/vestniconline/   исходная тема
wp-content/mu-plugins/vo-local-env.php
                                   совместимость с плагинами, которых нет в архиве
                                   (Shortcoder, Max Mega Menu, поля ACF, jQuery) и изоляция
                                   локальной среды
wp-content/mu-plugins/vo-reconstruction*
                                   стили и таймер блоков главной, восстановленных по скриншотам,
                                   шрифт Source Sans Pro
content/                           текст главной, 5 сниппетов page.php и тела форм CF7
                                   (по скриншотам vestnic.online от 05.11.2026)
wp-content/uploads/                локально размещённые оригиналы из uploads
scripts/setup.sh                   установка: зависимости, БД, ядро, плагины, наполнение
scripts/seed.php                   страницы с исходными ID, формы CF7, служебные тестовые страницы
scripts/serve.sh, router.php       запуск через встроенный сервер PHP
scripts/check.cjs                  браузерная проверка (Playwright) и снимки
.build/                            ядро WordPress, журналы, перехваченные письма и заявки (в git не входит)
```

### Локальная среда отделена от рабочей

Всё перечисленное включается только константой `VO_ENV = 'local'` в `.build/wordpress/wp-config.php`;
сама тема не меняется.

* Письма (`wp_mail`, в том числе Contact Form 7) не отправляются, а сохраняются в `.build/mail/*.json`.
* Заявки обратного звонка (`consultings.online/api/phoneSendDataVestnic.php` в footer.php) и квиза
  (`vestnic.online/api/sendData.php`) уходят в локальный приёмник `/wp-json/vo-local/v1/lead`
  и сохраняются в `.build/leads/*.json`. Список: http://127.0.0.1:8080/wp-json/vo-local/v1/leads
* Яндекс.Метрика, Roistat и Mango Office не загружаются; `ym()` только пишет в консоль.
* Абсолютные ссылки `https://vestnic.online/wp-content/...` указывают на локальный `wp-content`.
* Индексация запрещена (`X-Robots-Tag: noindex`).
* Места, где не хватает исходных данных, отмечены жёлтыми полосатыми блоками «Не хватает данных».
  Отключить их можно так: `define( 'VO_SHOW_GAPS', false );`.

### Как подставить настоящие данные

* **Дамп БД и uploads.** Импортировать дамп в `vestnic_local`, заменить домен с учётом сериализации
  (например, `wp search-replace 'https://vestnic.online' 'http://127.0.0.1:8080'`), а uploads
  положить в `wp-content/uploads/`. После этого маркеры пробелов исчезают сами.
* **Сниппеты Shortcoder.** Импортировать записи `post_type=shortcoder` или установить сам плагин:
  если `[sc]` уже зарегистрирован, слой совместимости отключается.
* **Max Mega Menu.** Установить плагин и импортировать его настройки. Без плагина достаточно
  назначить меню области «Главное меню (max_mega_menu_1)».

## Проверка в браузере

```bash
node scripts/check.cjs http://127.0.0.1:8080 docs/screenshots
```

Нужен Playwright с Chromium. Если cdnjs недоступен, можно подставить тот же релиз Font Awesome 5.15.2
из npm (`npm pack @fortawesome/fontawesome-free@5.15.2`) через `FA_LOCAL_DIR=<путь к package>`.
Один сценарий: `ONLY=quiz node scripts/check.cjs ...`.
