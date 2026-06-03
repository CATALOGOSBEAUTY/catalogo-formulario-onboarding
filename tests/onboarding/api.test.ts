import { describe, expect, it, vi } from "vitest";
import { submitOnboardingForm } from "../../src/modules/OnboardingForm/api";
import type { OnboardingFormState } from "../../src/modules/OnboardingForm/types";
import { INITIAL_FORM_STATE } from "../../src/modules/OnboardingForm/types";

function buildValidFormState(overrides: Partial<OnboardingFormState> = {}): OnboardingFormState {
  return {
    ...INITIAL_FORM_STATE,
    fullName: "Maria Silva",
    companyName: "Studio Digital Ltda",
    companySector: "Tecnologia e SaaS",
    cpfCnpj: "123.456.789-00",
    email: "maria@empresa.com",
    commercialContact: "(11) 99999-9999",
    isRemote: true,
    primaryGoal: "lead_generation",
    currentPainPoints: ["Site desatualizado e sem design profissional"],
    targetAudienceTypes: ["Outras empresas (B2B)"],
    audienceAgeRange: ["25 a 34 anos (Millennials)"],
    audienceDigitalBehavior: ["Acessa principalmente pelo celular"],
    competitors: "www.concorrente.com.br",
    competitorLikes: ["Design limpo e profissional"],
    uniqueValueProps: ["Tecnologia/inovacao exclusiva"],
    projectType: "landing_page",
    projectGoals: ["Captar leads e contatos comerciais"],
    landingPageCta: "Solicitar Orcamento",
    siteLanguages: ["Portugues"],
    brandingStatus: "partial",
    designStyle: ["minimalist", "tech"],
    brandVoice: ["Profissional e Tecnico", "Jovem e Moderno"],
    decisionMaker: "Sou eu mesmo",
    deliveryTimeline: "standard",
    projectBudget: "tier_2",
    contentStatus: "Temos parte do conteudo",
    preferredContactChannel: "WhatsApp",
    meetingFrequency: "Reunioes semanais",
    ...overrides,
  };
}

function createFakeXhr(responseStatus: number, responseBody: Record<string, unknown>) {
  const state = { status: 0, responseText: "" };
  let capturedFormData: FormData | null = null;
  const xhr = {
    open: vi.fn(),
    send: vi.fn((formData: FormData) => {
      state.status = responseStatus;
      state.responseText = JSON.stringify(responseBody);
      capturedFormData = formData;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      xhr.onload?.({} as ProgressEvent);
    }),
    upload: { onprogress: null as ((e: ProgressEvent) => void) | null },
    onload: null as ((ev: ProgressEvent) => void) | null,
    onerror: null as ((ev: ProgressEvent) => void) | null,
    get status() { return state.status; },
    get responseText() { return state.responseText; },
  } as unknown as XMLHttpRequest;

  return { xhr, getCapturedFormData: () => capturedFormData! };
}

describe("submitOnboardingForm", () => {
  it("serializes FormData and sends it via XHR, resolving the response", async () => {
    const { xhr, getCapturedFormData } = createFakeXhr(201, { id: "test-id" });

    const result = await submitOnboardingForm(buildValidFormState(), {
      xhrFactory: () => xhr,
    });

    expect(result.id).toBe("test-id");

    const capturedFormData = getCapturedFormData();
    expect(capturedFormData).toBeDefined();
    expect(capturedFormData.get("fullName")).toBe("Maria Silva");
    expect(capturedFormData.get("companyName")).toBe("Studio Digital Ltda");
    expect(capturedFormData.get("isRemote")).toBe("yes");
    expect(capturedFormData.get("projectType")).toBe("landing_page");
    expect(capturedFormData.get("deliveryTimeline")).toBe("standard");

    const scopeConfig = JSON.parse(capturedFormData.get("projectScopeConfig") as string);
    expect(scopeConfig.landingPageCta).toBe("Solicitar Orcamento");
  });

  it("serializes arrays as JSON strings in FormData", async () => {
    const { xhr, getCapturedFormData } = createFakeXhr(201, { id: "test-id-2" });

    await submitOnboardingForm(buildValidFormState(), {
      xhrFactory: () => xhr,
    });

    const capturedFormData = getCapturedFormData();

    const languages = JSON.parse(capturedFormData.get("siteLanguages") as string);
    expect(languages).toEqual(["Portugues"]);

    const designStyle = JSON.parse(capturedFormData.get("designStyle") as string);
    expect(designStyle).toEqual(["minimalist", "tech"]);

    const painPoints = JSON.parse(capturedFormData.get("currentPainPoints") as string);
    expect(painPoints).toEqual(["Site desatualizado e sem design profissional"]);
  });

  it("rejects when XHR returns an error status", async () => {
    const { xhr } = createFakeXhr(400, { error: "Dados invalidos" });

    await expect(
      submitOnboardingForm(buildValidFormState(), { xhrFactory: () => xhr }),
    ).rejects.toThrow("Dados invalidos");
  });
});
