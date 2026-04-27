import { describe, expect, it } from "vitest";
import {
  formatAmountInput,
  formatDigitsOnly,
  formatMoneyInput,
} from "../../src/modules/OnboardingForm/numberFormatting";

describe("onboarding numeric input formatting", () => {
  it("keeps duration fields with digits only", () => {
    expect(formatDigitsOnly("45min")).toBe("45");
    expect(formatDigitsOnly("1 hora e 30")).toBe("130");
  });

  it("formats currency values with automatic thousand separators and decimal comma", () => {
    expect(formatMoneyInput("abc123456")).toBe("1.234,56");
    expect(formatMoneyInput("5000")).toBe("50,00");
    expect(formatMoneyInput("")).toBe("");
  });

  it("formats amount fields according to the selected unit", () => {
    expect(formatAmountInput("abc5000", "BRL")).toBe("50,00");
    expect(formatAmountInput("abc5000", "USD")).toBe("50,00");
    expect(formatAmountInput("50%", "PERCENT")).toBe("50");
  });
});
