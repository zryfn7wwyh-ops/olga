// Анимация маскота. Только безопасные движения целого изображения (перемещение, масштаб,
// поворот, покачивание, «сжатие-растяжение»), смена готовых поз. Оригинальные изображения не изменяются и не отражаются.
(function () {
  const RV = (window.RV = window.RV || {});
  const { ease, prog, clamp } = RV;

  function placement(position, W, H, aspect, sizeOpt) {
    const v = H > W * 1.2;
    const sq = !v && H > W * 0.8;
    let size, x, bottom;
    if (v) {
      const base = { right: 560, left: 560, center: 620, hero: 800, small: 460, 'small-left': 460, peek: 640 }[position] || 560;
      size = sizeOpt || base;
      const floor = 1405;
      x = {
        right: W - size * 0.86, left: -size * 0.14, center: (W - size) / 2, hero: (W - size) / 2,
        small: W - size - 30, 'small-left': 30, peek: (W - size) / 2,
      }[position] ?? W - size * 0.86;
      bottom = position === 'peek' ? floor + size * 0.18 : floor;
    } else {
      size = sizeOpt || (sq ? H * 0.58 : H * 0.62);
      x = { left: W * 0.02, center: (W - size) / 2, hero: (W - size) / 2 }[position] ?? W - size - W * 0.04;
      bottom = H - 40;
    }
    return { size, x, bottom };
  }

  RV.createMascot = function (parent, cfg, ctx) {
    const { W, H, poses: manifest, sceneDur } = ctx;
    const el = RV.h('div', 'mascot');
    const shadow = RV.h('div', 'shadow');
    el.appendChild(shadow);
    const timeline = [{ at: 0, pose: cfg.pose }, ...(cfg.poses || [])].sort((a, b) => a.at - b.at);
    const imgs = {};
    let aspect = 1;
    for (const { pose } of timeline) {
      if (imgs[pose]) continue;
      const info = manifest[pose];
      if (!info) throw new Error('Неизвестная поза маскота: ' + pose);
      const img = new Image();
      img.src = ctx.root + info.path;
      img.dataset.pose = pose;
      img.style.opacity = 0;
      // scale — выравнивание размера тела между позами (у поз с вытянутыми руками картинка шире)
      const sc = info.scale || 1;
      img.style.width = sc * 100 + '%';
      img.style.left = ((1 - sc) / 2) * 100 + '%';
      imgs[pose] = img;
      el.appendChild(img);
      if (pose === cfg.pose && info.width) aspect = (info.height / info.width) * sc;
    }
    const pl = placement(cfg.position || 'right', W, H, aspect, cfg.size);
    el.style.width = pl.size + 'px';
    el.style.height = pl.size * aspect + 'px';
    el.style.left = pl.x + 'px';
    el.style.top = pl.bottom - pl.size * aspect + 'px';
    parent.appendChild(el);

    // Реплика в «пузыре»
    let say = null;
    if (cfg.say) {
      say = RV.h('div', 'say', RV.esc(cfg.say.text || cfg.say));
      parent.appendChild(say);
      const left = cfg.position === 'left' || cfg.position === 'small-left';
      say.style.top = pl.bottom - pl.size * aspect - 90 + 'px';
      if (left) say.style.left = Math.max(40, pl.x + pl.size * 0.55) + 'px';
      else say.style.right = Math.max(40, W - (pl.x + pl.size * 0.5)) + 'px';
    }

    // Указатель (стрелка) — вместо отсутствующей позы «указывает рукой»
    let pointer = null;
    if (cfg.point) {
      pointer = RV.h('div', 'pointer', RV.pointerSvg);
      parent.appendChild(pointer);
    }

    const enter = cfg.enter || 'slide';
    const enterAt = cfg.enterAt ?? 0.05;
    const action = cfg.action || null;
    const actionAt = cfg.actionAt ?? 0.75;
    const fromRight = (cfg.position || 'right') !== 'left' && cfg.position !== 'small-left';
    const seed = (cfg.pose || '').length;

    return {
      el,
      bounds: () => ({ x: pl.x, y: pl.bottom - pl.size * aspect, w: pl.size, h: pl.size * aspect }),
      setPointTarget(rect) { this.target = rect; },
      update(t, amp) {
        // Поза в момент t
        let cur = timeline[0], prevPose = null, swapT = 99;
        for (const k of timeline) if (t >= k.at) { prevPose = cur.pose; cur = k; swapT = t - k.at; }
        for (const [pose, img] of Object.entries(imgs)) {
          let o = pose === cur.pose ? 1 : 0;
          if (swapT < 0.12 && cur.at > 0) o = pose === cur.pose ? swapT / 0.12 : pose === prevPose ? 1 - swapT / 0.12 : 0;
          img.style.opacity = o;
        }
        let tx = 0, ty = 0, sc = 1, rot = 0, sx = 1, sy = 1, op = 1;
        // Появление
        const e = prog(t, enterAt, 0.6);
        if (enter === 'slide') tx = (1 - ease.outBack(e)) * (fromRight ? 700 : -700);
        else if (enter === 'rise') ty = (1 - ease.outBack(e)) * 700;
        else if (enter === 'pop') { sc *= 0.2 + 0.8 * ease.outBack(e); op = clamp(e * 4); }
        else if (enter === 'drop') { ty = -(1 - ease.outCubic(e)) * 900; if (e >= 1) { const b = prog(t, enterAt + 0.6, 0.35); sy *= 1 - Math.sin(b * Math.PI) * 0.12; sx *= 1 + Math.sin(b * Math.PI) * 0.08; } }
        // Покачивание в покое
        const idle = t * 2.1 + seed;
        ty += Math.sin(idle) * 9;
        rot += Math.sin(t * 1.3 + seed) * 1.6;
        // «Говорение» — сжатие/растяжение по громкости речи
        const a = amp || 0;
        sy *= 1 + a * 0.05;
        sx *= 1 - a * 0.025;
        ty -= a * 8;
        // Смена позы — короткое «сжатие»
        if (swapT < 0.25 && cur.at > 0) { const s = Math.sin((swapT / 0.25) * Math.PI); sy *= 1 - s * 0.08; sx *= 1 + s * 0.05; }
        // Действие
        if (action) {
          const at = t - actionAt;
          if (at >= 0) {
            if (action === 'jump') { const k = clamp(at / 0.7); ty -= Math.abs(Math.sin(k * Math.PI * 2)) * 90 * (1 - k); }
            if (action === 'shake') { const k = clamp(at / 0.8); rot += Math.sin(at * 38) * 7 * (1 - k); }
            if (action === 'nod') { const k = clamp(at / 0.9); ty += Math.sin(k * Math.PI * 3) * 18 * (1 - k); }
            if (action === 'tilt') { rot += -7 * ease.outCubic(clamp(at / 0.5)); }
            if (action === 'zoom') { const k = clamp(at / 0.6); sc *= 1 + 0.14 * ease.outBack(k); }
            if (action === 'wiggle') { rot += Math.sin(at * 9) * 4; }
            if (action === 'lean') { tx += (fromRight ? -1 : 1) * 40 * ease.outCubic(clamp(at / 0.5)); rot += (fromRight ? -1 : 1) * 5 * ease.outCubic(clamp(at / 0.5)); }
          }
        }
        el.style.opacity = op;
        el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${sc * sx}, ${sc * sy})`;
        shadow.style.transform = `translateY(${-ty * 0.6 + a * 8}px) scaleX(${1 - Math.min(0.3, Math.abs(Math.min(0, ty)) / 400)})`;
        shadow.style.opacity = op * (0.9 - Math.min(0.5, Math.abs(Math.min(0, ty)) / 300));

        if (say) {
          const sAt = cfg.say.at ?? 0.6;
          RV.appear(say, t, sAt, 'pop', 0.4);
          if (cfg.say.until && t > cfg.say.until) say.style.opacity = Math.max(0, 1 - (t - cfg.say.until) / 0.25);
        }
        if (pointer) {
          const pAt = cfg.pointAt ?? actionAt;
          const b = this.bounds();
          const tg = this.target || { x: W * 0.3, y: H * 0.3, w: 10, h: 10 };
          const mx = b.x + b.w * 0.45 + tx, my = b.y + b.h * 0.3;
          const gx = tg.x + tg.w / 2, gy = tg.y + tg.h / 2;
          const ang = Math.atan2(gy - my, gx - mx);
          const dist = Math.hypot(gx - mx, gy - my);
          const k = ease.outBack(prog(t, pAt, 0.45));
          const bob = Math.sin(t * 8) * 14;
          const along = Math.min(dist * 0.42, 330) + bob;
          const px = mx + Math.cos(ang) * along - 75, py = my + Math.sin(ang) * along - 75;
          pointer.style.left = px + 'px';
          pointer.style.top = py + 'px';
          pointer.style.opacity = clamp(prog(t, pAt, 0.2));
          pointer.style.transform = `rotate(${ang}rad) scale(${k})`;
        }
      },
    };
  };
})();
