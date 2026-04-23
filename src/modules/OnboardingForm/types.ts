export interface ServiceItem {
  id: string;
  name: string;
  duration: string;
  value: string;
}

export interface ProfessionalItem {
  id: string;
  name: string;
  role: string;
  serviceConfig: string; // Associated service or details
}

export interface OnboardingFormState {
  // Personal & Business
  fullName: string;
  cpf: string;
  email: string;
  commercialContact: string;
  addressZipcode: string;
  addressStreet: string;
  addressNumber: string;
  addressNeighborhood: string;

  // Services
  services: ServiceItem[];
  professionals: ProfessionalItem[];

  // Config & Policies
  schedulingModel: string;
  cancellationFine: string;
  rescheduleDetails: string;
  upfrontCost: string;

  // Media
  photosProcedures: FileList | null;
  photosFacade: FileList | null;

  // Tech
  hasDomain: "yes" | "no";
  websiteUrl: string;
  hostingProvider: string;
}

export interface SubmitOnboardingResponse {
  success: boolean;
  submissionId: string;
  whatsappStatus: "pending" | "sent" | "failed";
  warning?: string;
}
