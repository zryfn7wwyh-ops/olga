import { describe, expect, it } from "vitest";
import { sanitizeParams } from "@/lib/analytics";

describe("analytics", () => {
  it("never passes personal data", () => {
    expect(
      sanitizeParams({ source: "quiz", contact: "+79001234567", email: "a@b.ru", name: "Иван", description: "текст", note: "a@b.ru", x: "+7 900 123 45 67" }),
    ).toEqual({ source: "quiz" });
  });
  it("keeps categorical params", () => {
    expect(sanitizeParams({ site_type: "landing", step: 2 })).toEqual({ site_type: "landing", step: 2 });
  });
});
