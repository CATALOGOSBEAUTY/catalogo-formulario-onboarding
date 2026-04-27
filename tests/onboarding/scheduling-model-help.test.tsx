import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SchedulingConfigForm } from "../../src/modules/OnboardingForm/components/SchedulingConfigForm";
import type { OnboardingFormState } from "../../src/modules/OnboardingForm/types";

function buildState(schedulingModel: string): OnboardingFormState {
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
    appointmentFlow: "Alto - 31 a 80 agendamentos por dia",
    cancellationLevel: "Medio",
    rescheduleLevel: "Alto",
    schedulingModel,
    cancellationFineAmount: "50",
    cancellationFineUnit: "BRL",
    rescheduleDetails: "Com 24h de antecedencia",
    upfrontCostAmount: "20",
    upfrontCostUnit: "PERCENT",
    photosProcedures: [],
    photosFacade: [],
    hasDomain: "no",
    websiteUrl: "",
    hostingProvider: "",
  };
}

describe("SchedulingConfigForm scheduling model help", () => {
  it("renders the explanation for the selected WhatsApp model", () => {
    const markup = renderToStaticMarkup(
      <SchedulingConfigForm data={buildState("whatsapp")} updateData={vi.fn()} />,
    );

    expect(markup).toContain(
      "Ideal para uma operacao enxuta e personalizada",
    );
  });

  it("renders the explanation for the selected Google Agenda and WhatsApp model", () => {
    const markup = renderToStaticMarkup(
      <SchedulingConfigForm data={buildState("google_whatsapp")} updateData={vi.fn()} />,
    );

    expect(markup).toContain(
      "Combina relacionamento humano e organizacao executiva",
    );
  });

  it("renders the explanation for the selected complete platform model", () => {
    const markup = renderToStaticMarkup(
      <SchedulingConfigForm data={buildState("plataforma_completa")} updateData={vi.fn()} />,
    );

    expect(markup).toContain(
      "Experiencia premium para alto volume",
    );
  });
});
