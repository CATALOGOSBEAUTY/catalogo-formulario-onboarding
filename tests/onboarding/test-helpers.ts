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
    currentPainPoints: JSON.stringify(["Site desatualizado e sem design profissional", "Nao converte visitantes em clientes/leads"]),
    currentPainPointOther: "",
    targetAudienceTypes: JSON.stringify(["Outras empresas (B2B)", "Startups e PMEs"]),
    audienceAgeRange: JSON.stringify(["25 a 34 anos (Millennials)"]),
    audienceDigitalBehavior: JSON.stringify(["Acessa principalmente pelo celular"]),
    competitors: "www.concorrente1.com.br, www.concorrente2.com.br",
    competitorLikes: JSON.stringify(["Design limpo e profissional", "Navegacao intuitiva e rapida"]),
    uniqueValueProps: JSON.stringify(["Tecnologia/inovacao exclusiva", "Atendimento humanizado e personalizado"]),
    uniqueValuePropOther: "",
    hasSocialMedia: "yes",
    socialMediaNetworks: JSON.stringify(["Instagram", "LinkedIn"]),
    socialMediaHandles: "@studiodigital no Instagram",

    projectType: "landing_page",
    projectGoals: JSON.stringify(["Captar leads e contatos comerciais", "Apresentar a empresa e seus servicos"]),
    projectGoalsOther: "",
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
