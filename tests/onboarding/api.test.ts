import { describe, expect, it, vi } from "vitest";
import { submitOnboardingForm } from "../../src/modules/OnboardingForm/api";
import type { OnboardingFormState } from "../../src/modules/OnboardingForm/types";

function buildValidFormState(overrides: Partial<OnboardingFormState> = {}): OnboardingFormState {
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
    currentPainPoint: "Site desatualizado e nao converte visitantes.",
    targetAudience: "Empreendedores de 25 a 40 anos.",
    audienceAgeRange: ["25 a 34 anos (Millennials)"],
    audienceDigitalBehavior: ["Acessa principalmente pelo celular"],
    competitors: "www.concorrente.com.br",
    competitorLikes: "",
    uniqueValueProposition: "Automatizamos processos comerciais.",
    hasSocialMedia: false,
    socialMediaHandles: "",
    projectType: "landing_page",
    projectDescription: "Pagina de captacao de leads para novo produto SaaS de automacao comercial.",
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
    contentStatus: "Temos parte do conteudo",
    preferredContactChannel: "WhatsApp",
    meetingFrequency: "Reunioes semanais",
    filesBranding: [],
    filesReferences: [],
    ...overrides,
  };
}

describe("submitOnboardingForm", () => {
  it("serializes FormData and sends it via XHR, resolving the response", async () => {
    let capturedFormData: FormData | null = null;

    const fakeXhr = {
      open: vi.fn(),
      send: vi.fn((formData: FormData) => {
        capturedFormData = formData;
        fakeXhr.status = 201;
        fakeXhr.responseText = JSON.stringify({
          success: true,
          submissionId: "test-id",
          whatsappStatus: "sent",
        });
        fakeXhr.onload?.();
      }),
      upload: { onprogress: null as ((e: ProgressEvent) => void) | null },
      onload: null as (() => void) | null,
      onerror: null as (() => void) | null,
      status: 0,
      responseText: "",
    } as unknown as XMLHttpRequest;

    const result = await submitOnboardingForm(buildValidFormState(), {
      xhrFactory: () => fakeXhr,
    });

    expect(result.success).toBe(true);
    expect(result.submissionId).toBe("test-id");

    expect(capturedFormData).not.toBeNull();
    expect(capturedFormData!.get("fullName")).toBe("Maria Silva");
    expect(capturedFormData!.get("companyName")).toBe("Studio Digital Ltda");
    expect(capturedFormData!.get("isRemote")).toBe("yes");
    expect(capturedFormData!.get("projectType")).toBe("landing_page");
    expect(capturedFormData!.get("deliveryTimeline")).toBe("standard");

    const scopeConfig = JSON.parse(capturedFormData!.get("projectScopeConfig") as string);
    expect(scopeConfig.landingPageCta).toBe("Solicitar Orcamento");
  });

  it("serializes arrays as JSON strings in FormData", async () => {
    let capturedFormData: FormData | null = null;

    const fakeXhr = {
      open: vi.fn(),
      send: vi.fn((formData: FormData) => {
        capturedFormData = formData;
        fakeXhr.status = 201;
        fakeXhr.responseText = JSON.stringify({
          success: true,
          submissionId: "test-id-2",
          whatsappStatus: "sent",
        });
        fakeXhr.onload?.();
      }),
      upload: { onprogress: null as ((e: ProgressEvent) => void) | null },
      onload: null as (() => void) | null,
      onerror: null as (() => void) | null,
      status: 0,
      responseText: "",
    } as unknown as XMLHttpRequest;

    await submitOnboardingForm(buildValidFormState(), {
      xhrFactory: () => fakeXhr,
    });

    const languages = JSON.parse(capturedFormData!.get("siteLanguages") as string);
    expect(languages).toEqual(["Portugues"]);

    const designStyle = JSON.parse(capturedFormData!.get("designStyle") as string);
    expect(designStyle).toEqual(["minimalist", "tech"]);
  });

  it("rejects when XHR returns an error status", async () => {
    const fakeXhr = {
      open: vi.fn(),
      send: vi.fn(() => {
        fakeXhr.status = 400;
        fakeXhr.responseText = JSON.stringify({ error: "Dados invalidos" });
        fakeXhr.onload?.();
      }),
      upload: { onprogress: null as ((e: ProgressEvent) => void) | null },
      onload: null as (() => void) | null,
      onerror: null as (() => void) | null,
      status: 0,
      responseText: "",
    } as unknown as XMLHttpRequest;

    await expect(
      submitOnboardingForm(buildValidFormState(), { xhrFactory: () => fakeXhr }),
    ).rejects.toThrow("Dados invalidos");
  });
});
