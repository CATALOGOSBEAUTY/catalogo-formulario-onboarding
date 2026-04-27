import ExcelJS from "exceljs";
import type { OnboardingSubmissionInput, OnboardingUploadedFile } from "./types.js";

const headerFill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF2536A8" },
} as const;

const headerFont = {
  color: { argb: "FFFFFFFF" },
  bold: true,
  size: 12,
} as const;

const sectionFill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFEFF3FF" },
} as const;

function applySheetDefaults(sheet: ExcelJS.Worksheet) {
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.properties.defaultRowHeight = 22;
  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", wrapText: true };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE1E6F5" } },
        left: { style: "thin", color: { argb: "FFE1E6F5" } },
        bottom: { style: "thin", color: { argb: "FFE1E6F5" } },
        right: { style: "thin", color: { argb: "FFE1E6F5" } },
      };
    });
  });
}

function addKeyValueRows(
  sheet: ExcelJS.Worksheet,
  title: string,
  rows: Array<[string, string]>,
) {
  const titleRow = sheet.addRow([title, ""]);
  titleRow.eachCell((cell) => {
    cell.fill = sectionFill;
    cell.font = { bold: true, color: { argb: "FF1E2A5A" } };
  });

  rows.forEach(([label, value]) => {
    sheet.addRow([label, value || "Nao informado"]);
  });

  sheet.addRow([]);
}

function createStructuredSheet(workbook: ExcelJS.Workbook, input: OnboardingSubmissionInput) {
  const sheet = workbook.addWorksheet("Resumo do Onboarding");
  sheet.columns = [
    { header: "Campo", key: "field", width: 34 },
    { header: "Informacao", key: "value", width: 74 },
  ];

  sheet.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
  });

  addKeyValueRows(sheet, "1. Identificacao", [
    ["Nome completo", input.fullName],
    ["CPF/CNPJ", input.cpfCnpj],
    ["E-mail profissional", input.email],
    ["WhatsApp comercial", input.commercialContact],
  ]);

  addKeyValueRows(sheet, "2. Endereco do estabelecimento", [
    ["CEP", input.addressZipcode],
    ["Logradouro", `${input.addressStreet}, ${input.addressNumber}`],
    ["Bairro", input.addressNeighborhood],
    ["Cidade/UF", `${input.addressCity} - ${input.addressState}`],
  ]);

  addKeyValueRows(sheet, "3. Agendamento e regras", [
    ["Modelo de agendamento", input.schedulingModel],
    ["Fluxo de pessoas que agendam", input.appointmentFlow],
    ["Nivel de cancelamento", input.cancellationLevel],
    ["Nivel de reagendamento", input.rescheduleLevel],
    ["Assessora virtual para WhatsApp", input.virtualAssistantEnabled ? "Sim" : "Nao"],
    ["Escopo da assessora", input.virtualAssistantEnabled ? input.virtualAssistantScope : "Nao solicitado"],
    ["Multa de cancelamento", input.cancellationFine],
    ["Regras de reagendamento", input.rescheduleDetails],
    ["Pagamento antecipado", input.upfrontCost],
  ]);

  addKeyValueRows(sheet, "4. Tecnologia e presenca digital", [
    ["Possui dominio proprio", input.hasDomain ? "Sim" : "Nao"],
    ["Site informado", input.websiteUrl || "Nao possui"],
    ["Hospedagem/provedor", input.hostingProvider || "Nao possui"],
  ]);

  applySheetDefaults(sheet);
}

function createServicesSheet(workbook: ExcelJS.Workbook, input: OnboardingSubmissionInput) {
  const sheet = workbook.addWorksheet("Servicos e Equipe");
  sheet.columns = [
    { header: "Item", key: "item", width: 10 },
    { header: "Procedimento", key: "name", width: 36 },
    { header: "Profissional vinculado", key: "professional", width: 34 },
    { header: "Duracao", key: "duration", width: 18 },
    { header: "Valor informado", key: "value", width: 20 },
  ];

  sheet.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
  });

  input.services.forEach((service, index) => {
    sheet.addRow({
      item: index + 1,
      name: service.name,
      professional: service.professionalName,
      duration: service.duration,
      value: service.value,
    });
  });

  applySheetDefaults(sheet);
}

function getImageExtension(file: OnboardingUploadedFile): "jpeg" | "png" | "gif" | null {
  if (file.mimeType === "image/png") {
    return "png";
  }

  if (file.mimeType === "image/gif") {
    return "gif";
  }

  if (file.mimeType === "image/jpeg" || file.mimeType === "image/jpg") {
    return "jpeg";
  }

  return null;
}

function createImageSheet(
  workbook: ExcelJS.Workbook,
  title: string,
  files: OnboardingUploadedFile[],
) {
  const sheet = workbook.addWorksheet(title);
  sheet.columns = [
    { header: "Arquivo", key: "file", width: 42 },
    { header: "Tipo", key: "type", width: 22 },
    { header: "Tamanho", key: "size", width: 18 },
    { header: "Preview", key: "preview", width: 42 },
  ];

  sheet.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
  });

  if (files.length === 0) {
    sheet.addRow(["Nenhum arquivo enviado", "", "", ""]);
    applySheetDefaults(sheet);
    return;
  }

  files.forEach((file, index) => {
    const rowNumber = 2 + index * 12;
    const row = sheet.getRow(rowNumber);
    row.values = [file.originalName, file.mimeType, `${Math.round(file.size / 1024)} KB`, ""];
    row.height = 24;

    const extension = getImageExtension(file);
    if (extension) {
      const imageId = workbook.addImage({
        buffer: file.buffer,
        extension,
      });

      sheet.addImage(imageId, {
        tl: { col: 3, row: rowNumber - 1 },
        ext: { width: 280, height: 190 },
      });

      for (let offset = 1; offset <= 10; offset += 1) {
        sheet.getRow(rowNumber + offset).height = 18;
      }
    } else {
      sheet.getCell(rowNumber, 4).value = "Preview indisponivel para este tipo de arquivo.";
    }
  });

  applySheetDefaults(sheet);
}

export async function buildOnboardingWorkbook(input: OnboardingSubmissionInput): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sistematize";
  workbook.created = new Date();
  workbook.modified = new Date();

  createStructuredSheet(workbook, input);
  createServicesSheet(workbook, input);
  createImageSheet(
    workbook,
    "Procedimentos - Imagens",
    input.files.filter((file) => file.category === "procedures"),
  );
  createImageSheet(
    workbook,
    "Fachada e Ambiente",
    input.files.filter((file) => file.category === "facade"),
  );

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
