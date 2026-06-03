import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/Card";
import { Label } from "@/src/components/ui/Label";
import { Select } from "@/src/components/ui/Select";
import { Textarea } from "@/src/components/ui/Textarea";
import type { OnboardingFormState, ProjectType } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

const PROJECT_TYPE_CARDS: { value: ProjectType; label: string; description: string; icon: string }[] = [
  {
    value: "landing_page",
    label: "Landing Page",
    description: "Pagina unica de alta conversao, focada em captar leads ou vender um produto/servico especifico.",
    icon: "📄",
  },
  {
    value: "website",
    label: "Site Institucional",
    description: "Multiplas paginas para apresentar a empresa, equipe, servicos, portfolio e formas de contato.",
    icon: "🏢",
  },
  {
    value: "ecommerce",
    label: "Loja Virtual",
    description: "Catalogo de produtos, carrinho de compras, checkout e integracao com pagamentos e frete.",
    icon: "🛒",
  },
  {
    value: "platform",
    label: "Plataforma Web / SaaS",
    description: "Sistema com area logada, painel de controle, banco de dados e fluxos complexos de aplicacao.",
    icon: "🖥️",
  },
];

const LANGUAGE_OPTIONS = ["Portugues", "Ingles", "Espanhol", "Frances", "Outro"];

const ANALYTICS_OPTIONS = ["Google Analytics 4 (GA4)", "Google Search Console", "Hotjar / Clarity (heatmaps)", "Outro"];

const TRACKING_PIXEL_OPTIONS = [
  "Meta Pixel (Facebook/Instagram)",
  "Google Ads Tag",
  "LinkedIn Insight Tag",
  "TikTok Pixel",
  "Nenhum",
];

// Landing Page options
const LANDING_CTA_OPTIONS = [
  "Solicitar Orcamento",
  "Baixar Ebook/Material Gratuito",
  "Comprar Agora",
  "Agendar Demonstracao",
  "Entrar em Contato pelo WhatsApp",
  "Cadastrar-se em Lista de Espera",
];
const LEAD_CAPTURE_OPTIONS = ["Formulario com campos", "Botao de WhatsApp", "Ambos"];
const LEAD_DESTINATION_OPTIONS = ["E-mail", "CRM (RD Station / HubSpot / Pipedrive)", "Planilha Google", "WhatsApp"];

// Website options
const WEBSITE_PAGES_OPTIONS = [
  "Pagina Inicial (Home)",
  "Sobre / Nossa Historia",
  "Servicos / Solucoes",
  "Portfolio / Cases",
  "Blog / Noticias",
  "Equipe",
  "Contato",
  "Perguntas Frequentes (FAQ)",
  "Area de Download",
  "Politica de Privacidade",
];

// Ecommerce options
const PRODUCT_VOLUME_OPTIONS = ["Ate 50 produtos", "51 a 200 produtos", "201 a 1.000 produtos", "Acima de 1.000 produtos"];
const ECOMMERCE_PLATFORM_OPTIONS = ["Shopify", "WooCommerce (WordPress)", "Nuvemshop", "VTEX", "Preferencia da Agencia", "Sem Preferencia"];
const PAYMENT_GATEWAY_OPTIONS = ["Mercado Pago", "PagSeguro", "Stripe", "Asaas", "Cielo", "PayPal", "Outro"];
const SALES_MODEL_OPTIONS = ["Venda avulsa", "Assinatura Recorrente (mensal/anual)", "Pacotes/Kits de Produtos", "Venda Atacado/B2B"];

