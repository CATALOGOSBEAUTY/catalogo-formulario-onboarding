import { z } from "zod";
import type {
  OnboardingFileCategory,
  OnboardingServiceItemInput,
  OnboardingSubmissionInput,
  ParsedOnboardingPayload,
} from "./types.js";

const serviceSchema = z.object({
  name: z.string().trim().min(1),
  professionalName: z.string().trim().min(1),
  duration: z.string().trim().min(1),
  value: z.string().trim().min(1),
});

const fileSchema = z.object({
  category: z.enum(["procedures", "facade"] satisfies [OnboardingFileCategory, OnboardingFileCategory]),
  originalName: z.string().trim().min(1),
  mimeType: z.string().trim().min(1),
  size: z.number().int().positive(),
  buffer: z.instanceof(Buffer),
});

const onboardingSchema = z.object({
  fullName: z.string().trim().min(1),
  cpfCnpj: z.string().trim().min(1),
  email: z.string().trim().email(),
  commercialContact: z.string().trim().min(1),
  addressZipcode: z.string().trim().regex(/^\d{5}-?\d{3}$/),
  addressStreet: z.string().trim().min(1),
  addressNumber: z.string().trim().regex(/^\d+$/),
  addressNeighborhood: z.string().trim().min(1),
  addressCity: z.string().trim().min(1),
  addressState: z.string().trim().regex(/^[A-Z]{2}$/),
  appointmentFlow: z.string().trim().min(1),
  cancellationLevel: z.string().trim().min(1),
  rescheduleLevel: z.string().trim().min(1),
  schedulingModel: z.string().trim().min(1),
  cancellationFine: z.string().trim().min(1),
  rescheduleDetails: z.string().trim().min(1),
  upfrontCost: z.string().trim().min(1),
  hasDomain: z.boolean(),
  websiteUrl: z.string().trim(),
  hostingProvider: z.string().trim(),
  services: z.array(serviceSchema).min(1),
  files: z.array(fileSchema).superRefine((files, ctx) => {
    if (files.length > 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Envie no maximo 10 imagens no total.",
      });
    }

    const categories = new Set(files.map((file) => file.category));
    if (!categories.has("procedures")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Envie ao menos uma foto de procedimentos.",
      });
    }

    if (!categories.has("facade")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Envie ao menos uma foto de fachada.",
      });
    }
  }),
}).superRefine((payload, ctx) => {
  if (payload.hasDomain && (!payload.websiteUrl || !payload.hostingProvider)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Dados da area tecnologica obrigatorios para clientes com site ou dominio.",
      path: ["websiteUrl"],
    });
  }
});

function parseJsonArray<T>(value: unknown, itemParser: (item: unknown) => T): T[] {
  const raw = typeof value === "string" ? value : "[]";
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("Dados do formulario invalidos");
  }

  return parsed.map(itemParser);
}

function parseServiceItem(value: unknown): OnboardingServiceItemInput {
  return serviceSchema.parse(value) as OnboardingServiceItemInput;
}

function parseBooleanFlag(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase() === "yes";
}

export function parseOnboardingRequestPayload(payload: ParsedOnboardingPayload): OnboardingSubmissionInput {
  try {
    const normalized = {
      fullName: payload.body.fullName,
      cpfCnpj: payload.body.cpf,
      email: payload.body.email,
      commercialContact: payload.body.commercialContact,
      addressZipcode: payload.body.addressZipcode,
      addressStreet: payload.body.addressStreet,
      addressNumber: payload.body.addressNumber,
      addressNeighborhood: payload.body.addressNeighborhood,
      addressCity: payload.body.addressCity,
      addressState: payload.body.addressState,
      appointmentFlow: payload.body.appointmentFlow,
      cancellationLevel: payload.body.cancellationLevel,
      rescheduleLevel: payload.body.rescheduleLevel,
      schedulingModel: payload.body.schedulingModel,
      cancellationFine: payload.body.cancellationFine,
      rescheduleDetails: payload.body.rescheduleDetails,
      upfrontCost: payload.body.upfrontCost,
      hasDomain: parseBooleanFlag(payload.body.hasDomain),
      websiteUrl: payload.body.websiteUrl,
      hostingProvider: payload.body.hostingProvider,
      services: parseJsonArray(payload.body.services, parseServiceItem),
      files: payload.files,
    };

    return onboardingSchema.parse(normalized) as OnboardingSubmissionInput;
  } catch (error) {
    if (error instanceof Error && error.message === "Dados do formulario invalidos") {
      throw error;
    }

    throw new Error("Dados do formulario invalidos");
  }
}
