import { z } from "zod";
import type {
  OnboardingFileCategory,
  OnboardingSubmissionInput,
  ParsedOnboardingPayload,
} from "./types.js";

const fileSchema = z.object({
  category: z.enum(["branding", "references"] satisfies [OnboardingFileCategory, OnboardingFileCategory]),
  originalName: z.string().trim().min(1),
  mimeType: z.string().trim().min(1),
  size: z.number().int().positive(),
  buffer: z.instanceof(Buffer),
});

const onboardingSchema = z.object({
  // Steps 01-03
  fullName: z.string().trim().min(3),
  companyName: z.string().trim().min(2),
  companySector: z.string().trim().min(1),
  cpfCnpj: z.string().trim().min(1),
  email: z.string().trim().email(),
  commercialContact: z.string().trim().min(10),
  currentWebsiteUrl: z.string().trim(),
  isRemote: z.boolean(),
  addressZipcode: z.string().trim(),
  addressStreet: z.string().trim(),
  addressNumber: z.string().trim(),
  addressNeighborhood: z.string().trim(),
  addressCity: z.string().trim(),
  addressState: z.string().trim(),

  // Steps 04-06
  primaryGoal: z.string().trim().min(1),
  currentPainPoints: z.array(z.string()).min(1),
  currentPainPointOther: z.string().trim(),
  targetAudienceTypes: z.array(z.string()).min(1),
  audienceAgeRange: z.array(z.string()).min(1),
  audienceDigitalBehavior: z.array(z.string()).min(1),
  competitors: z.string().trim(),
  competitorLikes: z.array(z.string()),
  uniqueValueProps: z.array(z.string()).min(1),
  uniqueValuePropOther: z.string().trim(),
  hasSocialMedia: z.boolean(),
  socialMediaNetworks: z.array(z.string()),
  socialMediaHandles: z.string().trim(),

  // Steps 07-08
  projectType: z.string().trim().min(1),
  projectGoals: z.array(z.string()).min(1),
  projectGoalsOther: z.string().trim(),
  needsCms: z.boolean(),
  needsContactForm: z.boolean(),
  needsWhatsApp: z.boolean(),
  needsSeo: z.boolean(),
  siteLanguages: z.array(z.string()).min(1),

  projectScopeConfig: z.record(z.unknown()),

  // Steps 09-10
  brandingStatus: z.string().trim().min(1),
  designStyle: z.array(z.string()).min(1).max(3),
  brandVoice: z.array(z.string()).min(2).max(4),
  designReferences: z.string().trim(),
  hasDomain: z.boolean(),
  websiteUrl: z.string().trim(),
  hasHosting: z.boolean(),
  hostingProvider: z.string().trim(),
  needsSeoConsulting: z.boolean(),
  needsWcagCompliance: z.boolean(),
  needsPostLaunchSupport: z.boolean(),

  // Step 11
  contentStatus: z.string().trim().min(1),
  preferredContactChannel: z.string().trim().min(1),
  meetingFrequency: z.string().trim().min(1),

  files: z.array(fileSchema).superRefine((files, ctx) => {
    if (files.length > 10) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Envie no maximo 10 arquivos no total." });
    }
    if (files.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Envie ao menos um arquivo de branding ou referencia." });
    }
  }),
}).superRefine((payload, ctx) => {
  if (!payload.isRemote) {
    if (!payload.addressZipcode) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CEP obrigatorio para empresas presenciais.", path: ["addressZipcode"] });
    if (!payload.addressStreet) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Rua obrigatoria para empresas presenciais.", path: ["addressStreet"] });
    if (!payload.addressCity) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Cidade obrigatoria para empresas presenciais.", path: ["addressCity"] });
    if (!payload.addressState) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Estado obrigatorio para empresas presenciais.", path: ["addressState"] });
  }
  if (payload.hasDomain && !payload.websiteUrl) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Informe a URL do dominio.", path: ["websiteUrl"] });
  if (payload.hasSocialMedia && payload.socialMediaNetworks.length === 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Selecione pelo menos uma rede social.", path: ["socialMediaNetworks"] });
  if (payload.hasHosting && !payload.hostingProvider) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Informe o provedor de hospedagem.", path: ["hostingProvider"] });
});

function parseJsonArray(value: unknown): string[] {
  const raw = typeof value === "string" ? value : "[]";
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item: unknown) => String(item));
  } catch {
    return [];
  }
}

