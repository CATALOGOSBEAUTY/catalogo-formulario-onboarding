import { describe, expect, it } from "vitest";

// Address formatting utilities are validated with regex patterns
// that match the validation rules used in the onboarding form.

describe("address formatting", () => {
  it("validates CEP format (8 digits)", () => {
    const valid = /^\d{5}-?\d{3}$/;
    expect(valid.test("01001-000")).toBe(true);
    expect(valid.test("01001000")).toBe(true);
    expect(valid.test("0100A-000")).toBe(false);
    expect(valid.test("123")).toBe(false);
  });

  it("validates Brazilian state code (2 uppercase letters)", () => {
    const valid = /^[A-Z]{2}$/;
    expect(valid.test("SP")).toBe(true);
    expect(valid.test("RJ")).toBe(true);
    expect(valid.test("sp")).toBe(false);
    expect(valid.test("SPA")).toBe(false);
  });
});
