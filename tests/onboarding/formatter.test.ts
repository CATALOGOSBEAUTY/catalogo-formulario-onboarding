import { describe, expect, it } from "vitest";
import { formatOnboardingWhatsAppMessage } from "../../server/modules/onboarding/message";
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
    currentPainPoint: "Site desatualizado.",
    targetAudience: "Empreendedores jovens.",
    audienceAgeRange: ["25 a 34 anos (Millennials)"],
    audienceDigitalBehavior: ["Acessa principalmente pelo celular"],
    competitors: "www.concorrente1.com.br",
    competitorLikes: "",
    uniqueValueProposition: "Automatizamos processos.",
    hasSocialMedia: false,
    socialMediaHandles: "",
    projectType: "landing_page",
    projectDescription: "Landing page para captacao de leads.",
    needsCms: false,
    needsContactForm: true,
    needsWhatsApp: true,
    needsSeo: true,
    siteLanguages: ["Portugues"],
    analyticsRequired: [],
    trackingPixels: [],
    projectScopeConfig: {},
    brandingStatus: "partial",
    designStyle: ["minimalist"],
    brandVoice: ["Profissional e Tecnico", "Jovem e Moderno"],
    designReferences: "",
    hasDomain: false,
    websiteUrl: "",
    hasHosting: false,
    hostingProvider: "",
    needsSeoConsulting: false,
    needsWcagCompliance: false,
    needsPostLaunchSupport: false,
    decisionMaker: "Sou eu mesmo",
    hasCriticalDeadline: false,
    criticalDeadlineReason: "",
    deliveryTimeline: "standard",
    projectBudget: "tier_2",
    contentStatus: "Temos parte do conteudo",
    preferredContactChannel: "WhatsApp",
    meetingFrequency: "Reunioes semanais",
    files: [],
    ...overrides,
  };
}

describe("formatOnboardingWhatsAppMessage", () => {
  it("includes all major sections in the message", () => {
    const message = formatOnboardingWhatsAppMessage(buildValidInput());

    expect(message).toContain("*BRIEFING DE PROJETO DIGITAL*");
    expect(message).toContain("*1. IDENTIFICACAO*");
    expect(message).toContain("*2. LOCALIZACAO*");
    expect(message).toContain("*3. CONTEXTO ESTRATEGICO*");
    expect(message).toContain("*4. ESCOPO DO PROJETO*");
    expect(message).toContain("*5. DESIGN E INFRA*");
    expect(message).toContain("*6. COMERCIAL*");
    expect(message).toContain("*7. ARQUIVOS*");
  });

  it("shows remote company label instead of address", () => {
    const message = formatOnboardingWhatsAppMessage(buildValidInput({ isRemote: true }));
    expect(message).toContain("Empresa remota");
  });

  it("shows full address for non-remote company", () => {
    const message = formatOnboardingWhatsAppMessage(
      buildValidInput({
        isRemote: false,
        addressZipcode: "01001-000",
        addressStreet: "Av. Paulista",
        addressNumber: "1000",
        addressNeighborhood: "Bela Vista",
        addressCity: "Sao Paulo",
        addressState: "SP",
      }),
    );
    expect(message).toContain("Av. Paulista, 1000");
    expect(message).toContain("Sao Paulo - SP");
  });

  it("includes company name and sector", () => {
    const message = formatOnboardingWhatsAppMessage(buildValidInput());
    expect(message).toContain("Studio Digital Ltda");
    expect(message).toContain("Tecnologia e SaaS");
  });
});
