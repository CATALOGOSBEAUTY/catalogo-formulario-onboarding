import { describe, expect, it } from "vitest";
import { getStepValidationError } from "../../src/modules/OnboardingForm/validation";
import type { OnboardingFormState } from "../../src/modules/OnboardingForm/types";
import { INITIAL_FORM_STATE } from "../../src/modules/OnboardingForm/types";

function buildValidState(overrides: Partial<OnboardingFormState> = {}): OnboardingFormState {
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
    currentPainPointOther: "",
    targetAudienceTypes: ["Outras empresas (B2B)"],
    audienceAgeRange: ["25 a 34 anos (Millennials)"],
    audienceDigitalBehavior: ["Acessa principalmente pelo celular"],
    competitors: "www.concorrente1.com.br",
    competitorLikes: ["Design limpo e profissional"],
    uniqueValueProps: ["Tecnologia/inovacao exclusiva"],
    uniqueValuePropOther: "",
    hasSocialMedia: false,
    socialMediaNetworks: [],
    socialMediaHandles: "",

    projectType: "landing_page",
    projectGoals: ["Captar leads e contatos comerciais"],
    projectGoalsOther: "",
    siteLanguages: ["Portugues"],

    brandingStatus: "partial",
    designStyle: ["minimalist", "tech"],
    brandVoice: ["Profissional e Tecnico", "Jovem e Moderno"],

    decisionMaker: "Sou eu mesmo",
    deliveryTimeline: "standard",
    projectBudget: "tier_2",

    contentStatus: "Temos parte do conteudo e precisamos de apoio",
    preferredContactChannel: "WhatsApp",
    meetingFrequency: "Reunioes semanais de alinhamento",
    filesBranding: [new File(["content"], "logo.png", { type: "image/png" })],
    ...overrides,
  };
}

