import type { OnboardingFormState, ServiceItem } from "./types";

function isBlank(value: string) {
  return value.trim().length === 0;
}

function hasIncompleteService(services: ServiceItem[]) {
  return services.some(
    (service) =>
      isBlank(service.name) ||
      isBlank(service.professionalName) ||
      isBlank(service.durationValue) ||
      isBlank(service.valueAmount),
  );
}

function getTotalSelectedImages(data: OnboardingFormState) {
  return data.photosProcedures.length + data.photosFacade.length;
}

export function getStepValidationError(
  step: number,
  data: OnboardingFormState,
): string | null {
  if (step === 2) {
    if (data.services.length === 0) {
      return "Adicione pelo menos um servico antes de continuar.";
    }

    if (hasIncompleteService(data.services)) {
      return "Preencha todos os dados dos servicos antes de continuar.";
    }

    if (
      isBlank(data.appointmentFlow) ||
      isBlank(data.cancellationLevel) ||
      isBlank(data.rescheduleLevel)
    ) {
      return "Preencha o fluxo de agendamentos, cancelamentos e reagendamentos antes de continuar.";
    }

    return null;
  }

  if (step !== 4) {
    return null;
  }

  if (data.photosProcedures.length === 0 || data.photosFacade.length === 0) {
    return "Envie as fotos obrigatorias antes de concluir.";
  }

  if (getTotalSelectedImages(data) > 10) {
    return "Envie no maximo 10 imagens no total antes de concluir.";
  }

  if (data.hasDomain === "yes" && (isBlank(data.websiteUrl) || isBlank(data.hostingProvider))) {
    return "Preencha os dados da area tecnologica ou marque que ainda nao possui.";
  }

  return null;
}
