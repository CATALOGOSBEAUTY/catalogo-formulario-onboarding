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
  switch (step) {
    case 1: {
      if (isBlank(data.fullName) || isBlank(data.companyName)) {
        return "Preencha o nome do responsavel e a razao social.";
      }
      if (isBlank(data.companySector)) {
        return "Selecione o segmento de atuacao.";
      }
      if (isBlank(data.cpfCnpj)) {
        return "Preencha o CPF ou CNPJ.";
      }
      return null;
    }

    case 2: {
      if (isBlank(data.email)) {
        return "Preencha o e-mail corporativo.";
      }
      if (isBlank(data.commercialContact)) {
        return "Preencha o WhatsApp de contato.";
      }
      return null;
    }

    case 3: {
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

    case 4: {
      if (isBlank(data.primaryGoal)) {
        return "Selecione o objetivo principal do projeto.";
      }
      if (data.currentPainPoints.length === 0) {
        return "Selecione pelo menos uma dificuldade atual.";
      }
      return null;
    }

    case 5: {
      if (data.targetAudienceTypes.length === 0) {
        return "Selecione pelo menos um tipo de publico-alvo.";
      }
      if (data.audienceAgeRange.length === 0) {
        return "Selecione pelo menos uma faixa etaria.";
      }
      if (data.audienceDigitalBehavior.length === 0) {
        return "Selecione pelo menos um comportamento digital.";
      }
      return null;
    }

    case 6: {
      if (data.uniqueValueProps.length === 0) {
        return "Selecione pelo menos um diferencial competitivo.";
      }
      if (data.hasSocialMedia && data.socialMediaNetworks.length === 0) {
        return "Selecione pelo menos uma rede social ou desmarque a opcao.";
      }
      return null;
    }

    case 7: {
      if (isBlank(data.projectType)) {
        return "Selecione o tipo de projeto.";
      }
      if (data.projectGoals.length === 0) {
        return "Selecione pelo menos um objetivo do projeto.";
      }
      return null;
    }

    case 8: {
      if (data.siteLanguages.length === 0) {
        return "Selecione pelo menos um idioma para o site.";
      }
      if (data.projectType === "ecommerce" && data.paymentGateways.length === 0) {
        return "Selecione pelo menos um gateway de pagamento.";
      }
      if (data.projectType === "platform" && data.platformFeatures.length < 2) {
        return "Selecione pelo menos duas funcionalidades para a plataforma.";
      }
      return null;
    }

    case 9: {
      if (isBlank(data.brandingStatus)) {
        return "Selecione o estagio da identidade visual.";
      }
      if (data.designStyle.length === 0) {
        return "Selecione pelo menos um estilo visual.";
      }
      return null;
    }

    case 10: {
      if (data.brandVoice.length < 2) {
        return "Selecione pelo menos dois tons de voz.";
      }
      if (data.hasDomain && isBlank(data.websiteUrl)) {
        return "Informe a URL do dominio ou desmarque a opcao.";
      }
      if (data.hasHosting && isBlank(data.hostingProvider)) {
        return "Informe o provedor de hospedagem ou desmarque a opcao.";
      }
      return null;
    }

    case 11: {
      if (isBlank(data.contentStatus)) {
        return "Selecione o status do conteudo textual.";
      }
      if (isBlank(data.preferredContactChannel)) {
        return "Selecione o canal de comunicacao preferido.";
      }
      if (isBlank(data.meetingFrequency)) {
        return "Selecione a frequencia de reunioes.";
      }
      if (data.filesBranding.length === 0 && data.filesReferences.length === 0) {
        return "Envie pelo menos um arquivo antes de concluir.";
      }
      if (getTotalSelectedFiles(data) > 10) {
        return "Envie no maximo 10 arquivos no total.";
      }
      return null;
    }

    default:
      return null;
  }
}
