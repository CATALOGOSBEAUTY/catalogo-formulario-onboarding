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
    addressCity: "Sao Paulo",
    addressState: "SP",
    services: [],
    appointmentFlow: "Alto - 31 a 80 agendamentos por dia",
    cancellationLevel: "Medio",
    rescheduleLevel: "Alto",
    schedulingModel: "plataforma_completa",
    virtualAssistantEnabled: "no",
    virtualAssistantScope: "",
    cancellationFineAmount: "50",
    cancellationFineUnit: "BRL",
    rescheduleDetails: "Com 24h de antecedencia",
    upfrontCostAmount: "50",
    upfrontCostUnit: "PERCENT",
    photosProcedures: [],
    photosFacade: [],
    hasDomain: "yes",
    websiteUrl: "https://empresa.com.br",
    hostingProvider: "Vercel",
    ...overrides,
  };
}

describe("getStepValidationError", () => {
  it("blocks leaving step 2 when no linked service was added", () => {
    const error = getStepValidationError(2, buildState());

    expect(error).toBe("Adicione pelo menos um servico antes de continuar.");
  });

  it("blocks leaving step 2 when a linked service entry is incomplete", () => {
    const error = getStepValidationError(
      2,
      buildState({
        services: [
          {
            id: "1",
            name: "",
            professionalName: "Joao",
            durationValue: "45",
            durationUnit: "minutes",
            valueAmount: "50",
            valueUnit: "BRL",
          },
        ],
      }),
    );

    expect(error).toBe("Preencha todos os dados dos servicos antes de continuar.");
  });

  it("allows leaving step 2 when linked services are complete", () => {
    const error = getStepValidationError(
      2,
      buildState({
        services: [
          {
            id: "1",
            name: "Limpeza de pele",
            professionalName: "Joao",
            durationValue: "45",
            durationUnit: "minutes",
            valueAmount: "50",
            valueUnit: "BRL",
          },
        ],
      }),
    );

    expect(error).toBeNull();
  });

  it("allows leaving step 2 with more than 100 complete services", () => {
    const services = Array.from({ length: 101 }, (_, index) => ({
      id: String(index),
      name: `Servico ${index + 1}`,
      professionalName: `Profissional ${index + 1}`,
      durationValue: "45",
      durationUnit: "minutes" as const,
      valueAmount: "150",
      valueUnit: "BRL" as const,
    }));

    const error = getStepValidationError(2, buildState({ services }));

    expect(error).toBeNull();
  });

  it("blocks leaving step 2 when operational flow fields are missing", () => {
    const error = getStepValidationError(
      2,
      buildState({
        appointmentFlow: "",
        services: [
          {
            id: "1",
            name: "Limpeza de pele",
            professionalName: "Joao",
            durationValue: "45",
            durationUnit: "minutes",
            valueAmount: "50",
            valueUnit: "BRL",
          },
        ],
      }),
    );

    expect(error).toBe(
      "Preencha o fluxo de agendamentos, cancelamentos e reagendamentos antes de continuar.",
    );
  });

  it("allows step 4 without technological fields when the client selected no", () => {
    const error = getStepValidationError(
      4,
      buildState({
        hasDomain: "no",
        websiteUrl: "",
        hostingProvider: "",
        photosProcedures: [new File(["a"], "procedures.jpg", { type: "image/jpeg" })],
        photosFacade: [new File(["b"], "facade.jpg", { type: "image/jpeg" })],
      }),
    );

    expect(error).toBeNull();
  });

  it("blocks step 4 when more than 10 images were selected", () => {
    const files = Array.from({ length: 6 }, (_, index) => new File(["a"], `file-${index}.jpg`, { type: "image/jpeg" }));

    const error = getStepValidationError(
      4,
      buildState({
        photosProcedures: files,
        photosFacade: files,
      }),
    );

    expect(error).toBe("Envie no maximo 10 imagens no total antes de concluir.");
  });
});
