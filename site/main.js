(() => {
  'use strict';

  /* ---- Ассеты из макета ----
     Картинки подключаются только если файл перечислен в assets/manifest.json:
     так отсутствующие оригиналы не дают 404, а добавленные подхватываются без правки HTML. */
  const imgs = [...document.querySelectorAll('img[data-asset]')];
  const missing = (img) => {
    if (img.closest('.logos__track')) {
      const span = document.createElement('span');
      span.className = 'is-missing';
      span.textContent = img.alt;
      img.replaceWith(span);
    } else {
      img.classList.add('is-missing');
    }
  };
  fetch('assets/manifest.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => [])
    .then((list) => {
      const have = new Set(Array.isArray(list) ? list : []);
      const absent = [];
      imgs.forEach((img) => {
        if (have.has(img.dataset.asset)) {
          img.addEventListener('error', () => missing(img), { once: true });
          img.src = img.dataset.src;
        } else {
          absent.push(img.dataset.asset);
          missing(img);
        }
      });
      if (absent.length) console.info('[assets] ожидаются файлы из макета:', absent.join(', '));
    });

  /* ---- Мобильное меню ---- */
  const burger = document.querySelector('.burger');
  const nav = document.getElementById('main-nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---- Ссылки без заданной цели ---- */
  document.querySelectorAll('a[href="#"]').forEach((a) => {
    a.addEventListener('click', (e) => e.preventDefault());
  });

  /* ---- Маска телефона ---- */
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener('input', () => {
      let d = input.value.replace(/\D/g, '');
      if (!d) { input.value = ''; return; }
      if (d[0] === '8') d = '7' + d.slice(1);
      if (d[0] !== '7') d = '7' + d;
      d = d.slice(0, 11);
      const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
      let out = '+7';
      if (p[0]) out += ' (' + p[0] + (p[0].length === 3 ? ')' : '');
      if (p[1]) out += ' ' + p[1];
      if (p[2]) out += '-' + p[2];
      if (p[3]) out += '-' + p[3];
      input.value = out;
    });
  });

  /* ---- Формы ----
     Адрес приёма задаётся в атрибуте data-endpoint у <form>. Пока он пуст,
     данные никуда не уходят и пользователь видит сообщение об этом.
     Сообщение об успехе показывается только после ответа сервера 2xx. */
  const validators = {
    tel: (v) => v.replace(/\D/g, '').length === 11,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
  };

  document.querySelectorAll('.js-form').forEach((form) => {
    const status = form.querySelector('.form-status');
    const btn = form.querySelector('[type="submit"]');

    const check = (el) => {
      let ok = true;
      if (el.type === 'checkbox') ok = !el.required || el.checked;
      else if (el.required && !el.value.trim()) ok = false;
      else if (el.value && validators[el.type]) ok = validators[el.type](el.value.trim());
      const wrap = el.closest('.field, .consent');
      if (wrap) wrap.classList.toggle('is-invalid', !ok);
      el.setAttribute('aria-invalid', String(!ok));
      return ok;
    };

    form.addEventListener('change', (e) => { if (e.target.matches('input, select')) check(e.target); });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const els = [...form.querySelectorAll('input, select')];
      const bad = els.filter((el) => !check(el));
      status.className = 'form-status';
      if (bad.length) {
        status.classList.add('is-error');
        status.textContent = 'Заполните обязательные поля и отметьте согласия.';
        bad[0].focus();
        return;
      }
      const endpoint = form.dataset.endpoint;
      if (!endpoint) {
        status.classList.add('is-error');
        status.textContent = 'Отправка пока не подключена: не задан адрес приёма заявок. Позвоните нам: 8 (800) 522-04-55.';
        console.warn('[form] «' + form.dataset.name + '»: не задан data-endpoint');
        return;
      }
      btn.disabled = true;
      status.textContent = 'Отправляем…';
      try {
        const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        status.classList.add('is-ok');
        status.textContent = 'Заявка принята. Мы свяжемся с вами в ближайшее время.';
        form.reset();
      } catch (err) {
        status.classList.add('is-error');
        status.textContent = 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.';
        console.error('[form]', err);
      } finally {
        btn.disabled = false;
      }
    });
  });

  /* ---- Скачивание документа отказа: файл должен быть в assets/manifest.json ---- */
  document.querySelectorAll('.js-download').forEach((a) => {
    a.addEventListener('click', async (e) => {
      if (a.dataset.checked) { delete a.dataset.checked; return; } // повторный программный клик — штатное скачивание
      e.preventDefault();
      const rel = a.getAttribute('href').replace(/^assets\//, '');
      const list = await fetch('assets/manifest.json', { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : [])).catch(() => []);
      if (Array.isArray(list) && list.includes(rel)) { a.dataset.checked = '1'; a.click(); return; }
      const out = a.parentElement.querySelector('.form-status');
      out.className = 'form-status form-status--inline is-error';
      out.textContent = 'Документ пока не загружен на сайт.';
      console.info('[download] нет файла ' + a.getAttribute('href'));
    });
  });

  /* ---- Слайдер отзывов ---- */
  const track = document.querySelector('.js-track');
  if (track) {
    const prev = document.querySelector('.js-prev');
    const next = document.querySelector('.js-next');
    const dotsBox = document.querySelector('.js-dots');
    const slides = [...track.children];
    let index = 0;

    const perView = () => {
      const w = track.parentElement.clientWidth;
      return w >= 900 ? 3 : w >= 600 ? 2 : 1;
    };
    const pages = () => Math.max(1, slides.length - perView() + 1);

    const render = () => {
      const n = pages();
      if (index > n - 1) index = n - 1;
      if (dotsBox.children.length !== n) {
        dotsBox.innerHTML = '';
        for (let i = 0; i < n; i++) {
          const b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', 'Отзыв ' + (i + 1));
          b.addEventListener('click', () => { index = i; render(); });
          dotsBox.appendChild(b);
        }
      }
      [...dotsBox.children].forEach((b, i) => b.setAttribute('aria-current', String(i === index)));
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const step = slides[0].getBoundingClientRect().width + gap;
      track.style.transform = 'translateX(' + (-index * step) + 'px)';
      prev.disabled = index === 0;
      next.disabled = index >= n - 1;
    };
    prev.addEventListener('click', () => { index = Math.max(0, index - 1); render(); });
    next.addEventListener('click', () => { index = Math.min(pages() - 1, index + 1); render(); });
    window.addEventListener('resize', render);
    render();
  }
})();
