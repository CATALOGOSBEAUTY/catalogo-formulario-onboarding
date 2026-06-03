import { describe, expect, it } from "vitest";
import { parseOnboardingRequestPayload } from "../../server/modules/onboarding/validation";
import { buildValidPayload } from "./test-helpers";

describe("parseOnboardingRequestPayload", () => {
  it("parses a complete valid payload for a remote company with landing page", () => {
    const result = parseOnboardingRequestPayload(buildValidPayload());

    expect(result.fullName).toBe("Maria Silva");
    expect(result.companyName).toBe("Studio Digital Ltda");
    expect(result.isRemote).toBe(true);
    expect(result.primaryGoal).toBe("lead_generation");
    expect(result.currentPainPoints).toHaveLength(2);
    expect(result.targetAudienceTypes).toHaveLength(2);
    expect(result.audienceAgeRange).toHaveLength(1);
    expect(result.projectType).toBe("landing_page");
    expect(result.projectGoals).toHaveLength(2);
    expect(result.designStyle).toEqual(["minimalist", "tech"]);
    expect(result.brandVoice).toHaveLength(2);
    expect(result.deliveryTimeline).toBe("standard");
    expect(result.projectBudget).toBe("tier_2");
    expect(result.files).toHaveLength(1);
  });

  it("allows remote company without address fields", () => {
    const result = parseOnboardingRequestPayload(
      buildValidPayload({
        body: { isRemote: "yes", addressZipcode: "", addressStreet: "", addressCity: "", addressState: "" },
      }),
    );

    expect(result.isRemote).toBe(true);
    expect(result.addressZipcode).toBe("");
  });

  it("rejects non-remote company without required address fields", () => {
    expect(() =>
      parseOnboardingRequestPayload(
        buildValidPayload({
          body: { isRemote: "no", addressZipcode: "", addressStreet: "", addressCity: "", addressState: "" },
        }),
      ),
    ).toThrow("Dados do formulario invalidos");
  });

  it("accepts non-remote company with complete address", () => {
    const result = parseOnboardingRequestPayload(
      buildValidPayload({
        body: {
          isRemote: "no",
          addressZipcode: "01001-000",
          addressStreet: "Av. Paulista",
          addressNumber: "1000",
          addressNeighborhood: "Bela Vista",
          addressCity: "Sao Paulo",
          addressState: "SP",
        },
      }),
    );

    expect(result.isRemote).toBe(false);
    expect(result.addressCity).toBe("Sao Paulo");
  });

  it("rejects hasDomain=true without websiteUrl", () => {
    expect(() =>
      parseOnboardingRequestPayload(
        buildValidPayload({ body: { hasDomain: "yes", websiteUrl: "" } }),
      ),
    ).toThrow("Dados do formulario invalidos");
  });

  it("accepts hasDomain=true with websiteUrl", () => {
    const result = parseOnboardingRequestPayload(
      buildValidPayload({ body: { hasDomain: "yes", websiteUrl: "https://site.com" } }),
    );

    expect(result.hasDomain).toBe(true);
    expect(result.websiteUrl).toBe("https://site.com");
  });

  it("rejects hasSocialMedia=true without networks selected", () => {
    expect(() =>
      parseOnboardingRequestPayload(
        buildValidPayload({ body: { hasSocialMedia: "yes", socialMediaNetworks: JSON.stringify([]) } }),
      ),
    ).toThrow("Dados do formulario invalidos");
  });

  it("rejects hasCriticalDeadline=true without reason", () => {
    expect(() =>
      parseOnboardingRequestPayload(
        buildValidPayload({ body: { hasCriticalDeadline: "yes", criticalDeadlineReason: "" } }),
      ),
    ).toThrow("Dados do formulario invalidos");
  });

  it("accepts hasCriticalDeadline=true with reason", () => {
    const result = parseOnboardingRequestPayload(
      buildValidPayload({
        body: { hasCriticalDeadline: "yes", criticalDeadlineReason: "Lancamento do produto em agosto" },
      }),
    );

    expect(result.hasCriticalDeadline).toBe(true);
    expect(result.criticalDeadlineReason).toBe("Lancamento do produto em agosto");
  });

  it("rejects payload with more than 10 uploaded files", () => {
    const files = Array.from({ length: 11 }, (_, index) => ({
      category: (index < 6 ? "branding" : "references") as "branding" | "references",
      originalName: `file-${index}.jpg`,
      mimeType: "image/jpeg",
      size: 1024,
      buffer: Buffer.from(String(index)),
    }));

    expect(() =>
      parseOnboardingRequestPayload(buildValidPayload({ files })),
    ).toThrow("Dados do formulario invalidos");
  });

  it("rejects payload without any files", () => {
    expect(() =>
      parseOnboardingRequestPayload(buildValidPayload({ files: [] })),
    ).toThrow("Dados do formulario invalidos");
  });

  it("rejects payload without required identity fields", () => {
    expect(() =>
      parseOnboardingRequestPayload(
        buildValidPayload({ body: { fullName: "", companyName: "", email: "" } }),
      ),
    ).toThrow("Dados do formulario invalidos");
  });

  it("rejects empty project goals array", () => {
    expect(() =>
      parseOnboardingRequestPayload(
        buildValidPayload({ body: { projectGoals: JSON.stringify([]) } }),
      ),
    ).toThrow("Dados do formulario invalidos");
  });

  it("rejects design style with more than 3 items", () => {
    expect(() =>
      parseOnboardingRequestPayload(
        buildValidPayload({
          body: { designStyle: JSON.stringify(["minimalist", "tech", "corporate", "luxury"]) },
        }),
      ),
    ).toThrow("Dados do formulario invalidos");
  });

  it("rejects brand voice with less than 2 items", () => {
    expect(() =>
      parseOnboardingRequestPayload(
        buildValidPayload({
          body: { brandVoice: JSON.stringify(["Profissional e Tecnico"]) },
        }),
      ),
    ).toThrow("Dados do formulario invalidos");
  });

  it("parses projectScopeConfig as JSON object", () => {
    const config = { platformType: "SaaS", platformFeatures: ["Login", "Dashboard"] };
    const result = parseOnboardingRequestPayload(
      buildValidPayload({
        body: {
          projectType: "platform",
          projectScopeConfig: JSON.stringify(config),
        },
      }),
    );

    expect(result.projectScopeConfig).toEqual(config);
  });

  it("rejects hasHosting=true without hostingProvider", () => {
    expect(() =>
      parseOnboardingRequestPayload(
        buildValidPayload({ body: { hasHosting: "yes", hostingProvider: "" } }),
      ),
    ).toThrow("Dados do formulario invalidos");
  });
});
