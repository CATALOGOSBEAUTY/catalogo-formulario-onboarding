import type {
  OnboardingFormState,
  SubmitOnboardingResponse,
} from "./types";

function appendFiles(formData: FormData, fieldName: string, files: FileList | null) {
  if (!files) {
    return;
  }

  Array.from(files).forEach((file) => {
    formData.append(fieldName, file);
  });
}

export async function submitOnboardingForm(
  data: OnboardingFormState,
): Promise<SubmitOnboardingResponse> {
  const formData = new FormData();
  formData.append("fullName", data.fullName);
  formData.append("cpf", data.cpf);
  formData.append("email", data.email);
  formData.append("commercialContact", data.commercialContact);
  formData.append("addressZipcode", data.addressZipcode);
  formData.append("addressStreet", data.addressStreet);
  formData.append("addressNumber", data.addressNumber);
  formData.append("addressNeighborhood", data.addressNeighborhood);
  formData.append("schedulingModel", data.schedulingModel);
  formData.append("cancellationFine", data.cancellationFine);
  formData.append("rescheduleDetails", data.rescheduleDetails);
  formData.append("upfrontCost", data.upfrontCost);
  formData.append("hasDomain", data.hasDomain);
  formData.append("websiteUrl", data.websiteUrl);
  formData.append("hostingProvider", data.hostingProvider);
  formData.append(
    "services",
    JSON.stringify(
      data.services.map(({ name, duration, value }) => ({
        name,
        duration,
        value,
      })),
    ),
  );
  formData.append(
    "professionals",
    JSON.stringify(
      data.professionals.map(({ name, role, serviceConfig }) => ({
        name,
        role,
        serviceConfig,
      })),
    ),
  );

  appendFiles(formData, "photosProcedures", data.photosProcedures);
  appendFiles(formData, "photosFacade", data.photosFacade);

  const response = await fetch("/api/onboarding-submissions", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json()) as
    | SubmitOnboardingResponse
    | { error?: string };

  if (!response.ok) {
    throw new Error(
      typeof payload === "object" && payload && "error" in payload
        ? payload.error || "Falha ao enviar formulario."
        : "Falha ao enviar formulario.",
    );
  }

  return payload as SubmitOnboardingResponse;
}
