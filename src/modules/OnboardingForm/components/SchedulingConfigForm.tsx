import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Label } from "@/src/components/ui/Label";
import { Select } from "@/src/components/ui/Select";
import { Textarea } from "@/src/components/ui/Textarea";
import { OnboardingFormState } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

export function SchedulingConfigForm({ data, updateData }: Props) {
  return (
    <Card className="w-full mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>
          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] shrink-0">03</span>
          AGENDAMENTO E REGRAS
        </CardTitle>
        <CardDescription>Defina como será feito o agendamento e quais as suas políticas de atendimento.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-2">
          <Label htmlFor="schedulingModel" className="flex items-center gap-1">
            Modelo de agendamento desejado <span className="text-red-500">*</span>
          </Label>
          <Select 
            id="schedulingModel"
            value={data.schedulingModel}
            onChange={(e) => updateData({ schedulingModel: e.target.value })}
            required
          >
            <option value="" disabled>Selecione um modelo...</option>
            <option value="whatsapp">Via WhatsApp</option>
            <option value="google_whatsapp">Google Agenda + WhatsApp</option>
            <option value="plataforma_completa">Plataforma Completa</option>
          </Select>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-sm font-semibold text-slate-800">Política de Cancelamento e Reagendamento</h4>
          
          <div className="space-y-2">
            <Label htmlFor="cancellationFine" className="flex items-center gap-1">
              Valor da multa para cancelamento <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="cancellationFine" 
              placeholder="Ex: R$ 50,00 ou 20%" 
              value={data.cancellationFine}
              onChange={(e) => updateData({ cancellationFine: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rescheduleDetails" className="flex items-center gap-1">
              Para reagendamento vai ter alguma multa? Coloque aqui as informações detalhadas <span className="text-red-500">*</span>
            </Label>
            <Textarea 
              id="rescheduleDetails" 
              placeholder="Descreva as condições de reagendamento..." 
              value={data.rescheduleDetails}
              onChange={(e) => updateData({ rescheduleDetails: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upfrontCost" className="flex items-center gap-1">Para agendar a consulta paga algum valor? <span className="text-red-500">*</span></Label>
            <Input 
              id="upfrontCost" 
              placeholder="Ex: Pagamento adiantado de 50%" 
              value={data.upfrontCost}
              onChange={(e) => updateData({ upfrontCost: e.target.value })}
              required
            />
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
