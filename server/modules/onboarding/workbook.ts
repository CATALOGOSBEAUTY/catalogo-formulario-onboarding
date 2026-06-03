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

function boolToText(value: boolean) {
  return value ? "Sim" : "Nao";
}

function arrayToText(values: string[]) {
  if (values.length === 0) {
    return "Nenhum selecionado";
  }

  return values.join(", ");
}

// ABA 1: Identificacao e Contexto
function createIdentificationSheet(workbook: ExcelJS.Workbook, input: OnboardingSubmissionInput) {
  const sheet = workbook.addWorksheet("Identificacao e Contexto");
  sheet.columns = [
    { header: "Campo", key: "field", width: 38 },
    { header: "Informacao", key: "value", width: 74 },
  ];

  sheet.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
  });

  addKeyValueRows(sheet, "1. Dados do Responsavel", [
    ["Nome do responsavel", input.fullName],
    ["Razao Social / Nome Fantasia", input.companyName],
    ["Segmento de atuacao", input.companySector],
    ["CPF/CNPJ", input.cpfCnpj],
    ["E-mail corporativo", input.email],
    ["WhatsApp comercial", input.commercialContact],
    ["Site atual", input.currentWebsiteUrl],
    ["Empresa remota", boolToText(input.isRemote)],
  ]);

  if (!input.isRemote) {
    addKeyValueRows(sheet, "2. Endereco da Empresa", [
      ["CEP", input.addressZipcode],
      ["Logradouro", `${input.addressStreet}, ${input.addressNumber}`],
      ["Bairro", input.addressNeighborhood],
      ["Cidade/UF", `${input.addressCity} - ${input.addressState}`],
    ]);
  }

  addKeyValueRows(sheet, "3. Contexto Estrategico", [
    ["Objetivo principal", input.primaryGoal],
    ["O que nao esta funcionando hoje", input.currentPainPoint],
    ["Perfil do publico-alvo", input.targetAudience],
    ["Faixa etaria predominante", arrayToText(input.audienceAgeRange)],
    ["Comportamento digital", arrayToText(input.audienceDigitalBehavior)],
    ["Principais concorrentes", input.competitors],
    ["O que admira nos concorrentes", input.competitorLikes],
    ["Proposta unica de valor (USP)", input.uniqueValueProposition],
    ["Possui redes sociais", boolToText(input.hasSocialMedia)],
    ["Perfis nas redes", input.hasSocialMedia ? input.socialMediaHandles : "N/A"],
  ]);

  applySheetDefaults(sheet);
}

// ABA 2: Escopo Tecnico do Projeto
function createScopeSheet(workbook: ExcelJS.Workbook, input: OnboardingSubmissionInput) {
  const sheet = workbook.addWorksheet("Escopo Tecnico");
  sheet.columns = [
    { header: "Campo", key: "field", width: 38 },
    { header: "Informacao", key: "value", width: 74 },
  ];

  sheet.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
  });

  addKeyValueRows(sheet, "1. Tipo e Descricao do Projeto", [
    ["Tipo de projeto", input.projectType],
    ["Descricao geral", input.projectDescription],
  ]);

  addKeyValueRows(sheet, "2. Recursos Gerais", [
    ["Blog / CMS", boolToText(input.needsCms)],
    ["Formulario de contato", boolToText(input.needsContactForm)],
    ["Integracao com WhatsApp", boolToText(input.needsWhatsApp)],
    ["SEO otimizado", boolToText(input.needsSeo)],
    ["Idiomas do site", arrayToText(input.siteLanguages)],
    ["Analytics/Rastreamento", arrayToText(input.analyticsRequired)],
    ["Pixels de midia paga", arrayToText(input.trackingPixels)],
  ]);

  // Campos condicionais do escopo
  const scope = input.projectScopeConfig;

  if (input.projectType === "landing_page") {
    addKeyValueRows(sheet, "3. Detalhes da Landing Page", [
      ["CTA principal", String(scope.landingPageCta ?? "")],
      ["Possui video de apresentacao", boolToText(Boolean(scope.hasProductVideo))],
      ["Metodo de captacao", String(scope.leadCaptureMethod ?? "")],
      ["Destino dos leads", String(scope.leadDestination ?? "")],
    ]);
  }

  if (input.projectType === "website") {
    addKeyValueRows(sheet, "3. Detalhes do Site Institucional", [
      ["Paginas selecionadas", arrayToText(Array.isArray(scope.websitePages) ? scope.websitePages as string[] : [])],
      ["Possui portfolio / cases", boolToText(Boolean(scope.hasPortfolio))],
      ["Exibir depoimentos", boolToText(Boolean(scope.needsTestimonials))],
      ["Pagina Sobre Nos", boolToText(Boolean(scope.needsAboutPage))],
    ]);
  }

  if (input.projectType === "ecommerce") {
    addKeyValueRows(sheet, "3. Detalhes do E-commerce", [
      ["Volume de produtos", String(scope.productVolume ?? "")],
      ["Plataforma preferida", String(scope.ecommercePlatform ?? "")],
      ["Gateways de pagamento", arrayToText(Array.isArray(scope.paymentGateways) ? scope.paymentGateways as string[] : [])],
      ["Modelos de venda", arrayToText(Array.isArray(scope.salesModels) ? scope.salesModels as string[] : [])],
      ["Integracao com transportadoras", boolToText(Boolean(scope.needsShippingIntegration))],
      ["Cupons de desconto", boolToText(Boolean(scope.needsCoupons))],
      ["Avaliacoes de produtos", boolToText(Boolean(scope.needsProductReviews))],
    ]);
  }

  if (input.projectType === "platform") {
    addKeyValueRows(sheet, "3. Detalhes da Plataforma Web", [
      ["Tipo de plataforma", String(scope.platformType ?? "")],
      ["Tipos de usuario", arrayToText(Array.isArray(scope.platformUserTypes) ? scope.platformUserTypes as string[] : [])],
      ["Funcionalidades de negocio", arrayToText(Array.isArray(scope.platformFeatures) ? scope.platformFeatures as string[] : [])],
      ["Precisa de app mobile", boolToText(Boolean(scope.needsMobileApp))],
      ["Modelo de receita", String(scope.revenueModel ?? "")],
      ["Existe sistema legado", boolToText(Boolean(scope.hasLegacySystem))],
    ]);
  }

  applySheetDefaults(sheet);
}

