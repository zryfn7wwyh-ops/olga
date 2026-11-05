// Проверка: каждая кнопка на странице открывает форму захвата.
//   node scripts/check-buttons.cjs [url] [outDir]
// Для каждой видимой кнопки вне окон: клик → какое окно открылось → есть ли в нём форма.
// Затем каждая найденная форма CF7 заполняется тестовыми данными и отправляется
// (в локальной среде письма уходят в .build/mail).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const URL = process.argv[2] || 'http://127.0.0.1:8080/';
const OUT = process.argv[3] || path.join(__dirname, '..', 'docs', 'buttons');
fs.mkdirSync(OUT, { recursive: true });

async function context(browser, width) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 }, ignoreHTTPSErrors: true });
  if (process.env.FA_LOCAL_DIR) {
    await ctx.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/5\.15\.2\/(.+)$/, (r) => {
      const rel = r.request().url().split('/5.15.2/')[1].split('?')[0];
      r.fulfill({ body: fs.readFileSync(path.join(process.env.FA_LOCAL_DIR, rel)), headers: { 'content-type': rel.endsWith('.css') ? 'text/css' : 'font/woff2', 'access-control-allow-origin': '*' } });
    });
  }
  // Отложенное окно tenModal (setTimeout 30 000 мс в app.js) не должно открываться во время проверки.
  await ctx.addInitScript(() => { const o = window.setTimeout; window.setTimeout = function (f, d, ...a) { return d === 30000 ? 0 : o.call(this, f, d, ...a); }; });
  await ctx.addCookies([{ name: 'cookieConsent', value: 'accepted', url: new globalThis.URL(URL).origin }]);
  return ctx;
}

