// Браузерная проверка локальной копии: снимки на контрольных ширинах, ошибки JS,
// битые ресурсы, горизонтальный скролл, сырые шорткоды, сценарии модальных окон и форм.
//
//   node scripts/check.cjs [baseUrl] [outDir]
//
// Переменные окружения:
//   FA_LOCAL_DIR — каталог пакета @fortawesome/fontawesome-free@5.15.2: если cdnjs недоступен,
//                  запросы к cdnjs .../font-awesome/5.15.2/ отдаются из этого же релиза локально.
//   HTTPS_PROXY  — прокси для внешних ресурсов (Google Fonts).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://127.0.0.1:8080';
const OUT = process.argv[3] || path.join(__dirname, '..', 'docs', 'screenshots');
const WIDTHS = [1440, 1024, 768, 390, 360];
const ONLY = process.env.ONLY || ''; // имя сценария: прогнать только его (без обхода страниц)
const PAGES = [
  ['home', '/'],
  ['page-default', '/test-page-default/'],
  ['tpl-blank', '/test-tpl-blank/'],
  ['tpl-blank-acf', '/test-tpl-blank-acf/'],
  ['tpl-blank-2', '/test-tpl-blank-2/'],
  ['page-empty', '/test-empty-content/'],
  ['single-extra', '/test-article-extra/'],
  ['single-plain', '/test-article-plain/'],
  ['archive', '/category/test/'],
  ['search', '/?s=' + encodeURIComponent('Тест')],
  ['404', '/net-takoy-stranicy/'],
  ['kontakty', '/kontakty/'],
  ['politika', '/politika-konfidencialnosti/'],
];
fs.mkdirSync(OUT, { recursive: true });

const report = { base: BASE, date: new Date().toISOString(), pages: [], flows: [] };

async function newContext(browser, width) {
  const mobile = width < 768;
  const ctx = await browser.newContext({
    viewport: { width, height: mobile ? 800 : 900 },
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile,
    ignoreHTTPSErrors: true,
    locale: 'ru-RU',
  });
  if (process.env.FA_LOCAL_DIR) {
    await ctx.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/5\.15\.2\/(.+)$/, (route) => {
      const rel = route.request().url().split('/font-awesome/5.15.2/')[1].split('?')[0];
      const file = path.join(process.env.FA_LOCAL_DIR, rel);
      if (!fs.existsSync(file)) return route.fulfill({ status: 404 });
      const type = rel.endsWith('.css') ? 'text/css' : rel.endsWith('.woff2') ? 'font/woff2' : 'application/octet-stream';
      route.fulfill({ status: 200, body: fs.readFileSync(file), headers: { 'content-type': type, 'access-control-allow-origin': '*' } });
    });
  }
  return ctx;
}

function watch(page) {
  const log = { console: [], pageErrors: [], failed: [] };
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') log.console.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => log.pageErrors.push(String(e.message || e)));
  page.on('requestfailed', (r) => log.failed.push(`${r.failure()?.errorText} ${r.url()}`));
  page.on('response', (r) => { if (r.status() >= 400) log.failed.push(`${r.status()} ${r.url()}`); });
  return log;
}

async function settle(page) {
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => document.fonts && document.fonts.ready);
  // Баннер cookie перекрывает низ страницы: снимаем его отдельно в сценарии cookie.
  await page.evaluate(() => { document.cookie = 'cookieConsent=accepted;path=/'; const c = document.querySelector('.window_cookie'); if (c) c.style.display = 'none'; });
}

