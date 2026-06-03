import nodemailer from "nodemailer";
import type { AppEnv } from "../../config/env.js";
import type { OnboardingSubmissionInput } from "./types.js";
import { buildOnboardingWorkbook } from "./workbook.js";
import { formatOnboardingWhatsAppMessage } from "./message.js";

function sanitizeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function createGmailTransport(env: AppEnv) {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: env.GMAIL_USER,
      clientId: env.GMAIL_CLIENT_ID,
      clientSecret: env.GMAIL_CLIENT_SECRET,
      refreshToken: env.GMAIL_REFRESH_TOKEN,
    },
  });
}

function buildHtmlBody(input: OnboardingSubmissionInput) {
  const textMessage = formatOnboardingWhatsAppMessage(input);
  const lines = textMessage
    .replace(/\*([^*]+)\*/g, "<strong>$1</strong>")
    .split("\n")
    .map((line) => {
      if (line === "----------------------------------------") {
        return "<hr style='border:none;border-top:1px solid #e2e8f0;margin:16px 0;'>";
      }
      if (line.startsWith("<strong>")) {
        return `<p style='margin:12px 0 4px;font-size:15px;color:#1e293b;'>${line}</p>`;
      }
      if (line.startsWith("- ")) {
        return `<p style='margin:2px 0;padding-left:12px;font-size:14px;color:#475569;'>${line}</p>`;
      }
      if (line.trim() === "") return "";
      return `<p style='margin:4px 0;font-size:14px;color:#334155;'>${line}</p>`;
    })
    .join("\n");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:'Segoe UI',Roboto,Arial,sans-serif;background:#f8fafc;padding:24px;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="font-size:22px;color:#1e293b;margin:0;">📋 Novo Briefing Recebido</h1>
      <p style="font-size:14px;color:#64748b;margin:8px 0 0;">Empresa: <strong>${input.companyName}</strong> — ${input.fullName}</p>
    </div>
    ${lines}
    <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;">
      <p style="font-size:12px;color:#94a3b8;">📎 Planilha Excel anexada com todos os detalhes do briefing.</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendBriefingEmail(
  env: AppEnv,
  input: OnboardingSubmissionInput,
) {
  const transporter = createGmailTransport(env);

  const workbook = await buildOnboardingWorkbook(input);
  const fileName = `briefing-${sanitizeSegment(input.companyName || input.fullName || "cliente")}.xlsx`;

  await transporter.sendMail({
    from: `"Luvora Onboarding" <${env.GMAIL_USER}>`,
    to: env.NOTIFICATION_EMAIL,
    subject: `📋 Novo Briefing: ${input.companyName} — ${input.fullName}`,
    html: buildHtmlBody(input),
    attachments: [
      {
        filename: fileName,
        content: workbook,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  });
}
