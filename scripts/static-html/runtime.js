/*
 * Runtime автономной HTML-версии лендинга (без React/Next.js).
 * Повторяет интерактив: меню, модальное окно, форма, раскрывающиеся этапы и FAQ, лайтбокс, липкая кнопка.
 *
 * Отправка заявок: window.LP_LEAD_ENDPOINT (например, "https://ваш-домен.ru/api/leads").
 * Пока адрес не задан — демо-режим: «Демо: заявка не отправлена», без ложного «Спасибо».
 */
(function () {
  "use strict";
  var LEAD_ENDPOINT = window.LP_LEAD_ENDPOINT || "";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function swap(el, remove, add) {
    remove.split(" ").forEach(function (c) { if (c) el.classList.remove(c); });
    add.split(" ").forEach(function (c) { if (c) el.classList.add(c); });
  }
  function lockScroll(on) { document.documentElement.style.overflow = on ? "hidden" : ""; }

  $$("[data-current-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Появление секций ---------- */
  var revealItems = $$("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealItems.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Шапка и мобильное меню ---------- */
  var header = $("header");
  var headerBar = header && header.querySelector(".container-lp");
  var COMPACT = "border-[var(--on-dark-stroke)] bg-navy-deep/95 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.6)] backdrop-blur-md";
  var FULL = "border-transparent bg-navy-deep";
  var menu = $("#mobile-menu");
  var toggle = $('button[aria-controls="mobile-menu"]');
  function updateHeader() {
    if (!header) return;
    var compact = window.scrollY > 24 || (menu && !menu.hidden);
    if (compact) swap(header, FULL, COMPACT); else swap(header, COMPACT, FULL);
    if (headerBar) {
      if (window.scrollY > 24) swap(headerBar, "h-[var(--header-h)]", "h-[var(--header-h-compact)]");
      else swap(headerBar, "h-[var(--header-h-compact)]", "h-[var(--header-h)]");
    }
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  var ICON_MENU = '<path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path>';
  var ICON_X = '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>';
  function setMenu(open) {
    if (!menu || !toggle) return;
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    var svg = toggle.querySelector("svg");
    if (svg) svg.innerHTML = open ? ICON_X : ICON_MENU;
    updateHeader();
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () { setMenu(menu.hidden); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { setMenu(false); toggle.focus(); } });
    document.addEventListener("pointerdown", function (e) {
      if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1024) setMenu(false); });
  }

  /* ---------- Модальное окно заявки ---------- */
  var dialog = $("dialog.lead-dialog");
  var opener = null;
  var currentSource = "hero_primary";
  $$('button[aria-haspopup="dialog"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!dialog) return;
      opener = btn;
      currentSource = btn.getAttribute("data-form-source") || "hero_primary";
      if (menu && !menu.hidden) setMenu(false);
      dialog.showModal();
      lockScroll(true);
      var first = dialog.querySelector('input[name="name"]');
      if (first) first.focus();
    });
  });
  function wireDialog(d, onClose) {
    var down = false;
    d.addEventListener("mousedown", function (e) { down = e.target === d; });
    d.addEventListener("click", function (e) { if (e.target === d && down) d.close(); });
    d.addEventListener("close", function () { lockScroll(false); if (onClose) onClose(); });
  }
  if (dialog) {
    wireDialog(dialog, function () { if (opener && document.contains(opener)) opener.focus({ preventScroll: true }); });
    var closeBtn = dialog.querySelector('button[aria-label="Закрыть окно"]');
    if (closeBtn) closeBtn.addEventListener("click", function () { dialog.close(); });
  }

  /* ---------- Аккордеоны: этапы продвижения и FAQ ---------- */
  function setAccordion(btn, panel, open) {
    var faqIcon = btn.closest("#faq") ? btn.querySelector("span[aria-hidden]") : null;
    var label = btn.querySelector("[data-label]");
    var icon = btn.querySelector("svg");
    var isDisclosure = btn.hasAttribute("data-label-open");
    btn.setAttribute("aria-expanded", String(open));
    panel.setAttribute("data-open", String(open));
    if (open) panel.removeAttribute("inert"); else panel.setAttribute("inert", "");
    if (faqIcon) {
      if (open) swap(faqIcon, "border-stroke text-ink group-hover:border-navy/40", "rotate-45 border-navy bg-navy text-ivory");
      else swap(faqIcon, "rotate-45 border-navy bg-navy text-ivory", "border-stroke text-ink group-hover:border-navy/40");
    } else if (icon) {
      icon.classList.toggle(isDisclosure ? "rotate-180" : "rotate-45", open);
    }
    if (label) {
      label.textContent = isDisclosure
        ? btn.getAttribute(open ? "data-label-open" : "data-label-closed")
        : open ? "Свернуть" : "Что входит";
    }
  }
  $$("button[aria-controls]").forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel || !panel.classList.contains("accordion-panel")) return;
    var wrap = btn.closest("[data-collapse-below]");
    if (wrap && window.innerWidth < Number(wrap.getAttribute("data-collapse-below"))) setAccordion(btn, panel, false);
    btn.addEventListener("click", function () {
      setAccordion(btn, panel, btn.getAttribute("aria-expanded") !== "true");
    });
  });

  /* ---------- Мобильный слайдер галереи ---------- */
  var slider = $("[data-slider]");
  if (slider) {
    var dots = $$("[data-slider-dots] > span");
    var count = $("[data-slider-count]");
    slider.addEventListener("scroll", function () {
      var first = slider.firstElementChild;
      if (!first) return;
      var i = Math.min(dots.length - 1, Math.round(slider.scrollLeft / (first.offsetWidth + 12)));
      dots.forEach(function (d, j) {
        if (j === i) swap(d, "w-1.5 bg-navy/25", "w-6 bg-gold"); else swap(d, "w-6 bg-gold", "w-1.5 bg-navy/25");
      });
      if (count) count.textContent = i + 1 + " / " + dots.length + " · листайте";
    }, { passive: true });
  }

  /* ---------- Лайтбокс галереи кейса ---------- */
  var lightbox = $("dialog.lightbox-dialog");
  var galleryBtns = $$('#case button[aria-label^="Открыть изображение"]');
  var lbIndex = 0;
  var lbOpener = null;
  function renderLightbox() {
    var btn = galleryBtns[lbIndex];
    var img = btn.querySelector("img");
    var title = btn.getAttribute("aria-label").replace("Открыть изображение: ", "");
    var badge = btn.querySelector("span.absolute.z-10");
    lightbox.innerHTML =
      '<div class="relative flex w-full flex-col">' +
      '<div class="relative overflow-hidden rounded-[12px] bg-ivory" style="max-height:calc(100dvh - 110px)">' +
      '<img src="' + img.getAttribute("src") + '" alt="' + (img.getAttribute("alt") || "") + '" style="display:block;width:100%;max-height:calc(100dvh - 110px);object-fit:contain">' +
      (badge ? badge.outerHTML : "") + "</div>" +
      '<div class="mt-4 flex items-center justify-between gap-4 text-ivory"><p class="text-[15px]"><span class="mr-2 font-serif text-gold-soft">' +
      (lbIndex + 1) + " / " + galleryBtns.length + "</span>" + title + "</p>" +
      '<div class="flex gap-2">' +
      lbButton("prev", "Предыдущее изображение", "‹") + lbButton("next", "Следующее изображение", "›") + lbButton("close", "Закрыть", "×") +
      "</div></div></div>";
    lightbox.setAttribute("aria-label", title);
    $$("[data-lb]", lightbox).forEach(function (b) {
      b.addEventListener("click", function () {
        var a = b.getAttribute("data-lb");
        if (a === "close") lightbox.close(); else step(a === "next" ? 1 : -1);
      });
    });
  }
  function lbButton(action, label, glyph) {
    return '<button type="button" data-lb="' + action + '" aria-label="' + label +
      '" class="grid size-11 place-items-center rounded-full border border-white/25 text-[22px] leading-none text-ivory transition-colors hover:border-gold hover:text-gold-soft">' + glyph + "</button>";
  }
  function step(dir) { lbIndex = (lbIndex + dir + galleryBtns.length) % galleryBtns.length; renderLightbox(); }
  if (lightbox && galleryBtns.length) {
    galleryBtns.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        lbOpener = btn; lbIndex = i; renderLightbox(); lightbox.showModal(); lockScroll(true);
      });
    });
    wireDialog(lightbox, function () { if (lbOpener) lbOpener.focus({ preventScroll: true }); });
    lightbox.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
  }

  /* ---------- Мобильная липкая кнопка ---------- */
  var stickyBtn = $('[data-form-source="sticky_cta"]');
  var sticky = stickyBtn && stickyBtn.parentElement;
  var heroEl = $("#top");
  if (sticky && heroEl && "IntersectionObserver" in window) {
    var pastHero = false, nearForm = new Set();
    var apply = function () {
      var shown = pastHero && nearForm.size === 0 && !document.querySelector("dialog[open]");
      swap(sticky, "translate-y-0 pointer-events-none translate-y-full", shown ? "translate-y-0" : "pointer-events-none translate-y-full");
      sticky.setAttribute("aria-hidden", String(!shown));
      if (shown) sticky.removeAttribute("inert"); else sticky.setAttribute("inert", "");
    };
    new IntersectionObserver(function (es) { pastHero = !es[0].isIntersecting; apply(); }).observe(heroEl);
    var fio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) nearForm.add(e.target); else nearForm.delete(e.target); });
      apply();
    });
    [$("#lead"), $("footer")].forEach(function (t) { if (t) fio.observe(t); });
    var dmo = new MutationObserver(apply);
    $$("dialog").forEach(function (d) { dmo.observe(d, { attributes: true, attributeFilter: ["open"] }); });
  }

  /* ---------- Формы ---------- */
  function phoneDigits(raw) {
    var d = raw.replace(/\D/g, "");
    if (d.length === 11 && d.charAt(0) === "8") d = "7" + d.slice(1);
    if (d.length === 10 && raw.trim().charAt(0) !== "+") d = "7" + d;
    return d;
  }
  function isValidPhone(raw) {
    var t = raw.trim(), d = phoneDigits(t);
    if (t.charAt(0) === "+" && t.indexOf("+7") !== 0) return d.length >= 8 && d.length <= 15;
    return d.length === 11 && d.charAt(0) === "7" && /^[3-9]/.test(d.slice(1));
  }
  function formatPhone(raw) {
    var t = raw.replace(/^\s+/, "");
    if (t === "" || t === "+") return t;
    if (t.charAt(0) === "+" && t.indexOf("+7") !== 0) return "+" + t.replace(/\D/g, "").slice(0, 15);
    var d = t.replace(/\D/g, "");
    if (d.charAt(0) === "8" || d.charAt(0) === "7") d = d.slice(1);
    d = d.slice(0, 10);
    var out = "+7";
    if (d.length > 0) out += " (" + d.slice(0, 3);
    if (d.length >= 3) out += ")";
    if (d.length > 3) out += " " + d.slice(3, 6);
    if (d.length > 6) out += "-" + d.slice(6, 8);
    if (d.length > 8) out += "-" + d.slice(8, 10);
    return out;
  }
  function validateField(el) {
    var v = el.type === "checkbox" ? el.checked : el.value.trim();
    if (el.name === "name") return v.length < 2 ? "Укажите имя" : "";
    if (el.name === "phone") return !v || v === "+7" ? "Укажите телефон" : isValidPhone(v) ? "" : "Проверьте номер: например, +7 (999) 123-45-67";
    if (el.name === "consent") return v ? "" : "Необходимо согласие на обработку персональных данных";
    return "";
  }
  function fieldWrap(el) {
    if (el.name === "consent") return el.closest("label").parentElement;
    return el.parentElement;
  }
  function setError(el, message) {
    var id = el.id + "-error";
    var existing = document.getElementById(id);
    if (message) {
      if (!existing) {
        existing = document.createElement("p");
        existing.id = id;
        existing.className = el.name === "consent" ? "mt-2 pl-[38px] text-[14px] text-danger" : "mt-1.5 text-[14px] text-danger";
        fieldWrap(el).appendChild(existing);
      }
      existing.textContent = message;
      el.setAttribute("aria-invalid", "true");
      el.setAttribute("aria-describedby", id);
    } else {
      if (existing) existing.remove();
      el.removeAttribute("aria-invalid");
      el.removeAttribute("aria-describedby");
    }
    if (el.name === "consent") swap(el, "border-danger border-[#9aa3a8]", message ? "border-danger" : "border-[#9aa3a8]");
    else swap(el, "border-danger border-stroke hover:border-[#b9bfbd]", message ? "border-danger" : "border-stroke hover:border-[#b9bfbd]");
  }
  function statusBlock(title, text) {
    return '<div tabindex="-1" role="status" class="flex flex-col items-start gap-3 py-2 outline-none">' +
      '<p class="h3">' + title + '</p><p class="text-muted-text">' + text + "</p></div>";
  }
  function showAlert(form, text) {
    var box = form.querySelector("[data-form-alert]");
    if (!box) {
      box = document.createElement("div");
      box.setAttribute("role", "alert");
      box.setAttribute("data-form-alert", "");
      box.className = "mt-5 flex gap-3 rounded-[10px] border border-danger/30 bg-danger/[0.05] px-4 py-3 text-[15px] text-ink";
      var submit = form.querySelector('button[type="submit"]');
      form.insertBefore(box, submit);
    }
    box.textContent = text;
  }

  $$("form").forEach(function (form) {
    var inDialog = !!form.closest("dialog");
    var required = $$('input[name="name"], input[name="phone"], input[name="consent"]', form);
    var submit = form.querySelector('button[type="submit"]');
    var submitHtml = submit.innerHTML;
    var phone = form.querySelector('input[name="phone"]');
    var touched = {};
    var sent = new Set();

    if (phone) {
      var prev = "";
      phone.addEventListener("focus", function () { if (!phone.value) { phone.value = "+7 "; prev = phone.value; } });
      phone.addEventListener("input", function () {
        if (phone.value.length >= prev.length) phone.value = formatPhone(phone.value);
        prev = phone.value;
      });
      phone.addEventListener("blur", function () {
        var f = formatPhone(phone.value).trim();
        phone.value = f === "+7" || f === "+" ? "" : f;
        prev = phone.value;
      });
    }
    var spec = form.querySelector('select[name="specialization"]');
    if (spec) spec.addEventListener("change", function () { swap(spec, "text-muted-text", spec.value ? "" : "text-muted-text"); });

    required.forEach(function (el) {
      el.addEventListener("blur", function () {
        if (el.type === "checkbox") return;
        touched[el.name] = true;
        setError(el, validateField(el));
      });
      el.addEventListener(el.type === "checkbox" ? "change" : "input", function () {
        if (touched[el.name] || el.type === "checkbox") { touched[el.name] = true; setError(el, validateField(el)); }
        var alert = form.querySelector("[data-form-alert]");
        if (alert) alert.remove();
      });
    });

    var busy = false;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      var firstInvalid = null;
      required.forEach(function (el) {
        touched[el.name] = true;
        var msg = validateField(el);
        setError(el, msg);
        if (msg && !firstInvalid) firstInvalid = el;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      if (!LEAD_ENDPOINT) {
        form.innerHTML = statusBlock(
          "Демо: заявка не отправлена",
          "Это предпросмотр сайта. Форма проверила данные, но отправка в CRM ещё не подключена — заявка никуда не передана.",
        );
        form.firstChild.focus();
        return;
      }

      var phoneKey = phoneDigits(phone.value);
      if (sent.has(phoneKey)) return;
      busy = true;
      submit.disabled = true;
      submit.innerHTML = "<span>Отправляем…</span>";
      var fields = {};
      $$("input[name], select[name]", form).forEach(function (el) {
        if (el.name === "company_url") return;
        fields[el.name] = el.type === "checkbox" ? el.checked : el.value.trim() || undefined;
      });
      var utm = {};
      var params = new URLSearchParams(location.search);
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (k) { if (params.get(k)) utm[k] = params.get(k); });
      var honeypot = form.querySelector('input[name="company_url"]');
      fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_source: inDialog ? currentSource : "lead_section",
          fields: fields,
          utm: utm,
          page_url: location.href.split("#")[0],
          referrer: document.referrer || undefined,
          submission_id: phoneKey + "-" + Date.now(),
          company_url: honeypot && honeypot.value ? honeypot.value : undefined,
        }),
      })
        .then(function (res) { return res.json().catch(function () { return null; }).then(function (j) { return { res: res, json: j }; }); })
        .then(function (r) {
          if (r.res.ok && r.json && r.json.ok) {
            sent.add(phoneKey);
            form.innerHTML = r.json.mode === "demo"
              ? statusBlock("Демо: заявка не отправлена", "Отправка в CRM ещё не подключена — заявка никуда не передана.")
              : statusBlock("Спасибо! Заявка отправлена.", "Мы свяжемся с вами по указанному номеру.");
            form.firstChild.focus();
            return;
          }
          showAlert(form, (r.json && r.json.message) || "Не удалось отправить заявку. Попробуйте ещё раз.");
        })
        .catch(function () { showAlert(form, "Не удалось связаться с сервером. Проверьте подключение к интернету и попробуйте ещё раз."); })
        .then(function () {
          busy = false;
          if (submit.isConnected) { submit.disabled = false; submit.innerHTML = submitHtml; }
        });
    });
  });
})();
