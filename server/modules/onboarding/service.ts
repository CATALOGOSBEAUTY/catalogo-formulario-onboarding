import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AppEnv } from "../../config/env.js";
import { sendBriefingEmail } from "./email.js";
import type {
  OnboardingService,
  OnboardingSubmissionInput,
  OnboardingSubmissionResult,
  OnboardingUploadedFile,
} from "./types.js";

interface CreateOnboardingServiceDeps {
  env: AppEnv;
  supabase: SupabaseClient;
}

function sanitizeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
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

export function createOnboardingService({
  env,
  supabase,
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
        current_pain_points: input.currentPainPoints,
        current_pain_point_other: input.currentPainPointOther || null,
        target_audience_types: input.targetAudienceTypes,
        audience_age_range: input.audienceAgeRange,
        audience_behavior: input.audienceDigitalBehavior,
        competitors: input.competitors || null,
        competitor_likes: input.competitorLikes,
        unique_value_props: input.uniqueValueProps,
        unique_value_prop_other: input.uniqueValuePropOther || null,
        has_social_media: input.hasSocialMedia,
        social_media_networks: input.hasSocialMedia ? input.socialMediaNetworks : [],
        social_media_handles: input.hasSocialMedia ? input.socialMediaHandles : null,

        project_type: input.projectType,
        project_goals: input.projectGoals,
        project_goals_other: input.projectGoalsOther || null,
        needs_cms: input.needsCms,
        needs_contact_form: input.needsContactForm,
        needs_whatsapp: input.needsWhatsApp,
        needs_seo: input.needsSeo,
        site_languages: input.siteLanguages,

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

      // Send email notification
      try {
        await sendBriefingEmail(env, input);
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
        const message = error instanceof Error ? error.message : "Falha no envio do e-mail";
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
