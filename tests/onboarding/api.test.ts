import { describe, expect, it, vi } from "vitest";
import { submitOnboardingForm } from "../../src/modules/OnboardingForm/api";
import type { OnboardingFormState } from "../../src/modules/OnboardingForm/types";

function buildState(): OnboardingFormState {
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
    appointmentFlow: "Alto - 31 a 80 agendamentos por dia",
    cancellationLevel: "Medio",
    rescheduleLevel: "Alto",
    services: [
      {
        id: "1",
        name: "Limpeza de pele",
        professionalName: "Ana Souza",
        durationValue: "45",
        durationUnit: "minutes",
        valueAmount: "150,00",
        valueUnit: "BRL",
      },
    ],
    schedulingModel: "plataforma_completa",
    virtualAssistantEnabled: "yes",
    virtualAssistantScope: "Todas as opcoes",
    cancellationFineAmount: "50",
    cancellationFineUnit: "BRL",
    rescheduleDetails: "Com 24h de antecedencia",
    upfrontCostAmount: "20",
    upfrontCostUnit: "PERCENT",
    photosProcedures: [new File(["a"], "procedures.png", { type: "image/png" })],
    photosFacade: [new File(["b"], "facade.png", { type: "image/png" })],
    hasDomain: "no",
    websiteUrl: "",
    hostingProvider: "",
  };
}

class FakeXMLHttpRequest {
  status = 201;
  responseText = JSON.stringify({
    success: true,
    submissionId: "submission-123",
    whatsappStatus: "sent",
  });
  upload = {
    onprogress: null as ((event: ProgressEvent<EventTarget>) => void) | null,
  };
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  open() {}

  send() {
    this.upload.onprogress?.({
      lengthComputable: true,
      loaded: 50,
      total: 100,
    } as ProgressEvent<EventTarget>);
    this.onload?.();
  }
}

describe("submitOnboardingForm", () => {
  it("reports upload progress while sending images", async () => {
    const progressSpy = vi.fn();

    const response = await submitOnboardingForm(buildState(), {
      onProgress: progressSpy,
      xhrFactory: () => new FakeXMLHttpRequest() as unknown as XMLHttpRequest,
    });

    expect(progressSpy).toHaveBeenCalledWith(50);
    expect(progressSpy).toHaveBeenCalledWith(100);
    expect(response.submissionId).toBe("submission-123");
  });
});
