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
  addressCity: "Sao Paulo",
  addressState: "SP",
  appointmentFlow: "Alto - 31 a 80 agendamentos por dia",
  cancellationLevel: "Medio",
  rescheduleLevel: "Alto",
  schedulingModel: "plataforma_completa",
  virtualAssistantEnabled: true,
  virtualAssistantScope: "Todas as opcoes",
  cancellationFine: "R$ 50,00",
  rescheduleDetails: "Reagendamento permitido com 24h de antecedencia.",
  upfrontCost: "50% no ato da reserva",
  hasDomain: true,
  websiteUrl: "https://empresa.com.br",
  hostingProvider: "Vercel",
  services: [
    {
      name: "Corte",
      professionalName: "Joao Souza",
      duration: "45 minutos",
      value: "R$ 50,00",
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
    expect(message).toContain("Cidade/UF: Sao Paulo - SP");
    expect(message).toContain("1. Corte");
    expect(message).toContain("Profissional: Joao Souza");
    expect(message).toContain("Fluxo de pessoas que agendam: Alto - 31 a 80 agendamentos por dia");
    expect(message).toContain("Nivel de cancelamento: Medio");
    expect(message).toContain("Nivel de reagendamento: Alto");
    expect(message).toContain("Assessora virtual para WhatsApp: Sim");
    expect(message).toContain("Escopo da assessora: Todas as opcoes");
    expect(message).toContain("Possui dominio proprio? Sim");
  });
});
