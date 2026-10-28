import { describe, expect, it } from "vitest";
import { legal } from "@/content/legal";
import { parseLeadPayload } from "@/lib/leads/schema";
import { formDataToPayload } from "@/lib/leads/form-data";

const consent = { accepted: true, documentVersion: legal.documentVersion };
const base = { contactMethod: "phone", contact: "8 900 123-45-67", consent };

describe("parseLeadPayload", () => {
  it("accepts a hero estimate and normalizes the contact", () => {
    const r = parseLeadPayload({ ...base, source: "hero_estimate", siteType: "corporate" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data).toMatchObject({ source: "hero_estimate", siteType: "corporate", contact: "+79001234567", answers: null });
      expect(r.data.consent.documentVersion).toBe(legal.documentVersion);
    }
  });

  it("defaults hero site type to unknown", () => {
    const r = parseLeadPayload({ ...base, source: "hero_estimate" });
    expect(r.ok && r.data.siteType).toBe("unknown");
  });

  it("rejects unknown source", () => {
    expect(parseLeadPayload({ ...base, source: "spam" }).ok).toBe(false);
  });

  it("requires consent when the legal model requires it", () => {
    const r = parseLeadPayload({ ...base, source: "hero_estimate", consent: { accepted: false } });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.consent).toBe("consent_required");
    const stale = parseLeadPayload({ ...base, source: "hero_estimate", consent: { accepted: true, documentVersion: "old" } });
    expect(stale.ok).toBe(false);
  });

  it("does not require consent under another legal model", () => {
    const r = parseLeadPayload({ ...base, source: "hero_estimate", consent: {} }, { ...legal, consentRequired: false });
    expect(r.ok).toBe(true);
  });

  it("reports contact errors", () => {
    const r = parseLeadPayload({ ...base, source: "hero_estimate", contactMethod: "email", contact: "nope" });
    expect(!r.ok && r.errors.contact).toBe("email_invalid");
  });

  it("carries quiz answers and recommendation", () => {
    const r = parseLeadPayload({
      ...base,
      source: "quiz",
      answers: { goal: "assortment", current: "replace", launch: "1_3_months", recommendation: "catalog" },
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.answers).toEqual({ goal: "assortment", current: "replace", launch: "1_3_months", recommendation: "catalog" });
      expect(r.data.siteType).toBe("catalog");
    }
  });

  it("rejects incomplete quiz answers", () => {
    const r = parseLeadPayload({ ...base, source: "quiz", answers: { goal: "assortment" } });
    expect(!r.ok && r.errors.answers).toBe("invalid_option");
  });

  it("requires a data category for the PDn consultation", () => {
    expect(parseLeadPayload({ ...base, source: "pdn_consultation" }).ok).toBe(false);
    const r = parseLeadPayload({ ...base, source: "pdn_consultation", dataCategory: "orders" });
    expect(r.ok && r.data.dataCategory).toBe("orders");
  });

  it("accepts a brief with empty optional fields", () => {
    const r = parseLeadPayload({ ...base, source: "final_brief", siteType: "other", scope: "", name: " ", description: "" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toMatchObject({ siteType: "other", scope: null, name: null, description: null });
  });

  it("limits text lengths", () => {
    const r = parseLeadPayload({ ...base, source: "final_brief", name: "a".repeat(101), description: "b".repeat(2001) });
    expect(!r.ok && r.errors).toMatchObject({ name: "too_long", description: "too_long" });
  });

  it("drops fields not related to the scenario", () => {
    const r = parseLeadPayload({ ...base, source: "hero_estimate", description: "secret", name: "Иван", dataCategory: "orders" });
    expect(r.ok && r.data).toMatchObject({ description: null, name: null, dataCategory: null });
  });

  it("whitelists and trims UTM", () => {
    const r = parseLeadPayload({
      ...base,
      source: "hero_estimate",
      attribution: { utm_source: "x".repeat(300), evil: "1", utm_medium: "cpc" },
    });
    expect(r.ok && r.data.attribution).toEqual({ utm_source: "x".repeat(100), utm_medium: "cpc" });
  });

  it("flags honeypot submissions as bots", () => {
    const r = parseLeadPayload({ ...base, source: "hero_estimate", website: "http://spam" });
    expect(r.ok && r.isBot).toBe(true);
  });

  it("maps no-JS form posts to the payload", () => {
    const form = new URLSearchParams({
      source: "final_brief",
      siteType: "landing",
      contactMethod: "email",
      contact: "name@company.ru",
      consent: "on",
      consentVersion: legal.documentVersion,
    });
    const r = parseLeadPayload(formDataToPayload(form));
    expect(r.ok && r.data).toMatchObject({ source: "final_brief", siteType: "landing", contact: "name@company.ru" });
  });
});
