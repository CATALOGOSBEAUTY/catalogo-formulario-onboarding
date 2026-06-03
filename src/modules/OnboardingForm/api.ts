import type { OnboardingFormState, SubmitOnboardingResponse } from "./types";

interface SubmitOnboardingFormOptions {
  onProgress?: (progress: number) => void;
  xhrFactory?: () => XMLHttpRequest;
}

function appendFiles(formData: FormData, fieldName: string, files: File[]) {
  if (files.length === 0) {
    return;
  }

  files.forEach((file) => {
    formData.append(fieldName, file);
  });
}

function appendArray(formData: FormData, fieldName: string, values: string[]) {
  formData.append(fieldName, JSON.stringify(values));
}

export async function submitOnboardingForm(
  data: OnboardingFormState,
  options: SubmitOnboardingFormOptions = {},
): Promise<SubmitOnboardingResponse> {
  const { onProgress, xhrFactory = () => new XMLHttpRequest() } = options;
  const formData = new FormData();

  // Passo 1: Identidade Comercial
  formData.append("fullName", data.fullName);
  formData.append("companyName", data.companyName);
  formData.append("companySector", data.companySector);
  formData.append("cpfCnpj", data.cpfCnpj);
  formData.append("email", data.email);
  formData.append("commercialContact", data.commercialContact);
  formData.append("currentWebsiteUrl", data.currentWebsiteUrl);
  formData.append("isRemote", data.isRemote ? "yes" : "no");
  formData.append("addressZipcode", data.addressZipcode);
  formData.append("addressStreet", data.addressStreet);
  formData.append("addressNumber", data.addressNumber);
  formData.append("addressNeighborhood", data.addressNeighborhood);
  formData.append("addressCity", data.addressCity);
  formData.append("addressState", data.addressState);

  // Passo 2: Contexto Estrategico
  formData.append("primaryGoal", data.primaryGoal);
  formData.append("currentPainPoint", data.currentPainPoint);
  formData.append("targetAudience", data.targetAudience);
  appendArray(formData, "audienceAgeRange", data.audienceAgeRange);
  appendArray(formData, "audienceDigitalBehavior", data.audienceDigitalBehavior);
  formData.append("competitors", data.competitors);
  formData.append("competitorLikes", data.competitorLikes);
  formData.append("uniqueValueProposition", data.uniqueValueProposition);
  formData.append("hasSocialMedia", data.hasSocialMedia ? "yes" : "no");
  formData.append("socialMediaHandles", data.hasSocialMedia ? data.socialMediaHandles : "");

  // Passo 3: Tipo de Projeto e Escopo
  formData.append("projectType", data.projectType);
  formData.append("projectDescription", data.projectDescription);
  formData.append("needsCms", data.needsCms ? "yes" : "no");
  formData.append("needsContactForm", data.needsContactForm ? "yes" : "no");
  formData.append("needsWhatsApp", data.needsWhatsApp ? "yes" : "no");
  formData.append("needsSeo", data.needsSeo ? "yes" : "no");
  appendArray(formData, "siteLanguages", data.siteLanguages);
  appendArray(formData, "analyticsRequired", data.analyticsRequired);
  appendArray(formData, "trackingPixels", data.trackingPixels);

  // Condicionais por tipo (serializados como JSON no campo projectScopeConfig)
  const scopeConfig: Record<string, unknown> = {};

  if (data.projectType === "landing_page") {
    scopeConfig.landingPageCta = data.landingPageCta;
    scopeConfig.hasProductVideo = data.hasProductVideo;
    scopeConfig.leadCaptureMethod = data.leadCaptureMethod;
    scopeConfig.leadDestination = data.leadDestination;
  } else if (data.projectType === "website") {
    scopeConfig.websitePages = data.websitePages;
    scopeConfig.hasPortfolio = data.hasPortfolio;
    scopeConfig.needsTestimonials = data.needsTestimonials;
    scopeConfig.needsAboutPage = data.needsAboutPage;
  } else if (data.projectType === "ecommerce") {
    scopeConfig.productVolume = data.productVolume;
    scopeConfig.ecommercePlatform = data.ecommercePlatform;
    scopeConfig.paymentGateways = data.paymentGateways;
    scopeConfig.salesModels = data.salesModels;
    scopeConfig.needsShippingIntegration = data.needsShippingIntegration;
    scopeConfig.needsCoupons = data.needsCoupons;
    scopeConfig.needsProductReviews = data.needsProductReviews;
  } else if (data.projectType === "platform") {
    scopeConfig.platformType = data.platformType;
    scopeConfig.platformUserTypes = data.platformUserTypes;
    scopeConfig.platformFeatures = data.platformFeatures;
    scopeConfig.needsMobileApp = data.needsMobileApp;
    scopeConfig.revenueModel = data.revenueModel;
    scopeConfig.hasLegacySystem = data.hasLegacySystem;
  }

  formData.append("projectScopeConfig", JSON.stringify(scopeConfig));

  // Passo 4: Design, Branding e Infra
  formData.append("brandingStatus", data.brandingStatus);
  appendArray(formData, "designStyle", data.designStyle);
  appendArray(formData, "brandVoice", data.brandVoice);
  formData.append("designReferences", data.designReferences);
  formData.append("hasDomain", data.hasDomain ? "yes" : "no");
  formData.append("websiteUrl", data.hasDomain ? data.websiteUrl : "");
  formData.append("hasHosting", data.hasHosting ? "yes" : "no");
  formData.append("hostingProvider", data.hasHosting ? data.hostingProvider : "");
  formData.append("needsSeoConsulting", data.needsSeoConsulting ? "yes" : "no");
  formData.append("needsWcagCompliance", data.needsWcagCompliance ? "yes" : "no");
  formData.append("needsPostLaunchSupport", data.needsPostLaunchSupport ? "yes" : "no");

  // Passo 5: Cronograma, Budget e Anexos
  formData.append("decisionMaker", data.decisionMaker);
  formData.append("hasCriticalDeadline", data.hasCriticalDeadline ? "yes" : "no");
  formData.append("criticalDeadlineReason", data.hasCriticalDeadline ? data.criticalDeadlineReason : "");
  formData.append("deliveryTimeline", data.deliveryTimeline);
  formData.append("projectBudget", data.projectBudget);
  formData.append("contentStatus", data.contentStatus);
  formData.append("preferredContactChannel", data.preferredContactChannel);
  formData.append("meetingFrequency", data.meetingFrequency);

  appendFiles(formData, "filesBranding", data.filesBranding);
  appendFiles(formData, "filesReferences", data.filesReferences);

  return new Promise<SubmitOnboardingResponse>((resolve, reject) => {
    const xhr = xhrFactory();

    xhr.open("POST", "/api/onboarding-submissions");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) {
        return;
      }

      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onerror = () => {
      reject(new Error("Falha ao enviar formulario."));
    };

    xhr.onload = () => {
      onProgress?.(100);

      try {
        const payload = JSON.parse(xhr.responseText || "{}") as
          | SubmitOnboardingResponse
          | { error?: string };

        if (xhr.status < 200 || xhr.status >= 300) {
          reject(
            new Error(
              typeof payload === "object" && payload && "error" in payload
                ? payload.error || "Falha ao enviar formulario."
                : "Falha ao enviar formulario.",
            ),
          );
          return;
        }

        resolve(payload as SubmitOnboardingResponse);
      } catch {
        reject(new Error("Falha ao interpretar resposta do formulario."));
      }
    };

    xhr.send(formData);
  });
}
