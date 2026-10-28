import type { Page, Request } from "@playwright/test";

/** Перехватывает POST /api/leads: сохраняет payload и отвечает заданным статусом (или пропускает на сервер). */
export async function captureLeads(page: Page, opts: { status?: number; delayMs?: number; passthrough?: boolean } = {}) {
  const requests: Record<string, unknown>[] = [];
  await page.route("**/api/leads", async (route) => {
    const req: Request = route.request();
    requests.push(JSON.parse(req.postData() ?? "{}"));
    if (opts.delayMs) await new Promise((r) => setTimeout(r, opts.delayMs));
    if (opts.passthrough) return route.continue();
    const status = opts.status ?? 201;
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(status < 300 ? { success: true, requestId: "test-id" } : { success: false, error: "delivery_failed" }),
    });
  });
  return requests;
}

export async function collectAnalytics(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __events: unknown[] }).__events = [];
    window.addEventListener("site:analytics", (e) => (window as unknown as { __events: unknown[] }).__events.push((e as CustomEvent).detail));
  });
  return () => page.evaluate(() => (window as unknown as { __events: Record<string, unknown>[] }).__events);
}
