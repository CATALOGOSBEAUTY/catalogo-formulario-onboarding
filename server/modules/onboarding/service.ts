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

function deriveProfessionalsFromServices(input: OnboardingSubmissionInput) {
  const grouped = new Map<string, Set<string>>();

  input.services.forEach((service) => {
    const current = grouped.get(service.professionalName) || new Set<string>();
    current.add(service.name);
    grouped.set(service.professionalName, current);
  });

  return Array.from(grouped.entries()).map(([name, services]) => ({
    name,
    role: "Profissional vinculado",
    serviceConfig: Array.from(services).join(", "),
  }));
}

function appendContext(value: string, label: string, context: string) {
  return `${value}\n${label}: ${context}`;
}

async function sendWhatsAppWorkbookMessage(
  env: AppEnv,
  fetchImpl: typeof fetch,
  destinationNumber: string,
  input: OnboardingSubmissionInput,
) {
  const workbook = await buildOnboardingWorkbook(input);
  const fileName = `onboarding-${sanitizeSegment(input.fullName || "cliente")}.xlsx`;
  const response = await fetchImpl(
    `${env.EVOLUTION_API_URL.replace(/\/+$/, "")}/message/sendMedia/${env.EVOLUTION_INSTANCE_NAME}`,
    {
      method: "POST",
      headers: getEvolutionHeaders(env.EVOLUTION_API_KEY),
      body: JSON.stringify({
        number: destinationNumber,
        mediatype: "document",
        mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        caption: "planilha organizada do onboarding com dados, servicos e imagens separadas por abas.",
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
        cpf_cnpj: input.cpfCnpj,
        email: input.email,
        commercial_contact: input.commercialContact,
        address_zipcode: input.addressZipcode,
        address_street: input.addressStreet,
        address_number: input.addressNumber,
        address_neighborhood: input.addressNeighborhood,
        scheduling_model: appendContext(
          appendContext(
            input.schedulingModel,
            "Fluxo de pessoas que agendam",
            input.appointmentFlow,
          ),
          "Assessora virtual para WhatsApp",
          input.virtualAssistantEnabled ? input.virtualAssistantScope : "Nao solicitada",
        ),
        cancellation_fine: appendContext(
          input.cancellationFine,
          "Nivel de cancelamento",
          input.cancellationLevel,
        ),
        reschedule_details: appendContext(
          input.rescheduleDetails,
          "Nivel de reagendamento",
          input.rescheduleLevel,
        ),
        upfront_cost: input.upfrontCost,
        has_domain: input.hasDomain,
        website_url: input.websiteUrl,
        hosting_provider: input.hostingProvider,
        whatsapp_status: "pending",
        submitted_at: now,
        created_at: now,
        updated_at: now,
      });

      if (submissionError) {
        throw new Error(`Falha ao salvar submissao: ${submissionError.message}`);
      }

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

      const { error: servicesError } = await supabase.from("onboarding_services").insert(
        input.services.map((service, index) => ({
          id: randomUUID(),
          submission_id: submissionId,
          name: service.name,
          duration: service.duration,
          value: service.value,
          position: index,
        })),
      );

      if (servicesError) {
        throw new Error(`Falha ao salvar servicos: ${servicesError.message}`);
      }

      const derivedProfessionals = deriveProfessionalsFromServices(input);
      const { error: professionalsError } = await supabase.from("onboarding_professionals").insert(
        derivedProfessionals.map((professional, index) => ({
          id: randomUUID(),
          submission_id: submissionId,
          name: professional.name,
          role: professional.role,
          service_config: professional.serviceConfig,
          position: index,
        })),
      );

      if (professionalsError) {
        throw new Error(`Falha ao salvar profissionais: ${professionalsError.message}`);
      }

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
