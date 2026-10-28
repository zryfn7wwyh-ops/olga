import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  __resetServerState,
  acceptOnce,
  checkRateLimit,
  dedupeKey,
  deliverLead,
  getDeliveryConfig,
  type StoredLead,
} from "@/lib/leads/server";
import type { LeadPayload } from "@/lib/leads/schema";

const lead: LeadPayload = {
  source: "hero_estimate",
  siteType: "landing",
  contactMethod: "phone",
  contact: "+79001234567",
  name: null,
  description: null,
  scope: null,
  answers: null,
  dataCategory: null,
  consent: { accepted: true, documentVersion: "v1" },
  attribution: {},
};

const env = (vars: Record<string, string>) => vars as unknown as NodeJS.ProcessEnv;

afterEach(() => {
  __resetServerState();
  vi.restoreAllMocks();
});

describe("delivery config", () => {
  it("is disabled in production without a configured channel", () => {
    expect(getDeliveryConfig(env({ NODE_ENV: "production" })).mode).toBe("disabled");
  });
  it("refuses test mode in production unless explicitly allowed", () => {
    expect(getDeliveryConfig(env({ NODE_ENV: "production", LEAD_DELIVERY_MODE: "test" })).mode).toBe("disabled");
    expect(
      getDeliveryConfig(env({ NODE_ENV: "production", LEAD_DELIVERY_MODE: "test", LEAD_ALLOW_TEST_MODE_IN_PRODUCTION: "true" })).mode,
    ).toBe("test");
  });
  it("requires HTTPS webhook in production", () => {
    expect(getDeliveryConfig(env({ NODE_ENV: "production", LEAD_DELIVERY_MODE: "webhook", LEAD_WEBHOOK_URL: "http://crm" })).mode).toBe(
      "disabled",
    );
    expect(getDeliveryConfig(env({ NODE_ENV: "production", LEAD_DELIVERY_MODE: "webhook", LEAD_WEBHOOK_URL: "https://crm" })).mode).toBe(
      "webhook",
    );
  });
  it("defaults to test mode in development", () => {
    expect(getDeliveryConfig(env({ NODE_ENV: "development" })).mode).toBe("test");
  });
});

describe("deliverLead", () => {
  const stored: StoredLead = { ...lead, requestId: "r-1", receivedAt: "2026-10-28T00:00:00Z" };

  it("writes to the test file", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "leads-"));
    const file = path.join(dir, "leads.jsonl");
    await deliverLead(stored, { mode: "test", file });
    expect(JSON.parse(await readFile(file, "utf8"))).toMatchObject({ requestId: "r-1", source: "hero_estimate" });
  });

  it("posts to the webhook with the secret and fails on non-2xx", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response("ok", { status: 200 }));
    await deliverLead(stored, { mode: "webhook", url: "https://crm.example/hook", secret: "s3cret", timeoutMs: 1000 });
    const [, init] = fetchMock.mock.calls[0];
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer s3cret");

    fetchMock.mockResolvedValueOnce(new Response("no", { status: 502 }));
    await expect(deliverLead(stored, { mode: "webhook", url: "https://crm.example/hook", timeoutMs: 1000 })).rejects.toThrow(
      "webhook responded 502",
    );
  });

  it("never reports success when the channel is disabled", async () => {
    await expect(deliverLead(stored, { mode: "disabled", reason: "x" })).rejects.toThrow();
  });
});

describe("rate limit", () => {
  it("blocks after the limit within the window", () => {
    const e = env({ LEAD_RATE_LIMIT_MAX: "2", LEAD_RATE_LIMIT_WINDOW_MS: "1000" });
    expect(checkRateLimit("ip", 0, e).allowed).toBe(true);
    expect(checkRateLimit("ip", 1, e).allowed).toBe(true);
    expect(checkRateLimit("ip", 2, e).allowed).toBe(false);
    expect(checkRateLimit("ip", 1001, e).allowed).toBe(true);
  });
});

describe("deduplication", () => {
  it("delivers once for repeated requests with the same key", async () => {
    const deliver = vi.fn().mockResolvedValue(undefined);
    const key = dedupeKey({ ...lead, idempotencyKey: "abcdef12-key" });
    const [a, b] = await Promise.all([acceptOnce(key, deliver), acceptOnce(key, deliver)]);
    expect(a).toBe(b);
    expect(deliver).toHaveBeenCalledTimes(1);
  });

  it("allows a retry after a failed delivery", async () => {
    const key = dedupeKey(lead);
    await expect(acceptOnce(key, () => Promise.reject(new Error("down")))).rejects.toThrow("down");
    await expect(acceptOnce(key, () => Promise.resolve())).resolves.toBeTypeOf("string");
  });
});
