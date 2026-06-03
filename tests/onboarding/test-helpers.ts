import type { OnboardingUploadedFile, ParsedOnboardingPayload } from "../../server/modules/onboarding/types";

/**
 * Builds a complete, valid ParsedOnboardingPayload for use in tests.
 * Any field can be overridden via `overrides.body` or `overrides.files`.
 */
export function buildValidPayload(
  overrides: {
    body?: Record<string, unknown>;
    files?: OnboardingUploadedFile[];
  } = {},
): ParsedOnboardingPayload {
  const defaultBody: Record<string, unknown> = {
    fullName: "Maria Silva",
    companyName: "Studio Digital Ltda",
    companySector: "Tecnologia e SaaS",
    cpfCnpj: "123.456.789-00",
    email: "maria@empresa.com",
    commercialContact: "(11) 99999-9999",
    currentWebsiteUrl: "",
    isRemote: "yes",
    addressZipcode: "",
    addressStreet: "",
    addressNumber: "",
    addressNeighborhood: "",
    addressCity: "",
    addressState: "",

    primaryGoal: "lead_generation",
    currentPainPoint: "O site atual esta desatualizado e nao converte clientes.",
    targetAudience: "Empreendedores de 25 a 40 anos que buscam automatizar processos comerciais.",
    audienceAgeRange: JSON.stringify(["25 a 34 anos (Millennials)"]),
    audienceDigitalBehavior: JSON.stringify(["Acessa principalmente pelo celular"]),
    competitors: "www.concorrente1.com.br, www.concorrente2.com.br",
    competitorLikes: "Design limpo e checkout rapido",
    uniqueValueProposition: "Automatizamos processos comerciais com inteligencia artificial.",
    hasSocialMedia: "yes",
    socialMediaHandles: "@studiodigital no Instagram",

    projectType: "landing_page",
    projectDescription: "Pagina de captacao de leads para novo produto SaaS de automacao comercial",
    needsCms: "no",
    needsContactForm: "yes",
    needsWhatsApp: "yes",
    needsSeo: "yes",
    siteLanguages: JSON.stringify(["Portugues"]),
    analyticsRequired: JSON.stringify(["Google Analytics 4 (GA4)"]),
    trackingPixels: JSON.stringify(["Meta Pixel (Facebook/Instagram)"]),
    projectScopeConfig: JSON.stringify({
      landingPageCta: "Solicitar Orcamento",
      hasProductVideo: false,
      leadCaptureMethod: "Ambos",
      leadDestination: "WhatsApp",
    }),

    brandingStatus: "partial",
    designStyle: JSON.stringify(["minimalist", "tech"]),
    brandVoice: JSON.stringify(["Profissional e Tecnico", "Jovem e Moderno"]),
    designReferences: "https://stripe.com, https://linear.app",
    hasDomain: "no",
    websiteUrl: "",
    hasHosting: "no",
    hostingProvider: "",
    needsSeoConsulting: "no",
    needsWcagCompliance: "no",
    needsPostLaunchSupport: "yes",

    decisionMaker: "Sou eu mesmo",
    hasCriticalDeadline: "no",
    criticalDeadlineReason: "",
    deliveryTimeline: "standard",
    projectBudget: "tier_2",
    contentStatus: "Temos parte do conteudo e precisamos de apoio",
    preferredContactChannel: "WhatsApp",
    meetingFrequency: "Reunioes semanais de alinhamento",
  };

  const defaultFiles: OnboardingUploadedFile[] = [
    {
      category: "branding",
      originalName: "logo.png",
      mimeType: "image/png",
      size: 2048,
      buffer: Buffer.from("logo-content"),
    },
  ];

  return {
    body: { ...defaultBody, ...(overrides.body || {}) },
    files: overrides.files ?? defaultFiles,
  };
}
