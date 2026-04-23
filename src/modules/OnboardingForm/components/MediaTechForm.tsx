import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Label } from "@/src/components/ui/Label";
import { Select } from "@/src/components/ui/Select";
import { OnboardingFormState } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

export function MediaTechForm({ data, updateData }: Props) {
  return (
    <Card className="w-full mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>
          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] shrink-0">04</span>
          MÍDIA E TECNOLOGIA
        </CardTitle>
        <CardDescription>Envie suas fotos e nos conte sobre a sua estrutura tecnológica atual.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Media Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-800">Fotos e Arquivos</h4>
          
          <div className="space-y-2">
            <Label htmlFor="photosProcedures" className="flex items-center gap-1">Fotos dos seus procedimentos (Antes e Depois) <span className="text-red-500">*</span></Label>
            <Input 
              id="photosProcedures" 
              type="file" 
              multiple 
              accept="image/*"
              onChange={(e) => updateData({ photosProcedures: e.target.files })}
              className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:bg-rose-50 file:text-rose-900 hover:file:bg-rose-100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photosFacade" className="flex items-center gap-1">Fotos da fachada e ambiente interno <span className="text-red-500">*</span></Label>
            <Input 
              id="photosFacade" 
              type="file" 
              multiple 
              accept="image/*"
              onChange={(e) => updateData({ photosFacade: e.target.files })}
              className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:bg-rose-50 file:text-rose-900 hover:file:bg-rose-100"
              required
            />
          </div>
        </div>

        <div className="border-t border-slate-100"></div>

        {/* Tech Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-800">Área Tecnológica</h4>
          
          <div className="space-y-2">
            <Label htmlFor="hasDomain" className="flex items-center gap-1">Você possui domínio? <span className="text-red-500">*</span></Label>
            <Select 
              id="hasDomain"
              value={data.hasDomain}
              onChange={(e) => updateData({ hasDomain: e.target.value as "yes" | "no" })}
              required
            >
              <option value="no">Não</option>
              <option value="yes">Sim</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="websiteUrl" className="flex items-center gap-1">Tem algum site? Coloque o link aqui <span className="text-red-500">*</span></Label>
            <Input 
              id="websiteUrl" 
              placeholder="https://www.seusite.com.br" 
              value={data.websiteUrl}
              onChange={(e) => updateData({ websiteUrl: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hostingProvider" className="flex items-center gap-1">Qual provedor o seu site está hospedado? <span className="text-red-500">*</span></Label>
            <Input 
              id="hostingProvider" 
              placeholder="Ex: HostGator, Locaweb, Vercel..." 
              value={data.hostingProvider}
              onChange={(e) => updateData({ hostingProvider: e.target.value })}
              required
            />
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
