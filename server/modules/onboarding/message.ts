import type { OnboardingSubmissionInput } from "./types.js";

export function formatOnboardingWhatsAppMessage(input: OnboardingSubmissionInput) {
  const services = input.services
    .map(
      (service, index) =>
        `${index + 1}. ${service.name} (Duracao: ${service.duration}, Valor: ${service.value})`,
    )
    .join("\n");

  const professionals = input.professionals
    .map(
      (professional, index) =>
        `${index + 1}. ${professional.name} - ${professional.role} (Servicos: ${professional.serviceConfig})`,
    )
    .join("\n");

  return [
    "*Nova solicitacao de onboarding*",
    "",
    "*Identificacao basica*",
    `Nome: ${input.fullName}`,
    `CPF/CNPJ: ${input.cpfCnpj}`,
    `Email: ${input.email}`,
    `WhatsApp comercial: ${input.commercialContact}`,
    "",
    "*Endereco*",
    `CEP: ${input.addressZipcode}`,
    `Endereco: ${input.addressStreet}, ${input.addressNumber} - ${input.addressNeighborhood}`,
    "",
    "*Servicos*",
    services,
    "",
    "*Profissionais*",
    professionals,
    "",
    "*Agendamento e regras*",
    `Modelo: ${input.schedulingModel}`,
    `Multa de cancelamento: ${input.cancellationFine}`,
    `Reagendamento: ${input.rescheduleDetails}`,
    `Pagamento antecipado: ${input.upfrontCost}`,
    "",
    "*Tecnologia*",
    `Possui dominio proprio? ${input.hasDomain ? "Sim" : "Nao"}`,
    `Site: ${input.websiteUrl}`,
    `Hospedagem: ${input.hostingProvider}`,
    "",
    `Arquivos enviados: ${input.files.length}`,
  ].join("\n");
}
