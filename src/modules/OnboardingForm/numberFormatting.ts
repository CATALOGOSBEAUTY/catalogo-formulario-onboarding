export function formatDigitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function formatCPFOrCNPJ(value: string) {
  const v = value.replace(/\D/g, "");
  if (v.length <= 11) {
    return v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2");
  }

  return v
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})/, "$1-$2")
    .substring(0, 18);
}

export function formatPhoneBR(value: string) {
  const v = value.replace(/\D/g, "");
  if (v.length <= 10) {
    return v
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return v
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 15);
}

export function formatCEP(value: string) {
  const v = value.replace(/\D/g, "");
  return v.replace(/(\d{5})(\d{1,3})/, "$1-$2").substring(0, 9);
}

export function formatAddressNumber(value: string) {
  return value.replace(/\D/g, "");
}
