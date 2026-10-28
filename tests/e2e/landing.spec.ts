import { expect, test } from "@playwright/test";
import { captureLeads, collectAnalytics } from "./helpers";

const hero = (page: import("@playwright/test").Page) => page.locator("#calc form");

test("AC-01: first screen shows service, estimate offer and the main form", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("рассчитаем стоимость");
  await expect(page.getByRole("button", { name: "Получить предварительный расчёт" }).first()).toBeInViewport();
});

test("AC-02: menu links lead to anchors not hidden by the sticky header", async ({ page }) => {
  await page.goto("/");
  for (const [label, id] of [
    ["Виды сайтов", "formats"],
    ["Подход", "approach"],
    ["Этапы", "steps"],
    ["Вопросы", "faq"],
  ]) {
    await page.getByRole("navigation", { name: "Основная навигация" }).getByRole("link", { name: label }).click();
    await page.waitForFunction((anchor) => location.hash === `#${anchor}`, id);
    await page.waitForTimeout(800);
    const { top, header } = await page.evaluate((anchor) => {
      return {
        top: document.getElementById(anchor)!.getBoundingClientRect().top,
        header: document.querySelector("header")!.getBoundingClientRect().bottom,
      };
    }, id);
    expect(top).toBeGreaterThanOrEqual(header - 1);
  }
});

test("AC-03: format CTAs preselect the site type in the hero form and focus the contact", async ({ page }) => {
  await page.goto("/");
  for (const [cta, label] of [
    ["Рассчитать стоимость лендинга", "Лендинг"],
    ["Рассчитать стоимость сайта", "Корпоративный сайт"],
    ["Рассчитать стоимость каталога", "Сайт-каталог"],
  ]) {
    await page.getByRole("button", { name: cta }).click();
    await expect(hero(page).getByRole("radio", { name: label })).toBeChecked();
    await expect(page.locator("#estimate-contact")).toBeFocused();
  }
});

test("AC-04: phone/email switch changes label, type, autocomplete and validation", async ({ page }) => {
  await page.goto("/");
  const form = hero(page);
  const input = page.locator("#estimate-contact");
  await expect(input).toHaveAttribute("type", "tel");
  await expect(input).toHaveAttribute("autocomplete", "tel");
  await input.fill("+7 900 000-00-00");
  await form.getByText("Email", { exact: true }).click();
  await expect(input).toHaveAttribute("type", "email");
  await expect(input).toHaveAttribute("autocomplete", "email");
  await expect(input).toHaveValue("");
  await expect(form.getByText("Email", { exact: true }).last()).toBeVisible();
  await input.fill("wrong");
  await form.getByRole("button", { name: "Получить предварительный расчёт" }).click();
  await expect(form.getByText("Проверьте email")).toBeVisible();
});

test("AC-05/AC-06: required fields and consent are validated with accessible errors", async ({ page }) => {
  const requests = await captureLeads(page);
  await page.goto("/");
  const form = hero(page);
  await form.getByRole("button", { name: "Получить предварительный расчёт" }).click();
  const input = page.locator("#estimate-contact");
  await expect(form.getByText("Введите номер телефона")).toBeVisible();
  await expect(form.getByText("Необходимо согласие на обработку данных")).toBeVisible();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveAttribute("aria-describedby", "estimate-contact-error");
  await expect(page.locator("#estimate-consent")).toHaveAttribute("aria-describedby", "estimate-consent-error");
  await expect(input).toBeFocused();
  await expect(page.locator("#estimate-consent")).not.toBeChecked();
  expect(requests).toHaveLength(0);
});

test("AC-07: no duplicates while submitting; data stays after a server failure", async ({ page }) => {
  const requests = await captureLeads(page, { status: 503, delayMs: 600 });
  await page.goto("/");
  const form = hero(page);
  await form.getByRole("radio", { name: "Лендинг" }).check();
  await page.locator("#estimate-contact").fill("+7 900 123-45-67");
  await page.locator("#estimate-consent").check();
  const submit = form.locator('button[type="submit"]');
  await submit.click();
  await submit.click({ force: true }).catch(() => {});
  await expect(submit).toBeDisabled();
  await expect(form.getByRole("alert")).toContainText("Не удалось отправить заявку. Попробуйте ещё раз");
  expect(requests).toHaveLength(1);
  await expect(page.locator("#estimate-contact")).toHaveValue("+7 900 123-45-67");
  await expect(form.getByRole("radio", { name: "Лендинг" })).toBeChecked();
  await expect(page.locator("#estimate-consent")).toBeChecked();
});

