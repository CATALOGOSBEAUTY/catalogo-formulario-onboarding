import React from "react";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import { Label } from "@/src/components/ui/Label";
import { Select } from "@/src/components/ui/Select";
import { CheckboxGroup, ToggleField, StepHeader } from "./shared";
import type { OnboardingFormState } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

const LANGUAGE_OPTIONS = ["Portugues", "Ingles", "Espanhol", "Frances", "Outro"];
const ANALYTICS_OPTIONS = ["Google Analytics 4 (GA4)", "Google Search Console", "Hotjar / Clarity (heatmaps)", "Outro"];
const TRACKING_PIXEL_OPTIONS = ["Meta Pixel (Facebook/Instagram)", "Google Ads Tag", "LinkedIn Insight Tag", "TikTok Pixel", "Nenhum"];

// Landing Page
const LANDING_CTA_OPTIONS = ["Solicitar Orcamento", "Baixar Ebook/Material Gratuito", "Comprar Agora", "Agendar Demonstracao", "Entrar em Contato pelo WhatsApp", "Cadastrar-se em Lista de Espera"];
const LEAD_CAPTURE_OPTIONS = ["Formulario com campos", "Botao de WhatsApp", "Ambos"];
const LEAD_DESTINATION_OPTIONS = ["E-mail", "CRM (RD Station / HubSpot / Pipedrive)", "Planilha Google", "WhatsApp"];

// Website
const WEBSITE_PAGES_OPTIONS = ["Pagina Inicial (Home)", "Sobre / Nossa Historia", "Servicos / Solucoes", "Portfolio / Cases", "Blog / Noticias", "Equipe", "Contato", "Perguntas Frequentes (FAQ)", "Area de Download", "Politica de Privacidade"];

// Ecommerce
const PRODUCT_VOLUME_OPTIONS = ["Ate 50 produtos", "51 a 200 produtos", "201 a 1.000 produtos", "Acima de 1.000 produtos"];
const ECOMMERCE_PLATFORM_OPTIONS = ["Shopify", "WooCommerce (WordPress)", "Nuvemshop", "VTEX", "Preferencia da Agencia", "Sem Preferencia"];
const PAYMENT_GATEWAY_OPTIONS = ["Mercado Pago", "PagSeguro", "Stripe", "Asaas", "Cielo", "PayPal", "Outro"];
const SALES_MODEL_OPTIONS = ["Venda avulsa", "Assinatura Recorrente (mensal/anual)", "Pacotes/Kits de Produtos", "Venda Atacado/B2B"];

// Platform
const PLATFORM_TYPE_OPTIONS = ["SaaS (Software as a Service)", "Marketplace", "Plataforma de Cursos/LMS", "Rede Social / Comunidade", "Sistema de Gestao Interno (ERP/CRM)", "Portal do Cliente", "Outro"];
const PLATFORM_USER_TYPES = ["Administrador", "Gestor/Operacional", "Cliente Final", "Parceiro/Revendedor", "Visitante Publico"];
const PLATFORM_FEATURES_OPTIONS = ["Login / Cadastro / Autenticacao", "Painel de Controle (Dashboard com graficos)", "Gerenciamento de Usuarios", "Notificacoes (Push / E-mail / WhatsApp)", "Sistema de Faturamento / Cobrancas", "Relatorios e Exportacao de Dados", "Chat Interno / Suporte", "Upload e Gestao de Arquivos", "API Publica (para integrar terceiros)", "Multitenancy (multiplas empresas)"];
const REVENUE_MODEL_OPTIONS = ["Assinatura Mensal/Anual", "Comissao por Transacao", "Freemium + Planos Pagos", "Licenca Unica", "Servico Pago por Uso (Pay-as-you-go)"];

