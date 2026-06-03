import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AppEnv } from "../../config/env.js";
import { buildOnboardingWorkbook } from "./workbook.js";
import type {
  OnboardingService,
  OnboardingSubmissionInput,
  OnboardingSubmissionResult,
  OnboardingUploadedFile,
} from "./types.js";

interface CreateOnboardingServiceDeps {
  env: AppEnv;
  supabase: SupabaseClient;
  fetchImpl?: typeof fetch;
}

function sanitizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

function normalizeCommercialWhatsAppNumber(value: string) {
  const digits = sanitizeDigits(value);

  if (!digits) {
    throw new Error("WhatsApp comercial sem numero valido.");
  }

  if (digits.startsWith("55")) {
    return digits;
  }

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits;
}

function resolveReportDestinationNumber(env: AppEnv, input: OnboardingSubmissionInput) {
  if (env.ONBOARDING_REPORT_GROUP_JID) {
    return env.ONBOARDING_REPORT_GROUP_JID;
  }

  return normalizeCommercialWhatsAppNumber(input.commercialContact);
}

function sanitizeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getEvolutionHeaders(apiKey: string) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
  };
}

async function uploadFiles(
  supabase: SupabaseClient,
  bucket: string,
  submissionId: string,
  files: OnboardingUploadedFile[],
) {
  const uploadedFiles = [];

  for (const file of files) {
    const fileName = `${Date.now()}-${sanitizeSegment(file.originalName)}`;
    const storagePath = `submissions/${submissionId}/${file.category}/${fileName}`;

    const { error } = await supabase.storage.from(bucket).upload(storagePath, file.buffer, {
      contentType: file.mimeType,
      upsert: false,
    });

    if (error) {
      throw new Error(`Falha ao enviar arquivo para o storage: ${error.message}`);
    }

    uploadedFiles.push({
      submission_id: submissionId,
      category: file.category,
      file_name: file.originalName,
      storage_path: storagePath,
      content_type: file.mimeType,
      size_bytes: file.size,
    });
  }

  return uploadedFiles;
}

async function sendWhatsAppWorkbookMessage(
  env: AppEnv,
  fetchImpl: typeof fetch,
  destinationNumber: string,
  input: OnboardingSubmissionInput,
) {
  const workbook = await buildOnboardingWorkbook(input);
  const fileName = `briefing-${sanitizeSegment(input.companyName || input.fullName || "cliente")}.xlsx`;
  const response = await fetchImpl(
    `${env.EVOLUTION_API_URL.replace(/\/+$/, "")}/message/sendMedia/${env.EVOLUTION_INSTANCE_NAME}`,
    {
      method: "POST",
      headers: getEvolutionHeaders(env.EVOLUTION_API_KEY),
      body: JSON.stringify({
        number: destinationNumber,
        mediatype: "document",
        mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        media: workbook.toString("base64"),
        fileName,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao enviar planilha via Evolution: ${errorText}`);
  }
}

export function createOnboardingService({
  env,
  supabase,
  fetchImpl = fetch,
}: CreateOnboardingServiceDeps): OnboardingService {
  return {
    async submit(input: OnboardingSubmissionInput): Promise<OnboardingSubmissionResult> {
      const submissionId = randomUUID();
      const now = new Date().toISOString();

      const { error: submissionError } = await supabase.from("onboarding_submissions").insert({
        id: submissionId,
        full_name: input.fullName,
        company_name: input.companyName,
        company_sector: input.companySector,
        cpf_cnpj: input.cpfCnpj,
        email: input.email,
        commercial_contact: input.commercialContact,
        current_website_url: input.currentWebsiteUrl || null,
        is_remote: input.isRemote,
        address_zipcode: input.isRemote ? null : input.addressZipcode,
        address_street: input.isRemote ? null : input.addressStreet,
        address_number: input.isRemote ? null : input.addressNumber,
        address_neighborhood: input.isRemote ? null : input.addressNeighborhood,
        address_city: input.isRemote ? null : (input.addressCity || null),
        address_state: input.isRemote ? null : (input.addressState || null),

        primary_goal: input.primaryGoal,
        current_pain_point: input.currentPainPoint,
        target_audience: input.targetAudience,
        audience_age_range: input.audienceAgeRange,
        audience_behavior: input.audienceDigitalBehavior,
        competitors: input.competitors,
        competitor_likes: input.competitorLikes || null,
        unique_value_prop: input.uniqueValueProposition,
        has_social_media: input.hasSocialMedia,
        social_media_handles: input.hasSocialMedia ? input.socialMediaHandles : null,

        project_type: input.projectType,
        project_description: input.projectDescription,
        needs_cms: input.needsCms,
        needs_contact_form: input.needsContactForm,
        needs_whatsapp: input.needsWhatsApp,
        needs_seo: input.needsSeo,
        site_languages: input.siteLanguages,
        analytics_required: input.analyticsRequired,
        tracking_pixels: input.trackingPixels,
        project_scope_config: input.projectScopeConfig,

        branding_status: input.brandingStatus,
        design_style: input.designStyle,
        brand_voice: input.brandVoice,
        design_references: input.designReferences || null,
        has_domain: input.hasDomain,
        website_url: input.hasDomain ? input.websiteUrl : null,
        has_hosting: input.hasHosting,
        hosting_provider: input.hasHosting ? input.hostingProvider : null,
        needs_seo_consulting: input.needsSeoConsulting,
        needs_wcag: input.needsWcagCompliance,
        needs_post_support: input.needsPostLaunchSupport,

        decision_maker: input.decisionMaker,
        has_critical_deadline: input.hasCriticalDeadline,
        critical_deadline_reason: input.hasCriticalDeadline ? input.criticalDeadlineReason : null,
        delivery_timeline: input.deliveryTimeline,
        project_budget: input.projectBudget,
        content_status: input.contentStatus,
        preferred_contact: input.preferredContactChannel,
        meeting_frequency: input.meetingFrequency,

        whatsapp_status: "pending",
        submitted_at: now,
        created_at: now,
        updated_at: now,
      });

      if (submissionError) {
        throw new Error(`Falha ao salvar submissao: ${submissionError.message}`);
      }

      // Upload files
      const uploadedFiles = await uploadFiles(
        supabase,
        env.SUPABASE_STORAGE_BUCKET,
        submissionId,
        input.files,
      );

      if (uploadedFiles.length > 0) {
        const { error } = await supabase.from("onboarding_files").insert(uploadedFiles.map((file) => ({
          id: randomUUID(),
          ...file,
          created_at: now,
        })));

        if (error) {
          throw new Error(`Falha ao salvar metadados dos arquivos: ${error.message}`);
        }
      }

      // Send WhatsApp workbook
      try {
        const destinationNumber = resolveReportDestinationNumber(env, input);
        await sendWhatsAppWorkbookMessage(env, fetchImpl, destinationNumber, input);
        await supabase
          .from("onboarding_submissions")
          .update({
            whatsapp_status: "sent",
            whatsapp_error: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", submissionId);

        return {
          submissionId,
          whatsappStatus: "sent",
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Falha no envio do WhatsApp";
        await supabase
          .from("onboarding_submissions")
          .update({
            whatsapp_status: "failed",
            whatsapp_error: message,
            updated_at: new Date().toISOString(),
          })
          .eq("id", submissionId);

        return {
          submissionId,
          whatsappStatus: "failed",
          warning: message,
        };
      }
    },
  };
}
