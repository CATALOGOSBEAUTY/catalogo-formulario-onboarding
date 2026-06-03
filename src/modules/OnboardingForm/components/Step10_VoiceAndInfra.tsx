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

const BRAND_VOICE_OPTIONS = [
  "Profissional e Tecnico",
  "Descontraido e Proximo",
  "Inspirador e Motivacional",
  "Autoritario e Especialista",
  "Jovem e Moderno",
  "Seguro e Confiavel",
];

export function Step10_VoiceAndInfra({ data, updateData }: Props) {
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <StepHeader stepNumber={10} title="VOZ, REFERÊNCIAS E INFRAESTRUTURA" description="Tom da marca, sites de inspiracao e infraestrutura tecnica atual." />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Tom de voz da marca (2 a 4) <span className="text-red-500">*</span>
          </Label>
          <CheckboxGroup
            id="brandVoice"
            options={BRAND_VOICE_OPTIONS}
            selected={data.brandVoice}
            onChange={(v) => { if (v.length <= 4) updateData({ brandVoice: v }); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="designReferences">Sites de referencia que admira</Label>
          <Input id="designReferences" placeholder="Cole URLs de sites que voce admira" value={data.designReferences} onChange={(e) => updateData({ designReferences: e.target.value })} />
        </div>

        <div className="border-t border-[rgba(77,88,246,0.12)] pt-4 space-y-4">
          <h4 className="text-sm font-semibold text-slate-800">Infraestrutura tecnologica</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hasDomain" className="flex items-center gap-1">Possui dominio registrado? <span className="text-red-500">*</span></Label>
              <Select id="hasDomain" value={data.hasDomain ? "yes" : "no"} onChange={(e) => updateData(e.target.value === "yes" ? { hasDomain: true } : { hasDomain: false, websiteUrl: "" })} required>
                <option value="no">Nao</option>
                <option value="yes">Sim</option>
              </Select>
            </div>
            {data.hasDomain ? (
              <div className="space-y-2">
                <Label htmlFor="websiteUrl" className="flex items-center gap-1">URL do dominio <span className="text-red-500">*</span></Label>
                <Input id="websiteUrl" placeholder="https://www.seusite.com.br" value={data.websiteUrl} onChange={(e) => updateData({ websiteUrl: e.target.value })} required />
              </div>
            ) : null}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hasHosting" className="flex items-center gap-1">Possui hospedagem ativa? <span className="text-red-500">*</span></Label>
              <Select id="hasHosting" value={data.hasHosting ? "yes" : "no"} onChange={(e) => updateData(e.target.value === "yes" ? { hasHosting: true } : { hasHosting: false, hostingProvider: "" })} required>
                <option value="no">Nao</option>
                <option value="yes">Sim</option>
              </Select>
            </div>
            {data.hasHosting ? (
              <div className="space-y-2">
                <Label htmlFor="hostingProvider" className="flex items-center gap-1">Provedor <span className="text-red-500">*</span></Label>
                <Input id="hostingProvider" placeholder="Ex: AWS, Vercel, HostGator..." value={data.hostingProvider} onChange={(e) => updateData({ hostingProvider: e.target.value })} required />
              </div>
            ) : null}
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[rgba(77,88,246,0.12)] bg-white/80 px-4 py-3 text-xs font-medium text-slate-700 transition-all hover:border-[rgba(77,88,246,0.28)]">
              <span>Assessoria em SEO tecnico?</span>
              <input type="checkbox" checked={data.needsSeoConsulting} onChange={(e) => updateData({ needsSeoConsulting: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-[#4D58F6] focus:ring-[#4D58F6]" />
            </label>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[rgba(77,88,246,0.12)] bg-white/80 px-4 py-3 text-xs font-medium text-slate-700 transition-all hover:border-[rgba(77,88,246,0.28)]">
              <span>Acessibilidade digital (WCAG)?</span>
              <input type="checkbox" checked={data.needsWcagCompliance} onChange={(e) => updateData({ needsWcagCompliance: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-[#4D58F6] focus:ring-[#4D58F6]" />
            </label>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[rgba(77,88,246,0.12)] bg-white/80 px-4 py-3 text-xs font-medium text-slate-700 transition-all hover:border-[rgba(77,88,246,0.28)]">
              <span>Suporte pos-lancamento?</span>
              <input type="checkbox" checked={data.needsPostLaunchSupport} onChange={(e) => updateData({ needsPostLaunchSupport: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-[#4D58F6] focus:ring-[#4D58F6]" />
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
