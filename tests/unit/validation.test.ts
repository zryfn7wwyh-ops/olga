import { describe, expect, it } from "vitest";
import { contactFieldConfig, normalizeEmail, normalizePhone, validateContact, validateEmail, validatePhone } from "@/lib/validation";

describe("validateEmail", () => {
  it("accepts a valid email and trims", () => {
    expect(validateEmail("  name@company.ru ")).toBeNull();
  });
  it("requires a value", () => {
    expect(validateEmail("   ")).toBe("contact_required");
  });
  it.each(["name", "name@", "@company.ru", "name@company", "na me@company.ru"])("rejects %s", (v) => {
    expect(validateEmail(v)).toBe("email_invalid");
  });
  it("limits length to 254", () => {
    expect(validateEmail(`${"a".repeat(250)}@x.ru`)).toBe("contact_too_long");
  });
});

describe("validatePhone", () => {
  it.each(["+7 900 000-00-00", "8 (900) 000-00-00", "+44 20 7946 0958", "+1-202-555-0143"])("accepts %s", (v) => {
    expect(validatePhone(v)).toBeNull();
  });
  it.each(["12345", "+7 900 abc", "phone", "+1234567890123456"])("rejects %s", (v) => {
    expect(validatePhone(v)).toBe("phone_invalid");
  });
  it("requires a value", () => {
    expect(validatePhone("")).toBe("contact_required");
  });
});

describe("normalization", () => {
  it("normalizes Russian numbers to +7", () => {
    expect(normalizePhone("8 (900) 123-45-67")).toBe("+79001234567");
    expect(normalizePhone("7 900 123 45 67")).toBe("+79001234567");
  });
  it("keeps international numbers", () => {
    expect(normalizePhone("+44 20 7946 0958")).toBe("+442079460958");
  });
  it("lowercases the email domain only", () => {
    expect(normalizeEmail(" Ivan@Company.RU ")).toBe("Ivan@company.ru");
  });
});

describe("contact method switching", () => {
  it("changes type, inputMode, autocomplete and label", () => {
    expect(contactFieldConfig("phone")).toMatchObject({ type: "tel", inputMode: "tel", autoComplete: "tel", label: "Телефон" });
    expect(contactFieldConfig("email")).toMatchObject({ type: "email", inputMode: "email", autoComplete: "email", label: "Email" });
  });
  it("validates by the selected method", () => {
    expect(validateContact("email", "+7 900 000-00-00")).toBe("email_invalid");
    expect(validateContact("phone", "name@company.ru")).toBe("phone_invalid");
  });
});
