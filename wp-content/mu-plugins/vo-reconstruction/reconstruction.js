/* Таймер «До выпуска осталось» на макете телефона (первый экран).
   Отсчёт до ближайшей среды 14:00 по Москве (UTC+3): срок приёма заявок в текущий номер
   из текста главной. Сверено со скриншотом: чт 05.11.2026 09:10 → «6 : 4 : 49». */
(function () {
	function nextDeadline(now) {
		var msk = new Date(now.getTime() + 3 * 3600e3);           // «московские» часы в полях UTC
		var d = new Date(Date.UTC(msk.getUTCFullYear(), msk.getUTCMonth(), msk.getUTCDate(), 14, 0, 0));
		var add = (3 - msk.getUTCDay() + 7) % 7;                   // 3 = среда
		d.setUTCDate(d.getUTCDate() + add);
		if (d <= msk) d.setUTCDate(d.getUTCDate() + 7);
		return d.getTime() - 3 * 3600e3;
	}
	function tick() {
		var left = Math.max(0, nextDeadline(new Date()) - Date.now());
		var mins = Math.floor(left / 60000);
		var v = { d: Math.floor(mins / 1440), h: Math.floor(mins % 1440 / 60), m: mins % 60 };
		document.querySelectorAll('[data-vo-countdown] [data-unit]').forEach(function (el) {
			el.textContent = v[el.getAttribute('data-unit')];
		});
	}
	tick();
	setInterval(tick, 15000);
})();
