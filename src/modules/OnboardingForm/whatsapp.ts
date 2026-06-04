import type { OnboardingFormState } from "./types";

const WHATSAPP_NUMBER = "5571982589134";

function boolToText(value: boolean) {
  return value ? "Sim" : "Nao";
}

function arrayToText(values: string[]) {
  if (values.length === 0) return "Nenhum selecionado";
  return values.join(", ");
}

export function buildWhatsAppMessage(data: OnboardingFormState): string {
  const addressBlock = data.isRemote
    ? ["- Empresa remota (sem escritorio fisico)"]
    : [
        `- CEP: ${data.addressZipcode}`,
        `- Rua: ${data.addressStreet}, ${data.addressNumber}`,
        `- Bairro: ${data.addressNeighborhood}`,
        `- Cidade/UF: ${data.addressCity} - ${data.addressState}`,
      ];

  const lines = [
    "*BRIEFING DE PROJETO DIGITAL*",
    "Nova solicitacao de briefing via formulario.",
    "",
    "----",
    "*1. IDENTIFICACAO*",
    `- Responsavel: ${data.fullName}`,
    `- Empresa: ${data.companyName}`,
    `- Segmento: ${data.companySector}`,
    `- CPF/CNPJ: ${data.cpfCnpj}`,
    `- E-mail: ${data.email}`,
    `- WhatsApp: ${data.commercialContact}`,
    `- Site atual: ${data.currentWebsiteUrl || "Nao possui"}`,
    "",
    "----",
    "*2. LOCALIZACAO*",
    ...addressBlock,
    "",
    "----",
    "*3. ESTRATEGIA*",
    `- Objetivo: ${data.primaryGoal}`,
    `- Dores: ${arrayToText(data.currentPainPoints)}`,
    ...(data.currentPainPointOther ? [`  (Outro: ${data.currentPainPointOther})`] : []),
    `- Publico: ${arrayToText(data.targetAudienceTypes)}`,
    `- Faixa etaria: ${arrayToText(data.audienceAgeRange)}`,
    `- Diferenciais: ${arrayToText(data.uniqueValueProps)}`,
    ...(data.uniqueValuePropOther ? [`  (Outro: ${data.uniqueValuePropOther})`] : []),
    `- Concorrentes: ${data.competitors || "Nao informado"}`,
    `- Admiram: ${arrayToText(data.competitorLikes)}`,
    "",
    "----",
    "*4. PROJETO*",
    `- Tipo: ${data.projectType}`,
    `- Objetivos: ${arrayToText(data.projectGoals)}`,
    ...(data.projectGoalsOther ? [`  (Detalhes: ${data.projectGoalsOther})`] : []),
    `- Idiomas: ${arrayToText(data.siteLanguages)}`,
    `- CMS: ${boolToText(data.needsCms)}`,
    `- Form contato: ${boolToText(data.needsContactForm)}`,
    `- WhatsApp: ${boolToText(data.needsWhatsApp)}`,
    `- SEO: ${boolToText(data.needsSeo)}`,
    "",
    "----",
    "*5. DESIGN*",
    `- Branding: ${data.brandingStatus}`,
    `- Estilo: ${arrayToText(data.designStyle)}`,
    `- Tom: ${arrayToText(data.brandVoice)}`,
    `- Dominio: ${boolToText(data.hasDomain)}${data.hasDomain ? ` (${data.websiteUrl})` : ""}`,
    `- Hospedagem: ${boolToText(data.hasHosting)}${data.hasHosting ? ` (${data.hostingProvider})` : ""}`,
    "",
    "----",
    "*6. COMERCIAL*",
    `- Canal: ${data.preferredContactChannel}`,
    `- Reunioes: ${data.meetingFrequency}`,
    `- Conteudo: ${data.contentStatus}`,
    `- Arquivos: ${data.filesBranding.length + data.filesReferences.length} anexados`,
    "",
    "Briefing pronto para analise!",
  ];

  return lines.join("\n");
}

export function getWhatsAppUrl(data: OnboardingFormState): string {
  const message = buildWhatsAppMessage(data);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
