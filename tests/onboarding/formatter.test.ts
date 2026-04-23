import { describe, expect, it } from "vitest";
import { formatOnboardingWhatsAppMessage } from "../../server/modules/onboarding/message";
import type { OnboardingSubmissionInput } from "../../server/modules/onboarding/types";

const buildSubmission = (): OnboardingSubmissionInput => ({
  fullName: "Maria Silva",
  cpfCnpj: "123.456.789-00",
  email: "maria@empresa.com",
  commercialContact: "(11) 99999-9999",
  addressZipcode: "01001-000",
  addressStreet: "Av. Paulista",
  addressNumber: "1000",
  addressNeighborhood: "Bela Vista",
  schedulingModel: "plataforma_completa",
  cancellationFine: "R$ 50,00",
  rescheduleDetails: "Reagendamento permitido com 24h de antecedencia.",
  upfrontCost: "50% no ato da reserva",
  hasDomain: true,
  websiteUrl: "https://empresa.com.br",
  hostingProvider: "Vercel",
  services: [
    {
      name: "Corte",
      duration: "45 min",
      value: "R$ 50,00",
    },
  ],
  professionals: [
    {
      name: "Joao Souza",
      role: "Barbeiro Senior",
      serviceConfig: "Corte: R$ 50,00",
    },
  ],
  files: [
    {
      category: "procedures",
      originalName: "antes-depois.jpg",
      mimeType: "image/jpeg",
      size: 2048,
      buffer: Buffer.from("procedures"),
    },
    {
      category: "facade",
      originalName: "fachada.jpg",
      mimeType: "image/jpeg",
      size: 1024,
      buffer: Buffer.from("facade"),
    },
  ],
});

describe("formatOnboardingWhatsAppMessage", () => {
  it("formats the full onboarding payload into a business message", () => {
    const message = formatOnboardingWhatsAppMessage(buildSubmission());

    expect(message).toContain("*Nova solicitacao de onboarding*");
    expect(message).toContain("Nome: Maria Silva");
    expect(message).toContain("1. Corte");
    expect(message).toContain("Joao Souza - Barbeiro Senior");
    expect(message).toContain("Possui dominio proprio? Sim");
  });
});