test("AC-08: success appears only after the real server confirms", async ({ page }) => {
  const getEvents = await collectAnalytics(page);
  const requests = await captureLeads(page, { passthrough: true });
  await page.goto("/");
  const form = hero(page);
  await form.getByRole("radio", { name: "Корпоративный сайт" }).check();
  await form.getByText("Email", { exact: true }).click();
  await page.locator("#estimate-contact").fill("e2e@example.com");
  await page.locator("#estimate-consent").check();
  await form.getByRole("button", { name: "Получить предварительный расчёт" }).click();
  await expect(page.locator("#calc").getByText("Спасибо! Заявка получена.")).toBeVisible();
  expect(requests[0]).toMatchObject({ source: "hero_estimate", siteType: "corporate", contactMethod: "email", contact: "e2e@example.com" });

  // AC-21: события без персональных данных
  const events = await getEvents();
  const names = events.map((e) => e.event);
  expect(names).toEqual(expect.arrayContaining(["site_type_select", "lead_submit_attempt", "lead_submit_success"]));
  expect(JSON.stringify(events)).not.toContain("e2e@example.com");
});

test("AC-09/AC-10: quiz has 3 steps, keeps answers on Back, recommends and sends answers", async ({ page }) => {
  const requests = await captureLeads(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Подобрать сайт за 3 вопроса" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Подбор сайта за 3 вопроса" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("1/3")).toBeVisible();
  const next = dialog.getByRole("button", { name: "Далее" });
  await expect(next).toBeDisabled();
  await dialog.getByRole("radio", { name: "Показать товары или ассортимент" }).check();
  await next.click();
  await expect(dialog.getByText("2/3")).toBeVisible();
  await dialog.getByRole("button", { name: "Назад" }).click();
  await expect(dialog.getByRole("radio", { name: "Показать товары или ассортимент" })).toBeChecked();
  await next.click();
  await dialog.getByRole("radio", { name: "Есть сайт, хотим его улучшить" }).check();
  await next.click();
  await expect(dialog.getByText("3/3")).toBeVisible();
  await dialog.getByRole("radio", { name: "В течение 1–3 месяцев" }).check();
  await dialog.getByRole("button", { name: "Показать рекомендацию" }).click();
  await expect(dialog.getByText("Вам подойдёт сайт-каталог")).toBeVisible();
  await expect(dialog).not.toContainText("₽");

  await page.locator("#quiz-contact").fill("+7 900 123-45-67");
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Получить предложение по сайту" }).click();
  await expect(dialog.getByText("Спасибо! Заявка получена.")).toBeVisible();
  expect(requests[0]).toMatchObject({
    source: "quiz",
    answers: { goal: "assortment", current: "improve", launch: "1_3_months", recommendation: "catalog" },
  });
});

test("quiz resets after closing and reopening", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Подобрать сайт за 3 вопроса" }).first();
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("radio", { name: "Представить компанию и несколько услуг" }).check();
  await dialog.getByRole("button", { name: "Далее" }).click();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await trigger.click();
  await expect(dialog.getByText("1/3")).toBeVisible();
  await expect(dialog.getByRole("radio", { name: "Представить компанию и несколько услуг" })).not.toBeChecked();
});

