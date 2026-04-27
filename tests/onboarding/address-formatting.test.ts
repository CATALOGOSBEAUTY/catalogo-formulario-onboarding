import { describe, expect, it, vi } from "vitest";
import {
  formatAddressNumber,
  formatCEP,
  lookupAddressByCep,
} from "../../src/modules/OnboardingForm/components/PersonalInfoForm";

describe("address formatting and lookup", () => {
  it("keeps residence number with digits only", () => {
    expect(formatAddressNumber("123A bloco 4")).toBe("1234");
  });

  it("keeps CEP with digits and automatic hyphen only", () => {
    expect(formatCEP("01a001000")).toBe("01001-000");
  });

  it("looks up neighborhood, city and state from CEP", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        cep: "01001-000",
        logradouro: "Praça da Sé",
        bairro: "Sé",
        localidade: "São Paulo",
        uf: "SP",
      }),
    });

    const result = await lookupAddressByCep("01001-000", fetchMock as unknown as typeof fetch);

    expect(fetchMock).toHaveBeenCalledWith("https://viacep.com.br/ws/01001000/json/");
    expect(result).toEqual({
      street: "Praça da Sé",
      neighborhood: "Sé",
      city: "São Paulo",
      state: "SP",
    });
  });
});
