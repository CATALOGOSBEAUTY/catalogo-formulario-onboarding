import { describe, expect, it, vi } from "vitest";
import { createOnboardingService } from "../../server/modules/onboarding/service";
import type { AppEnv } from "../../server/config/env";
import type { OnboardingSubmissionInput } from "../../server/modules/onboarding/types";

function buildValidInput(): OnboardingSubmissionInput {
  return {
    fullName: "Maria Silva",
    companyName: "Studio Digital Ltda",
    companySector: "Tecnologia e SaaS",
    cpfCnpj: "123.456.789-00",
    email: "maria@empresa.com",
    commercialContact: "(11) 99999-9999",
    currentWebsiteUrl: "",
    isRemote: true,
    addressZipcode: "",
    addressStreet: "",
    addressNumber: "",
    addressNeighborhood: "",
    addressCity: "",
    addressState: "",
    primaryGoal: "lead_generation",
    currentPainPoints: ["Site desatualizado e sem design profissional"],
    currentPainPointOther: "",
    targetAudienceTypes: ["Outras empresas (B2B)"],
    audienceAgeRange: ["25 a 34 anos"],
    audienceDigitalBehavior: ["Acessa pelo celular"],
    competitors: "www.concorrente.com.br",
    competitorLikes: ["Design limpo e profissional"],
    uniqueValueProps: ["Tecnologia/inovacao exclusiva"],
    uniqueValuePropOther: "",
    hasSocialMedia: false,
    socialMediaNetworks: [],
    socialMediaHandles: "",
    projectType: "landing_page",
    projectGoals: ["Captar leads e contatos comerciais"],
    projectGoalsOther: "",
    needsCms: false,
    needsContactForm: true,
    needsWhatsApp: true,
    needsSeo: true,
    siteLanguages: ["Portugues"],

    projectScopeConfig: {},
    brandingStatus: "partial",
    designStyle: ["minimalist"],
    brandVoice: ["Profissional", "Moderno"],
    designReferences: "",
    hasDomain: false,
    websiteUrl: "",
    hasHosting: false,
    hostingProvider: "",
    needsSeoConsulting: false,
    needsWcagCompliance: false,
    needsPostLaunchSupport: false,
    contentStatus: "Temos conteudo",
    preferredContactChannel: "WhatsApp",
    meetingFrequency: "Reunioes semanais",
    files: [
      {
        category: "branding",
        originalName: "logo.png",
        mimeType: "image/png",
        size: 2048,
        buffer: Buffer.from("logo"),
      },
    ],
  };
}

function createMockEnv(): AppEnv {
  return {
    PORT: 3000,
    SUPABASE_URL: "https://test.supabase.co",
    SUPABASE_ANON_KEY: "test-anon-key",
    SUPABASE_SERVICE_ROLE_KEY: "test-service-key",
    SUPABASE_STORAGE_BUCKET: "onboarding",
    MAX_FILE_SIZE_BYTES: 10485760,
  };
}

function createMockSupabase() {
  return {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null }),
      })),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
      })),
    },
  };
}

describe("createOnboardingService", () => {
  it("submits successfully and returns pending status", async () => {
    const env = createMockEnv();
    const supabase = createMockSupabase();

    const service = createOnboardingService({
      env,
      supabase: supabase as any,
    });

    const result = await service.submit(buildValidInput());

    expect(result.submissionId).toBeDefined();
    expect(result.whatsappStatus).toBe("pending");
    expect(result.warning).toBeUndefined();
    expect(supabase.from).toHaveBeenCalled();
  });

  it("throws when supabase insert fails", async () => {
    const env = createMockEnv();
    const supabase = {
      from: vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({ error: { message: "DB Error" } }),
      })),
      storage: { from: vi.fn() },
    };

    const service = createOnboardingService({
      env,
      supabase: supabase as any,
    });

    await expect(service.submit(buildValidInput())).rejects.toThrow("Falha ao salvar submissao: DB Error");
  });
});
