import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createApp } from "../../server/app";

describe("POST /api/onboarding-submissions", () => {
  it("accepts multipart onboarding data and delegates persistence/send flow", async () => {
    const onboardingService = {
      submit: vi.fn().mockResolvedValue({
        submissionId: "submission-123",
        whatsappStatus: "sent",
      }),
    };

    const app = createApp({ onboardingService });

    const response = await request(app)
      .post("/api/onboarding-submissions")
      .field("fullName", "Maria Silva")
      .field("cpf", "123.456.789-00")
      .field("email", "maria@empresa.com")
      .field("commercialContact", "(11) 99999-9999")
      .field("addressZipcode", "01001-000")
      .field("addressStreet", "Av. Paulista")
      .field("addressNumber", "1000")
      .field("addressNeighborhood", "Bela Vista")
      .field("addressCity", "Sao Paulo")
      .field("addressState", "SP")
      .field("appointmentFlow", "Alto - 31 a 80 agendamentos por dia")
      .field("cancellationLevel", "Medio")
      .field("rescheduleLevel", "Alto")
      .field("schedulingModel", "plataforma_completa")
      .field("cancellationFine", "R$ 50,00")
      .field("rescheduleDetails", "Com 24h de antecedencia")
      .field("upfrontCost", "50%")
      .field("hasDomain", "yes")
      .field("websiteUrl", "https://empresa.com.br")
      .field("hostingProvider", "Vercel")
      .field(
        "services",
        JSON.stringify([
          {
            name: "Corte",
            professionalName: "Joao",
            duration: "45 minutos",
            value: "R$ 50,00",
          },
        ]),
      )
      .attach("photosProcedures", Buffer.from("procedures"), "procedures.jpg")
      .attach("photosFacade", Buffer.from("facade"), "facade.jpg");

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      submissionId: "submission-123",
      whatsappStatus: "sent",
    });
    expect(onboardingService.submit).toHaveBeenCalledTimes(1);
  });
});
