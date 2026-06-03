import React from "react";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Label } from "@/src/components/ui/Label";
import { Select } from "@/src/components/ui/Select";
import { CheckboxGroup, StepHeader } from "./shared";
import type { OnboardingFormState } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

const COMPETITOR_LIKES_OPTIONS = [
  "Design limpo e profissional",
  "Navegacao intuitiva e rapida",
  "Checkout/conversao simplificados",
  "Conteudo bem escrito e persuasivo",
  "Bom posicionamento no Google",
  "Identidade visual forte",
  "Experiencia mobile excelente",
  "Funcionalidades avancadas",
];

const USP_OPTIONS = [
  "Preco mais competitivo do mercado",
  "Atendimento humanizado e personalizado",
  "Tecnologia/inovacao exclusiva",
  "Maior experiencia/autoridade no setor",
  "Entrega/resultado mais rapido",
  "Qualidade superior comprovada",
  "Solucao completa (tudo em um so lugar)",
  "Outro",
];

const SOCIAL_NETWORK_OPTIONS = ["Instagram", "LinkedIn", "Facebook", "TikTok", "YouTube", "Twitter/X"];

export function Step06_MarketPosition({ data, updateData }: Props) {
  const hasUspOther = data.uniqueValueProps.includes("Outro");

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <StepHeader stepNumber={6} title="MERCADO E POSICIONAMENTO" description="Como voce se posiciona frente aos concorrentes." />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="competitors">Principais concorrentes (URLs ou nomes)</Label>
          <Input id="competitors" placeholder="Ex: www.concorrente1.com.br, Empresa X" value={data.competitors} onChange={(e) => updateData({ competitors: e.target.value })} />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1">O que admira nesses concorrentes?</Label>
          <CheckboxGroup id="competitorLikes" options={COMPETITOR_LIKES_OPTIONS} selected={data.competitorLikes} onChange={(v) => updateData({ competitorLikes: v })} />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Seu diferencial competitivo (USP) <span className="text-red-500">*</span>
          </Label>
          <CheckboxGroup id="uniqueValueProps" options={USP_OPTIONS} selected={data.uniqueValueProps} onChange={(v) => updateData({ uniqueValueProps: v })} />
          {hasUspOther ? (
            <Input placeholder="Descreva seu diferencial..." value={data.uniqueValuePropOther} onChange={(e) => updateData({ uniqueValuePropOther: e.target.value })} className="mt-2" />
          ) : null}
        </div>

        <div className="border-t border-[rgba(77,88,246,0.12)] pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hasSocialMedia">Ja possui presenca em redes sociais?</Label>
            <Select id="hasSocialMedia" value={data.hasSocialMedia ? "yes" : "no"} onChange={(e) => updateData({ hasSocialMedia: e.target.value === "yes", socialMediaNetworks: e.target.value === "yes" ? data.socialMediaNetworks : [], socialMediaHandles: e.target.value === "yes" ? data.socialMediaHandles : "" })}>
              <option value="no">Nao</option>
              <option value="yes">Sim</option>
            </Select>
          </div>

          {data.hasSocialMedia ? (
            <>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">Quais redes? <span className="text-red-500">*</span></Label>
                <CheckboxGroup id="socialMediaNetworks" options={SOCIAL_NETWORK_OPTIONS} selected={data.socialMediaNetworks} onChange={(v) => updateData({ socialMediaNetworks: v })} columns={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialMediaHandles">Seus @ ou links dos perfis</Label>
                <Input id="socialMediaHandles" placeholder="Ex: @empresa no Instagram, /empresa no LinkedIn" value={data.socialMediaHandles} onChange={(e) => updateData({ socialMediaHandles: e.target.value })} />
              </div>
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