// Что сейчас открыто: окно Vue, квиз или панель обратного звонка.
const STATE = () => {
  // offsetParent у position:fixed всегда null, поэтому видимость — по размерам и стилям.
  const vis = (el) => { if (!el) return false; const cs = getComputedStyle(el), r = el.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
  const modal = [...document.querySelectorAll('.fComponent-modal.overlay')].find(vis);
  if (modal) {
    const form = modal.querySelector('form.wpcf7-form');
    const title = (modal.querySelector('.h2, .title_licvid, .title_ten_title') || {}).textContent || '';
    return {
      kind: 'modal', title: title.trim().replace(/\s+/g, ' '),
      form: form ? (form.querySelector('input[name=_wpcf7]') || {}).value : null,
      formNotFound: /не найдена|not found/i.test(modal.textContent) && !form,
      fields: form ? [...form.querySelectorAll('input:not([type=hidden]):not([type=submit]), select, textarea')].map((f) => f.name) : [],
    };
  }
  const quiz = document.getElementById('quizModal');
  if (quiz && quiz.style.display === 'block') return { kind: 'quiz', title: (quiz.querySelector('.text-header-quiz') || {}).textContent, form: 'quiz' };
  const cb = document.getElementById('call_me_block');
  if (cb && cb.classList.contains('show')) return { kind: 'callback', title: cb.querySelector('.hello_text').textContent, form: 'callback-widget' };
  const menu = document.querySelector('.mobileMenu.showMenu');
  if (menu) return { kind: 'mobile-menu' };
  return null;
};

const RESET = () => {
  if (window.app) { for (const k in app.options.modals) app.options.modals[k].visible = false; app.openMobileMenu = false; }
  const q = document.getElementById('quizModal'); if (q) q.style.display = 'none';
  const cb = document.getElementById('call_me_block'); if (cb) cb.classList.remove('show');
};

(async () => {
  const browser = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '127.0.0.1,localhost' } : undefined });
  const result = { url: URL, date: new Date().toISOString(), widths: {}, submits: [] };
  const forms = new Map(); // id формы → как открыть

  for (const width of [1440, 390]) {
    const ctx = await context(browser, width);
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(URL, { waitUntil: 'networkidle' });

    // Все видимые кнопки вне окон и мобильного меню.
    const targets = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('[style*="display: none"]'); };
      const els = [...document.querySelectorAll('button, [role=button], #phone__icon_form, input[type=submit]')]
        .filter((el) => !el.closest('.fComponent-modal, .mobileMenu, #quizModal, #call_me_block, .window_cookie, #wpadminbar, form'))
        .filter(vis);
      return els.map((el, i) => {
        el.setAttribute('data-btn-check', i);
        return { i, text: (el.innerText || el.alt || el.id || el.className).trim().replace(/\s+/g, ' '), where: (el.closest('section, header, footer, .leadForm, .payment_methods, .vo-msg-grid, .vo-why, .contentBorderBlock, .quizDiv') || {}).className || el.parentElement.className };
      });
    });

    const rows = [];
    for (const t of targets) {
      await page.evaluate(RESET);
      await page.waitForTimeout(150);
      const el = page.locator(`[data-btn-check="${t.i}"]`);
      await el.scrollIntoViewIfNeeded().catch(() => {});
      await el.click({ force: true, timeout: 5000 }).catch((e) => rows.push({ ...t, error: e.message.split('\n')[0] }));
      await page.waitForTimeout(500);
      const st = await page.evaluate(STATE);
      const row = { ...t, opened: st };
      if (st && st.kind !== 'mobile-menu') {
        await page.screenshot({ path: path.join(OUT, `btn-${width}-${String(t.i).padStart(2, '0')}.png`) });
        if (st.form && !forms.has(st.form)) forms.set(st.form, { width, i: t.i, title: st.title });
      }
      rows.push(row);
    }
    // Бургер на телефоне открывает меню; кнопки внутри меню тоже проверяем.
    if (width === 390) {
      await page.evaluate(RESET);
      await page.click('#mega-toggle-block-1');
      await page.waitForTimeout(400);
      rows.push({ text: 'Бургер (мобильное меню)', opened: await page.evaluate(STATE) });
    }
    result.widths[width] = { buttons: rows, pageErrors: errors };
    await ctx.close();
  }

  // Отправка каждой найденной формы CF7.
  for (const [id, how] of forms) {
    if (!/^\d+$/.test(id)) continue;
    const ctx = await context(browser, how.width);
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('[style*="display: none"]'); };
      [...document.querySelectorAll('button, [role=button], #phone__icon_form, input[type=submit]')]
        .filter((el) => !el.closest('.fComponent-modal, .mobileMenu, #quizModal, #call_me_block, .window_cookie, #wpadminbar, form'))
        .filter(vis).forEach((el, i) => el.setAttribute('data-btn-check', i));
    });
    await page.locator(`[data-btn-check="${how.i}"]`).click({ force: true });
    await page.waitForTimeout(500);
    const form = page.locator('.fComponent-modal.overlay:visible form.wpcf7-form');
    const res = { form: id, title: how.title };
    try {
      for (const f of await form.locator('input[type=text], input[type=tel], input[type=email], textarea').all()) {
        const type = await f.getAttribute('type');
        if (type === 'tel') { await f.click(); await f.pressSequentially('9001234567'); }
        else if (type === 'email') await f.fill('test@example.com');
        else await f.fill('Тест');
      }
      for (const c of await form.locator('input[type=checkbox]').all()) await c.check({ force: true });
      await form.locator('input[type=submit]').click();
      await page.waitForFunction(() => { const f = document.querySelector('.fComponent-modal.overlay form.wpcf7-form.sent, .fComponent-modal.overlay form.wpcf7-form.invalid, .fComponent-modal.overlay form.wpcf7-form.failed'); return !!f || document.getElementById('licvidationsModal'); }, null, { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(600);
      res.status = await page.evaluate(() => { const f = [...document.querySelectorAll('form.wpcf7-form')].find((f) => /sent|invalid|failed|spam/.test(f.className)); return f ? f.className.replace('wpcf7-form', '').trim() : 'нет ответа'; });
      res.after = await page.evaluate(STATE);
    } catch (e) { res.status = 'ERROR ' + e.message.split('\n')[0]; }
    result.submits.push(res);
    await ctx.close();
  }

  // Встроенная форма блока «Заполните форму и рассчитайте стоимость».
  {
    const ctx = await context(browser, 1440);
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    const form = page.locator('.leadForm form.wpcf7-form');
    const res = { form: 'встроенная (.leadForm)', title: 'Рассчитать стоимость объявления' };
    if (await form.count()) {
      await form.locator('input[type=tel]').click(); await form.locator('input[type=tel]').pressSequentially('9001234567');
      await form.locator('input[type=email]').fill('test@example.com');
      for (const c of await form.locator('input[type=checkbox]').all()) await c.check({ force: true });
      await form.locator('input[type=submit]').click();
      await page.waitForTimeout(3000);
      res.status = await form.evaluate((f) => f.className.replace('wpcf7-form', '').trim());
      res.after = await page.evaluate(STATE);
    } else res.status = 'формы нет';
    result.submits.push(res);
    await ctx.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'buttons.json'), JSON.stringify(result, null, 2));

  for (const [w, d] of Object.entries(result.widths)) {
    console.log(`\n=== ${w}px (ошибок JS: ${d.pageErrors.length})`);
    for (const r of d.buttons) {
      const o = r.opened;
      const what = r.error ? 'ОШИБКА ' + r.error : !o ? 'НИЧЕГО НЕ ОТКРЫЛОСЬ' : o.kind === 'modal' ? `окно «${o.title}» форма=${o.form || 'НЕТ'} поля=${(o.fields || []).join(',')}` : `${o.kind}${o.title ? ' «' + o.title.trim().slice(0, 50) + '»' : ''}`;
      console.log(`${String(r.text).slice(0, 38).padEnd(38)} → ${what}`);
    }
  }
  console.log('\n=== Отправка форм');
  for (const s of result.submits) console.log(`${String(s.form).padEnd(22)} «${(s.title || '').slice(0, 40)}» → ${s.status}${s.after && s.after.kind ? ' (затем: ' + s.after.kind + (s.after.title ? ' «' + s.after.title.slice(0, 40) + '»' : '') + ')' : ''}`);
})();
