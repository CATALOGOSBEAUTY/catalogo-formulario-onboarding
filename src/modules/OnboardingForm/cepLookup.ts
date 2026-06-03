interface CepLookupResponse {
  erro?: boolean;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
}

export interface AddressLookupResult {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export async function lookupAddressByCep(
  cep: string,
  fetchImpl: typeof fetch = fetch,
): Promise<AddressLookupResult | null> {
  const digits = cep.replace(/\D/g, "");

  if (digits.length !== 8) {
    return null;
  }

  const response = await fetchImpl(`https://viacep.com.br/ws/${digits}/json/`);

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as CepLookupResponse;

  if (payload.erro) {
    return null;
  }

  return {
    street: payload.logradouro || "",
    neighborhood: payload.bairro || "",
    city: payload.localidade || "",
    state: payload.uf || "",
  };
}
