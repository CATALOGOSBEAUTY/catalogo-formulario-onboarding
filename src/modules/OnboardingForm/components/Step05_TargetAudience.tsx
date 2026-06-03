import React from "react";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import { Label } from "@/src/components/ui/Label";
import { CheckboxGroup, StepHeader } from "./shared";
import type { OnboardingFormState } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

const TARGET_AUDIENCE_OPTIONS = [
  "Consumidores finais (B2C)",
  "Outras empresas (B2B)",
  "Profissionais autonomos/freelancers",
  "Startups e PMEs",
  "Grandes empresas e corporacoes",
  "Estudantes e universitarios",
  "Publico local (bairro/cidade)",
  "Publico nacional",
  "Publico internacional",
];

const AGE_RANGE_OPTIONS = [
  "13 a 17 anos (Gen Z Jovem)",
  "18 a 24 anos (Gen Z)",
  "25 a 34 anos (Millennials)",
  "35 a 44 anos (Millennials Senior)",
  "45 a 54 anos (Gen X)",
  "55 anos ou mais (Baby Boomers)",
];

const DIGITAL_BEHAVIOR_OPTIONS = [
  "Acessa principalmente pelo celular",
  "Acessa principalmente pelo computador",
  "Usa muito Instagram / TikTok",
  "Usa muito o Google para pesquisar solucoes",
  "Esta em grupos de WhatsApp do setor",
  "Assiste a videos no YouTube sobre o tema",
  "Prefere conteudos longos (artigos, PDFs, relatorios)",
];

export function Step05_TargetAudience({ data, updateData }: Props) {
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <StepHeader stepNumber={5} title="PÚBLICO-ALVO" description="Quem sao as pessoas que voce quer alcançar com o projeto." />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Tipo de publico <span className="text-red-500">*</span>
          </Label>
          <CheckboxGroup id="targetAudienceTypes" options={TARGET_AUDIENCE_OPTIONS} selected={data.targetAudienceTypes} onChange={(v) => updateData({ targetAudienceTypes: v })} />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Faixa etaria predominante <span className="text-red-500">*</span>
          </Label>
          <CheckboxGroup id="audienceAgeRange" options={AGE_RANGE_OPTIONS} selected={data.audienceAgeRange} onChange={(v) => updateData({ audienceAgeRange: v })} />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Comportamento digital <span className="text-red-500">*</span>
          </Label>
          <CheckboxGroup id="audienceDigitalBehavior" options={DIGITAL_BEHAVIOR_OPTIONS} selected={data.audienceDigitalBehavior} onChange={(v) => updateData({ audienceDigitalBehavior: v })} />
        </div>
      </CardContent>
    </Card>
  );
}
