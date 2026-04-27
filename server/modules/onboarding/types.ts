export type OnboardingFileCategory = "procedures" | "facade";

export interface OnboardingUploadedFile {
  category: OnboardingFileCategory;
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
}

export interface OnboardingServiceItemInput {
  name: string;
  professionalName: string;
  duration: string;
  value: string;
}

export interface OnboardingSubmissionInput {
  fullName: string;
  cpfCnpj: string;
  email: string;
  commercialContact: string;
  addressZipcode: string;
  addressStreet: string;
  addressNumber: string;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;
  appointmentFlow: string;
  cancellationLevel: string;
  rescheduleLevel: string;
  schedulingModel: string;
  virtualAssistantEnabled: boolean;
  virtualAssistantScope: string;
  cancellationFine: string;
  rescheduleDetails: string;
  upfrontCost: string;
  hasDomain: boolean;
  websiteUrl: string;
  hostingProvider: string;
  services: OnboardingServiceItemInput[];
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
