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
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(37,136,245,0.14)_0%,rgba(142,34,255,0.16)_100%)] text-[10px] text-[#3640D7]">
            03
          </span>
          AGENDAMENTO E REGRAS
        </CardTitle>
        <CardDescription>
          Defina como sera feito o agendamento e quais sao as suas politicas de atendimento.
        </CardDescription>
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
            <option value="" disabled>
              Selecione um modelo...
            </option>
            <option value="whatsapp">Via WhatsApp</option>
            <option value="google_whatsapp">Google Agenda + WhatsApp</option>
            <option value="plataforma_completa">Plataforma completa</option>
          </Select>
        </div>

        <div className="space-y-4 border-t border-[rgba(77,88,246,0.12)] pt-4">
          <h4 className="text-sm font-semibold text-slate-800">
            Politica de cancelamento e reagendamento
          </h4>

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
              Regras detalhadas para reagendamento <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="rescheduleDetails"
              placeholder="Descreva as condicoes de reagendamento..."
              value={data.rescheduleDetails}
              onChange={(e) => updateData({ rescheduleDetails: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upfrontCost" className="flex items-center gap-1">
              Existe valor antecipado para agendar? <span className="text-red-500">*</span>
            </Label>
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
