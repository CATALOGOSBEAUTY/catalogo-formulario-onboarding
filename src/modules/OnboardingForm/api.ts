import type {
  DurationUnit,
  OnboardingFormState,
  PriceUnit,
  SubmitOnboardingResponse,
} from "./types";

interface SubmitOnboardingFormOptions {
  onProgress?: (progress: number) => void;
  xhrFactory?: () => XMLHttpRequest;
}

function appendFiles(formData: FormData, fieldName: string, files: File[]) {
  if (files.length === 0) {
    return;
  }

  files.forEach((file) => {
    formData.append(fieldName, file);
  });
}

function formatDuration(value: string, unit: DurationUnit) {
  const normalizedValue = value.trim();
  const normalizedUnit = unit === "hours" ? "hora" : "minuto";
  const suffix = normalizedValue === "1" ? normalizedUnit : `${normalizedUnit}s`;

  return `${normalizedValue} ${suffix}`;
}

function formatMoney(amount: string, unit: PriceUnit) {
  const normalizedAmount = amount.trim();

  if (unit === "PERCENT") {
    return `${normalizedAmount}%`;
  }

  return `${unit === "USD" ? "US$" : "R$"} ${normalizedAmount}`;
}

export async function submitOnboardingForm(
  data: OnboardingFormState,
  options: SubmitOnboardingFormOptions = {},
): Promise<SubmitOnboardingResponse> {
  const { onProgress, xhrFactory = () => new XMLHttpRequest() } = options;
  const formData = new FormData();
  formData.append("fullName", data.fullName);
  formData.append("cpf", data.cpf);
  formData.append("email", data.email);
  formData.append("commercialContact", data.commercialContact);
  formData.append("addressZipcode", data.addressZipcode);
  formData.append("addressStreet", data.addressStreet);
  formData.append("addressNumber", data.addressNumber);
  formData.append("addressNeighborhood", data.addressNeighborhood);
  formData.append("addressCity", data.addressCity);
  formData.append("addressState", data.addressState);
  formData.append("appointmentFlow", data.appointmentFlow);
  formData.append("cancellationLevel", data.cancellationLevel);
  formData.append("rescheduleLevel", data.rescheduleLevel);
  formData.append("schedulingModel", data.schedulingModel);
  formData.append("virtualAssistantEnabled", data.virtualAssistantEnabled);
  formData.append(
    "virtualAssistantScope",
    data.virtualAssistantEnabled === "yes" ? data.virtualAssistantScope : "",
  );
  formData.append(
    "cancellationFine",
    formatMoney(data.cancellationFineAmount, data.cancellationFineUnit),
  );
  formData.append("rescheduleDetails", data.rescheduleDetails);
  formData.append("upfrontCost", formatMoney(data.upfrontCostAmount, data.upfrontCostUnit));
  formData.append("hasDomain", data.hasDomain);
  formData.append("websiteUrl", data.hasDomain === "yes" ? data.websiteUrl : "");
  formData.append("hostingProvider", data.hasDomain === "yes" ? data.hostingProvider : "");
  formData.append(
    "services",
    JSON.stringify(
      data.services.map(({ name, professionalName, durationValue, durationUnit, valueAmount, valueUnit }) => ({
        name,
        professionalName,
        duration: formatDuration(durationValue, durationUnit),
        value: formatMoney(valueAmount, valueUnit),
      })),
    ),
  );

  appendFiles(formData, "photosProcedures", data.photosProcedures);
  appendFiles(formData, "photosFacade", data.photosFacade);

  return new Promise<SubmitOnboardingResponse>((resolve, reject) => {
    const xhr = xhrFactory();

    xhr.open("POST", "/api/onboarding-submissions");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) {
        return;
      }

      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onerror = () => {
      reject(new Error("Falha ao enviar formulario."));
    };

    xhr.onload = () => {
      onProgress?.(100);

      try {
        const payload = JSON.parse(xhr.responseText || "{}") as
          | SubmitOnboardingResponse
          | { error?: string };

        if (xhr.status < 200 || xhr.status >= 300) {
          reject(
            new Error(
              typeof payload === "object" && payload && "error" in payload
                ? payload.error || "Falha ao enviar formulario."
                : "Falha ao enviar formulario.",
            ),
          );
          return;
        }

        resolve(payload as SubmitOnboardingResponse);
      } catch {
        reject(new Error("Falha ao interpretar resposta do formulario."));
      }
    };

    xhr.send(formData);
  });
}