describe("getStepValidationError (12 steps)", () => {
  // Step 1 — Dados do Responsavel
  describe("step 1 — Dados do Responsavel", () => {
    it("returns null for a valid step 1", () => {
      expect(getStepValidationError(1, buildValidState())).toBeNull();
    });
    it("returns error without fullName", () => {
      expect(getStepValidationError(1, buildValidState({ fullName: "" }))).not.toBeNull();
    });
    it("returns error without companySector", () => {
      expect(getStepValidationError(1, buildValidState({ companySector: "" }))).not.toBeNull();
    });
    it("returns error without cpfCnpj", () => {
      expect(getStepValidationError(1, buildValidState({ cpfCnpj: "" }))).not.toBeNull();
    });
  });

  // Step 2 — Contato Comercial
  describe("step 2 — Contato Comercial", () => {
    it("returns null for a valid step 2", () => {
      expect(getStepValidationError(2, buildValidState())).toBeNull();
    });
    it("returns error without email", () => {
      expect(getStepValidationError(2, buildValidState({ email: "" }))).not.toBeNull();
    });
    it("returns error without commercialContact", () => {
      expect(getStepValidationError(2, buildValidState({ commercialContact: "" }))).not.toBeNull();
    });
  });

  // Step 3 — Localizacao
  describe("step 3 — Localizacao", () => {
    it("returns null for remote company", () => {
      expect(getStepValidationError(3, buildValidState({ isRemote: true }))).toBeNull();
    });
    it("returns error for non-remote without address", () => {
      expect(
        getStepValidationError(3, buildValidState({ isRemote: false, addressZipcode: "", addressStreet: "", addressCity: "" })),
      ).not.toBeNull();
    });
  });

  // Step 4 — Objetivo e Dor Atual
  describe("step 4 — Objetivo e Dor", () => {
    it("returns null for a valid step 4", () => {
      expect(getStepValidationError(4, buildValidState())).toBeNull();
    });
    it("returns error without primaryGoal", () => {
      expect(getStepValidationError(4, buildValidState({ primaryGoal: "" }))).not.toBeNull();
    });
    it("returns error for empty currentPainPoints", () => {
      expect(getStepValidationError(4, buildValidState({ currentPainPoints: [] }))).not.toBeNull();
    });
  });

  // Step 5 — Publico-Alvo
  describe("step 5 — Publico-Alvo", () => {
    it("returns null for a valid step 5", () => {
      expect(getStepValidationError(5, buildValidState())).toBeNull();
    });
    it("returns error for empty targetAudienceTypes", () => {
      expect(getStepValidationError(5, buildValidState({ targetAudienceTypes: [] }))).not.toBeNull();
    });
    it("returns error for empty audienceAgeRange", () => {
      expect(getStepValidationError(5, buildValidState({ audienceAgeRange: [] }))).not.toBeNull();
    });
    it("returns error for empty audienceDigitalBehavior", () => {
      expect(getStepValidationError(5, buildValidState({ audienceDigitalBehavior: [] }))).not.toBeNull();
    });
  });

  // Step 6 — Mercado e Posicionamento
  describe("step 6 — Mercado e Posicionamento", () => {
    it("returns null for a valid step 6", () => {
      expect(getStepValidationError(6, buildValidState())).toBeNull();
    });
    it("returns error for empty uniqueValueProps", () => {
      expect(getStepValidationError(6, buildValidState({ uniqueValueProps: [] }))).not.toBeNull();
    });
    it("returns error when hasSocialMedia=true but no networks", () => {
      expect(
        getStepValidationError(6, buildValidState({ hasSocialMedia: true, socialMediaNetworks: [] })),
      ).not.toBeNull();
    });
  });

  // Step 7 — Tipo de Projeto
  describe("step 7 — Tipo de Projeto", () => {
    it("returns null for a valid step 7", () => {
      expect(getStepValidationError(7, buildValidState())).toBeNull();
    });
    it("returns error without projectType", () => {
      expect(getStepValidationError(7, buildValidState({ projectType: "" }))).not.toBeNull();
    });
    it("returns error for empty projectGoals", () => {
      expect(getStepValidationError(7, buildValidState({ projectGoals: [] }))).not.toBeNull();
    });
  });

  // Step 8 — Recursos Tecnicos
  describe("step 8 — Recursos Tecnicos", () => {
    it("returns null for a valid step 8", () => {
      expect(getStepValidationError(8, buildValidState())).toBeNull();
    });
    it("returns error for empty siteLanguages", () => {
      expect(getStepValidationError(8, buildValidState({ siteLanguages: [] }))).not.toBeNull();
    });
    it("returns error for ecommerce without payment gateways", () => {
      expect(
        getStepValidationError(8, buildValidState({ projectType: "ecommerce", paymentGateways: [] })),
      ).not.toBeNull();
    });
    it("returns error for platform with less than 2 features", () => {
      expect(
        getStepValidationError(8, buildValidState({ projectType: "platform", platformFeatures: ["Login"] })),
      ).not.toBeNull();
    });
  });

  // Step 9 — Identidade Visual
  describe("step 9 — Identidade Visual", () => {
    it("returns null for a valid step 9", () => {
      expect(getStepValidationError(9, buildValidState())).toBeNull();
    });
    it("returns error without brandingStatus", () => {
      expect(getStepValidationError(9, buildValidState({ brandingStatus: "" }))).not.toBeNull();
    });
    it("returns error for empty designStyle", () => {
      expect(getStepValidationError(9, buildValidState({ designStyle: [] }))).not.toBeNull();
    });
  });

  // Step 10 — Voz e Infra
  describe("step 10 — Voz e Infra", () => {
    it("returns null for a valid step 10", () => {
      expect(getStepValidationError(10, buildValidState())).toBeNull();
    });
    it("returns error for brandVoice with less than 2 items", () => {
      expect(
        getStepValidationError(10, buildValidState({ brandVoice: ["Profissional e Tecnico"] })),
      ).not.toBeNull();
    });
    it("returns error when hasDomain=true but no URL", () => {
      expect(
        getStepValidationError(10, buildValidState({ hasDomain: true, websiteUrl: "" })),
      ).not.toBeNull();
    });
    it("returns error when hasHosting=true but no provider", () => {
      expect(
        getStepValidationError(10, buildValidState({ hasHosting: true, hostingProvider: "" })),
      ).not.toBeNull();
    });
  });

  // Step 11 — Prazo e Investimento
  describe("step 11 — Prazo e Investimento", () => {
    it("returns null for a valid step 11", () => {
      expect(getStepValidationError(11, buildValidState())).toBeNull();
    });
    it("returns error without decisionMaker", () => {
      expect(getStepValidationError(11, buildValidState({ decisionMaker: "" }))).not.toBeNull();
    });
    it("returns error without deliveryTimeline", () => {
      expect(getStepValidationError(11, buildValidState({ deliveryTimeline: "" }))).not.toBeNull();
    });
    it("returns error without projectBudget", () => {
      expect(getStepValidationError(11, buildValidState({ projectBudget: "" }))).not.toBeNull();
    });
    it("returns error when hasCriticalDeadline=true but no reason", () => {
      expect(
        getStepValidationError(11, buildValidState({ hasCriticalDeadline: true, criticalDeadlineReason: "" })),
      ).not.toBeNull();
    });
  });

  // Step 12 — Conteudo e Anexos
  describe("step 12 — Conteudo e Anexos", () => {
    it("returns null for a valid step 12", () => {
      expect(getStepValidationError(12, buildValidState())).toBeNull();
    });
    it("returns error without contentStatus", () => {
      expect(getStepValidationError(12, buildValidState({ contentStatus: "" }))).not.toBeNull();
    });
    it("returns error without any files", () => {
      expect(
        getStepValidationError(12, buildValidState({ filesBranding: [], filesReferences: [] })),
      ).not.toBeNull();
    });
  });
});
