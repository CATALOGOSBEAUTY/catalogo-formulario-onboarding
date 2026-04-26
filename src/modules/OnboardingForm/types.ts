export type DurationUnit = "minutes" | "hours";
export type CurrencyUnit = "BRL" | "USD";
export type PriceUnit = CurrencyUnit | "PERCENT";

export interface ServiceItem {
  id: string;
  name: string;
  professionalName: string;
  durationValue: string;
  durationUnit: DurationUnit;
  valueAmount: string;
  valueUnit: CurrencyUnit;
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
  appointmentFlow: string;
  cancellationLevel: string;
  rescheduleLevel: string;

  // Config & Policies
  schedulingModel: string;
  cancellationFineAmount: string;
  cancellationFineUnit: PriceUnit;
  rescheduleDetails: string;
  upfrontCostAmount: string;
  upfrontCostUnit: PriceUnit;

  // Media
  photosProcedures: File[];
  photosFacade: File[];

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
