import React from "react";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Label } from "@/src/components/ui/Label";
import { CheckboxGroup, StepHeader } from "./shared";
import type { OnboardingFormState, ProjectType } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

const PROJECT_TYPE_CARDS: { value: ProjectType; label: string; description: string; icon: string }[] = [
  { value: "landing_page", label: "Landing Page", description: "Pagina unica de alta conversao, focada em captar leads ou vender um produto/servico.", icon: "📄" },
  { value: "website", label: "Site Institucional", description: "Multiplas paginas para apresentar empresa, servicos, portfolio e contato.", icon: "🏢" },
  { value: "ecommerce", label: "Loja Virtual", description: "Catalogo de produtos, carrinho, checkout e integracao com pagamentos.", icon: "🛒" },
  { value: "platform", label: "Plataforma Web / SaaS", description: "Sistema com area logada, painel de controle e fluxos de aplicacao.", icon: "🖥️" },
];

const PROJECT_GOALS_OPTIONS = [
  "Apresentar a empresa e seus servicos",
  "Captar leads e contatos comerciais",
  "Vender produtos/servicos online",
  "Agendar consultas/reunioes",
  "Exibir portfolio e cases de sucesso",
  "Oferecer area logada para clientes",
  "Publicar conteudo/blog",
  "Automatizar processos internos",
  "Integrar com sistemas existentes",
  "Outro",
];

export function Step07_ProjectType({ data, updateData }: Props) {
  const hasOther = data.projectGoals.includes("Outro");

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <StepHeader stepNumber={7} title="TIPO DE PROJETO" description="Selecione o que sera construido e os objetivos principais." />
      </CardHeader>
      <CardContent className="space-y-6">
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

        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            O que o projeto deve fazer? <span className="text-red-500">*</span>
          </Label>
          <CheckboxGroup id="projectGoals" options={PROJECT_GOALS_OPTIONS} selected={data.projectGoals} onChange={(v) => updateData({ projectGoals: v })} />
          {hasOther ? (
            <Input placeholder="Descreva detalhes adicionais..." value={data.projectGoalsOther} onChange={(e) => updateData({ projectGoalsOther: e.target.value })} className="mt-2" />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
