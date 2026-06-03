import React from "react";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Label } from "@/src/components/ui/Label";
import { Select } from "@/src/components/ui/Select";
import { StepHeader } from "./shared";
import type { OnboardingFormState } from "../types";
import { formatCPFOrCNPJ } from "../numberFormatting";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

const SECTOR_OPTIONS = [
  "Saude e Clinicas",
  "Educacao e Cursos Online",
  "E-commerce e Varejo",
  "Imobiliario",
  "Advocacia e Juridico",
  "Financas e Contabilidade",
  "Alimentacao e Gastronomia",
  "Beleza e Estetica",
  "Tecnologia e SaaS",
  "Servicos e Consultoria",
  "Outro",
];

export function Step01_ResponsibleData({ data, updateData }: Props) {
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <StepHeader stepNumber={1} title="DADOS DO RESPONSÁVEL" description="Informacoes basicas do responsavel pelo projeto." />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-1">
              Nome do responsavel <span className="text-red-500">*</span>
            </Label>
            <Input id="fullName" placeholder="Ex: Maria Silva" value={data.fullName} onChange={(e) => updateData({ fullName: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName" className="flex items-center gap-1">
              Razao Social / Nome Fantasia <span className="text-red-500">*</span>
            </Label>
            <Input id="companyName" placeholder="Ex: Studio Digital Ltda" value={data.companyName} onChange={(e) => updateData({ companyName: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companySector" className="flex items-center gap-1">
              Segmento de atuacao <span className="text-red-500">*</span>
            </Label>
            <Select id="companySector" value={data.companySector} onChange={(e) => updateData({ companySector: e.target.value })} required>
              <option value="" disabled>Selecione...</option>
              {SECTOR_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpfCnpj" className="flex items-center gap-1">
              CPF / CNPJ <span className="text-red-500">*</span>
            </Label>
            <Input id="cpfCnpj" placeholder="000.000.000-00" value={data.cpfCnpj} onChange={(e) => updateData({ cpfCnpj: formatCPFOrCNPJ(e.target.value) })} required />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
