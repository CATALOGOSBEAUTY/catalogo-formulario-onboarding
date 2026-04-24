import { describe, expect, it } from "vitest";
import { getStepValidationError } from "../../src/modules/OnboardingForm/validation";
import type { OnboardingFormState } from "../../src/modules/OnboardingForm/types";

function buildState(overrides: Partial<OnboardingFormState> = {}): OnboardingFormState {
  return {
    fullName: "Maria Silva",
    cpf: "123.456.789-00",
    email: "maria@empresa.com",
    commercialContact: "(11) 99999-9999",
    addressZipcode: "01001-000",
    addressStreet: "Av. Paulista",
    addressNumber: "1000",
    addressNeighborhood: "Bela Vista",
    services: [],
    professionals: [],
    schedulingModel: "plataforma_completa",
    cancellationFine: "R$ 50,00",
    rescheduleDetails: "Com 24h de antecedencia",
    upfrontCost: "50% antecipado",
    photosProcedures: null,
    photosFacade: null,
    hasDomain: "yes",
    websiteUrl: "https://empresa.com.br",
    hostingProvider: "Vercel",
    ...overrides,
  };
}

describe("getStepValidationError", () => {
  it("blocks leaving step 2 when no service or professional was added", () => {
    const error = getStepValidationError(2, buildState());

    expect(error).toBe("Adicione pelo menos um servico antes de continuar.");
  });

  it("blocks leaving step 2 when a service entry is incomplete", () => {
    const error = getStepValidationError(
      2,
      buildState({
        services: [{ id: "1", name: "", duration: "45 min", value: "R$ 50,00" }],
        professionals: [{ id: "2", name: "Joao", role: "Esteticista", serviceConfig: "Limpeza" }],
      }),
    );

    expect(error).toBe("Preencha todos os dados dos servicos antes de continuar.");
  });

  it("allows leaving step 2 when services and professionals are complete", () => {
    const error = getStepValidationError(
      2,
      buildState({
        services: [{ id: "1", name: "Limpeza de pele", duration: "45 min", value: "R$ 50,00" }],
        professionals: [{ id: "2", name: "Joao", role: "Esteticista", serviceConfig: "Limpeza" }],
      }),
    );

    expect(error).toBeNull();
  });
});
