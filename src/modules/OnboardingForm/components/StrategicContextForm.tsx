import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/Card";
import { Label } from "@/src/components/ui/Label";
import { Select } from "@/src/components/ui/Select";
import { Textarea } from "@/src/components/ui/Textarea";
import { Input } from "@/src/components/ui/Input";
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

function CheckboxGroup({
  options,
  selected,
  onChange,
  id,
}: {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  id: string;
}) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((v) => v !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" id={id}>
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

export function StrategicContextForm({ data, updateData }: Props) {
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(37,136,245,0.14)_0%,rgba(142,34,255,0.16)_100%)] text-[10px] text-[#3640D7]">
            02
          </span>
          CONTEXTO ESTRATEGICO
        </CardTitle>
        <CardDescription>
          Entender o DNA do seu negocio nos permite criar uma solucao digital que gera resultados reais.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="primaryGoal" className="flex items-center gap-1">
            Objetivo principal do projeto <span className="text-red-500">*</span>
          </Label>
          <Select
            id="primaryGoal"
            value={data.primaryGoal}
            onChange={(e) => updateData({ primaryGoal: e.target.value as PrimaryGoal })}
            required
          >
            <option value="" disabled>
              Selecione...
            </option>
            {PRIMARY_GOAL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentPainPoint" className="flex items-center gap-1">
            O que nao esta funcionando hoje? <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="currentPainPoint"
            placeholder="Descreva as dificuldades atuais do seu negocio digital: falta de clientes, site desatualizado, perda de vendas..."
            rows={3}
            value={data.currentPainPoint}
            onChange={(e) => updateData({ currentPainPoint: e.target.value })}
            required
          />
          <p className="text-xs text-slate-500">Minimo de 20 caracteres.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAudience" className="flex items-center gap-1">
            Perfil do publico-alvo <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="targetAudience"
            placeholder="Ex: Empreendedores de 25 a 40 anos que buscam automatizar processos comerciais e melhorar a presenca online."
            rows={3}
            value={data.targetAudience}
            onChange={(e) => updateData({ targetAudience: e.target.value })}
            required
          />
          <p className="text-xs text-slate-500">Minimo de 20 caracteres.</p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Faixa etaria predominante <span className="text-red-500">*</span>
          </Label>
          <CheckboxGroup
            id="audienceAgeRange"
            options={AGE_RANGE_OPTIONS}
            selected={data.audienceAgeRange}
            onChange={(audienceAgeRange) => updateData({ audienceAgeRange })}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Comportamento digital do publico <span className="text-red-500">*</span>
          </Label>
          <CheckboxGroup
            id="audienceDigitalBehavior"
            options={DIGITAL_BEHAVIOR_OPTIONS}
            selected={data.audienceDigitalBehavior}
            onChange={(audienceDigitalBehavior) => updateData({ audienceDigitalBehavior })}
          />
        </div>

        <div className="border-t border-[rgba(77,88,246,0.12)] pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="competitors" className="flex items-center gap-1">
              Principais concorrentes (URLs ou nomes) <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="competitors"
              placeholder="Ex: www.concorrente1.com.br, www.concorrente2.com.br, Empresa X"
              rows={2}
              value={data.competitors}
              onChange={(e) => updateData({ competitors: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="competitorLikes" className="flex items-center gap-1">
              O que admira nesses concorrentes?
            </Label>
            <Textarea
              id="competitorLikes"
              placeholder="Ex: Gosto do design limpo do concorrente X, e do checkout rapido do concorrente Y."
              rows={2}
              value={data.competitorLikes}
              onChange={(e) => updateData({ competitorLikes: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="uniqueValueProposition" className="flex items-center gap-1">
              Proposta unica de valor (USP) <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="uniqueValueProposition"
              placeholder="Se voce pudesse entregar uma unica mensagem ao visitante, qual seria? O que te diferencia?"
              rows={2}
              value={data.uniqueValueProposition}
              onChange={(e) => updateData({ uniqueValueProposition: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="border-t border-[rgba(77,88,246,0.12)] pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hasSocialMedia" className="flex items-center gap-1">
              Ja possui presenca em redes sociais? <span className="text-red-500">*</span>
            </Label>
            <Select
              id="hasSocialMedia"
              value={data.hasSocialMedia ? "yes" : "no"}
              onChange={(e) =>
                updateData({
                  hasSocialMedia: e.target.value === "yes",
                  socialMediaHandles: e.target.value === "yes" ? data.socialMediaHandles : "",
                })
              }
              required
            >
              <option value="no">Nao</option>
              <option value="yes">Sim</option>
            </Select>
          </div>

          {data.hasSocialMedia ? (
            <div className="space-y-2">
              <Label htmlFor="socialMediaHandles" className="flex items-center gap-1">
                Quais redes e perfis? <span className="text-red-500">*</span>
              </Label>
              <Input
                id="socialMediaHandles"
                placeholder="Ex: @empresa no Instagram, /empresa no LinkedIn"
                value={data.socialMediaHandles}
                onChange={(e) => updateData({ socialMediaHandles: e.target.value })}
                required
              />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
