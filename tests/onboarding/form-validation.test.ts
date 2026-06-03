import { describe, expect, it } from "vitest";
import { getStepValidationError } from "../../src/modules/OnboardingForm/validation";
import type { OnboardingFormState } from "../../src/modules/OnboardingForm/types";

function buildValidState(overrides: Partial<OnboardingFormState> = {}): OnboardingFormState {
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
    currentPainPoint: "O site atual esta desatualizado e nao converte visitantes em clientes.",
    targetAudience: "Empreendedores de 25 a 40 anos que buscam automatizar processos comerciais.",
    audienceAgeRange: ["25 a 34 anos (Millennials)"],
    audienceDigitalBehavior: ["Acessa principalmente pelo celular"],
    competitors: "www.concorrente1.com.br",
    competitorLikes: "",
    uniqueValueProposition: "Automatizamos processos comerciais com IA.",
    hasSocialMedia: false,
    socialMediaHandles: "",

    projectType: "landing_page",
    projectDescription: "Pagina de captacao de leads para novo produto SaaS de automacao comercial que ajuda empresas.",
    needsCms: false,
    needsContactForm: true,
    needsWhatsApp: true,
    needsSeo: true,
    siteLanguages: ["Portugues"],
    analyticsRequired: [],
    trackingPixels: [],
    landingPageCta: "Solicitar Orcamento",
    hasProductVideo: false,
    leadCaptureMethod: "Ambos",
    leadDestination: "WhatsApp",
    websitePages: [],
    hasPortfolio: false,
    needsTestimonials: false,
    needsAboutPage: true,
    productVolume: "",
    ecommercePlatform: "",
    paymentGateways: [],
    salesModels: [],
    needsShippingIntegration: false,
    needsCoupons: false,
    needsProductReviews: false,
    platformType: "",
    platformUserTypes: [],
    platformFeatures: [],
    needsMobileApp: false,
    revenueModel: "",
    hasLegacySystem: false,

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
    needsPostLaunchSupport: false,

    decisionMaker: "Sou eu mesmo",
    hasCriticalDeadline: false,
    criticalDeadlineReason: "",
    deliveryTimeline: "standard",
    projectBudget: "tier_2",
    contentStatus: "Temos parte do conteudo e precisamos de apoio",
    preferredContactChannel: "WhatsApp",
    meetingFrequency: "Reunioes semanais de alinhamento",
    filesBranding: [new File(["content"], "logo.png", { type: "image/png" })],
    filesReferences: [],
    ...overrides,
  };
}

describe("getStepValidationError", () => {
  describe("step 1 — Identidade Comercial", () => {
    it("returns null for a valid step 1", () => {
      expect(getStepValidationError(1, buildValidState())).toBeNull();
    });

    it("returns error without fullName", () => {
      expect(getStepValidationError(1, buildValidState({ fullName: "" }))).not.toBeNull();
    });

    it("returns error without companyName", () => {
      expect(getStepValidationError(1, buildValidState({ companyName: "" }))).not.toBeNull();
    });

    it("returns error for non-remote company without address", () => {
      expect(
        getStepValidationError(1, buildValidState({ isRemote: false, addressZipcode: "", addressStreet: "", addressCity: "" })),
      ).not.toBeNull();
    });

    it("returns null for remote company without address", () => {
      expect(
        getStepValidationError(1, buildValidState({ isRemote: true, addressZipcode: "" })),
      ).toBeNull();
    });
  });

  describe("step 2 — Contexto Estrategico", () => {
    it("returns null for a valid step 2", () => {
      expect(getStepValidationError(2, buildValidState())).toBeNull();
    });

    it("returns error without primaryGoal", () => {
      expect(getStepValidationError(2, buildValidState({ primaryGoal: "" }))).not.toBeNull();
    });

    it("returns error for short currentPainPoint", () => {
      expect(getStepValidationError(2, buildValidState({ currentPainPoint: "curto" }))).not.toBeNull();
    });

    it("returns error for empty audienceAgeRange", () => {
      expect(getStepValidationError(2, buildValidState({ audienceAgeRange: [] }))).not.toBeNull();
    });

    it("returns error when hasSocialMedia=true but no handles", () => {
      expect(
        getStepValidationError(2, buildValidState({ hasSocialMedia: true, socialMediaHandles: "" })),
      ).not.toBeNull();
    });
  });

  describe("step 3 — Tipo de Projeto e Escopo", () => {
    it("returns null for a valid step 3", () => {
      expect(getStepValidationError(3, buildValidState())).toBeNull();
    });

    it("returns error without projectType", () => {
      expect(getStepValidationError(3, buildValidState({ projectType: "" }))).not.toBeNull();
    });

    it("returns error for short projectDescription", () => {
      expect(getStepValidationError(3, buildValidState({ projectDescription: "curto" }))).not.toBeNull();
    });

    it("returns error for empty siteLanguages", () => {
      expect(getStepValidationError(3, buildValidState({ siteLanguages: [] }))).not.toBeNull();
    });

    it("returns error for ecommerce without payment gateways", () => {
      expect(
        getStepValidationError(3, buildValidState({ projectType: "ecommerce", paymentGateways: [] })),
      ).not.toBeNull();
    });

    it("returns error for platform with less than 2 features", () => {
      expect(
        getStepValidationError(3, buildValidState({ projectType: "platform", platformFeatures: ["Login"] })),
      ).not.toBeNull();
    });
  });

  describe("step 4 — Design, Branding e Infra", () => {
    it("returns null for a valid step 4", () => {
      expect(getStepValidationError(4, buildValidState())).toBeNull();
    });

    it("returns error without brandingStatus", () => {
      expect(getStepValidationError(4, buildValidState({ brandingStatus: "" }))).not.toBeNull();
    });

    it("returns error for empty designStyle", () => {
      expect(getStepValidationError(4, buildValidState({ designStyle: [] }))).not.toBeNull();
    });

    it("returns error for brandVoice with less than 2 items", () => {
      expect(
        getStepValidationError(4, buildValidState({ brandVoice: ["Profissional e Tecnico"] })),
      ).not.toBeNull();
    });

    it("returns error when hasDomain=true but no URL", () => {
      expect(
        getStepValidationError(4, buildValidState({ hasDomain: true, websiteUrl: "" })),
      ).not.toBeNull();
    });
  });

  describe("step 5 — Cronograma, Budget e Anexos", () => {
    it("returns null for a valid step 5", () => {
      expect(getStepValidationError(5, buildValidState())).toBeNull();
    });

    it("returns error without deliveryTimeline", () => {
      expect(getStepValidationError(5, buildValidState({ deliveryTimeline: "" }))).not.toBeNull();
    });

    it("returns error without projectBudget", () => {
      expect(getStepValidationError(5, buildValidState({ projectBudget: "" }))).not.toBeNull();
    });

    it("returns error without any files", () => {
      expect(
        getStepValidationError(5, buildValidState({ filesBranding: [], filesReferences: [] })),
      ).not.toBeNull();
    });

    it("returns error when hasCriticalDeadline=true but no reason", () => {
      expect(
        getStepValidationError(5, buildValidState({ hasCriticalDeadline: true, criticalDeadlineReason: "" })),
      ).not.toBeNull();
    });
  });
});
