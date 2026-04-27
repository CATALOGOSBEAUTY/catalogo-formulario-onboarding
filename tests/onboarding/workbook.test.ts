import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { buildOnboardingWorkbook } from "../../server/modules/onboarding/workbook";
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
  rescheduleDetails: "Com 24h de antecedencia",
  upfrontCost: "50%",
  hasDomain: true,
  websiteUrl: "https://empresa.com.br",
  hostingProvider: "Vercel",
  services: [
    {
      name: "Limpeza de pele",
      professionalName: "Ana Souza",
      duration: "45 minutos",
      value: "R$ 150,00",
    },
  ],
  files: [
    {
      category: "procedures",
      originalName: "procedimento.jpg",
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

describe("buildOnboardingWorkbook", () => {
  it("creates an organized Excel workbook with separated sheets", async () => {
    const buffer = await buildOnboardingWorkbook(buildSubmission());
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(buffer);

    expect(workbook.getWorksheet("Resumo do Onboarding")).toBeTruthy();
    expect(workbook.getWorksheet("Servicos e Equipe")).toBeTruthy();
    expect(workbook.getWorksheet("Procedimentos - Imagens")).toBeTruthy();
    expect(workbook.getWorksheet("Fachada e Ambiente")).toBeTruthy();
    expect(workbook.getWorksheet("Resumo do Onboarding")?.getCell("B3").value).toBe("Maria Silva");
    expect(workbook.getWorksheet("Servicos e Equipe")?.getCell("B2").value).toBe("Limpeza de pele");
  });
});
