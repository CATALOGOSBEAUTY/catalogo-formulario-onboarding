import type { OnboardingFormState } from "./types";

function isBlank(value: string) {
  return value.trim().length === 0;
}

function getTotalSelectedFiles(data: OnboardingFormState) {
  return data.filesBranding.length + data.filesReferences.length;
}

export function getStepValidationError(
  step: number,
  data: OnboardingFormState,
): string | null {
  if (step === 1) {
    if (isBlank(data.fullName) || isBlank(data.companyName)) {
      return "Preencha o nome do responsavel e a razao social antes de continuar.";
    }

    if (isBlank(data.cpfCnpj) || isBlank(data.email) || isBlank(data.commercialContact)) {
      return "Preencha CPF/CNPJ, e-mail e WhatsApp antes de continuar.";
    }

    if (!data.isRemote) {
      if (
        isBlank(data.addressZipcode) ||
        isBlank(data.addressStreet) ||
        isBlank(data.addressNumber) ||
        isBlank(data.addressCity) ||
        isBlank(data.addressState)
      ) {
        return "Preencha o endereco completo ou marque que a empresa opera remotamente.";
      }
    }

    return null;
  }

  if (step === 2) {
    if (isBlank(data.primaryGoal)) {
      return "Selecione o objetivo principal do projeto antes de continuar.";
    }

    if (isBlank(data.currentPainPoint) || data.currentPainPoint.trim().length < 20) {
      return "Descreva o que nao esta funcionando hoje com pelo menos 20 caracteres.";
    }

    if (isBlank(data.targetAudience) || data.targetAudience.trim().length < 20) {
      return "Descreva o perfil do publico-alvo com pelo menos 20 caracteres.";
    }

    if (data.audienceAgeRange.length === 0) {
      return "Selecione pelo menos uma faixa etaria predominante.";
    }

    if (data.audienceDigitalBehavior.length === 0) {
      return "Selecione pelo menos um comportamento digital do publico.";
    }

    if (isBlank(data.uniqueValueProposition)) {
      return "Descreva a proposta unica de valor antes de continuar.";
    }

    if (data.hasSocialMedia && isBlank(data.socialMediaHandles)) {
      return "Informe os perfis das redes sociais ou desmarque a opcao.";
    }

    return null;
  }

  if (step === 3) {
    if (isBlank(data.projectType)) {
      return "Selecione o tipo de projeto antes de continuar.";
    }

    if (isBlank(data.projectDescription) || data.projectDescription.trim().length < 30) {
      return "Descreva o projeto com pelo menos 30 caracteres.";
    }

    if (data.siteLanguages.length === 0) {
      return "Selecione pelo menos um idioma para o site.";
    }

    if (data.projectType === "ecommerce" && data.paymentGateways.length === 0) {
      return "Selecione pelo menos um gateway de pagamento para o e-commerce.";
    }

    if (data.projectType === "platform" && data.platformFeatures.length < 2) {
      return "Selecione pelo menos duas funcionalidades para a plataforma.";
    }

    return null;
  }

  if (step === 4) {
    if (isBlank(data.brandingStatus)) {
      return "Selecione o estagio da identidade visual antes de continuar.";
    }

    if (data.designStyle.length === 0) {
      return "Selecione pelo menos um estilo visual desejado.";
    }

    if (data.brandVoice.length < 2) {
      return "Selecione pelo menos dois tons de voz da marca.";
    }

    if (data.hasDomain && isBlank(data.websiteUrl)) {
      return "Informe a URL do dominio ou desmarque a opcao.";
    }

    if (data.hasHosting && isBlank(data.hostingProvider)) {
      return "Informe o provedor de hospedagem ou desmarque a opcao.";
    }

    return null;
  }

  if (step !== 5) {
    return null;
  }

  if (isBlank(data.deliveryTimeline)) {
    return "Selecione o prazo estimado de entrega.";
  }

  if (isBlank(data.projectBudget)) {
    return "Selecione a faixa de investimento estimada.";
  }

  if (data.filesBranding.length === 0 && data.filesReferences.length === 0) {
    return "Envie pelo menos um arquivo de branding ou referencia antes de concluir.";
  }

  if (getTotalSelectedFiles(data) > 10) {
    return "Envie no maximo 10 arquivos no total antes de concluir.";
  }

  if (data.hasCriticalDeadline && isBlank(data.criticalDeadlineReason)) {
    return "Descreva o motivo do prazo critico ou desmarque a opcao.";
  }

  return null;
}
