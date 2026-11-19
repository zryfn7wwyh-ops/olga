/*
 * Runtime для автономной HTML-версии лендинга (без React/Next.js).
 * Повторяет интерактив: модальное окно, формы, FAQ, карточки услуг, схему этапов, мобильное меню.
 *
 * Отправка заявок: укажите LEAD_ENDPOINT (например, "https://ваш-домен.ru/api/leads").
 * Пока адрес не задан, форма НЕ имитирует успешную отправку и сообщает, что заявка не отправлена.
 */
(function () {
  "use strict";
  var LEAD_ENDPOINT = window.LP_LEAD_ENDPOINT || "";
  var STEPS = window.LP_STEPS || [];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function swap(el, remove, add) {
    remove.split(" ").forEach(function (c) { if (c) el.classList.remove(c); });
    add.split(" ").forEach(function (c) { if (c) el.classList.add(c); });
  }

  /* ---------- Год в подвале ---------- */
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

  /* ---------- Шапка ---------- */
  var header = $("header");
  var headerBar = header && header.querySelector(".container-lp");
  var COMPACT = "border-[var(--on-dark-stroke)] bg-navy-deep/95 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.6)] backdrop-blur-md";
  var FULL = "border-transparent bg-navy-deep";
  var menu = $("#mobile-menu");
  var toggle = $('button[aria-controls="mobile-menu"]');
  function updateHeader() {
    var compact = window.scrollY > 24 || (menu && !menu.hidden);
    if (!header) return;
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
  if (toggle) {
    toggle.addEventListener("click", function () { setMenu(menu.hidden); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
    document.addEventListener("pointerdown", function (e) {
      if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1024) setMenu(false); });
  }

  /* ---------- Модальное окно ---------- */
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
      document.documentElement.style.overflow = "hidden";
      var first = dialog.querySelector('input[name="name"]');
      if (first) first.focus();
    });
  });
  if (dialog) {
    var downOnBackdrop = false;
    dialog.addEventListener("mousedown", function (e) { downOnBackdrop = e.target === dialog; });
    dialog.addEventListener("click", function (e) { if (e.target === dialog && downOnBackdrop) dialog.close(); });
    var closeBtn = dialog.querySelector('button[aria-label="Закрыть окно"]');
    if (closeBtn) closeBtn.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("close", function () {
      document.documentElement.style.overflow = "";
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    });
  }

  /* ---------- Аккордеоны: FAQ и карточки услуг ---------- */
  function setupAccordion(btn, onToggle) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      panel.setAttribute("data-open", String(open));
      if (open) panel.removeAttribute("inert"); else panel.setAttribute("inert", "");
      onToggle(open);
    });
  }
  $$("#faq button[aria-controls]").forEach(function (btn) {
    var icon = btn.querySelector("span[aria-hidden]");
    setupAccordion(btn, function (open) {
      if (!icon) return;
      if (open) swap(icon, "border-stroke text-ink group-hover:border-navy/40", "rotate-45 border-navy bg-navy text-ivory");
      else swap(icon, "rotate-45 border-navy bg-navy text-ivory", "border-stroke text-ink group-hover:border-navy/40");
    });
  });
  $$("#services article button[aria-controls]").forEach(function (btn) {
    var svg = btn.querySelector("svg");
    var label = null;
    btn.childNodes.forEach(function (n) { if (n.nodeType === 3 && n.textContent.trim()) label = n; });
    setupAccordion(btn, function (open) {
      if (svg) svg.classList.toggle("rotate-45", open);
      if (label) label.textContent = open ? "Свернуть" : "Подробнее";
    });
  });

  /* ---------- Схема этапов (вкладки) ---------- */
  var tabs = $$('[role="tab"]');
  var tabPanel = $('[role="tabpanel"]');
  var tablist = $('[role="tablist"]');
  var progress = tablist ? tablist.querySelectorAll(":scope > span")[1] : null;
  var BTN_ON = "border-gold/60 bg-white/[0.04]";
  var BTN_OFF = "border-[var(--on-dark-stroke)] hover:border-gold/40";
  var DOT_ON = "border-gold bg-gold text-navy-deep";
  var DOT_PASSED = "border-gold bg-navy-deep text-gold-soft";
  var DOT_OFF = "border-[var(--on-dark-stroke)] bg-navy-deep text-ivory/80 group-hover:border-gold/60";
  var activeTab = 0;
  function selectTab(i, focus) {
    activeTab = i;
    tabs.forEach(function (t, j) {
      var selected = j === i;
      var dot = t.children[0];
      var title = t.children[1];
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      swap(t, BTN_ON + " " + BTN_OFF, selected ? BTN_ON : BTN_OFF);
      swap(dot, DOT_ON + " " + DOT_PASSED + " " + DOT_OFF, selected ? DOT_ON : j <= i ? DOT_PASSED : DOT_OFF);
      swap(title, "text-ivory text-ivory/75", selected ? "text-ivory" : "text-ivory/75");
    });
    if (progress) progress.style.width = (i / (tabs.length - 1)) * 80 + "%";
    if (tabPanel && STEPS[i]) {
      tabPanel.setAttribute("aria-labelledby", tabs[i].id);
      var ps = tabPanel.querySelectorAll("p");
      ps[0].innerHTML = '<span class="mr-3 text-ivory/50 lining-nums tabular-nums">0' + (i + 1) + "</span>";
      ps[0].appendChild(document.createTextNode(STEPS[i].title));
      ps[1].textContent = STEPS[i].text;
    }
    if (focus) tabs[i].focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(i); });
    t.addEventListener("mouseenter", function () { selectTab(i); });
    t.addEventListener("keydown", function (e) {
      var last = tabs.length - 1, next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = activeTab === last ? 0 : activeTab + 1;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = activeTab === 0 ? last : activeTab - 1;
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = last;
      if (next === null) return;
      e.preventDefault();
      selectTab(next, true);
    });
  });

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

  function fieldWrap(el) {
    if (el.name === "consent") return el.closest("label").parentElement;
    if (el.parentElement.classList.contains("relative")) return el.parentElement.parentElement;
    return el.parentElement;
  }
  function setError(el, message) {
    var wrap = fieldWrap(el);
    var id = el.id + "-error";
    var existing = document.getElementById(id);
    var hint = wrap.querySelector('[id$="-hint"]');
    if (message) {
      if (!existing) {
        existing = document.createElement("p");
        existing.id = id;
        existing.className = el.name === "consent" ? "mt-2 pl-[38px] text-[14px] text-danger" : "mt-1.5 text-[14px] text-danger";
        wrap.appendChild(existing);
      }
      existing.textContent = message;
      if (hint) hint.hidden = true;
      el.setAttribute("aria-invalid", "true");
      el.setAttribute("aria-describedby", id);
    } else {
      if (existing) existing.remove();
      if (hint) hint.hidden = false;
      el.removeAttribute("aria-invalid");
      if (hint) el.setAttribute("aria-describedby", hint.id); else el.removeAttribute("aria-describedby");
    }
    if (el.name === "consent") {
      swap(el, "border-danger border-[#9aa3a8]", message ? "border-danger" : "border-[#9aa3a8]");
    } else {
      swap(el, "border-danger border-stroke hover:border-[#b9bfbd]", message ? "border-danger" : "border-stroke hover:border-[#b9bfbd]");
    }
  }
  function validateField(el) {
    var v = el.type === "checkbox" ? el.checked : el.value.trim();
    switch (el.name) {
      case "name": return v.length < 2 ? "Укажите имя" : "";
      case "phone": return !v || v === "+7" ? "Укажите телефон" : isValidPhone(v) ? "" : "Проверьте номер: например, +7 (999) 123-45-67";
      case "city": return v.length < 2 ? "Укажите город или регион" : "";
      case "specialization": return v ? "" : "Выберите специализацию";
      case "consent": return v ? "" : "Необходимо согласие на обработку персональных данных";
      default: return "";
    }
  }

  function showFormAlert(form, text) {
    var box = form.querySelector("[data-form-alert]");
    if (!box) {
      box = document.createElement("div");
      box.setAttribute("role", "alert");
      box.setAttribute("data-form-alert", "");
      box.className = "mt-6 flex gap-3 rounded-[10px] border border-danger/30 bg-danger/[0.05] px-4 py-3 text-[15px] text-ink";
      var submitRow = form.querySelector('button[type="submit"]').parentElement;
      form.insertBefore(box, submitRow);
    }
    box.textContent = text;
  }

  $$("form").forEach(function (form) {
    var inDialog = !!form.closest("dialog");
    var fields = $$("input[name], select[name], textarea[name]", form).filter(function (el) {
      return el.name !== "company_url";
    });
    var submit = form.querySelector('button[type="submit"]');
    var submitHtml = submit.innerHTML;
    var phone = form.querySelector('input[name="phone"]');
    var touched = {};

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
    fields.forEach(function (el) {
      el.addEventListener("blur", function () {
        if (el.type === "checkbox") return;
        touched[el.name] = true;
        setError(el, validateField(el));
      });
      el.addEventListener(el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input", function () {
        if (el.tagName === "SELECT") swap(el, "text-muted-text", el.value ? "" : "text-muted-text");
        if (touched[el.name] || el.type === "checkbox" || el.tagName === "SELECT") {
          touched[el.name] = true;
          setError(el, validateField(el));
        }
        var alert = form.querySelector("[data-form-alert]");
        if (alert) alert.remove();
      });
    });

    var busy = false;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      var firstInvalid = null;
      fields.forEach(function (el) {
        touched[el.name] = true;
        var msg = validateField(el);
        setError(el, msg);
        if (msg && !firstInvalid) firstInvalid = el;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      if (!LEAD_ENDPOINT) {
        showFormAlert(form, "Это демонстрационная HTML-версия страницы: отправка заявок в ней не подключена. Заявка не отправлена.");
        return;
      }

      busy = true;
      submit.disabled = true;
      submit.innerHTML = '<span>Отправляем…</span>';
      var data = {};
      fields.forEach(function (el) { data[el.name] = el.type === "checkbox" ? el.checked : el.value.trim() || undefined; });
      var utm = {};
      var params = new URLSearchParams(location.search);
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (k) {
        if (params.get(k)) utm[k] = params.get(k);
      });
      var honeypot = form.querySelector('input[name="company_url"]');
      fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variant: inDialog ? "short" : "full",
          form_source: inDialog ? currentSource : "lead_section",
          fields: data,
          utm: utm,
          page_url: location.href.split("#")[0],
          referrer: document.referrer || undefined,
          company_url: honeypot && honeypot.value ? honeypot.value : undefined,
        }),
      })
        .then(function (res) { return res.json().catch(function () { return null; }).then(function (j) { return { res: res, json: j }; }); })
        .then(function (r) {
          if (r.res.ok && r.json && r.json.ok) {
            form.innerHTML =
              '<div tabindex="-1" role="status" class="flex flex-col items-start gap-4 py-4 outline-none">' +
              '<p class="h3">Спасибо! Заявка отправлена.</p>' +
              '<p class="text-muted-text">Мы свяжемся с вами по указанному номеру.</p></div>';
            form.firstChild.focus();
            return;
          }
          showFormAlert(form, (r.json && r.json.message) || "Не удалось отправить заявку. Попробуйте ещё раз.");
        })
        .catch(function () {
          showFormAlert(form, "Не удалось связаться с сервером. Проверьте подключение к интернету и попробуйте ещё раз.");
        })
        .then(function () {
          busy = false;
          if (submit.isConnected) { submit.disabled = false; submit.innerHTML = submitHtml; }
        });
    });
  });
})();
