/* Лёгкий runtime для автономного превью (без React): повторяет интерактивы прототипа. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header: уменьшение при прокрутке
  var header = $("header"), bar = header && header.firstElementChild;
  function onScroll() {
    var s = scrollY > 24;
    bar.classList.toggle("h-16", s);
    bar.classList.toggle("h-[72px]", !s);
    bar.classList.toggle("lg:h-[88px]", !s);
    header.classList.toggle("bg-ink/95", s);
    header.classList.toggle("border-slate-2", s);
    header.classList.toggle("backdrop-blur-md", s);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Мобильное меню
  var burger = $('[aria-controls="mobile-menu"]'), menu = $("#mobile-menu");
  var burgerIcon = burger.innerHTML;
  function setMenu(open) {
    menu.hidden = !open; burger.setAttribute("aria-expanded", open);
    burger.innerHTML = open ? '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l12 12M18 6 6 18"/></svg>' : burgerIcon;
    document.documentElement.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { setMenu(menu.hidden); });
  $$("#mobile-menu a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { setMenu(false); burger.focus(); } });

  // Модальное окно «Обсудить задачу»
  var modal = $('dialog[aria-labelledby="contact-modal-title"]');
  $$('[aria-haspopup="dialog"]').forEach(function (b) {
    b.addEventListener("click", function () { if (!menu.hidden) setMenu(false); modal.showModal(); });
  });
  modal.addEventListener("click", function (e) { if (e.target === modal) modal.close(); });
  $('[aria-label="Закрыть окно"]', modal).addEventListener("click", function () { modal.close(); });

  // Универсальный accordion: кнопки с aria-expanded → .reveal[data-open]
  function toggle(btn, open) {
    btn.setAttribute("aria-expanded", open);
    var r = document.getElementById(btn.getAttribute("aria-controls"));
    if (r) r.setAttribute("data-open", open);
    var plus = btn.querySelector("svg.rotate-45, svg:last-child");
    if (plus && btn.closest("#faq, #expertise")) plus.classList.toggle("rotate-45", open);
  }
  function group(selector, exclusive, onOpen) {
    var btns = $$(selector);
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var open = b.getAttribute("aria-expanded") !== "true";
        if (exclusive) btns.forEach(function (o) { if (o !== b) toggle(o, false); });
        toggle(b, open);
        if (onOpen) onOpen(b, open);
      });
    });
    return btns;
  }
  group("#faq button[aria-expanded]", true);
  group('#expertise button[id^="acc-btn-"]', true);
  group("#cases h3 > button[aria-expanded]", false, function (b, open) {
    var lbl = b.querySelector("span:last-child");
    if (lbl && lbl.firstChild) lbl.firstChild.textContent = open ? "Свернуть" : "Открыть кейс";
    var arr = lbl && lbl.querySelector("[aria-hidden]"); if (arr) arr.classList.toggle("rotate-180", open);
  });
  // «Сложные процедуры»: hover / focus / tap
  var cx = group('section[aria-labelledby="complex-title"] button[aria-expanded]', true, restyleCx);
  function restyleCx() {
    cx.forEach(function (b) {
      var o = b.getAttribute("aria-expanded") === "true", s = b.children;
      s[0].classList.toggle("text-bronze", o); s[0].classList.toggle("text-mist/60", !o);
      s[1].classList.toggle("w-8", o); s[1].classList.toggle("w-3", !o);
      s[2].classList.toggle("text-ivory", o); s[2].classList.toggle("text-ivory/75", !o);
    });
  }
  cx.forEach(function (b) {
    var li = b.closest("li");
    li.addEventListener("mouseenter", function () { cx.forEach(function (o) { toggle(o, o === b); }); restyleCx(); });
    b.addEventListener("focus", function () { cx.forEach(function (o) { toggle(o, o === b); }); restyleCx(); });
  });
  var cxList = cx.length && cx[0].closest("ol");
  if (cxList) cxList.addEventListener("mouseleave", function () { cx.forEach(function (o) { toggle(o, false); }); restyleCx(); });

  // Экспертиза: вертикальные табы (контент берётся из мобильного accordion)
  var tabs = $$('#expertise [role="tab"]'), panel = $('#expertise [role="tabpanel"]');
  function selectTab(i) {
    tabs.forEach(function (t, k) {
      var a = k === i;
      t.setAttribute("aria-selected", a); t.tabIndex = a ? 0 : -1;
      t.classList.toggle("text-text", a); t.classList.toggle("text-muted", !a);
      t.children[0].classList.toggle("scale-y-100", a); t.children[0].classList.toggle("scale-y-0", !a);
      t.children[1].classList.toggle("text-bronze", a); t.children[1].classList.toggle("text-muted", !a);
      t.children[3].classList.toggle("opacity-100", a); t.children[3].classList.toggle("opacity-0", !a);
    });
    var id = tabs[i].id.replace("tab-", ""), src = $("#acc-" + id + " .pb-8 > div");
    var wrap = panel.firstElementChild, accBtn = $("#acc-btn-" + id);
    $("h3", wrap).textContent = accBtn.children[1].textContent;
    wrap.querySelector("h3 + span").textContent = accBtn.children[0].textContent;
    wrap.children[1].innerHTML = src.outerHTML;
    panel.id = "panel-" + id; panel.setAttribute("aria-labelledby", tabs[i].id);
    if (!reduce) { wrap.style.animation = "none"; void wrap.offsetWidth; wrap.style.animation = ""; }
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(i); });
    t.addEventListener("keydown", function (e) {
      var n = tabs.length, nx = { ArrowDown: (i + 1) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
      if (nx !== undefined) { e.preventDefault(); selectTab(nx); tabs[nx].focus(); }
    });
  });

  // Слайдеры на scroll-snap
  function slider(ul, nav) {
    var items = Array.prototype.slice.call(ul.children);
    var counter = $("[aria-live] span", nav), prev = $('[aria-label="Предыдущий"]', nav), next = $('[aria-label="Следующий"]', nav);
    var pad = function () { return parseFloat(getComputedStyle(ul).scrollPaddingLeft) || 0; };
    var idx = 0, loop = !prev.hasAttribute("disabled") || ul.closest("#reviews");
    function update() {
      var best = 0, d = Infinity;
      items.forEach(function (s, i) { var x = Math.abs(s.offsetLeft - ul.offsetLeft - ul.scrollLeft - pad()); if (x < d) { d = x; best = i; } });
      idx = best; counter.textContent = String(best + 1).padStart(2, "0");
      if (!loop) { prev.disabled = ul.scrollLeft <= 4; next.disabled = ul.scrollLeft + ul.clientWidth >= ul.scrollWidth - 4; }
    }
    function go(i) {
      i = loop ? (i + items.length) % items.length : Math.max(0, Math.min(items.length - 1, i));
      ul.scrollTo({ left: items[i].offsetLeft - ul.offsetLeft - pad(), behavior: reduce ? "auto" : "smooth" });
    }
    ul.addEventListener("scroll", update, { passive: true }); addEventListener("resize", update);
    prev.addEventListener("click", function () { go(idx - 1); }); next.addEventListener("click", function () { go(idx + 1); });
    update();
  }
  var docsList = $('ul[aria-label="Документы"]');
  slider(docsList, $('[aria-label="Навигация по документам"]'));
  slider($("#reviews ul"), $('[aria-label="Навигация по отзывам"]'));

  // Lightbox документов
  var lb = $('dialog[aria-label="Документ"]'), docs = $$("li > button", docsList), cur = 0;
  function renderLb() {
    var b = docs[cur], t = b.children[1].textContent, meta = b.children[2].textContent.replace(/(уточняется)/, "$1 · ");
    var prevSvg = '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5m6-6-6 6 6 6"/></svg>';
    var nextSvg = '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
    var preview = b.querySelector(".relative.mx-auto, img").outerHTML.replace("mt-[12%] font-serif text-[15px]", "mt-[10%] font-serif text-[clamp(20px,3vw,32px)]");
    lb.setAttribute("aria-label", "Документ: " + t);
    lb.innerHTML = '<div class="flex h-full flex-col"><div class="container-x flex items-center justify-between gap-4 py-4"><div><p class="text-[15px] font-semibold">' + t + '</p><p class="text-[13px] text-mist">' + meta + '</p></div><div class="flex items-center gap-4"><span class="tech tabular text-mist">' + String(cur + 1).padStart(2, "0") + " / " + String(docs.length).padStart(2, "0") + '</span><button type="button" data-x aria-label="Закрыть" class="grid h-11 w-11 place-items-center border border-slate-2 hover:border-mist"><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div></div><div class="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-8 sm:px-20"><div class="aspect-[3/4] h-full max-h-[calc(100dvh-140px)] max-w-full motion-safe:animate-[fade_250ms_var(--ease-premium)]">' + preview + '</div><button type="button" data-p aria-label="Предыдущий документ" class="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-slate-2 bg-ink/70 hover:border-mist sm:left-6">' + prevSvg + '</button><button type="button" data-n aria-label="Следующий документ" class="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-slate-2 bg-ink/70 hover:border-mist sm:right-6">' + nextSvg + "</button></div></div>";
  }
  function step(d) { cur = (cur + d + docs.length) % docs.length; renderLb(); }
  docs.forEach(function (b, i) { b.addEventListener("click", function () { cur = i; renderLb(); lb.showModal(); }); });
  lb.addEventListener("click", function (e) {
    if (e.target === lb || e.target.closest("[data-x]")) lb.close();
    else if (e.target.closest("[data-p]")) step(-1);
    else if (e.target.closest("[data-n]")) step(1);
  });
  lb.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); });

  // Карта: в превью встраивание сторонних сайтов недоступно — показываем ссылку
  $$("iframe").forEach(function (f) { f.remove(); });
  var mapBox = $("#contacts .bg-slate");
  if (mapBox) {
    var tabsMap = $$('#contacts [role="tablist"] button');
    var routes = $$('#contacts dl a[href*="yandex.ru/maps"]');
    function showMap(i) {
      tabsMap.forEach(function (t, k) {
        var a = k === i; t.setAttribute("aria-selected", a);
        ["border-mist", "bg-ivory", "text-ink"].forEach(function (c) { t.classList.toggle(c, a); });
        ["border-slate-2", "text-mist"].forEach(function (c) { t.classList.toggle(c, !a); });
      });
      mapBox.innerHTML = '<div class="absolute inset-0 grid place-items-center p-6 text-center text-mist"><div><p class="tech">Яндекс Карта · ' + tabsMap[i].textContent + '</p><p class="mt-3 text-[14px] text-mist/80">На сайте здесь загружается карта (lazy-load). В превью встраивание недоступно.</p><a class="link mt-4 inline-flex min-h-11 items-center gap-2" target="_blank" rel="noopener noreferrer" href="' + (routes[i] ? routes[i].href : "#") + '">Открыть в Яндекс Картах →</a></div></div>';
    }
    tabsMap.forEach(function (t, i) { t.addEventListener("click", function () { showMap(i); }); });
    showMap(0);
  }
})();
