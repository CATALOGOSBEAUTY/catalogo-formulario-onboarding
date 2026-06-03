// ===== Enums / Union Types =====

export type PrimaryGoal =
  | "lead_generation"
  | "brand_awareness"
  | "online_sales"
  | "saas_subscriptions"
  | "member_community"
  | "portfolio_showcase"
  | "event_launch";

export type ProjectType = "" | "landing_page" | "website" | "ecommerce" | "platform";

export type BrandingStatus = "" | "ready" | "partial" | "none";

export type DesignStyle = "minimalist" | "tech" | "corporate" | "creative" | "luxury" | "warm";

export type DeliveryTimeline = "" | "urgent" | "standard" | "structured" | "flexible";

export type ProjectBudget = "" | "tier_1" | "tier_2" | "tier_3" | "tier_4" | "tier_5";

// ===== Form State (Frontend) =====

export interface OnboardingFormState {
  // Step 01 — Dados do Responsavel
  fullName: string;
  companyName: string;
  companySector: string;
  cpfCnpj: string;

  // Step 02 — Contato Comercial
  email: string;
  commercialContact: string;
  currentWebsiteUrl: string;

  // Step 03 — Localizacao
  isRemote: boolean;
  addressZipcode: string;
  addressStreet: string;
  addressNumber: string;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;

  // Step 04 — Objetivo e Dor Atual
  primaryGoal: PrimaryGoal | "";
  currentPainPoints: string[];         // was string, now multi-select
  currentPainPointOther: string;       // "Outro" field

  // Step 05 — Publico-Alvo
  targetAudienceTypes: string[];       // was string, now multi-select
  audienceAgeRange: string[];
  audienceDigitalBehavior: string[];

  // Step 06 — Mercado e Posicionamento
  competitors: string;                 // stays string (URLs/names)
  competitorLikes: string[];           // was string, now multi-select
  uniqueValueProps: string[];          // was string, now multi-select
  uniqueValuePropOther: string;        // "Outro" field
  hasSocialMedia: boolean;
  socialMediaNetworks: string[];       // which networks (Instagram, LinkedIn, etc.)
  socialMediaHandles: string;          // the actual handles text

  // Step 07 — Tipo de Projeto
  projectType: ProjectType;
  projectGoals: string[];              // was projectDescription string, now multi-select
  projectGoalsOther: string;           // "Detalhes adicionais" field

  // Step 08 — Recursos e Escopo Tecnico
  needsCms: boolean;
  needsContactForm: boolean;
  needsWhatsApp: boolean;
  needsSeo: boolean;
  siteLanguages: string[];
  analyticsRequired: string[];
  trackingPixels: string[];
  // Landing Page conditionals
  landingPageCta: string;
  hasProductVideo: boolean;
  leadCaptureMethod: string;
  leadDestination: string;
  // Website conditionals
  websitePages: string[];
  hasPortfolio: boolean;
  needsTestimonials: boolean;
  needsAboutPage: boolean;
  // Ecommerce conditionals
  productVolume: string;
  ecommercePlatform: string;
  paymentGateways: string[];
  salesModels: string[];
  needsShippingIntegration: boolean;
  needsCoupons: boolean;
  needsProductReviews: boolean;
  // Platform conditionals
  platformType: string;
  platformUserTypes: string[];
  platformFeatures: string[];
  needsMobileApp: boolean;
  revenueModel: string;
  hasLegacySystem: boolean;

  // Step 09 — Identidade Visual
  brandingStatus: BrandingStatus;
  designStyle: DesignStyle[];

  // Step 10 — Voz, Referencias e Infraestrutura
  brandVoice: string[];
  designReferences: string;            // stays string (URLs)
  hasDomain: boolean;
  websiteUrl: string;
  hasHosting: boolean;
  hostingProvider: string;
  needsSeoConsulting: boolean;
  needsWcagCompliance: boolean;
  needsPostLaunchSupport: boolean;

  // Step 11 — Prazo e Investimento
  decisionMaker: string;
  hasCriticalDeadline: boolean;
  criticalDeadlineReason: string;      // now comes from select options
  deliveryTimeline: DeliveryTimeline;
  projectBudget: ProjectBudget;

  // Step 12 — Conteudo e Anexos
  contentStatus: string;
  preferredContactChannel: string;
  meetingFrequency: string;
  filesBranding: File[];
  filesReferences: File[];
}

export const INITIAL_FORM_STATE: OnboardingFormState = {
  fullName: "",
  companyName: "",
  companySector: "",
  cpfCnpj: "",
  email: "",
  commercialContact: "",
  currentWebsiteUrl: "",
  isRemote: false,
  addressZipcode: "",
  addressStreet: "",
  addressNumber: "",
  addressNeighborhood: "",
  addressCity: "",
  addressState: "",
  primaryGoal: "",
  currentPainPoints: [],
  currentPainPointOther: "",
  targetAudienceTypes: [],
  audienceAgeRange: [],
  audienceDigitalBehavior: [],
  competitors: "",
  competitorLikes: [],
  uniqueValueProps: [],
  uniqueValuePropOther: "",
  hasSocialMedia: false,
  socialMediaNetworks: [],
  socialMediaHandles: "",
  projectType: "",
  projectGoals: [],
  projectGoalsOther: "",
  needsCms: false,
  needsContactForm: false,
  needsWhatsApp: false,
  needsSeo: false,
  siteLanguages: [],
  analyticsRequired: [],
  trackingPixels: [],
  landingPageCta: "",
  hasProductVideo: false,
  leadCaptureMethod: "",
  leadDestination: "",
  websitePages: [],
  hasPortfolio: false,
  needsTestimonials: false,
  needsAboutPage: false,
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
  brandingStatus: "",
  designStyle: [],
  brandVoice: [],
  designReferences: "",
  hasDomain: false,
  websiteUrl: "",
  hasHosting: false,
  hostingProvider: "",
  needsSeoConsulting: false,
  needsWcagCompliance: false,
  needsPostLaunchSupport: false,
  decisionMaker: "",
  hasCriticalDeadline: false,
  criticalDeadlineReason: "",
  deliveryTimeline: "",
  projectBudget: "",
  contentStatus: "",
  preferredContactChannel: "",
  meetingFrequency: "",
  filesBranding: [],
  filesReferences: [],
};
