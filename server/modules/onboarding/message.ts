import type { OnboardingSubmissionInput } from "./types.js";

export function formatOnboardingWhatsAppMessage(input: OnboardingSubmissionInput) {
  const services = input.services
    .map(
      (service, index) =>
        `${index + 1}. ${service.name}\n   Profissional: ${service.professionalName}\n   Duracao: ${service.duration}\n   Valor: ${service.value}`,
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
    "*Agendamento e regras*",
    `Fluxo de pessoas que agendam: ${input.appointmentFlow}`,
    `Nivel de cancelamento: ${input.cancellationLevel}`,
    `Nivel de reagendamento: ${input.rescheduleLevel}`,
    `Modelo: ${input.schedulingModel}`,
    `Multa de cancelamento: ${input.cancellationFine}`,
    `Reagendamento: ${input.rescheduleDetails}`,
    `Pagamento antecipado: ${input.upfrontCost}`,
    "",
    "*Tecnologia*",
    `Possui dominio proprio? ${input.hasDomain ? "Sim" : "Nao"}`,
    `Site: ${input.websiteUrl || "Nao possui"}`,
    `Hospedagem: ${input.hostingProvider || "Nao possui"}`,
    "",
    `Arquivos enviados: ${input.files.length}`,
  ].join("\n");
}
