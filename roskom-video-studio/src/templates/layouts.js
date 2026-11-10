// Визуальные шаблоны сцен. Каждый шаблон строит DOM один раз и обновляет его по времени сцены t.
// Тайминги появления элементов (ctx.itemTimes) рассчитываются в Node по фактической озвучке.
(function () {
  const RV = (window.RV = window.RV || {});
  const { h, esc, appear, prog, ease, clamp, icon, fitText } = RV;

  /** Заголовок со словами-спанами и выделением ключевых слов. */
  function buildTitle(text, highlights, cls = 'title') {
    const el = h('div', cls + ' fit');
    const hl = (highlights || []).map((x) => x.toLowerCase());
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const isHl = (w) => {
      const n = w.toLowerCase().replace(/[^a-zа-яё0-9-]/gi, '');
      return n.length > 1 && hl.some((x) => x.split(/\s+/).some((p) => {
        const q = p.replace(/[^a-zа-яё0-9-]/gi, '');
        return q.length <= 4 || /\d/.test(q) ? n === q : n.startsWith(q.slice(0, Math.max(4, q.length - 2)));
      }));
    };
    el.innerHTML = words.map((w) => `<span class="w${isHl(w) ? ' hl' : ''}">${esc(w)}</span>`).join(' ');
    return el;
  }

  function animateWords(el, t, start, stagger = 0.06, kind = 'up') {
    const ws = el.querySelectorAll('.w');
    ws.forEach((w, i) => {
      appear(w, t, start + i * stagger, kind, 0.4);
      if (w.classList.contains('hl')) w.style.setProperty('--hlp', ease.outCubic(prog(t, start + i * stagger + 0.25, 0.35)));
    });
  }

  function box(ctx, scene) {
    const { W, H, v } = ctx;
    const pos = scene.mascot ? scene.mascot.position || 'right' : 'none';
    const el = h('div', 'content');
    if (v) {
      let bottom = 1060;
      if (!scene.mascot || pos === 'small' || pos === 'small-left') bottom = 1120;
      if (scene.mascot && ['hero', 'center', 'peek'].includes(pos)) bottom = 900;
      if (scene.contentBottom) bottom = scene.contentBottom;
      Object.assign(el.style, { left: '64px', right: '64px', top: '230px', bottom: H - bottom + 'px', display: 'flex', flexDirection: 'column', gap: '34px',
        justifyContent: ['cards', 'checklist', 'mistake', 'truth', 'qa', 'fact'].includes(scene.layout) ? 'center' : 'flex-start' });
    } else {
      const right = !scene.mascot ? 90 : W * 0.4;
      Object.assign(el.style, { left: '90px', right: right + 'px', top: '160px', bottom: '200px', display: 'flex', flexDirection: 'column', gap: '26px', justifyContent: 'center' });
    }
    return el;
  }

  const L = {};

  // 1. Крючок / заголовок
  L.hook = function (scene, ctx) {
    const root = box(ctx, scene);
    root.style.justifyContent = ctx.v ? 'flex-start' : 'center';
    let kicker = null;
    if (scene.kicker) { kicker = h('div', 'kicker', esc(scene.kicker)); kicker.style.alignSelf = 'flex-start'; root.appendChild(kicker); }
    const title = buildTitle(scene.title, scene.highlight);
    title.style.flex = '0 1 auto';
    title.style.maxHeight = ctx.v ? '560px' : '560px';
    root.appendChild(title);
    let text = null;
    if (scene.text) { text = h('div', 'text fit', esc(scene.text)); text.style.maxHeight = '220px'; root.appendChild(text); }
    let ic = null;
    if (scene.icon) {
      ic = h('div', 'ico', icon(scene.icon));
      Object.assign(ic.style, { width: '170px', height: '170px', background: 'var(--accent)', color: '#fff', borderRadius: '48px', boxShadow: '0 20px 50px rgba(0,0,0,.18)' });
      root.appendChild(ic);
    }
    return {
      root,
      mount() { fitText(title, ctx.v ? 112 : 96, 56); if (text) fitText(text, 46, 32); },
      pointTarget: () => title,
      update(t) {
        if (kicker) appear(kicker, t, 0.05, 'left', 0.4);
        animateWords(title, t, 0.15, 0.07);
        if (text) appear(text, t, 0.6, 'up');
        if (ic) { appear(ic, t, ctx.itemTimes[0] ?? 0.9, 'pop', 0.5, `rotate(${Math.sin(t * 2) * 5}deg)`); }
      },
    };
  };
  L.title = L.hook;

  // 2. Окно сайта с формой
  L.browser = function (scene, ctx) {
    const root = box(ctx, scene);
    const card = h('div', 'card browser');
    card.style.position = 'relative';
    const fields = scene.fields || ['Имя', 'Телефон'];
    card.innerHTML = `
      <div class="bar"><i style="background:#ff6b6b"></i><i style="background:#ffc94d"></i><i style="background:#3ccf7a"></i>
      <div class="url">${icon('lock').replace('<svg', '<svg style="width:28px;height:28px;margin-right:12px;stroke:#8a90ad;fill:none;stroke-width:2.4"')} ${esc(scene.url || 'ваш-сайт.ru')}</div></div>
      <div class="body">
        <div class="ftitle">${esc(scene.title || 'Оставьте заявку')}</div>
        ${fields.map((f) => `<div class="field" data-v="${esc(typeof f === 'object' ? f.value || '' : '')}">${esc(typeof f === 'object' ? f.label : f)}</div>`).join('')}
        ${scene.consent !== false ? `<div class="consent"><div class="box"></div><div>${esc(scene.consentText || 'Согласен на обработку персональных данных')}</div></div>` : ''}
        <div class="btn">${esc(scene.button || 'Отправить')}</div>
      </div>`;
    root.appendChild(card);
    const badges = (scene.badges || (scene.badge ? [scene.badge] : [])).map((b, i) => {
      const el = h('div', `badge ${b.type || 'warning'}`, `${icon(b.icon || (b.type === 'ok' ? 'check' : 'alert'))}<span>${esc(b.text)}</span>`);
      el.style.left = 30 + i * 40 + 'px';
      root.appendChild(el);
      return el;
    });
    root.style.position = 'absolute';
    const fieldEls = [...card.querySelectorAll('.field')];
    return {
      root,
      mount() { badges.forEach((b, i) => (b.style.top = card.offsetTop + card.offsetHeight - 40 + i * 120 + 'px')); },
      pointTarget: () => card.querySelector('.body'),
      update(t) {
        appear(card, t, 0.05, 'zoom', 0.5);
        fieldEls.forEach((f, i) => {
          const at = 0.5 + i * 0.35;
          if (f.dataset.v && t > at + 0.4) {
            const full = f.dataset.v;
            const n = Math.min(full.length, Math.floor((t - at - 0.4) * 18));
            f.textContent = full.slice(0, n) + (n < full.length ? '|' : '');
            f.classList.add('filled');
          }
        });
        badges.forEach((b, i) => appear(b, t, ctx.itemTimes[i] ?? 1.2 + i * 0.6, 'pop', 0.45, `rotate(${-3 + Math.sin(t * 3 + i) * 1.5}deg)`));
      },
    };
  };

  // 3. Карточки / список с иконками
  L.cards = function (scene, ctx) {
    const root = box(ctx, scene);
    let title = null;
    if (scene.title) { title = buildTitle(scene.title, scene.highlight); title.style.maxHeight = '300px'; root.appendChild(title); }
    const list = h('div', 'items');
    const items = (scene.items || []).map((it, i) => {
      const o = typeof it === 'string' ? { title: it } : it;
      const left = scene.numbered ? `<div class="num">${i + 1}</div>` : `<div class="ico">${icon(o.icon || 'doc')}</div>`;
      const st = o.status ? `<div class="status ${o.status}">${icon(o.status === 'ok' ? 'check' : o.status === 'bad' ? 'cross' : 'alert')}</div>` : '';
      const el = h('div', 'card item', `${left}<div style="min-width:0;flex:1"><div class="t">${esc(o.title)}</div>${o.text ? `<div class="s">${esc(o.text)}</div>` : ''}</div>${st}`);
      list.appendChild(el);
      return el;
    });
    root.appendChild(list);
    return {
      root,
      mount() {
        if (title) fitText(title, ctx.v ? 96 : 76, 48);
        // ужимаем карточки, если не помещаются
        let fs = 52;
        const apply = () => items.forEach((el) => { el.querySelector('.t').style.fontSize = fs + 'px'; const s = el.querySelector('.s'); if (s) s.style.fontSize = Math.round(fs * 0.72) + 'px'; el.style.padding = Math.round(fs * 0.62) + 'px 34px'; });
        apply();
        while (fs > 30 && root.scrollHeight > root.clientHeight + 1) {
          fs -= 2;
          items.forEach((el) => { el.querySelector('.t').style.fontSize = fs + 'px'; const s = el.querySelector('.s'); if (s) s.style.fontSize = Math.round(fs * 0.72) + 'px'; el.style.padding = Math.round(fs * 0.55) + 'px 30px'; });
        }
      },
      pointTarget: () => list,
      update(t) {
        if (title) animateWords(title, t, 0.05, 0.05);
        items.forEach((el, i) => {
          appear(el, t, ctx.itemTimes[i] ?? 0.6 + i * 0.5, i % 2 ? 'right' : 'left', 0.5);
          const st = el.querySelector('.status');
          if (st) appear(st, t, (ctx.itemTimes[i] ?? 0.6 + i * 0.5) + 0.35, 'pop', 0.4);
        });
      },
    };
  };

  // 4. Чек-лист с галочками
  L.checklist = function (scene, ctx) {
    const s = { ...scene, items: (scene.items || []).map((it) => (typeof it === 'string' ? { title: it, status: 'ok' } : { status: 'ok', ...it })), numbered: scene.numbered ?? true };
    return L.cards(s, ctx);
  };

  // 5. Ошибка №N
  L.mistake = function (scene, ctx) {
    const root = box(ctx, scene);
    const head = h('div', 'mistake-head', `<div class="cross">${icon('cross')}</div><div><div class="mistake-label">${esc(scene.label || 'Ошибка')}</div><div class="mistake-num">№${esc(scene.number ?? 1)}</div></div>`);
    root.appendChild(head);
    const title = buildTitle(scene.title, scene.highlight);
    title.style.maxHeight = '330px';
    root.appendChild(title);
    let text = null;
    if (scene.text) { text = h('div', 'card text fit', esc(scene.text)); Object.assign(text.style, { padding: '30px 36px', maxHeight: '260px', color: 'var(--card-ink)', borderLeft: '14px solid var(--danger)' }); root.appendChild(text); }
    return {
      root,
      mount() {
        let k = 1;
        const num = head.querySelector('.mistake-num'), lbl = head.querySelector('.mistake-label'), cr = head.querySelector('.cross');
        const apply = () => {
          num.style.fontSize = 200 * k + 'px';
          lbl.style.fontSize = 48 * Math.max(0.75, k) + 'px';
          cr.style.width = cr.style.height = 130 * k + 'px';
          fitText(title, (ctx.v ? 80 : 68) * k, 40);
          if (text) fitText(text, 40 * Math.max(0.8, k), 26);
        };
        apply();
        while (k > 0.55 && root.scrollHeight > root.clientHeight + 2) { k -= 0.05; apply(); }
      },
      pointTarget: () => title,
      update(t) {
        appear(head, t, 0.05, 'stamp', 0.45);
        animateWords(title, t, 0.4, 0.05);
        if (text) appear(text, t, ctx.itemTimes[0] ?? 1.2, 'up');
      },
    };
  };

  // 6. Миф
  L.myth = function (scene, ctx) {
    const root = box(ctx, scene);
    const pill = h('div', 'label-pill', `${icon('question').replace('<svg', '<svg style="width:46px;height:46px;stroke:#fff;fill:none;stroke-width:2.6"')}${esc(scene.label || 'Миф или правда?')}`);
    pill.style.background = 'var(--deep)';
    pill.style.alignSelf = 'flex-start';
    root.appendChild(pill);
    const card = h('div', 'card');
    Object.assign(card.style, { position: 'relative', padding: '50px 46px 190px', overflow: 'hidden' });
    const q = buildTitle('«' + (scene.myth || scene.title) + '»', scene.highlight);
    q.style.maxHeight = '420px';
    q.style.color = 'var(--card-ink)';
    card.appendChild(q);
    root.appendChild(card);
    const strike = h('div', 'strike');
    const verdict = h('div', `verdict ${scene.verdict === 'true' ? 'true' : 'false'}`, esc(scene.verdictText || (scene.verdict === 'true' ? 'Правда' : 'Миф')));
    card.appendChild(strike);
    card.appendChild(verdict);
    return {
      root,
      mount() {
        fitText(q, ctx.v ? 76 : 64, 44);
        Object.assign(strike.style, { left: '30px', right: '30px' });
        Object.assign(verdict.style, { right: '70px', bottom: '45px', background: 'var(--card)' });
        strike.style.top = q.offsetTop + q.offsetHeight / 2 + 'px';
      },
      pointTarget: () => card,
      update(t) {
        appear(pill, t, 0.05, 'left', 0.4);
        appear(card, t, 0.2, 'up', 0.5);
        animateWords(q, t, 0.35, 0.05, 'fade');
        const r = ctx.itemTimes[0] ?? ctx.dur * 0.6;
        if (scene.verdict !== 'true') { strike.style.transform = `rotate(-4deg) scaleX(${ease.outCubic(prog(t, r, 0.3))})`; strike.style.opacity = t >= r ? 1 : 0; }
        else strike.style.opacity = 0;
        appear(verdict, t, r + 0.15, 'stamp', 0.4);
        if (t < r + 0.15) verdict.style.opacity = 0;
      },
    };
  };

  // 7. Правда / решение
  L.truth = function (scene, ctx) {
    const root = box(ctx, scene);
    const pill = h('div', 'label-pill', `${icon('check').replace('<svg', '<svg style="width:46px;height:46px;stroke:#fff;fill:none;stroke-width:3"')}${esc(scene.label || 'Правда')}`);
    pill.style.background = 'var(--success)';
    pill.style.alignSelf = 'flex-start';
    root.appendChild(pill);
    const title = buildTitle(scene.title, scene.highlight);
    title.style.maxHeight = '360px';
    root.appendChild(title);
    const inner = scene.items && scene.items.length ? L.checklist({ ...scene, title: null, mascot: null, numbered: false, items: scene.items }, { ...ctx, itemTimes: ctx.itemTimes }) : null;
    let text = null;
    if (inner) { inner.root.style.position = 'static'; inner.root.style.flex = '1'; root.appendChild(inner.root); }
    else if (scene.text) { text = h('div', 'text fit', esc(scene.text)); text.style.maxHeight = '300px'; root.appendChild(text); }
    return {
      root,
      mount() { fitText(title, ctx.v ? 82 : 70, 46); if (text) fitText(text, 46, 30); if (inner) inner.mount && inner.mount(); },
      pointTarget: () => title,
      update(t) {
        appear(pill, t, 0.05, 'pop', 0.4);
        animateWords(title, t, 0.2, 0.05);
        if (inner) inner.update(t);
        if (text) appear(text, t, ctx.itemTimes[0] ?? 0.9, 'up');
      },
    };
  };

  // 8. Вопрос — ответ
  L.qa = function (scene, ctx) {
    const root = box(ctx, scene);
    const who = h('div', 'who', esc(scene.asker || 'Вопрос от предпринимателя'));
    const q = h('div', 'bubble q fit', esc(scene.question || scene.title));
    q.style.maxHeight = '420px';
    root.appendChild(who);
    root.appendChild(q);
    let a = null;
    if (scene.answer) {
      a = h('div', 'bubble a fit', esc(scene.answer));
      Object.assign(a.style, { alignSelf: 'flex-end', maxWidth: '92%', maxHeight: '380px' });
      root.appendChild(a);
    }
    return {
      root,
      mount() { fitText(q, ctx.v ? 60 : 54, 38); if (a) fitText(a, 48, 32); },
      pointTarget: () => q,
      update(t) {
        appear(who, t, 0.05, 'fade');
        appear(q, t, 0.1, 'pop', 0.5);
        if (a) appear(a, t, ctx.itemTimes[0] ?? ctx.dur * 0.45, 'pop', 0.5);
      },
    };
  };

  // 9. Новость законодательства
  L.news = function (scene, ctx) {
    const root = box(ctx, scene);
    const tk = h('div', 'ticker', `<div class="lbl">${esc(scene.tag || 'НОВОСТЬ')}</div><div class="run">${esc((scene.ticker || scene.title || '') + '   •   ').repeat(4)}</div>`);
    tk.style.top = ctx.v ? '190px' : '120px';
    tk.style.position = 'absolute';
    const parent = h('div', 'layer');
    parent.appendChild(tk);
    root.style.top = ctx.v ? '330px' : '250px';
    let date = null;
    if (scene.date) {
      const [d, ...m] = String(scene.date).split(' ');
      date = h('div', 'date-badge', `<div class="m">${esc(scene.datePrefix || 'с')}</div><div class="d">${esc(d)}</div><div class="m">${esc(m.join(' '))}</div>`);
      date.style.alignSelf = 'flex-start';
      root.appendChild(date);
    }
    const title = buildTitle(scene.title, scene.highlight);
    title.style.maxHeight = '360px';
    root.appendChild(title);
    let text = null;
    if (scene.text) { text = h('div', 'text fit', esc(scene.text)); text.style.maxHeight = '220px'; root.appendChild(text); }
    parent.appendChild(root);
    const run = tk.querySelector('.run');
    return {
      root: parent,
      mount() { fitText(title, ctx.v ? 78 : 66, 44); if (text) fitText(text, 42, 30); },
      pointTarget: () => title,
      update(t) {
        appear(tk, t, 0, 'left', 0.4);
        run.style.transform = `translateX(${-t * 160}px)`;
        if (date) appear(date, t, 0.25, 'pop', 0.5);
        animateWords(title, t, 0.45, 0.05);
        if (text) appear(text, t, ctx.itemTimes[0] ?? 1.2, 'up');
      },
    };
  };

  // 10. Факт / цифра
  L.fact = function (scene, ctx) {
    const root = box(ctx, scene);
    root.style.justifyContent = 'center';
    if (scene.label) { const k = h('div', 'kicker', esc(scene.label)); k.style.alignSelf = 'flex-start'; root.appendChild(k); }
    const val = h('div', 'big-value fit', esc(scene.value));
    val.style.maxHeight = '330px';
    root.appendChild(val);
    const title = buildTitle(scene.title || '', scene.highlight);
    title.style.maxHeight = '300px';
    root.appendChild(title);
    let note = null;
    if (scene.note) { note = h('div', 'text', esc(scene.note)); note.style.fontSize = '30px'; root.appendChild(note); }
    const kids = [...root.children];
    return {
      root,
      mount() { fitText(val, 260, 90); fitText(title, 72, 40); },
      pointTarget: () => val,
      update(t) {
        kids.forEach((k, i) => (k === val ? appear(k, t, 0.15, 'zoom', 0.5) : k === title ? animateWords(title, t, 0.5, 0.05) : appear(k, t, 0.05 + i * 0.3, 'up')));
      },
    };
  };

  // 11. Призыв к действию
  L.cta = function (scene, ctx) {
    const root = box(ctx, scene);
    root.style.justifyContent = ctx.v ? 'flex-start' : 'center';
    const card = h('div', 'card cta-card');
    const brand = ctx.brand;
    const [b1, ...b2] = brand.name.split(' ');
    card.innerHTML = `
      ${ctx.logo ? `<img src="${ctx.root + ctx.logo}" style="height:110px;margin-bottom:24px">` : `<div class="wordmark">${esc(b1)} <span>${esc(b2.join(' '))}</span></div>`}
      <div class="text fit cta-t" style="margin-top:26px;color:var(--card-ink);font-weight:800;max-height:300px">${esc(scene.title || '')}</div>
      ${scene.text ? `<div class="text" style="margin-top:14px;font-size:34px">${esc(scene.text)}</div>` : ''}
      <div class="cta-btn">${icon('arrow')}<span>${esc(scene.button || brand.siteLabel)}</span></div>`;
    root.appendChild(card);
    const btn = card.querySelector('.cta-btn');
    const t1 = card.querySelector('.cta-t');
    return {
      root,
      mount() { fitText(t1, 54, 34); },
      pointTarget: () => btn,
      update(t) {
        appear(card, t, 0.05, 'up', 0.55);
        appear(btn, t, ctx.itemTimes[0] ?? 0.7, 'pop', 0.5, `scale(${1 + Math.max(0, Math.sin((t - 1) * 4)) * 0.035})`);
      },
    };
  };

  RV.layouts = L;
  RV.buildTitle = buildTitle;
  RV.animateWords = animateWords;
})();
