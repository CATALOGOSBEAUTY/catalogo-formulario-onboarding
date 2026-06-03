export type OnboardingFileCategory = "branding" | "references";

export interface OnboardingUploadedFile {
  category: OnboardingFileCategory;
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
}

export interface OnboardingSubmissionInput {
  // Passo 1: Identidade Comercial
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

  // Passo 2: Contexto Estrategico
  primaryGoal: string;
  currentPainPoint: string;
  targetAudience: string;
  audienceAgeRange: string[];
  audienceDigitalBehavior: string[];
  competitors: string;
  competitorLikes: string;
  uniqueValueProposition: string;
  hasSocialMedia: boolean;
  socialMediaHandles: string;

  // Passo 3: Tipo de Projeto e Escopo
  projectType: string;
  projectDescription: string;
  needsCms: boolean;
  needsContactForm: boolean;
  needsWhatsApp: boolean;
  needsSeo: boolean;
  siteLanguages: string[];
  analyticsRequired: string[];
  trackingPixels: string[];
  projectScopeConfig: Record<string, unknown>;

  // Passo 4: Design, Branding e Infra
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

  // Passo 5: Cronograma, Budget e Anexos
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
