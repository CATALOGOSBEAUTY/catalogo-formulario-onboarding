import { describe, expect, it } from "vitest";
import {
  formatCPFOrCNPJ,
  formatPhoneBR,
  formatCEP,
  formatAddressNumber,
  formatDigitsOnly,
} from "../../src/modules/OnboardingForm/numberFormatting";

describe("formatCPFOrCNPJ", () => {
  it("formats CPF digits with dots and dash", () => {
    expect(formatCPFOrCNPJ("12345678900")).toBe("123.456.789-00");
  });

  it("formats partial CPF", () => {
    expect(formatCPFOrCNPJ("123456")).toBe("123.456");
  });

  it("formats CNPJ with dots, slash, and dash", () => {
    expect(formatCPFOrCNPJ("12345678000190")).toBe("12.345.678/0001-90");
  });
});

describe("formatPhoneBR", () => {
  it("formats 11-digit mobile number", () => {
    expect(formatPhoneBR("11999999999")).toBe("(11) 99999-9999");
  });

  it("formats 10-digit landline number", () => {
    expect(formatPhoneBR("1133334444")).toBe("(11) 3333-4444");
  });
});

describe("formatCEP", () => {
  it("formats 8-digit CEP with dash", () => {
    expect(formatCEP("01001000")).toBe("01001-000");
  });

  it("handles partial CEP", () => {
    expect(formatCEP("01001")).toBe("01001");
  });
});

describe("formatAddressNumber", () => {
  it("keeps only digits", () => {
    expect(formatAddressNumber("1000A")).toBe("1000");
  });
});

describe("formatDigitsOnly", () => {
  it("strips all non-digit characters", () => {
    expect(formatDigitsOnly("(11) 99999-9999")).toBe("11999999999");
  });
});
