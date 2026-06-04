import type { OnboardingFormState } from "./types";

export interface SubmitOnboardingResponse {
  id: string;
  warning?: string;
}

interface SubmitOnboardingFormOptions {
  onProgress?: (progress: number) => void;
  xhrFactory?: () => XMLHttpRequest;
}

function appendFiles(formData: FormData, fieldName: string, files: File[]) {
  if (files.length === 0) return;
  files.forEach((file) => formData.append(fieldName, file));
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

  // Step 01-03: Identidade e Localizacao
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

  // Step 04-06: Estrategia e Mercado
  formData.append("primaryGoal", data.primaryGoal);
  appendArray(formData, "currentPainPoints", data.currentPainPoints);
  formData.append("currentPainPointOther", data.currentPainPointOther);
  appendArray(formData, "targetAudienceTypes", data.targetAudienceTypes);
  appendArray(formData, "audienceAgeRange", data.audienceAgeRange);
  appendArray(formData, "audienceDigitalBehavior", data.audienceDigitalBehavior);
  formData.append("competitors", data.competitors);
  appendArray(formData, "competitorLikes", data.competitorLikes);
  appendArray(formData, "uniqueValueProps", data.uniqueValueProps);
  formData.append("uniqueValuePropOther", data.uniqueValuePropOther);
  formData.append("hasSocialMedia", data.hasSocialMedia ? "yes" : "no");
  appendArray(formData, "socialMediaNetworks", data.socialMediaNetworks);
  formData.append("socialMediaHandles", data.hasSocialMedia ? data.socialMediaHandles : "");

  // Step 07-08: Projeto e Escopo
  formData.append("projectType", data.projectType);
  appendArray(formData, "projectGoals", data.projectGoals);
  formData.append("projectGoalsOther", data.projectGoalsOther);
  formData.append("needsCms", data.needsCms ? "yes" : "no");
  formData.append("needsContactForm", data.needsContactForm ? "yes" : "no");
  formData.append("needsWhatsApp", data.needsWhatsApp ? "yes" : "no");
  formData.append("needsSeo", data.needsSeo ? "yes" : "no");
  appendArray(formData, "siteLanguages", data.siteLanguages);


  // Condicionais por tipo (JSONB)
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

  // Step 09-10: Design e Infra
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

  // Step 11: Conteudo e Anexos
  formData.append("contentStatus", data.contentStatus);
  formData.append("preferredContactChannel", data.preferredContactChannel);
  formData.append("meetingFrequency", data.meetingFrequency);

  appendFiles(formData, "filesBranding", data.filesBranding);
  appendFiles(formData, "filesReferences", data.filesReferences);

  return new Promise<SubmitOnboardingResponse>((resolve, reject) => {
    const xhr = xhrFactory();
    xhr.open("POST", "/api/onboarding-submissions");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onerror = () => reject(new Error("Falha ao enviar formulario."));

    xhr.onload = () => {
      onProgress?.(100);
      try {
        const rawPayload = JSON.parse(xhr.responseText || "{}");
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error(rawPayload && typeof rawPayload === "object" && "error" in rawPayload ? rawPayload.error || "Falha ao enviar formulario." : "Falha ao enviar formulario."));
          return;
        }
        const mappedPayload: SubmitOnboardingResponse = {
          id: rawPayload.submissionId || rawPayload.id || "",
          warning: rawPayload.warning,
        };
        resolve(mappedPayload);
      } catch {
        reject(new Error("Falha ao interpretar resposta do formulario."));
      }
    };

    xhr.send(formData);
  });
}