function parseJsonObject(value: unknown): Record<string, unknown> {
  const raw = typeof value === "string" ? value : "{}";
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    return parsed as Record<string, unknown>;
  } catch {
    return {};
  }
}

function parseBooleanFlag(value: unknown) {
  return String(value ?? "").trim().toLowerCase() === "yes";
}

export function parseOnboardingRequestPayload(payload: ParsedOnboardingPayload): OnboardingSubmissionInput {
  try {
    const normalized = {
      fullName: payload.body.fullName,
      companyName: payload.body.companyName,
      companySector: payload.body.companySector,
      cpfCnpj: payload.body.cpfCnpj,
      email: payload.body.email,
      commercialContact: payload.body.commercialContact,
      currentWebsiteUrl: payload.body.currentWebsiteUrl ?? "",
      isRemote: parseBooleanFlag(payload.body.isRemote),
      addressZipcode: payload.body.addressZipcode ?? "",
      addressStreet: payload.body.addressStreet ?? "",
      addressNumber: payload.body.addressNumber ?? "",
      addressNeighborhood: payload.body.addressNeighborhood ?? "",
      addressCity: payload.body.addressCity ?? "",
      addressState: payload.body.addressState ?? "",

      primaryGoal: payload.body.primaryGoal,
      currentPainPoints: parseJsonArray(payload.body.currentPainPoints),
      currentPainPointOther: payload.body.currentPainPointOther ?? "",
      targetAudienceTypes: parseJsonArray(payload.body.targetAudienceTypes),
      audienceAgeRange: parseJsonArray(payload.body.audienceAgeRange),
      audienceDigitalBehavior: parseJsonArray(payload.body.audienceDigitalBehavior),
      competitors: payload.body.competitors ?? "",
      competitorLikes: parseJsonArray(payload.body.competitorLikes),
      uniqueValueProps: parseJsonArray(payload.body.uniqueValueProps),
      uniqueValuePropOther: payload.body.uniqueValuePropOther ?? "",
      hasSocialMedia: parseBooleanFlag(payload.body.hasSocialMedia),
      socialMediaNetworks: parseJsonArray(payload.body.socialMediaNetworks),
      socialMediaHandles: payload.body.socialMediaHandles ?? "",

      projectType: payload.body.projectType,
      projectGoals: parseJsonArray(payload.body.projectGoals),
      projectGoalsOther: payload.body.projectGoalsOther ?? "",
      needsCms: parseBooleanFlag(payload.body.needsCms),
      needsContactForm: parseBooleanFlag(payload.body.needsContactForm),
      needsWhatsApp: parseBooleanFlag(payload.body.needsWhatsApp),
      needsSeo: parseBooleanFlag(payload.body.needsSeo),
      siteLanguages: parseJsonArray(payload.body.siteLanguages),

      projectScopeConfig: parseJsonObject(payload.body.projectScopeConfig),

      brandingStatus: payload.body.brandingStatus,
      designStyle: parseJsonArray(payload.body.designStyle),
      brandVoice: parseJsonArray(payload.body.brandVoice),
      designReferences: payload.body.designReferences ?? "",
      hasDomain: parseBooleanFlag(payload.body.hasDomain),
      websiteUrl: payload.body.websiteUrl ?? "",
      hasHosting: parseBooleanFlag(payload.body.hasHosting),
      hostingProvider: payload.body.hostingProvider ?? "",
      needsSeoConsulting: parseBooleanFlag(payload.body.needsSeoConsulting),
      needsWcagCompliance: parseBooleanFlag(payload.body.needsWcagCompliance),
      needsPostLaunchSupport: parseBooleanFlag(payload.body.needsPostLaunchSupport),

      contentStatus: payload.body.contentStatus,
      preferredContactChannel: payload.body.preferredContactChannel,
      meetingFrequency: payload.body.meetingFrequency,

      files: payload.files,
    };

    return onboardingSchema.parse(normalized) as OnboardingSubmissionInput;
  } catch (error) {
    if (error instanceof Error && error.message === "Dados do formulario invalidos") throw error;
    throw new Error("Dados do formulario invalidos");
  }
}