export function Step08_ScopeAndFeatures({ data, updateData }: Props) {
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <StepHeader stepNumber={8} title="RECURSOS E ESCOPO TÉCNICO" description="Funcionalidades gerais e detalhes especificos do tipo de projeto escolhido." />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Recursos gerais</Label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <ToggleField label="Blog / Area de conteudo (CMS)" checked={data.needsCms} onChange={(v) => updateData({ needsCms: v })} id="needsCms" />
            <ToggleField label="Formulario de contato" checked={data.needsContactForm} onChange={(v) => updateData({ needsContactForm: v })} id="needsContactForm" />
            <ToggleField label="Integracao com WhatsApp" checked={data.needsWhatsApp} onChange={(v) => updateData({ needsWhatsApp: v })} id="needsWhatsApp" />
            <ToggleField label="SEO otimizado" checked={data.needsSeo} onChange={(v) => updateData({ needsSeo: v })} id="needsSeo" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1">Idiomas do site <span className="text-red-500">*</span></Label>
          <CheckboxGroup id="siteLanguages" options={LANGUAGE_OPTIONS} selected={data.siteLanguages} onChange={(v) => updateData({ siteLanguages: v })} columns={3} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Rastreamento e analytics</Label>
            <CheckboxGroup id="analyticsRequired" options={ANALYTICS_OPTIONS} selected={data.analyticsRequired} onChange={(v) => updateData({ analyticsRequired: v })} columns={1} />
          </div>
          <div className="space-y-2">
            <Label>Pixels de midia paga</Label>
            <CheckboxGroup id="trackingPixels" options={TRACKING_PIXEL_OPTIONS} selected={data.trackingPixels} onChange={(v) => updateData({ trackingPixels: v })} columns={1} />
          </div>
        </div>

        {/* Landing Page */}
        {data.projectType === "landing_page" ? (
          <div className="space-y-4 border-t border-[rgba(77,88,246,0.12)] pt-4">
            <h4 className="text-sm font-semibold text-slate-800">Detalhes da Landing Page</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="landingPageCta" className="flex items-center gap-1">CTA principal <span className="text-red-500">*</span></Label>
                <Select id="landingPageCta" value={data.landingPageCta} onChange={(e) => updateData({ landingPageCta: e.target.value })} required>
                  <option value="" disabled>Selecione...</option>
                  {LANDING_CTA_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leadCaptureMethod" className="flex items-center gap-1">Metodo de captacao <span className="text-red-500">*</span></Label>
                <Select id="leadCaptureMethod" value={data.leadCaptureMethod} onChange={(e) => updateData({ leadCaptureMethod: e.target.value })} required>
                  <option value="" disabled>Selecione...</option>
                  {LEAD_CAPTURE_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leadDestination" className="flex items-center gap-1">Destino dos leads <span className="text-red-500">*</span></Label>
                <Select id="leadDestination" value={data.leadDestination} onChange={(e) => updateData({ leadDestination: e.target.value })} required>
                  <option value="" disabled>Selecione...</option>
                  {LEAD_DESTINATION_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
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
            <CheckboxGroup id="websitePages" options={WEBSITE_PAGES_OPTIONS} selected={data.websitePages} onChange={(v) => updateData({ websitePages: v })} />
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
                <Label htmlFor="productVolume" className="flex items-center gap-1">Volume de produtos <span className="text-red-500">*</span></Label>
                <Select id="productVolume" value={data.productVolume} onChange={(e) => updateData({ productVolume: e.target.value })} required>
                  <option value="" disabled>Selecione...</option>
                  {PRODUCT_VOLUME_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ecommercePlatform" className="flex items-center gap-1">Plataforma preferida <span className="text-red-500">*</span></Label>
                <Select id="ecommercePlatform" value={data.ecommercePlatform} onChange={(e) => updateData({ ecommercePlatform: e.target.value })} required>
                  <option value="" disabled>Selecione...</option>
                  {ECOMMERCE_PLATFORM_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">Gateways de pagamento <span className="text-red-500">*</span></Label>
              <CheckboxGroup id="paymentGateways" options={PAYMENT_GATEWAY_OPTIONS} selected={data.paymentGateways} onChange={(v) => updateData({ paymentGateways: v })} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">Modelos de venda <span className="text-red-500">*</span></Label>
              <CheckboxGroup id="salesModels" options={SALES_MODEL_OPTIONS} selected={data.salesModels} onChange={(v) => updateData({ salesModels: v })} />
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
                  {PLATFORM_TYPE_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenueModel" className="flex items-center gap-1">Modelo de receita <span className="text-red-500">*</span></Label>
                <Select id="revenueModel" value={data.revenueModel} onChange={(e) => updateData({ revenueModel: e.target.value })} required>
                  <option value="" disabled>Selecione...</option>
                  {REVENUE_MODEL_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">Tipos de usuario <span className="text-red-500">*</span></Label>
              <CheckboxGroup id="platformUserTypes" options={PLATFORM_USER_TYPES} selected={data.platformUserTypes} onChange={(v) => updateData({ platformUserTypes: v })} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">Funcionalidades <span className="text-red-500">*</span></Label>
              <CheckboxGroup id="platformFeatures" options={PLATFORM_FEATURES_OPTIONS} selected={data.platformFeatures} onChange={(v) => updateData({ platformFeatures: v })} />
              <p className="text-xs text-slate-500">Selecione pelo menos 2.</p>
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
