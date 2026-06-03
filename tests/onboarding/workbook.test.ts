import { describe, expect, it } from "vitest";
import { buildOnboardingWorkbook } from "../../server/modules/onboarding/workbook";
import type { OnboardingSubmissionInput } from "../../server/modules/onboarding/types";

function buildValidInput(overrides: Partial<OnboardingSubmissionInput> = {}): OnboardingSubmissionInput {
  return {
    fullName: "Maria Silva",
    companyName: "Studio Digital Ltda",
    companySector: "Tecnologia e SaaS",
    cpfCnpj: "123.456.789-00",
    email: "maria@empresa.com",
    commercialContact: "(11) 99999-9999",
    currentWebsiteUrl: "",
    isRemote: true,
    addressZipcode: "",
    addressStreet: "",
    addressNumber: "",
    addressNeighborhood: "",
    addressCity: "",
    addressState: "",
    primaryGoal: "lead_generation",
    currentPainPoint: "Site desatualizado e sem conversoes.",
    targetAudience: "Empreendedores entre 25 e 40 anos.",
    audienceAgeRange: ["25 a 34 anos (Millennials)"],
    audienceDigitalBehavior: ["Acessa principalmente pelo celular"],
    competitors: "www.concorrente1.com.br",
    competitorLikes: "",
    uniqueValueProposition: "Automatizamos processos comerciais.",
    hasSocialMedia: false,
    socialMediaHandles: "",
    projectType: "landing_page",
    projectDescription: "Landing page para captacao de leads com integracao WhatsApp e analytics.",
    needsCms: false,
    needsContactForm: true,
    needsWhatsApp: true,
    needsSeo: true,
    siteLanguages: ["Portugues"],
    analyticsRequired: ["Google Analytics 4 (GA4)"],
    trackingPixels: ["Meta Pixel (Facebook/Instagram)"],
    projectScopeConfig: { landingPageCta: "Solicitar Orcamento", leadCaptureMethod: "Ambos" },
    brandingStatus: "partial",
    designStyle: ["minimalist", "tech"],
    brandVoice: ["Profissional e Tecnico", "Jovem e Moderno"],
    designReferences: "",
    hasDomain: false,
    websiteUrl: "",
    hasHosting: false,
    hostingProvider: "",
    needsSeoConsulting: false,
    needsWcagCompliance: false,
    needsPostLaunchSupport: true,
    decisionMaker: "Sou eu mesmo",
    hasCriticalDeadline: false,
    criticalDeadlineReason: "",
    deliveryTimeline: "standard",
    projectBudget: "tier_2",
    contentStatus: "Temos parte do conteudo",
    preferredContactChannel: "WhatsApp",
    meetingFrequency: "Reunioes semanais",
    files: [
      {
        category: "branding",
        originalName: "logo.png",
        mimeType: "image/png",
        size: 2048,
        buffer: Buffer.from("logo"),
      },
    ],
    ...overrides,
  };
}

describe("buildOnboardingWorkbook", () => {
  it("generates a non-empty xlsx buffer with 5 worksheets", async () => {
    const buffer = await buildOnboardingWorkbook(buildValidInput());

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);

    const ExcelJS = await import("exceljs");
    const wb = new ExcelJS.default.Workbook();
    await wb.xlsx.load(buffer);

    expect(wb.worksheets).toHaveLength(5);
    expect(wb.worksheets[0]!.name).toBe("Identificacao e Contexto");
    expect(wb.worksheets[1]!.name).toBe("Escopo Tecnico");
    expect(wb.worksheets[2]!.name).toBe("Design e Infraestrutura");
    expect(wb.worksheets[3]!.name).toBe("Alinhamento Comercial");
    expect(wb.worksheets[4]!.name).toBe("Arquivos Enviados");
  });

  it("includes ecommerce scope details when projectType is ecommerce", async () => {
    const buffer = await buildOnboardingWorkbook(
      buildValidInput({
        projectType: "ecommerce",
        projectScopeConfig: {
          productVolume: "Ate 50 produtos",
          ecommercePlatform: "Shopify",
          paymentGateways: ["Mercado Pago", "Stripe"],
          salesModels: ["Venda avulsa"],
          needsShippingIntegration: true,
          needsCoupons: false,
          needsProductReviews: true,
        },
      }),
    );

    const ExcelJS = await import("exceljs");
    const wb = new ExcelJS.default.Workbook();
    await wb.xlsx.load(buffer);

    const scopeSheet = wb.worksheets[1]!;
    const rows: string[] = [];
    scopeSheet.eachRow((row) => {
      row.eachCell((cell) => {
        rows.push(String(cell.value || ""));
      });
    });
    const allText = rows.join(" ");

    expect(allText).toContain("Detalhes do E-commerce");
    expect(allText).toContain("Mercado Pago, Stripe");
  });

  it("handles files sheet with 0 images gracefully", async () => {
    const buffer = await buildOnboardingWorkbook(buildValidInput({ files: [] }));

    const ExcelJS = await import("exceljs");
    const wb = new ExcelJS.default.Workbook();
    await wb.xlsx.load(buffer);

    const filesSheet = wb.worksheets[4]!;
    const secondRow = filesSheet.getRow(2);
    expect(String(secondRow.getCell(1).value)).toContain("Nenhum arquivo enviado");
  });
});
