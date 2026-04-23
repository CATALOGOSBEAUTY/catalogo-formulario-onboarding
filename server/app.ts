import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { getEnv } from "./config/env.js";
import { createSupabaseAdminClient } from "./lib/supabase.js";
import { createOnboardingRouter } from "./modules/onboarding/routes.js";
import { createOnboardingService } from "./modules/onboarding/service.js";
import type { OnboardingService } from "./modules/onboarding/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CreateAppOptions {
  onboardingService?: OnboardingService;
}

export function createApp(options: CreateAppOptions = {}) {
  const app = express();
  const defaultService = (() => {
    if (options.onboardingService) {
      return options.onboardingService;
    }

    const env = getEnv();
    const supabase = createSupabaseAdminClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    return createOnboardingService({
      env,
      supabase,
    });
  })();

  app.disable("x-powered-by");
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api", createOnboardingRouter(defaultService));

  const clientDistPath = path.resolve(__dirname, "../../dist");
  app.use(express.static(clientDistPath));

  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });

  return app;
}
