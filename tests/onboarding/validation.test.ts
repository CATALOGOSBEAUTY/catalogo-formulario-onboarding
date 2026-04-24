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
        upfrontCost: "50%",
        hasDomain: "yes",
        websiteUrl: "https://empresa.com.br",
        hostingProvider: "Vercel",
        services: JSON.stringify([
          {
            name: "Corte",
            professionalName: "Joao",
            duration: "45 minutos",
            value: "R$ 50,00",
          },
        ]),
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
    expect(result.services[0]?.professionalName).toBe("Joao");
    expect(result.files).toHaveLength(2);
  });

  it("accepts empty website fields when the client does not have a site or domain", () => {
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
        cancellationFine: "US$ 50.00",
        rescheduleDetails: "Com 24h de antecedencia",
        upfrontCost: "20%",
        hasDomain: "no",
        websiteUrl: "",
        hostingProvider: "",
        services: JSON.stringify([
          {
            name: "Corte",
            professionalName: "Joao",
            duration: "1 hora",
            value: "US$ 50.00",
          },
        ]),
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

    expect(result.hasDomain).toBe(false);
    expect(result.websiteUrl).toBe("");
    expect(result.hostingProvider).toBe("");
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
        },
        files: [],
      }),
    ).toThrow("Dados do formulario invalidos");
  });

  it("rejects payload with more than 10 uploaded images", () => {
    expect(() =>
      parseOnboardingRequestPayload({
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
          upfrontCost: "20%",
          hasDomain: "yes",
          websiteUrl: "https://empresa.com.br",
          hostingProvider: "Vercel",
          services: JSON.stringify([
            {
              name: "Corte",
              professionalName: "Joao",
              duration: "45 minutos",
              value: "R$ 50,00",
            },
          ]),
        },
        files: Array.from({ length: 11 }, (_, index) => ({
          category: index < 6 ? "procedures" : "facade",
          originalName: `imagem-${index}.jpg`,
          mimeType: "image/jpeg",
          size: 1024,
          buffer: Buffer.from(String(index)),
        })),
      }),
    ).toThrow("Dados do formulario invalidos");
  });
});
