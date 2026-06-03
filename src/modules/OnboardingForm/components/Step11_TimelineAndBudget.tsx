import React from "react";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import { Label } from "@/src/components/ui/Label";
import { Select } from "@/src/components/ui/Select";
import { StepHeader } from "./shared";
import type { OnboardingFormState, DeliveryTimeline, ProjectBudget } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

const DECISION_MAKER_OPTIONS = ["Sou eu mesmo", "Meu socio/parceiro", "Diretor ou Gerente acima de mim", "Conselho / Diretoria Colegiada"];

const DEADLINE_REASON_OPTIONS = [
  "Lancamento de produto/servico",
  "Campanha sazonal (Black Friday, Natal...)",
  "Evento ou feira presencial",
  "Investidores/apresentacao de pitch",
  "Migracao de plataforma urgente",
  "Outro",
];

const TIMELINE_CARDS: { value: DeliveryTimeline; label: string; description: string; icon: string }[] = [
  { value: "urgent", label: "Urgente", description: "Menos de 30 dias.", icon: "⚡" },
  { value: "standard", label: "Padrao", description: "30 a 90 dias.", icon: "📅" },
  { value: "structured", label: "Estruturado", description: "3 a 6 meses.", icon: "🏗️" },
  { value: "flexible", label: "Flexivel", description: "Sem data definida.", icon: "🕐" },
];

const BUDGET_CARDS: { value: ProjectBudget; label: string; description: string }[] = [
  { value: "tier_1", label: "R$ 2.000 a R$ 5.000", description: "Landing Pages simples." },
  { value: "tier_2", label: "R$ 5.000 a R$ 15.000", description: "Sites institucionais." },
  { value: "tier_3", label: "R$ 15.000 a R$ 30.000", description: "E-commerces robustos." },
  { value: "tier_4", label: "R$ 30.000 a R$ 80.000", description: "Plataformas SaaS." },
  { value: "tier_5", label: "Acima de R$ 80.000", description: "Sistemas de grande escala." },
];

export function Step11_TimelineAndBudget({ data, updateData }: Props) {
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <StepHeader stepNumber={11} title="PRAZO E INVESTIMENTO" description="Alinhe expectativas de prazo, orcamento e tomada de decisao." />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="decisionMaker" className="flex items-center gap-1">
              Quem decide sobre o projeto? <span className="text-red-500">*</span>
            </Label>
            <Select id="decisionMaker" value={data.decisionMaker} onChange={(e) => updateData({ decisionMaker: e.target.value })} required>
              <option value="" disabled>Selecione...</option>
              {DECISION_MAKER_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hasCriticalDeadline">Existe data critica de lancamento?</Label>
            <Select id="hasCriticalDeadline" value={data.hasCriticalDeadline ? "yes" : "no"} onChange={(e) => updateData({ hasCriticalDeadline: e.target.value === "yes", criticalDeadlineReason: e.target.value === "yes" ? data.criticalDeadlineReason : "" })}>
              <option value="no">Nao</option>
              <option value="yes">Sim</option>
            </Select>
          </div>
        </div>

        {data.hasCriticalDeadline ? (
          <div className="space-y-2">
            <Label htmlFor="criticalDeadlineReason" className="flex items-center gap-1">
              Motivo do prazo critico <span className="text-red-500">*</span>
            </Label>
            <Select id="criticalDeadlineReason" value={data.criticalDeadlineReason} onChange={(e) => updateData({ criticalDeadlineReason: e.target.value })} required>
              <option value="" disabled>Selecione...</option>
              {DEADLINE_REASON_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
            </Select>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Prazo estimado <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {TIMELINE_CARDS.map((card) => (
              <button key={card.value} type="button" onClick={() => updateData({ deliveryTimeline: card.value })}
                className={`group flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition-all ${
                  data.deliveryTimeline === card.value
                    ? "border-[rgba(77,88,246,0.42)] bg-[rgba(237,240,255,0.92)] shadow-[0_8px_24px_rgba(77,88,246,0.12)]"
                    : "border-[rgba(77,88,246,0.12)] bg-white/80 hover:border-[rgba(77,88,246,0.28)]"
                }`}>
                <span className="text-base">{card.icon}</span>
                <span className="text-xs font-bold text-slate-800">{card.label}</span>
                <p className="text-[10px] leading-relaxed text-slate-500">{card.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Faixa de investimento <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BUDGET_CARDS.map((card) => (
              <button key={card.value} type="button" onClick={() => updateData({ projectBudget: card.value })}
                className={`group flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition-all ${
                  data.projectBudget === card.value
                    ? "border-[rgba(77,88,246,0.42)] bg-[rgba(237,240,255,0.92)] shadow-[0_8px_24px_rgba(77,88,246,0.12)]"
                    : "border-[rgba(77,88,246,0.12)] bg-white/80 hover:border-[rgba(77,88,246,0.28)]"
                }`}>
                <span className="text-xs font-bold text-slate-800">{card.label}</span>
                <p className="text-[10px] leading-relaxed text-slate-500">{card.description}</p>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
