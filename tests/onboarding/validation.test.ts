import { describe, expect, it } from "vitest";
import { parseOnboardingRequestPayload } from "../../server/modules/onboarding/validation";

describe("parseOnboardingRequestPayload", () => {
  it("parses form fields, json arrays and file metadata into normalized input", () => {
    const result = parseOnboardingRequestPayload({
      body: {
        fullName: "Maria Silva",
        cpf: "123.456.789-00",
        email: "maria@empresa.com",
        commercialContact: "(11) 99999-9999",
        addressZipcode: "01001-000",
        addressStreet: "Av. Paulista",
        addressNumber: "1000",
        addressNeighborhood: "Bela Vista",
        schedulingModel: "plataforma_completa",
        cancellationFine: "R$ 50,00",
        rescheduleDetails: "Com 24h de antecedencia",
        upfrontCost: "50% antecipado",
        hasDomain: "yes",
        websiteUrl: "https://empresa.com.br",
        hostingProvider: "Vercel",
        services: JSON.stringify([{ name: "Corte", duration: "45 min", value: "R$ 50,00" }]),
        professionals: JSON.stringify([{ name: "Joao", role: "Barbeiro", serviceConfig: "Corte" }]),
      },
      files: [
        {
          category: "procedures",
          originalName: "antes.jpg",
          mimeType: "image/jpeg",
          size: 2048,
          buffer: Buffer.from("a"),
        },
        {
          category: "facade",
          originalName: "fachada.jpg",
          mimeType: "image/jpeg",
          size: 2048,
          buffer: Buffer.from("b"),
        },
      ],
    });

    expect(result.hasDomain).toBe(true);
    expect(result.services).toHaveLength(1);
    expect(result.professionals).toHaveLength(1);
    expect(result.files).toHaveLength(2);
  });

  it("rejects payload without required identity fields", () => {
    expect(() =>
      parseOnboardingRequestPayload({
        body: {
          fullName: "",
          cpf: "",
          email: "",
          commercialContact: "",
          addressZipcode: "",
          addressStreet: "",
          addressNumber: "",
          addressNeighborhood: "",
          schedulingModel: "",
          cancellationFine: "",
          rescheduleDetails: "",
          upfrontCost: "",
          hasDomain: "no",
          websiteUrl: "",
          hostingProvider: "",
          services: "[]",
          professionals: "[]",
        },
        files: [],
      }),
    ).toThrow("Dados do formulario invalidos");
  });
});