test("AC-11: PDn consultation validates and sends the correct source", async ({ page }) => {
  const requests = await captureLeads(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Обсудить требования к сайту" }).click();
  const dialog = page.getByRole("dialog", { name: "Обсудить требования к сайту" });
  await dialog.getByRole("button", { name: "Обсудить требования и оценку" }).click();
  await expect(dialog.getByText("Выберите один из вариантов")).toBeVisible();
  await dialog.getByRole("radio", { name: "Регистрации пользователей" }).check();
  await dialog.getByText("Email", { exact: true }).click();
  await page.locator("#consult-contact").fill("dpo@example.com");
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Обсудить требования и оценку" }).click();
  await expect(dialog.getByText("Спасибо! Заявка получена.")).toBeVisible();
  expect(requests[0]).toMatchObject({ source: "pdn_consultation", dataCategory: "user_registration", contactMethod: "email" });
});

test("AC-12: final brief works with empty optional fields", async ({ page }) => {
  const requests = await captureLeads(page, { passthrough: true });
  await page.goto("/#brief");
  const form = page.locator("#brief form");
  await page.locator("#brief-contact").fill("+44 20 7946 0958");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Получить предварительный расчёт" }).click();
  await expect(page.locator("#brief").getByText("Спасибо! Заявка получена.")).toBeVisible();
  expect(requests[0]).toMatchObject({ source: "final_brief", siteType: "unknown", scope: "unknown", name: "", description: "" });
});

test("AC-13: FAQ toggles from the keyboard", async ({ page }) => {
  await page.goto("/#faq");
  const summary = page.locator("#faq-price summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#faq-price")).toHaveAttribute("open", "");
  await expect(page.locator("#faq-price").getByText("Фиксированного прайса")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(page.locator("#faq-price")).not.toHaveAttribute("open", "");
});

test("AC-14: dialogs close on Escape, trap focus and return it to the trigger", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Обсудить требования к сайту" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
  }
  await expect(dialog.getByRole("button", { name: "Закрыть" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("AC-15: no dead links; legal pages exist", async ({ page, request }) => {
  await page.goto("/");
  expect(await page.locator('a[href="#"]').count()).toBe(0);
  const hrefs = await page.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
  for (const href of hrefs.filter((h) => h.startsWith("#"))) {
    expect(await page.locator(href).count(), href).toBe(1);
  }
  for (const href of ["/privacy", "/consent"]) {
    expect((await request.get(href)).status()).toBe(200);
  }
});

test("AC-16: showcase items are labelled as concepts", async ({ page }) => {
  await page.goto("/#work");
  const items = page.locator("#work ol > li");
  await expect(items).toHaveCount(3);
  for (const item of await items.all()) await expect(item.getByText("Демонстрационный концепт")).toBeVisible();
});

for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
  test(`AC-17: no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(sw).toBeLessThanOrEqual(width);
    if (width < 1024) {
      await page.getByRole("button", { name: "Открыть меню" }).click();
      await expect(page.getByRole("navigation", { name: "Мобильная навигация" })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.getByRole("navigation", { name: "Мобильная навигация" }).getByRole("link", { name: "Этапы" }).click();
      await expect(page.getByRole("navigation", { name: "Мобильная навигация" })).toBeHidden();
    }
  });
}

test("AC-18: motion slots are marked, unique and content is visible", async ({ page }) => {
  await page.goto("/");
  const slots = await page.locator("[data-motion]").evaluateAll((els) =>
    els.map((e) => ({ slot: e.getAttribute("data-motion"), id: e.getAttribute("data-motion-id"), opacity: getComputedStyle(e).opacity })),
  );
  const ids = slots.map((s) => s.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids.every(Boolean)).toBe(true);
  expect(new Set(slots.map((s) => s.slot))).toEqual(
    new Set(["hero-title", "hero-art", "section-intro", "case-reveal", "process-line", "detail-focus", "cta-accent"]),
  );
  expect(slots.every((s) => s.opacity === "1")).toBe(true);
});

test("AC-20: SEO basics", async ({ page, request }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Создание сайтов для бизнеса/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{50,}/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  expect(await page.locator("h2").count()).toBeGreaterThan(8);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect(await (await request.get("/sitemap.xml")).text()).toContain("<urlset");
});

test("AC-22: API validates payloads, catches bots and rejects oversized bodies", async ({ request }) => {
  const bad = await request.post("/api/leads", { data: { source: "hero_estimate", contactMethod: "phone", contact: "1" } });
  expect(bad.status()).toBe(422);
  expect((await bad.json()).success).toBe(false);

  const huge = await request.post("/api/leads", { data: { source: "final_brief", description: "x".repeat(20000) } });
  expect(huge.status()).toBe(413);

  const notJson = await request.post("/api/leads", { headers: { "content-type": "application/json" }, data: Buffer.from("{oops") });
  expect(notJson.status()).toBe(400);
});

test("form works without JavaScript via a regular POST", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  const form = page.locator("#brief form");
  await form.locator('input[name="contact"]').fill("+7 900 765-43-21");
  await form.locator('input[name="consent"]').check();
  await form.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/lead\?status=success/);
  await expect(page.getByText("Спасибо! Заявка получена.")).toBeVisible();
  await ctx.close();
});