async function audit(page) {
  return page.evaluate(() => {
    const docW = document.documentElement.scrollWidth, winW = window.innerWidth;
    const text = document.body.innerText;
    const raw = (text.match(/\[(sc|contact-form-7|header_title|subheader_title|slider_r)[^\]]*\]/g) || []);
    const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.getAttribute('src'));
    const gaps = [...document.querySelectorAll('[data-vo-gap]')].map((g) => g.getAttribute('data-vo-gap'));
    const fonts = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight} ${f.style}`);
    const fa = (() => { const i = document.querySelector('.fa-phone-alt, .fab, .fa'); if (!i) return null; const s = getComputedStyle(i, '::before'); return { family: s.fontFamily, content: s.content }; })();
    return { hScroll: docW > winW, docW, winW, raw, broken: [...new Set(broken)], gaps, fonts: [...new Set(fonts)], fa, h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()) };
  });
}

(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '127.0.0.1,localhost' } : undefined;
  const browser = await chromium.launch({ proxy });

  for (const width of ONLY ? [] : WIDTHS) {
    const ctx = await newContext(browser, width);
    for (const [name, url] of PAGES) {
      const page = await ctx.newPage();
      const log = watch(page);
      const resp = await page.goto(BASE + url, { waitUntil: 'load' });
      await settle(page);
      const a = await audit(page);
      if (width === 1440 || width === 390 || ['home', 'page-default', 'single-extra'].includes(name)) {
        await page.screenshot({ path: path.join(OUT, `${name}-${width}.png`), fullPage: true });
      }
      report.pages.push({ name, url, width, status: resp.status(), ...a, ...log });
      await page.close();
    }
    await ctx.close();
  }

  // ---- Сценарии взаимодействия ----
  async function flow(name, width, fn) {
    if (ONLY && ONLY !== name) return;
    const ctx = await newContext(browser, width);
    const page = await ctx.newPage();
    const log = watch(page);
    const res = { name, width, ok: false, notes: [] };
    try {
      await page.goto(BASE + '/test-page-default/', { waitUntil: 'load' });
      await settle(page);
      await fn(page, res);
      res.ok = res.ok !== null;
    } catch (e) { res.ok = false; res.notes.push('ERROR ' + e.message.split('\n')[0]); }
    Object.assign(res, log);
    report.flows.push(res);
    await ctx.close();
  }
  const shot = (page, n) => page.screenshot({ path: path.join(OUT, n + '.png') });

  // 1. «Перезвоните мне» в шапке → окно «Заказать звонок» → маска, ошибка валидации, отправка, закрытие.
  await flow('callModal', 1440, async (page, res) => {
    await shot(page, 'flow-callModal-0-initial-1440');
    await page.click('header >> text=Перезвоните мне');
    const modal = page.locator('.fComponent-modal.overlay:visible');
    await modal.waitFor();
    res.notes.push('title: ' + (await modal.locator('.h2').innerText()).trim());
    await shot(page, 'flow-callModal-1-open-1440');
    res.notes.push('submit disabled before consent: ' + (await modal.locator('input[type=submit]').isDisabled()));
    await modal.locator('input[name=acceptance-pd]').check();
    await modal.locator('input[type=submit]').click();
    await page.waitForSelector('.fComponent-modal.overlay:visible .wpcf7-not-valid-tip', { timeout: 10000 });
    res.notes.push('validation: ' + (await modal.locator('.wpcf7-not-valid-tip').first().innerText()));
    await shot(page, 'flow-callModal-2-invalid-1440');
    const tel = modal.locator('input[name=your-tel]');
    await tel.click();
    await tel.pressSequentially('9001234567');
    res.notes.push('mask value: ' + (await tel.inputValue()));
    await modal.locator('input[type=submit]').click();
    await page.waitForSelector('.fComponent-modal.overlay:visible form.sent', { timeout: 15000 });
    res.notes.push('response: ' + (await modal.locator('.wpcf7-response-output').innerText()));
    await shot(page, 'flow-callModal-3-sent-1440');
    await modal.locator('.swal2-close').click();
    res.notes.push('closed: ' + !(await page.locator('.fComponent-modal.overlay:visible').count()));
  });

  // 2. Мобильное меню (бургер) — открыто/закрыто.
  for (const w of [390, 360]) {
    await flow('mobileMenu', w, async (page, res) => {
      await shot(page, `flow-mobileMenu-0-initial-${w}`);
      await page.click('#mega-toggle-block-1');
      await page.waitForTimeout(500);
      const left = await page.locator('.mobileMenu').evaluate((e) => e.getBoundingClientRect().left);
      res.notes.push('menu left after open: ' + left);
      await shot(page, `flow-mobileMenu-1-open-${w}`);
      await page.click('.mobileMenu >> text=Закрыть');
      await page.waitForTimeout(500);
      res.notes.push('menu left after close: ' + (await page.locator('.mobileMenu').evaluate((e) => Math.round(e.getBoundingClientRect().left))));
    });
  }

  // 3. Квиз: «Продолжить» → шаг 1 → шаг 2 → «Назад» → последний шаг (ошибка, затем отправка).
  //    На ширине ≤992px кнопка .quizDiv скрыта CSS, а мобильный триггер закомментирован в footer.php.
  await flow('quiz-mobile-trigger', 390, async (page, res) => {
    res.notes.push('desktop button visible: ' + (await page.locator('#openQuizButton').isVisible()));
    res.notes.push('mobile trigger in DOM: ' + (await page.locator('#openQuizButton_1').count()));
  });
  await flow('quiz', 1440, async (page, res) => {
    await shot(page, 'flow-quiz-0-initial-1440');
    await page.click('#openQuizButton');
    await page.locator('#quizModal').waitFor();
    await shot(page, 'flow-quiz-1-step1-1440');
    const opts = await page.locator('#questionContainer select option').allInnerTexts();
    res.notes.push('step1 options: ' + opts.join('/'));
    await page.selectOption('#questionContainer select', { label: 'Реорганизация' });
    const next = () => page.locator('#quizModal button:visible', { hasText: 'Далее' }).first().click();
    await next();
    res.notes.push('step2: ' + (await page.locator('#questionContainer h3').innerText()));
    await shot(page, 'flow-quiz-2-step2-1440');
    await page.locator('#quizModal button:visible', { hasText: 'Назад' }).first().click();
    res.notes.push('back keeps answer: ' + (await page.locator('#questionContainer select').inputValue()));
    await next();
    await page.selectOption('#questionContainer select', { label: 'Да' });
    await next();
    res.notes.push('step3: ' + (await page.locator('#questionContainer h3').innerText()));
    await page.click('#submitButton');
    res.notes.push('error shown on empty: ' + (await page.locator('#errorMessage').isVisible()));
    await shot(page, 'flow-quiz-3-error-1440');
    await page.fill('input[name=name]', 'Тест');
    await page.fill('input[name=phone]', '+79000000000');
    await page.check('input[name=consentPersonalData]');
    await page.check('input[name=consentMarketing]');
    const [resp] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('vo-local/v1/lead')),
      page.click('#submitButton'),
    ]);
    res.notes.push('lead endpoint: ' + resp.status());
    res.notes.push('modal closed: ' + !(await page.locator('#quizModal').isVisible()));
  });

  // 4. Плавающая кнопка обратного звонка → панель → отправка на локальный приёмник.
  await flow('callbackWidget', 1440, async (page, res) => {
    await page.click('#phone__icon_form', { force: true }); // у иконки бесконечная pulse-анимация
    await page.waitForTimeout(600);
    await shot(page, 'flow-callbackWidget-1-open-1440');
    await page.fill('#phone_field', '+7 900 000-00-00');
    const [resp] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('vo-local/v1/lead')),
      page.click('button.call_me'),
    ]);
    res.notes.push('lead endpoint: ' + resp.status() + ' ' + (await resp.text()));
    await page.waitForTimeout(500);
    await shot(page, 'flow-callbackWidget-2-thanks-1440');
  });

  // 5. Отложенное окно tenModal через 30 секунд.
  await flow('tenModal', 1440, async (page, res) => {
    const before = await page.locator('.fComponent-modal.overlay:visible').count();
    await page.waitForTimeout(31000);
    const after = await page.locator('.fComponent-modal.overlay:visible').count();
    res.notes.push(`visible modals before=${before} after 31s=${after}`);
    await shot(page, 'flow-tenModal-1-open-1440');
  });

  // 6. Уведомление cookie (начальное состояние) и закрытие.
  for (const w of [1440, 390]) {
    await flow('cookie', w, async (page, res) => {
      await page.context().clearCookies();
      await page.reload({ waitUntil: 'load' });
      await page.waitForTimeout(300);
      res.notes.push('banner visible: ' + (await page.locator('.window_cookie').isVisible()));
      await shot(page, `flow-cookie-0-initial-${w}`);
      await page.click('.btn_cookie');
      res.notes.push('after OK visible: ' + (await page.locator('.window_cookie').isVisible()));
    });
  }

  // 7. Все модальные окна из app.js: открыть и снять по очереди.
  await flow('allModals', 1440, async (page, res) => {
    const keys = await page.evaluate(() => Object.keys(app.options.modals));
    for (const k of keys) {
      await page.evaluate((k) => { app.toggleModal(k); if (k === 'exitPopup_2') app.options.modals.exitPopup_2.formVisible = true; }, k);
      await page.waitForTimeout(250);
      const vis = await page.locator('.fComponent-modal.overlay:visible').count();
      res.notes.push(`${k}: visible=${vis}`);
      if (vis) await shot(page, `modal-${k}-1440`);
      await page.evaluate(() => app.closeCurrentModal());
    }
  });

  await browser.close();
  if (!ONLY) fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));

  // Краткая сводка в консоль
  for (const p of report.pages) {
    const errs = p.pageErrors.length + p.console.filter((c) => c.startsWith('error')).length;
    console.log(`${String(p.width).padStart(4)} ${p.name.padEnd(14)} ${p.status} hScroll=${p.hScroll ? 'YES(' + p.docW + ')' : 'no'} raw=${p.raw.length} broken=${p.broken.length} gaps=${p.gaps.length} jsErr=${errs} failed=${p.failed.length}`);
  }
  for (const f of report.flows) console.log(`FLOW ${f.name}@${f.width} ok=${f.ok} ${f.notes.join(' ; ')} | jsErr=${f.pageErrors.length}`);
})();