// Platform options
const PLATFORM_TYPE_OPTIONS = [
  "SaaS (Software as a Service)",
  "Marketplace",
  "Plataforma de Cursos/LMS",
  "Rede Social / Comunidade",
  "Sistema de Gestao Interno (ERP/CRM)",
  "Portal do Cliente",
  "Outro",
];
const PLATFORM_USER_TYPES = ["Administrador", "Gestor/Operacional", "Cliente Final", "Parceiro/Revendedor", "Visitante Publico"];
const PLATFORM_FEATURES_OPTIONS = [
  "Login / Cadastro / Autenticacao",
  "Painel de Controle (Dashboard com graficos)",
  "Gerenciamento de Usuarios",
  "Notificacoes (Push / E-mail / WhatsApp)",
  "Sistema de Faturamento / Cobrancas",
  "Relatorios e Exportacao de Dados",
  "Chat Interno / Suporte",
  "Upload e Gestao de Arquivos",
  "API Publica (para integrar terceiros)",
  "Multitenancy (multiplas empresas)",
];
const REVENUE_MODEL_OPTIONS = [
  "Assinatura Mensal/Anual",
  "Comissao por Transacao",
  "Freemium + Planos Pagos",
  "Licenca Unica",
  "Servico Pago por Uso (Pay-as-you-go)",
];

