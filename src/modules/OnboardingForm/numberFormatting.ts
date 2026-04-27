import type { PriceUnit } from "./types";

export function formatDigitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function formatMoneyInput(value: string) {
  const digits = formatDigitsOnly(value);

  if (!digits) {
    return "";
  }

  const cents = digits.padStart(3, "0");
  const integerPart = cents.slice(0, -2).replace(/^0+(?=\d)/, "") || "0";
  const decimalPart = cents.slice(-2);
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${formattedInteger},${decimalPart}`;
}

export function formatAmountInput(value: string, unit: PriceUnit) {
  if (unit === "PERCENT") {
    return formatDigitsOnly(value);
  }

  return formatMoneyInput(value);
}
