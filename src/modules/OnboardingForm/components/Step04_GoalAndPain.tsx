import React from "react";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Label } from "@/src/components/ui/Label";
import { Select } from "@/src/components/ui/Select";
import { CheckboxGroup, StepHeader } from "./shared";
import type { OnboardingFormState, PrimaryGoal } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

const PRIMARY_GOAL_OPTIONS: { value: PrimaryGoal; label: string }[] = [
  { value: "lead_generation", label: "Captar leads qualificados (formularios, WhatsApp, e-mail)" },
  { value: "brand_awareness", label: "Fortalecer a presenca e credibilidade da marca" },
  { value: "online_sales", label: "Vender produtos ou servicos diretamente online" },
  { value: "saas_subscriptions", label: "Vender assinaturas de um software/plataforma" },
  { value: "member_community", label: "Criar e gerenciar uma comunidade de membros pagantes" },
  { value: "portfolio_showcase", label: "Exibir portfolio e atrair novos projetos" },
  { value: "event_launch", label: "Lancar um produto, evento ou campanha especifica" },
];

const PAIN_POINT_OPTIONS = [
  "Site desatualizado e sem design profissional",
  "Nao aparece no Google (SEO ruim)",
  "Nao converte visitantes em clientes/leads",
  "Nao tenho presenca digital (sem site)",
  "Perco vendas para concorrentes online",
  "Processo de vendas e manual/desorganizado",
  "Marca sem credibilidade visual",
  "Outro",
];

export function Step04_GoalAndPain({ data, updateData }: Props) {
  const hasOther = data.currentPainPoints.includes("Outro");

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <StepHeader stepNumber={4} title="OBJETIVO E DOR ATUAL" description="Qual o principal resultado esperado e o que nao funciona hoje." />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="primaryGoal" className="flex items-center gap-1">
            Objetivo principal do projeto <span className="text-red-500">*</span>
          </Label>
          <Select id="primaryGoal" value={data.primaryGoal} onChange={(e) => updateData({ primaryGoal: e.target.value as PrimaryGoal })} required>
            <option value="" disabled>Selecione...</option>
            {PRIMARY_GOAL_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            O que nao esta funcionando hoje? <span className="text-red-500">*</span>
          </Label>
          <CheckboxGroup id="currentPainPoints" options={PAIN_POINT_OPTIONS} selected={data.currentPainPoints} onChange={(v) => updateData({ currentPainPoints: v })} />
          {hasOther ? (
            <Input placeholder="Descreva a dificuldade..." value={data.currentPainPointOther} onChange={(e) => updateData({ currentPainPointOther: e.target.value })} className="mt-2" />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
