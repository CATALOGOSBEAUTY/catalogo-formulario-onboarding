import { describe, expect, it, vi } from "vitest";
import { createOnboardingRouter } from "../../server/modules/onboarding/routes";
import type { OnboardingService } from "../../server/modules/onboarding/types";

describe("createOnboardingRouter", () => {
  it("returns an express router with POST /onboarding-submissions route", () => {
    const mockService: OnboardingService = {
      submit: vi.fn().mockResolvedValue({
        submissionId: "test-id",
        whatsappStatus: "sent",
      }),
    };

    const router = createOnboardingRouter(mockService);

    expect(router).toBeDefined();
    expect(typeof router).toBe("function");

    const routes = (router as any).stack?.filter(
      (layer: any) => layer.route,
    );

    expect(routes).toBeDefined();
    expect(routes.length).toBeGreaterThanOrEqual(1);

    const postRoute = routes.find(
      (layer: any) =>
        layer.route.path === "/onboarding-submissions" &&
        layer.route.methods.post,
    );

    expect(postRoute).toBeDefined();
  });
});
