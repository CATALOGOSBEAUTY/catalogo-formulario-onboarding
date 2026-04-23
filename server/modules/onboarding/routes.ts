import { Router } from "express";
import multer from "multer";
import { parseOnboardingRequestPayload } from "./validation.js";
import type { OnboardingService, OnboardingUploadedFile } from "./types.js";

const upload = multer({
  storage: multer.memoryStorage(),
});

function normalizeUploadedFiles(files: {
  photosProcedures?: Express.Multer.File[];
  photosFacade?: Express.Multer.File[];
}): OnboardingUploadedFile[] {
  const procedures = (files.photosProcedures || []).map((file) => ({
    category: "procedures" as const,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    buffer: file.buffer,
  }));

  const facade = (files.photosFacade || []).map((file) => ({
    category: "facade" as const,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    buffer: file.buffer,
  }));

  return [...procedures, ...facade];
}

export function createOnboardingRouter(onboardingService: OnboardingService) {
  const router = Router();

  router.post(
    "/onboarding-submissions",
    upload.fields([
      { name: "photosProcedures", maxCount: 10 },
      { name: "photosFacade", maxCount: 10 },
    ]),
    async (req, res) => {
      try {
        const files = normalizeUploadedFiles(
          (req.files as {
            photosProcedures?: Express.Multer.File[];
            photosFacade?: Express.Multer.File[];
          }) || {},
        );

        const payload = parseOnboardingRequestPayload({
          body: req.body as Record<string, unknown>,
          files,
        });

        const result = await onboardingService.submit(payload);

        return res.status(201).json({
          success: true,
          submissionId: result.submissionId,
          whatsappStatus: result.whatsappStatus,
          warning: result.warning,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Falha ao processar formulario de onboarding";

        if (message === "Dados do formulario invalidos") {
          return res.status(400).json({ error: message });
        }

        return res.status(500).json({ error: message });
      }
    },
  );

  return router;
}
