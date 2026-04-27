import { describe, expect, it, vi } from "vitest";
import { createOnboardingService } from "../../server/modules/onboarding/service";
import type { AppEnv } from "../../server/config/env";
import type { OnboardingSubmissionInput } from "../../server/modules/onboarding/types";

function buildEnv(): AppEnv {
  return {
    NODE_ENV: "test",
    PORT: 3001,
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_ANON_KEY: "anon-key",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
    SUPABASE_STORAGE_BUCKET: "onboarding-uploads",
    EVOLUTION_API_URL: "https://saasevolution.azurewebsites.net",
    EVOLUTION_API_KEY: "test-api-key",
    EVOLUTION_INSTANCE_NAME: "diaprao",
    MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  };
}

function buildSubmission(): OnboardingSubmissionInput {
  return {
    fullName: "Maria Silva",
    cpfCnpj: "123.456.789-00",
    email: "maria@empresa.com",
    commercialContact: "(11) 99999-9999",
    addressZipcode: "01001-000",
    addressStreet: "Av. Paulista",
    addressNumber: "1000",
    addressNeighborhood: "Bela Vista",
    addressCity: "Sao Paulo",
    addressState: "SP",
    appointmentFlow: "Alto - 31 a 80 agendamentos por dia",
    cancellationLevel: "Medio",
    rescheduleLevel: "Alto",
    schedulingModel: "plataforma_completa",
    virtualAssistantEnabled: true,
    virtualAssistantScope: "Todas as opcoes",
    cancellationFine: "R$ 50,00",
    rescheduleDetails: "Com 24h de antecedencia",
    upfrontCost: "50%",
    hasDomain: true,
    websiteUrl: "https://empresa.com.br",
    hostingProvider: "Vercel",
    services: [
      {
        name: "Corte",
        professionalName: "Joao",
        duration: "45 minutos",
        value: "R$ 50,00",
      },
    ],
    files: [
      {
        category: "procedures",
        originalName: "procedures.jpg",
        mimeType: "image/jpeg",
        size: 128,
        buffer: Buffer.from("procedures"),
      },
      {
        category: "facade",
        originalName: "facade.jpg",
        mimeType: "image/jpeg",
        size: 128,
        buffer: Buffer.from("facade"),
      },
    ],
  };
}

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function createSupabaseMock() {
  return {
    from(table: string) {
      return {
        insert: vi.fn().mockResolvedValue({ error: null, table }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null, table }),
        }),
      };
    },
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ error: null }),
      }),
    },
  };
}

describe("createOnboardingService", () => {
  it("sends the message to the whatsapp number connected to the configured evolution instance", async () => {
    const env = buildEnv();
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        jsonResponse({
          value: [
            {
              name: "diaprao",
              ownerJid: "557182589134@s.whatsapp.net",
            },
          ],
        }),
      )
      .mockResolvedValueOnce(jsonResponse({ key: { id: "text-message" } }))
      .mockResolvedValueOnce(jsonResponse({ key: { id: "media-1" } }))
      .mockResolvedValueOnce(jsonResponse({ key: { id: "media-2" } }));

    const service = createOnboardingService({
      env,
      supabase: createSupabaseMock() as never,
      fetchImpl: fetchMock,
    });

    await service.submit(buildSubmission());

    expect(fetchMock).toHaveBeenCalledTimes(4);

    const requestInit = fetchMock.mock.calls[1]?.[1];
    const body = JSON.parse(String(requestInit?.body));

    expect(body.number).toBe("557182589134");

    expect(String(fetchMock.mock.calls[2]?.[0])).toContain("/message/sendMedia/diaprao");
    expect(String(fetchMock.mock.calls[3]?.[0])).toContain("/message/sendMedia/diaprao");
  });
});
