import type { OnboardingSubmissionInput } from "./types.js";

export function formatOnboardingWhatsAppMessage(input: OnboardingSubmissionInput) {
  const services = input.services
    .map(
      (service, index) =>
        [
          `*Servico ${String(index + 1).padStart(2, "0")}*`,
          `- Procedimento: ${service.name}`,
          `- Profissional vinculado: ${service.professionalName}`,
          `- Duracao: ${service.duration}`,
          `- Valor informado: ${service.value}`,
        ].join("\n"),
    )
    .join("\n\n");

  return [
    "*RELATORIO DE ONBOARDING - ESTETICA PREMIUM*",
    "Nova solicitacao recebida pelo formulario digital.",
    "",
    "----------------------------------------",
    "*1. IDENTIFICACAO*",
    `- Nome completo: ${input.fullName}`,
    `- CPF/CNPJ: ${input.cpfCnpj}`,
    `- E-mail profissional: ${input.email}`,
    `- WhatsApp comercial: ${input.commercialContact}`,
    "",
    "----------------------------------------",
    "*2. ENDERECO DO ESTABELECIMENTO*",
    `- CEP: ${input.addressZipcode}`,
    `- Logradouro: ${input.addressStreet}, ${input.addressNumber}`,
    `- Bairro: ${input.addressNeighborhood}`,
    `- Cidade/UF: ${input.addressCity} - ${input.addressState}`,
    "",
    "----------------------------------------",
    "*3. SERVICOS E EQUIPE*",
    services,
    "",
    "----------------------------------------",
    "*4. AGENDAMENTO E REGRAS*",
    `- Modelo de agendamento: ${input.schedulingModel}`,
    `- Fluxo de pessoas que agendam: ${input.appointmentFlow}`,
    `- Nivel de cancelamento: ${input.cancellationLevel}`,
    `- Nivel de reagendamento: ${input.rescheduleLevel}`,
    `- Assessora virtual para WhatsApp: ${input.virtualAssistantEnabled ? "Sim" : "Nao"}`,
    `- Escopo da assessora: ${input.virtualAssistantEnabled ? input.virtualAssistantScope : "Nao solicitado"}`,
    `- Multa de cancelamento: ${input.cancellationFine}`,
    `- Regras de reagendamento: ${input.rescheduleDetails}`,
    `- Pagamento antecipado: ${input.upfrontCost}`,
    "",
    "----------------------------------------",
    "*5. TECNOLOGIA E PRESENCA DIGITAL*",
    `- Possui dominio proprio: ${input.hasDomain ? "Sim" : "Nao"}`,
    `- Site informado: ${input.websiteUrl || "Nao possui"}`,
    `- Hospedagem/provedor: ${input.hostingProvider || "Nao possui"}`,
    "",
    "----------------------------------------",
    "*6. MIDIAS RECEBIDAS*",
    `- Total de arquivos anexados: ${input.files.length}`,
    "",
    "Relatorio pronto para analise da equipe.",
  ].join("\n");
}