// ABA 3: Design e Infraestrutura
function createDesignSheet(workbook: ExcelJS.Workbook, input: OnboardingSubmissionInput) {
  const sheet = workbook.addWorksheet("Design e Infraestrutura");
  sheet.columns = [
    { header: "Campo", key: "field", width: 38 },
    { header: "Informacao", key: "value", width: 74 },
  ];

  sheet.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
  });

  addKeyValueRows(sheet, "1. Identidade Visual", [
    ["Estagio do branding", input.brandingStatus],
    ["Estilo visual desejado", arrayToText(input.designStyle)],
    ["Tom de voz da marca", arrayToText(input.brandVoice)],
    ["Sites de referencia", input.designReferences],
  ]);

  addKeyValueRows(sheet, "2. Infraestrutura Tecnologica", [
    ["Possui dominio registrado", boolToText(input.hasDomain)],
    ["URL do dominio", input.hasDomain ? input.websiteUrl : "N/A"],
    ["Possui hospedagem ativa", boolToText(input.hasHosting)],
    ["Provedor de hospedagem", input.hasHosting ? input.hostingProvider : "N/A"],
    ["Assessoria em SEO tecnico", boolToText(input.needsSeoConsulting)],
    ["Acessibilidade digital (WCAG)", boolToText(input.needsWcagCompliance)],
    ["Suporte pos-lancamento", boolToText(input.needsPostLaunchSupport)],
  ]);

  applySheetDefaults(sheet);
}

// ABA 4: Alinhamento Comercial
function createCommercialSheet(workbook: ExcelJS.Workbook, input: OnboardingSubmissionInput) {
  const sheet = workbook.addWorksheet("Alinhamento Comercial");
  sheet.columns = [
    { header: "Campo", key: "field", width: 38 },
    { header: "Informacao", key: "value", width: 74 },
  ];

  sheet.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
  });

  addKeyValueRows(sheet, "1. Prazo e Investimento", [
    ["Tomador de decisao", input.decisionMaker],
    ["Data critica de lancamento", boolToText(input.hasCriticalDeadline)],
    ["Motivo do prazo critico", input.hasCriticalDeadline ? input.criticalDeadlineReason : "N/A"],
    ["Prazo estimado de entrega", input.deliveryTimeline],
    ["Faixa de investimento", input.projectBudget],
  ]);

  addKeyValueRows(sheet, "2. Conteudo e Comunicacao", [
    ["Status do conteudo textual", input.contentStatus],
    ["Canal de comunicacao preferido", input.preferredContactChannel],
    ["Frequencia de reunioes", input.meetingFrequency],
  ]);

  applySheetDefaults(sheet);
}

// ABA 5: Arquivos Enviados
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

function createFilesSheet(
  workbook: ExcelJS.Workbook,
  input: OnboardingSubmissionInput,
) {
  const sheet = workbook.addWorksheet("Arquivos Enviados");
  sheet.columns = [
    { header: "Arquivo", key: "file", width: 42 },
    { header: "Categoria", key: "category", width: 18 },
    { header: "Tipo", key: "type", width: 22 },
    { header: "Tamanho", key: "size", width: 18 },
    { header: "Preview", key: "preview", width: 42 },
  ];

  sheet.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
  });

  if (input.files.length === 0) {
    sheet.addRow(["Nenhum arquivo enviado", "", "", "", ""]);
    applySheetDefaults(sheet);
    return;
  }

  input.files.forEach((file, index) => {
    const rowNumber = 2 + index * 12;
    const row = sheet.getRow(rowNumber);
    const categoryLabel = file.category === "branding" ? "Branding" : "Referencia";
    row.values = [file.originalName, categoryLabel, file.mimeType, `${Math.round(file.size / 1024)} KB`, ""];
    row.height = 24;

    const extension = getImageExtension(file);
    if (extension) {
      const imageId = workbook.addImage({
        buffer: file.buffer,
        extension,
      });

      sheet.addImage(imageId, {
        tl: { col: 4, row: rowNumber - 1 },
        ext: { width: 280, height: 190 },
      });

      for (let offset = 1; offset <= 10; offset += 1) {
        sheet.getRow(rowNumber + offset).height = 18;
      }
    } else {
      sheet.getCell(rowNumber, 5).value = "Preview indisponivel para este tipo de arquivo.";
    }
  });

  applySheetDefaults(sheet);
}

export async function buildOnboardingWorkbook(input: OnboardingSubmissionInput): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Luvora Digital";
  workbook.created = new Date();
  workbook.modified = new Date();

  createIdentificationSheet(workbook, input);
  createScopeSheet(workbook, input);
  createDesignSheet(workbook, input);
  createCommercialSheet(workbook, input);
  createFilesSheet(workbook, input);

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
