import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AppEnv } from "../../config/env.js";
import { formatOnboardingWhatsAppMessage } from "./message.js";
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

interface EvolutionInstanceRecord {
  name?: string;
  ownerJid?: string;
  instance?: {
    instanceName?: string;
  };
  owner?: {
    id?: string;
    jid?: string;
  };
}

function sanitizeDigits(value: string) {
  return value.replace(/\D/g, "");
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

function parseEvolutionInstances(payload: unknown): EvolutionInstanceRecord[] {
  if (Array.isArray(payload)) {
    return payload as EvolutionInstanceRecord[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const candidate = payload as {
    value?: unknown;
    instances?: unknown;
  };

  if (Array.isArray(candidate.value)) {
    return candidate.value as EvolutionInstanceRecord[];
  }

  if (Array.isArray(candidate.instances)) {
    return candidate.instances as EvolutionInstanceRecord[];
  }

  return [];
}

function extractInstanceName(instance: EvolutionInstanceRecord) {
  return instance.name ?? instance.instance?.instanceName ?? "";
}

function extractInstanceOwnerJid(instance: EvolutionInstanceRecord) {
  return instance.ownerJid ?? instance.owner?.jid ?? instance.owner?.id ?? "";
}

async function resolveInstanceDestinationNumber(env: AppEnv, fetchImpl: typeof fetch) {
  const response = await fetchImpl(
    `${env.EVOLUTION_API_URL.replace(/\/+$/, "")}/instance/fetchInstances`,
    {
      method: "GET",
      headers: getEvolutionHeaders(env.EVOLUTION_API_KEY),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao consultar instancia Evolution: ${errorText}`);
  }

  const payload = (await response.json()) as unknown;
  const instances = parseEvolutionInstances(payload);
  const instance = instances.find(
    (candidate) => extractInstanceName(candidate) === env.EVOLUTION_INSTANCE_NAME,
  );

  if (!instance) {
    throw new Error(
      `Instancia Evolution nao encontrada: ${env.EVOLUTION_INSTANCE_NAME}`,
    );
  }

  const destinationNumber = sanitizeDigits(extractInstanceOwnerJid(instance));

  if (!destinationNumber) {
    throw new Error(
      `Instancia Evolution sem ownerJid valido: ${env.EVOLUTION_INSTANCE_NAME}`,
    );
  }

  return destinationNumber;
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

async function sendWhatsAppMessage(
  env: AppEnv,
  fetchImpl: typeof fetch,
  input: OnboardingSubmissionInput,
) {
  const destinationNumber = await resolveInstanceDestinationNumber(env, fetchImpl);
  const response = await fetchImpl(
    `${env.EVOLUTION_API_URL.replace(/\/+$/, "")}/message/sendText/${env.EVOLUTION_INSTANCE_NAME}`,
    {
      method: "POST",
      headers: getEvolutionHeaders(env.EVOLUTION_API_KEY),
      body: JSON.stringify({
        number: destinationNumber,
        text: formatOnboardingWhatsAppMessage(input),
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao enviar mensagem via Evolution: ${errorText}`);
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
        scheduling_model: input.schedulingModel,
        cancellation_fine: input.cancellationFine,
        reschedule_details: input.rescheduleDetails,
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

      const { error: professionalsError } = await supabase.from("onboarding_professionals").insert(
        input.professionals.map((professional, index) => ({
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
        await sendWhatsAppMessage(env, fetchImpl, input);
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
