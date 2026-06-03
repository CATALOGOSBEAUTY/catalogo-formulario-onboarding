export type ProjectType = "landing_page" | "website" | "ecommerce" | "platform";
export type BrandingStatus = "ready" | "partial" | "none";
export type DesignStyle = "minimalist" | "tech" | "corporate" | "creative" | "luxury" | "warm";
export type DeliveryTimeline = "urgent" | "standard" | "structured" | "flexible";
export type ProjectBudget = "tier_1" | "tier_2" | "tier_3" | "tier_4" | "tier_5";
export type PrimaryGoal =
  | "lead_generation"
  | "brand_awareness"
  | "online_sales"
  | "saas_subscriptions"
  | "member_community"
  | "portfolio_showcase"
  | "event_launch";

export interface OnboardingFormState {
  // === PASSO 1: Identidade Comercial ===
  fullName: string;
  companyName: string;
  companySector: string;
  cpfCnpj: string;
  email: string;
  commercialContact: string;
  currentWebsiteUrl: string;
  isRemote: boolean;
  addressZipcode: string;
  addressStreet: string;
  addressNumber: string;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;

  // === PASSO 2: Contexto Estrategico ===
  primaryGoal: PrimaryGoal | "";
  currentPainPoint: string;
  targetAudience: string;
  audienceAgeRange: string[];
  audienceDigitalBehavior: string[];
  competitors: string;
  competitorLikes: string;
  uniqueValueProposition: string;
  hasSocialMedia: boolean;
  socialMediaHandles: string;

  // === PASSO 3: Tipo de Projeto e Escopo ===
  projectType: ProjectType | "";
  projectDescription: string;
  needsCms: boolean;
  needsContactForm: boolean;
  needsWhatsApp: boolean;
  needsSeo: boolean;
  siteLanguages: string[];
  analyticsRequired: string[];
  trackingPixels: string[];

  // Condicionais Landing Page
  landingPageCta: string;
  hasProductVideo: boolean;
  leadCaptureMethod: string;
  leadDestination: string;

  // Condicionais Website
  websitePages: string[];
  hasPortfolio: boolean;
  needsTestimonials: boolean;
  needsAboutPage: boolean;

  // Condicionais Ecommerce
  productVolume: string;
  ecommercePlatform: string;
  paymentGateways: string[];
  salesModels: string[];
  needsShippingIntegration: boolean;
  needsCoupons: boolean;
  needsProductReviews: boolean;

  // Condicionais Platform
  platformType: string;
  platformUserTypes: string[];
  platformFeatures: string[];
  needsMobileApp: boolean;
  revenueModel: string;
  hasLegacySystem: boolean;

  // === PASSO 4: Design, Branding e Infra ===
  brandingStatus: BrandingStatus | "";
  designStyle: DesignStyle[];
  brandVoice: string[];
  designReferences: string;
  hasDomain: boolean;
  websiteUrl: string;
  hasHosting: boolean;
  hostingProvider: string;
  needsSeoConsulting: boolean;
  needsWcagCompliance: boolean;
  needsPostLaunchSupport: boolean;

  // === PASSO 5: Cronograma, Budget e Anexos ===
  decisionMaker: string;
  hasCriticalDeadline: boolean;
  criticalDeadlineReason: string;
  deliveryTimeline: DeliveryTimeline | "";
  projectBudget: ProjectBudget | "";
  contentStatus: string;
  preferredContactChannel: string;
  meetingFrequency: string;
  filesBranding: File[];
  filesReferences: File[];
}

export interface SubmitOnboardingResponse {
  success: boolean;
  submissionId: string;
  whatsappStatus: "pending" | "sent" | "failed";
  warning?: string;
}
