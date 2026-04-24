import type { OnboardingFormState, ProfessionalItem, ServiceItem } from "./types";

function isBlank(value: string) {
  return value.trim().length === 0;
}

function hasIncompleteService(services: ServiceItem[]) {
  return services.some(
    (service) =>
      isBlank(service.name) || isBlank(service.duration) || isBlank(service.value),
  );
}

function hasIncompleteProfessional(professionals: ProfessionalItem[]) {
  return professionals.some(
    (professional) =>
      isBlank(professional.name) ||
      isBlank(professional.role) ||
      isBlank(professional.serviceConfig),
  );
}

export function getStepValidationError(
  step: number,
  data: OnboardingFormState,
): string | null {
  if (step !== 2) {
    return null;
  }

  if (data.services.length === 0) {
    return "Adicione pelo menos um servico antes de continuar.";
  }

  if (hasIncompleteService(data.services)) {
    return "Preencha todos os dados dos servicos antes de continuar.";
  }

  if (data.professionals.length === 0) {
    return "Adicione pelo menos um profissional antes de continuar.";
  }

  if (hasIncompleteProfessional(data.professionals)) {
    return "Preencha todos os dados dos profissionais antes de continuar.";
  }

  return null;
}
