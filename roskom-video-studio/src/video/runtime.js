// Движок композиции: фон, HUD, сцены, камера, переходы, субтитры. Кадр = чистая функция номера кадра.
(function () {
  const RV = (window.RV = window.RV || {});
  const { h, esc, prog, ease, clamp } = RV;
  let D, stage, bgLayer, sceneLayer, hud, capsEl, trans, progressEl;
  const built = {};
  let current = -1;

  function setVars(theme, brand) {
    const c = brand.colors;
    const vars = {
      '--primary': c.primary, '--deep': c.deep, '--accent': c.danger, '--success': c.success, '--danger': c.danger,
      '--warning': c.warning, '--hl': c.highlight, '--hl-ink': c.ink, '--soft': c.soft,
      '--bg1': c.soft, '--bg2': '#ffffff', '--ink': c.ink, '--muted': '#4a5075', '--card': '#ffffff', '--card-ink': c.ink, '--card-muted': '#6a7091',
      '--chip-bg': '#ffffff', '--chip-ink': c.deep, '--cap-bg': 'rgba(22,26,69,.9)', '--cap-hl': c.highlight, '--grid': 'rgba(91,111,216,.22)', '--stripe': 'rgba(91,111,216,.08)',
      ...(theme.vars || {}),
    };
    for (const [k, v] of Object.entries(vars)) stage.style.setProperty(k, v);
  }

  function buildBackground(theme) {
    bgLayer.innerHTML = '';
    const grid = h('div', 'bg-grid');
    bgLayer.appendChild(grid);
    const blobs = (theme.blobs || ['#8EA0FF', '#C7D0FF', '#FFD9A8']).map((col, i) => {
      const b = h('div', 'bg-blob');
      const s = [700, 560, 480][i % 3];
      Object.assign(b.style, { width: s + 'px', height: s + 'px', background: col });
      bgLayer.appendChild(b);
      return b;
    });
    const stripes = [0, 1].map((i) => {
      const s = h('div', 'bg-stripe');
      s.style.top = (i ? 72 : 22) + '%';
      bgLayer.appendChild(s);
      return s;
    });
    return (t) => {
      blobs.forEach((b, i) => {
        const x = [0.75, 0.05, 0.5][i] * D.W + Math.sin(t * 0.3 + i * 2) * 80 - 300;
        const y = [0.05, 0.45, 0.8][i] * D.H + Math.cos(t * 0.25 + i) * 90 - 280;
        b.style.transform = `translate(${x}px, ${y}px)`;
      });
      grid.style.transform = `translate(${(t * 12) % 46}px, ${(t * 8) % 46}px)`;
      stripes.forEach((s, i) => (s.style.transform = `rotate(${i ? 6 : -8}deg) translateX(${Math.sin(t * 0.4 + i) * 40}px)`));
    };
  }
  let bgUpdate = () => {};

  RV.init = async function (data) {
    D = data;
    document.body.innerHTML = '';
    stage = h('div', D.W > D.H * 1.2 ? 'h' : D.H > D.W * 1.2 ? 'v' : 'sq');
    stage.id = 'stage';
    stage.style.setProperty('--W', D.W + 'px');
    stage.style.setProperty('--H', D.H + 'px');
    document.body.appendChild(stage);
    setVars(D.theme, D.brand);
    bgLayer = h('div', 'layer');
    sceneLayer = h('div', 'layer');
    hud = h('div', 'layer');
    capsEl = h('div', 'captions');
    trans = h('div', 'trans', `<div class="panel2"></div><div class="panel"><div class="tbrand">${esc(D.brand.name)}</div></div>`);
    stage.append(bgLayer, sceneLayer, hud, capsEl, trans);
    bgUpdate = buildBackground(D.theme);
    // HUD: бренд, метка формата, прогресс
    const chip = h('div', 'hud-brand', D.logo ? `<img src="${D.root + D.logo}">` : `<div class="dot"></div><div>${esc(D.brand.name)}</div>`);
    hud.appendChild(chip);
    if (D.theme.tag) hud.appendChild(h('div', 'hud-tag', esc(D.theme.tag)));
    progressEl = h('div', 'hud-progress');
    hud.appendChild(progressEl);
    const v = D.H > D.W * 1.2;
    if (v) capsEl.style.top = '1440px';
    else capsEl.style.bottom = '60px';
    await document.fonts.ready;
    return true;
  };

  RV.prepareScene = async function (i) {
    if (built[i]) return built[i];
    const sc = D.scenes[i];
    const el = h('div', 'scene');
    el.style.visibility = 'hidden';
    sceneLayer.appendChild(el);
    const ctx = {
      W: D.W, H: D.H, v: D.H > D.W * 1.2, dur: sc.duration, itemTimes: sc.itemTimes || [], brand: D.brand, logo: D.logo, root: D.root,
      poses: D.poses, sceneDur: sc.duration,
    };
    const make = RV.layouts[sc.layout];
    if (!make) throw new Error('Неизвестный шаблон сцены: ' + sc.layout);
    const layout = make(sc, ctx);
    el.appendChild(layout.root);
    let mascot = null;
    if (sc.mascot) {
      mascot = RV.createMascot(el, sc.mascot, ctx);
      await Promise.all([...mascot.el.querySelectorAll('img')].map((im) => im.decode().catch(() => { throw new Error('Не загрузилось изображение маскота ' + im.src); })));
    }
    await Promise.all([...el.querySelectorAll('img')].map((im) => im.decode().catch(() => {})));
    // Контент не должен заходить под маскота: поднимаем нижнюю границу области контента
    if (mascot && ctx.v && !sc.allowOverlap && !['browser', 'cta'].includes(sc.layout)) {
      const content = el.querySelector('.content');
      const mb = mascot.bounds();
      if (content) {
        const cur = parseFloat(content.style.bottom) || 0;
        content.style.bottom = Math.max(cur, D.H - mb.y + 28) + 'px';
      }
    }
    if (layout.mount) layout.mount();
    // Если контент всё ещё не помещается — равномерно уменьшаем блок целиком (сверху по центру)
    const content = el.querySelector('.content');
    if (content && content.scrollHeight > content.clientHeight + 2) {
      const r = content.clientHeight / content.scrollHeight;
      content.style.bottom = 'auto';
      content.style.height = content.scrollHeight + 'px';
      content.style.transformOrigin = '50% 0';
      content.style.transform = `scale(${r})`;
      content.dataset.scaled = r.toFixed(3);
    }
    if (mascot && sc.mascot.point && layout.pointTarget) {
      const r = layout.pointTarget().getBoundingClientRect();
      const s = stage.getBoundingClientRect();
      mascot.setPointTarget({ x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height });
    }
    built[i] = { el, layout, mascot, sc };
    return built[i];
  };

  RV.releaseScene = function (i) {
    if (built[i]) { built[i].el.remove(); delete built[i]; }
  };

  function sceneAt(frame) {
    for (let i = 0; i < D.scenes.length; i++) {
      const s = D.scenes[i];
      if (frame >= s.startFrame && frame < s.startFrame + s.frames) return i;
    }
    return D.scenes.length - 1;
  }

  function cameraTransform(cam, t, dur) {
    const p = ease.inOutCubic(clamp(t / dur));
    switch (cam) {
      case 'zoom-in': return `scale(${1 + 0.07 * p})`;
      case 'zoom-out': return `scale(${1.08 - 0.08 * p})`;
      case 'pan-left': return `scale(1.06) translateX(${30 - 60 * p}px)`;
      case 'pan-right': return `scale(1.06) translateX(${-30 + 60 * p}px)`;
      case 'punch': { const k = prog(t, 0.0, 0.35); return `scale(${1.12 - 0.12 * ease.outCubic(k)})`; }
      case 'drift': return `translateY(${-20 * p}px) scale(${1 + 0.03 * p})`;
      default: return '';
    }
  }

  const ENTER = 0.38, EXIT = 0.3;
  function applyTransitions(i, t, dur, el) {
    const sc = D.scenes[i];
    const next = D.scenes[i + 1];
    const tin = i === 0 ? 'none' : sc.transition || 'wipe';
    const tout = next ? next.transition || 'wipe' : 'none';
    let sceneTr = '', sceneOp = 1, panelX = null, circle = null;
    const pin = prog(t, 0, ENTER), pout = prog(t, dur - EXIT, EXIT);
    if (t < ENTER) {
      if (tin === 'wipe') panelX = -115 * ease.inOutCubic(pin);
      if (tin === 'slide') sceneTr = `translateX(${(1 - ease.outCubic(pin)) * D.W}px)`;
      if (tin === 'zoom') { sceneTr = `scale(${0.82 + 0.18 * ease.outCubic(pin)})`; sceneOp = pin; }
      if (tin === 'fade') sceneOp = pin;
      if (tin === 'circle') circle = 1 - ease.inOutCubic(pin);
    }
    if (t > dur - EXIT) {
      if (tout === 'wipe') panelX = 115 * (1 - ease.inOutCubic(pout));
      if (tout === 'slide') sceneTr = `translateX(${-ease.inCubic(pout) * D.W}px)`;
      if (tout === 'zoom') { sceneTr = `scale(${1 + 0.25 * ease.inCubic(pout)})`; sceneOp = 1 - pout; }
      if (tout === 'fade') sceneOp = 1 - pout;
      if (tout === 'circle') circle = ease.inOutCubic(pout);
    }
    trans.style.display = panelX === null && circle === null ? 'none' : 'block';
    const [p2, p1] = trans.children;
    if (panelX !== null) {
      trans.style.clipPath = 'none';
      p1.style.transform = `translateX(${panelX}%) skewX(-8deg)`;
      p2.style.transform = `translateX(${panelX * 1.12 + (panelX > 0 ? 8 : -8)}%) skewX(-8deg)`;
    } else if (circle !== null) {
      const r = circle * 130;
      p1.style.transform = p2.style.transform = 'none';
      trans.style.clipPath = `circle(${r}% at 50% 55%)`;
    }
    return { sceneTr, sceneOp };
  }

  function renderCaptions(time) {
    const caps = D.captions;
    let c = null;
    for (const x of caps) if (time >= x.start && time < x.end) { c = x; break; }
    if (!c) { capsEl.innerHTML = ''; capsEl.dataset.key = ''; return; }
    const key = c.start + c.text;
    if (capsEl.dataset.key !== key) {
      capsEl.dataset.key = key;
      capsEl.innerHTML = `<div class="cap">${c.words.map((w) => (w.hl ? `<span class="k">${esc(w.w)}</span>` : esc(w.w))).join(' ')}</div>`;
      capsEl.firstChild.style.fontSize = D.captionFont + 'px';
    }
    const k = prog(time, c.start, 0.12);
    capsEl.firstChild.style.transform = `scale(${0.9 + 0.1 * ease.outBack(k)})`;
    capsEl.firstChild.style.opacity = clamp(k * 2);
  }

  RV.renderFrame = function (frame) {
    const i = sceneAt(frame);
    const b = built[i];
    if (!b) throw new Error('Сцена не подготовлена: ' + i);
    if (current !== i) {
      for (const [k, v] of Object.entries(built)) v.el.style.visibility = +k === i ? 'visible' : 'hidden';
      current = i;
    }
    const sc = D.scenes[i];
    const t = (frame - sc.startFrame) / D.fps;
    const time = frame / D.fps;
    bgUpdate(time);
    b.layout.update(t);
    if (b.mascot) b.mascot.update(t, D.envelope[frame] || 0);
    const { sceneTr, sceneOp } = applyTransitions(i, t, sc.duration, b.el);
    b.el.style.transform = `${sceneTr} ${cameraTransform(sc.camera, t, sc.duration)}`.trim();
    b.el.style.opacity = sceneOp;
    progressEl.style.width = (D.W * (frame + 1)) / D.totalFrames + 'px';
    renderCaptions(time);
    return i;
  };

  /** Проверка обрезанного текста и выхода элементов за кадр (для quality-report). */
  RV.qaCheck = function (i) {
    const b = built[i];
    const issues = [];
    const s = stage.getBoundingClientRect();
    b.el.querySelectorAll('.fit').forEach((el) => {
      const wide = [...el.querySelectorAll('.w')].some((w) => w.offsetWidth > el.clientWidth + 2);
      if (el.scrollHeight > el.clientHeight + parseFloat(getComputedStyle(el).fontSize) * 0.2 || wide || el.dataset.overflow) issues.push({ type: 'text-overflow', text: el.textContent.slice(0, 80) });
      else if (el.dataset.fitted && +el.dataset.fitted <= +el.dataset.minPx) issues.push({ type: 'text-min-size', text: el.textContent.slice(0, 80), size: +el.dataset.fitted });
    });
    b.el.querySelectorAll('.card, .title, .kicker, .bubble, .badge, .label-pill, .date-badge').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;
      if (r.left < s.left - 30 || r.right > s.right + 30 || r.top < s.top - 2 || r.bottom > s.bottom - 2) issues.push({ type: 'out-of-frame', text: el.textContent.slice(0, 60) });
    });
    const content = b.el.querySelector('.content');
    if (content && content.scrollHeight > content.clientHeight + 4) issues.push({ type: 'content-overflow', by: content.scrollHeight - content.clientHeight });
    if (content && content.dataset.scaled && +content.dataset.scaled < 0.75) issues.push({ type: 'content-scaled', scale: +content.dataset.scaled });
    // Перекрытие контента и субтитров
    const v = D.H > D.W * 1.2;
    if (v && content) {
      const r = content.getBoundingClientRect();
      if (r.bottom - s.top > 1430) issues.push({ type: 'content-under-captions' });
    }
    return issues;
  };

  RV.captionCheck = function () {
    const issues = [];
    const probe = h('div', 'cap');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.fontSize = D.captionFont + 'px';
    capsEl.appendChild(probe);
    for (const c of D.captions) {
      probe.textContent = c.text;
      const lines = Math.round((probe.clientHeight - 40) / (D.captionFont * 1.18));
      if (lines > 2) issues.push({ type: 'caption-too-long', text: c.text, lines });
      if (c.end - c.start < 0.45) issues.push({ type: 'caption-too-fast', text: c.text, duration: +(c.end - c.start).toFixed(2) });
    }
    probe.remove();
    return issues;
  };

  /** Обложка: крупный заголовок, маскот, бренд. */
  RV.renderCover = async function (cover) {
    for (const k of Object.keys(built)) RV.releaseScene(k);
    capsEl.innerHTML = '';
    trans.style.display = 'none';
    progressEl.style.width = '0';
    bgUpdate(3);
    const el = h('div', 'scene');
    sceneLayer.appendChild(el);
    const v = D.H > D.W * 1.2;
    const title = RV.buildTitle(cover.title, cover.highlight, 'cover-title fit');
    Object.assign(title.style, v ? { top: '250px', height: '640px' } : { top: '170px', height: D.H - 340 + 'px', right: '45%', display: 'flex', alignItems: 'center' });
    el.appendChild(title);
    title.querySelectorAll('.w').forEach((w) => w.style.setProperty('--hlp', 1));
    const m = RV.createMascot(el, { pose: cover.pose || 'surprised', position: v ? 'hero' : 'right', enter: 'none', size: v ? 860 : undefined }, { W: D.W, H: D.H, poses: D.poses, root: D.root });
    await Promise.all([...el.querySelectorAll('img')].map((im) => im.decode()));
    RV.fitText(title, v ? 128 : 110, 60);
    m.update(0, 0);
    m.el.style.transform = 'none';
    if (v) {
      // маскот целиком под заголовком, над кнопкой
      const words = [...title.querySelectorAll('.w')];
      const titleBottom = title.offsetTop + Math.max(...words.map((w) => w.offsetTop + w.offsetHeight));
      const floor = D.H - 230;
      const aspect = m.el.offsetHeight / m.el.offsetWidth;
      const size = Math.min(900, D.W - 80, (floor - titleBottom - 40) / aspect);
      Object.assign(m.el.style, { width: size + 'px', height: size * aspect + 'px', left: (D.W - size) / 2 + 'px', top: floor - size * aspect + 'px' });
    }
    const btn = h('div', 'cta-btn', `${RV.icon('arrow')}<span>${esc(D.brand.siteLabel)}</span>`);
    Object.assign(btn.style, { position: 'absolute', left: '64px', bottom: v ? '120px' : '60px', padding: '0 50px', marginTop: 0 });
    el.appendChild(btn);
    return true;
  };
})();