function CheckboxGroup({
  options,
  selected,
  onChange,
  id,
  columns = 2,
}: {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  id: string;
  columns?: number;
}) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((v) => v !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className={`grid grid-cols-1 gap-2 ${columns === 2 ? "sm:grid-cols-2" : ""}`} id={id}>
      {options.map((option) => (
        <label
          key={option}
          className="group flex cursor-pointer items-start gap-2.5 rounded-xl border border-[rgba(77,88,246,0.12)] bg-white/80 px-3 py-2.5 text-xs font-medium text-slate-700 transition-all hover:border-[rgba(77,88,246,0.28)] hover:bg-[rgba(245,247,255,0.9)] has-[:checked]:border-[rgba(77,88,246,0.36)] has-[:checked]:bg-[rgba(237,240,255,0.92)] has-[:checked]:text-[#1C2040]"
        >
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => toggle(option)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-slate-300 text-[#4D58F6] focus:ring-[#4D58F6]"
          />
          <span className="leading-relaxed">{option}</span>
        </label>
      ))}
    </div>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
  id,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[rgba(77,88,246,0.12)] bg-white/80 px-4 py-3 text-xs font-medium text-slate-700 transition-all hover:border-[rgba(77,88,246,0.28)]"
    >
      <span>{label}</span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-[#4D58F6] focus:ring-[#4D58F6]"
      />
    </label>
  );
}

export function ProjectScopeForm({ data, updateData }: Props) {
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(37,136,245,0.14)_0%,rgba(142,34,255,0.16)_100%)] text-[10px] text-[#3640D7]">
            03
          </span>
          TIPO DE PROJETO E ESCOPO
        </CardTitle>
        <CardDescription>
          Defina o que sera construido e quais recursos tecnicos sao necessarios.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Project Type Cards */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Tipo de projeto <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PROJECT_TYPE_CARDS.map((card) => (
              <button
                key={card.value}
                type="button"
                onClick={() => updateData({ projectType: card.value })}
                className={`group flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all ${
                  data.projectType === card.value
                    ? "border-[rgba(77,88,246,0.42)] bg-[rgba(237,240,255,0.92)] shadow-[0_8px_24px_rgba(77,88,246,0.12)]"
                    : "border-[rgba(77,88,246,0.12)] bg-white/80 hover:border-[rgba(77,88,246,0.28)] hover:bg-[rgba(245,247,255,0.9)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{card.icon}</span>
                  <span className="text-sm font-bold text-slate-800">{card.label}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">{card.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="projectDescription" className="flex items-center gap-1">
            Descricao geral e objetivos do projeto <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="projectDescription"
            placeholder="Descreva a ideia do projeto, os objetivos principais e as regras de negocio mais importantes..."
            rows={4}
            value={data.projectDescription}
            onChange={(e) => updateData({ projectDescription: e.target.value })}
            required
          />
          <p className="text-xs text-slate-500">Minimo de 30 caracteres. ({data.projectDescription.length}/2000)</p>
        </div>

        {/* Common toggles */}
        <div className="space-y-3">
          <Label className="flex items-center gap-1">Recursos gerais</Label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <ToggleField label="Blog / Area de conteudo (CMS)" checked={data.needsCms} onChange={(v) => updateData({ needsCms: v })} id="needsCms" />
            <ToggleField label="Formulario de contato" checked={data.needsContactForm} onChange={(v) => updateData({ needsContactForm: v })} id="needsContactForm" />
            <ToggleField label="Integracao com WhatsApp" checked={data.needsWhatsApp} onChange={(v) => updateData({ needsWhatsApp: v })} id="needsWhatsApp" />
            <ToggleField label="SEO otimizado" checked={data.needsSeo} onChange={(v) => updateData({ needsSeo: v })} id="needsSeo" />
          </div>
        </div>

        {/* Languages */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Idiomas do site <span className="text-red-500">*</span>
          </Label>
          <CheckboxGroup
            id="siteLanguages"
            options={LANGUAGE_OPTIONS}
            selected={data.siteLanguages}
            onChange={(siteLanguages) => updateData({ siteLanguages })}
          />
        </div>

        {/* Analytics & Tracking */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-1">Rastreamento e analytics</Label>
            <CheckboxGroup
              id="analyticsRequired"
              options={ANALYTICS_OPTIONS}
              selected={data.analyticsRequired}
              onChange={(analyticsRequired) => updateData({ analyticsRequired })}
              columns={1}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1">Pixels de midia paga</Label>
            <CheckboxGroup
              id="trackingPixels"
              options={TRACKING_PIXEL_OPTIONS}
              selected={data.trackingPixels}
              onChange={(trackingPixels) => updateData({ trackingPixels })}
              columns={1}
            />
          </div>
        </div>

        {/* ===== CONDITIONAL SECTIONS ===== */}

        {/* Landing Page */}
        {data.projectType === "landing_page" ? (
          <div className="space-y-4 border-t border-[rgba(77,88,246,0.12)] pt-4">
            <h4 className="text-sm font-semibold text-slate-800">Detalhes da Landing Page</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="landingPageCta" className="flex items-center gap-1">CTA principal <span className="text-red-500">*</span></Label>
                <Select id="landingPageCta" value={data.landingPageCta} onChange={(e) => updateData({ landingPageCta: e.target.value })} required>
                  <option value="" disabled>Selecione...</option>
                  {LANDING_CTA_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leadCaptureMethod" className="flex items-center gap-1">Metodo de captacao <span className="text-red-500">*</span></Label>
                <Select id="leadCaptureMethod" value={data.leadCaptureMethod} onChange={(e) => updateData({ leadCaptureMethod: e.target.value })} required>
                  <option value="" disabled>Selecione...</option>
                  {LEAD_CAPTURE_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leadDestination" className="flex items-center gap-1">Destino dos leads <span className="text-red-500">*</span></Label>
                <Select id="leadDestination" value={data.leadDestination} onChange={(e) => updateData({ leadDestination: e.target.value })} required>
                  <option value="" disabled>Selecione...</option>
                  {LEAD_DESTINATION_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                </Select>
              </div>
              <ToggleField label="Possui video de apresentacao?" checked={data.hasProductVideo} onChange={(v) => updateData({ hasProductVideo: v })} id="hasProductVideo" />
            </div>
          </div>
        ) : null}

        {/* Website */}
        {data.projectType === "website" ? (
          <div className="space-y-4 border-t border-[rgba(77,88,246,0.12)] pt-4">
            <h4 className="text-sm font-semibold text-slate-800">Paginas do Site Institucional</h4>
            <CheckboxGroup
              id="websitePages"
              options={WEBSITE_PAGES_OPTIONS}
              selected={data.websitePages}
              onChange={(websitePages) => updateData({ websitePages })}
            />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <ToggleField label="Possui portfolio / cases?" checked={data.hasPortfolio} onChange={(v) => updateData({ hasPortfolio: v })} id="hasPortfolio" />
              <ToggleField label="Exibir depoimentos?" checked={data.needsTestimonials} onChange={(v) => updateData({ needsTestimonials: v })} id="needsTestimonials" />
              <ToggleField label="Pagina Sobre Nos?" checked={data.needsAboutPage} onChange={(v) => updateData({ needsAboutPage: v })} id="needsAboutPage" />
            </div>
          </div>
        ) : null}

        {/* Ecommerce */}
        {data.projectType === "ecommerce" ? (
          <div className="space-y-4 border-t border-[rgba(77,88,246,0.12)] pt-4">
            <h4 className="text-sm font-semibold text-slate-800">Detalhes do E-commerce</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="productVolume" className="flex items-center gap-1">Volume estimado de produtos <span className="text-red-500">*</span></Label>
                <Select id="productVolume" value={data.productVolume} onChange={(e) => updateData({ productVolume: e.target.value })} required>
                  <option value="" disabled>Selecione...</option>
                  {PRODUCT_VOLUME_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ecommercePlatform" className="flex items-center gap-1">Plataforma preferida <span className="text-red-500">*</span></Label>
                <Select id="ecommercePlatform" value={data.ecommercePlatform} onChange={(e) => updateData({ ecommercePlatform: e.target.value })} required>
                  <option value="" disabled>Selecione...</option>
                  {ECOMMERCE_PLATFORM_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">Gateways de pagamento <span className="text-red-500">*</span></Label>
              <CheckboxGroup id="paymentGateways" options={PAYMENT_GATEWAY_OPTIONS} selected={data.paymentGateways} onChange={(paymentGateways) => updateData({ paymentGateways })} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">Modelos de venda <span className="text-red-500">*</span></Label>
              <CheckboxGroup id="salesModels" options={SALES_MODEL_OPTIONS} selected={data.salesModels} onChange={(salesModels) => updateData({ salesModels })} />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <ToggleField label="Integracao com transportadoras?" checked={data.needsShippingIntegration} onChange={(v) => updateData({ needsShippingIntegration: v })} id="needsShippingIntegration" />
              <ToggleField label="Cupons de desconto?" checked={data.needsCoupons} onChange={(v) => updateData({ needsCoupons: v })} id="needsCoupons" />
              <ToggleField label="Avaliacoes de produtos?" checked={data.needsProductReviews} onChange={(v) => updateData({ needsProductReviews: v })} id="needsProductReviews" />
            </div>
          </div>
        ) : null}

        {/* Platform */}
        {data.projectType === "platform" ? (
          <div className="space-y-4 border-t border-[rgba(77,88,246,0.12)] pt-4">
            <h4 className="text-sm font-semibold text-slate-800">Detalhes da Plataforma Web</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="platformType" className="flex items-center gap-1">Tipo de plataforma <span className="text-red-500">*</span></Label>
                <Select id="platformType" value={data.platformType} onChange={(e) => updateData({ platformType: e.target.value })} required>
                  <option value="" disabled>Selecione...</option>
                  {PLATFORM_TYPE_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenueModel" className="flex items-center gap-1">Modelo de receita <span className="text-red-500">*</span></Label>
                <Select id="revenueModel" value={data.revenueModel} onChange={(e) => updateData({ revenueModel: e.target.value })} required>
                  <option value="" disabled>Selecione...</option>
                  {REVENUE_MODEL_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">Tipos de usuario do sistema <span className="text-red-500">*</span></Label>
              <CheckboxGroup id="platformUserTypes" options={PLATFORM_USER_TYPES} selected={data.platformUserTypes} onChange={(platformUserTypes) => updateData({ platformUserTypes })} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">Funcionalidades de negocio <span className="text-red-500">*</span></Label>
              <CheckboxGroup id="platformFeatures" options={PLATFORM_FEATURES_OPTIONS} selected={data.platformFeatures} onChange={(platformFeatures) => updateData({ platformFeatures })} />
              <p className="text-xs text-slate-500">Selecione pelo menos 2 funcionalidades.</p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <ToggleField label="Precisa de app mobile (iOS/Android)?" checked={data.needsMobileApp} onChange={(v) => updateData({ needsMobileApp: v })} id="needsMobileApp" />
              <ToggleField label="Existe sistema legado para migrar?" checked={data.hasLegacySystem} onChange={(v) => updateData({ hasLegacySystem: v })} id="hasLegacySystem" />
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
