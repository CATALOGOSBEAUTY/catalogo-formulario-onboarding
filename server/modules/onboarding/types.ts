export type OnboardingFileCategory = "branding" | "references";

export interface OnboardingUploadedFile {
  category: OnboardingFileCategory;
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
}

export interface OnboardingSubmissionInput {
  // Steps 01-03: Identidade e Localizacao
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

  // Steps 04-06: Estrategia e Mercado
  primaryGoal: string;
  currentPainPoints: string[];           // was currentPainPoint: string
  currentPainPointOther: string;
  targetAudienceTypes: string[];         // was targetAudience: string
  audienceAgeRange: string[];
  audienceDigitalBehavior: string[];
  competitors: string;
  competitorLikes: string[];             // was competitorLikes: string
  uniqueValueProps: string[];            // was uniqueValueProposition: string
  uniqueValuePropOther: string;
  hasSocialMedia: boolean;
  socialMediaNetworks: string[];
  socialMediaHandles: string;

  // Steps 07-08: Projeto e Escopo
  projectType: string;
  projectGoals: string[];                // was projectDescription: string
  projectGoalsOther: string;
  needsCms: boolean;
  needsContactForm: boolean;
  needsWhatsApp: boolean;
  needsSeo: boolean;
  siteLanguages: string[];
  analyticsRequired: string[];
  trackingPixels: string[];
  projectScopeConfig: Record<string, unknown>;

  // Steps 09-10: Design e Infra
  brandingStatus: string;
  designStyle: string[];
  brandVoice: string[];
  designReferences: string;
  hasDomain: boolean;
  websiteUrl: string;
  hasHosting: boolean;
  hostingProvider: string;
  needsSeoConsulting: boolean;
  needsWcagCompliance: boolean;
  needsPostLaunchSupport: boolean;

  // Steps 11-12: Cronograma e Anexos
  decisionMaker: string;
  hasCriticalDeadline: boolean;
  criticalDeadlineReason: string;
  deliveryTimeline: string;
  projectBudget: string;
  contentStatus: string;
  preferredContactChannel: string;
  meetingFrequency: string;

  files: OnboardingUploadedFile[];
}

export interface ParsedOnboardingPayload {
  body: Record<string, unknown>;
  files: OnboardingUploadedFile[];
}

export interface OnboardingSubmissionResult {
  submissionId: string;
  whatsappStatus: "pending" | "sent" | "failed";
  warning?: string;
}

export interface OnboardingService {
  submit(input: OnboardingSubmissionInput): Promise<OnboardingSubmissionResult>;
}
