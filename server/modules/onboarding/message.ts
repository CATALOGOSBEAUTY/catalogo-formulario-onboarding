import type { OnboardingSubmissionInput } from "./types.js";

function boolToText(value: boolean) {
  return value ? "Sim" : "Nao";
}

function arrayToText(values: string[]) {
  if (values.length === 0) {
    return "Nenhum selecionado";
  }

  return values.join(", ");
}

export function formatOnboardingWhatsAppMessage(input: OnboardingSubmissionInput) {
  const addressBlock = input.isRemote
    ? ["- Empresa remota (sem escritorio fisico)"]
    : [
        `- CEP: ${input.addressZipcode}`,
        `- Logradouro: ${input.addressStreet}, ${input.addressNumber}`,
        `- Bairro: ${input.addressNeighborhood}`,
        `- Cidade/UF: ${input.addressCity} - ${input.addressState}`,
      ];

  return [
    "*BRIEFING DE PROJETO DIGITAL*",
    "Nova solicitacao de briefing recebida pelo formulario digital.",
    "",
    "----------------------------------------",
    "*1. IDENTIFICACAO*",
    `- Responsavel: ${input.fullName}`,
    `- Empresa: ${input.companyName}`,
    `- Segmento: ${input.companySector}`,
    `- CPF/CNPJ: ${input.cpfCnpj}`,
    `- E-mail: ${input.email}`,
    `- WhatsApp: ${input.commercialContact}`,
    `- Site atual: ${input.currentWebsiteUrl || "Nao possui"}`,
    "",
    "----------------------------------------",
    "*2. LOCALIZACAO*",
    ...addressBlock,
    "",
    "----------------------------------------",
    "*3. ESTRATEGIA E MERCADO*",
    `- Objetivo principal: ${input.primaryGoal}`,
    `- Dores atuais: ${arrayToText(input.currentPainPoints)}`,
    ...(input.currentPainPointOther ? [`  (Outro: ${input.currentPainPointOther})`] : []),
    `- Publico-alvo: ${arrayToText(input.targetAudienceTypes)}`,
    `- Faixa etaria: ${arrayToText(input.audienceAgeRange)}`,
    `- Diferenciais: ${arrayToText(input.uniqueValueProps)}`,
    ...(input.uniqueValuePropOther ? [`  (Outro: ${input.uniqueValuePropOther})`] : []),
    `- Concorrentes: ${input.competitors || "Nao informado"}`,
    `- O que admira: ${arrayToText(input.competitorLikes)}`,
    "",
    "----------------------------------------",
    "*4. ESCOPO DO PROJETO*",
    `- Tipo: ${input.projectType}`,
    `- Objetivos: ${arrayToText(input.projectGoals)}`,
    ...(input.projectGoalsOther ? [`  (Detalhes: ${input.projectGoalsOther})`] : []),
    `- Idiomas: ${arrayToText(input.siteLanguages)}`,
    `- CMS/Blog: ${boolToText(input.needsCms)}`,
    `- Formulario de contato: ${boolToText(input.needsContactForm)}`,
    `- Integracao WhatsApp: ${boolToText(input.needsWhatsApp)}`,
    `- SEO: ${boolToText(input.needsSeo)}`,
    "",
    "----------------------------------------",
    "*5. DESIGN E INFRA*",
    `- Branding: ${input.brandingStatus}`,
    `- Estilo visual: ${arrayToText(input.designStyle)}`,
    `- Tom de voz: ${arrayToText(input.brandVoice)}`,
    `- Dominio: ${boolToText(input.hasDomain)}${input.hasDomain ? ` (${input.websiteUrl})` : ""}`,
    `- Hospedagem: ${boolToText(input.hasHosting)}${input.hasHosting ? ` (${input.hostingProvider})` : ""}`,
    "",
    "----------------------------------------",
    "*6. COMERCIAL*",
    `- Canal preferido: ${input.preferredContactChannel}`,
    `- Reunioes: ${input.meetingFrequency}`,
    `- Status do conteudo: ${input.contentStatus}`,
    "",
    "----------------------------------------",
    "*7. ARQUIVOS*",
    `- Total de arquivos anexados: ${input.files.length}`,
    "",
    "Briefing pronto para analise da equipe.",
  ].join("\n");
}
