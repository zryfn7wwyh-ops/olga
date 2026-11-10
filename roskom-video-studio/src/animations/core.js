// Базовые анимации: функции плавности и появления. Всё вычисляется из времени t (детерминированно).
(function () {
  const RV = (window.RV = window.RV || {});
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = {
    linear: (x) => x,
    outCubic: (x) => 1 - Math.pow(1 - x, 3),
    inCubic: (x) => x * x * x,
    inOutCubic: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    outBack: (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
    outElastic: (x) => (x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1),
    outQuint: (x) => 1 - Math.pow(1 - x, 5),
  };
  const prog = (t, start, dur) => clamp((t - start) / dur);

  /** Применяет анимацию появления kind к элементу в момент start. */
  function appear(el, t, start, kind = 'up', dur = 0.45, extra = '') {
    const x = prog(t, start, dur);
    let o = 1, tr = '';
    switch (kind) {
      case 'up': o = ease.outCubic(x); tr = `translateY(${(1 - ease.outCubic(x)) * 70}px)`; break;
      case 'down': o = ease.outCubic(x); tr = `translateY(${(ease.outCubic(x) - 1) * 70}px)`; break;
      case 'left': o = ease.outCubic(x); tr = `translateX(${(1 - ease.outCubic(x)) * -160}px)`; break;
      case 'right': o = ease.outCubic(x); tr = `translateX(${(1 - ease.outCubic(x)) * 160}px)`; break;
      case 'pop': o = clamp(x * 3); tr = `scale(${0.4 + 0.6 * ease.outBack(x)})`; break;
      case 'zoom': o = ease.outCubic(x); tr = `scale(${1.3 - 0.3 * ease.outCubic(x)})`; break;
      case 'stamp': o = clamp(x * 4); tr = `scale(${2.2 - 1.2 * ease.outBack(x)}) rotate(${-14 * ease.outCubic(x)}deg)`; break;
      case 'fade': o = ease.outCubic(x); break;
      case 'none': break;
    }
    el.style.opacity = o;
    el.style.transform = (tr + ' ' + extra).trim();
    return x;
  }

  function fitText(el, maxPx, minPx) {
    let size = maxPx;
    el.style.fontSize = size + 'px';
    const over = () => el.scrollHeight > el.clientHeight + parseFloat(el.style.fontSize) * 0.2 || [...el.querySelectorAll('.w')].some((w) => w.offsetWidth > el.clientWidth + 2);
    while (size > minPx && over()) {
      size -= 2;
      el.style.fontSize = size + 'px';
    }
    el.dataset.fitted = size;
    el.dataset.overflow = over() ? '1' : '';
    el.dataset.minPx = minPx;
    return size;
  }

  RV.clamp = clamp;
  RV.ease = ease;
  RV.prog = prog;
  RV.appear = appear;
  RV.fitText = fitText;
  RV.h = function h(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  };
  RV.esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
})();
