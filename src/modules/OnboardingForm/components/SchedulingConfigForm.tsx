import React from "react";
import { ChevronDown, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Label } from "@/src/components/ui/Label";
import { Select } from "@/src/components/ui/Select";
import { Textarea } from "@/src/components/ui/Textarea";
import { OnboardingFormState, PriceUnit } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

const schedulingOptions = [
  {
    value: "whatsapp",
    label: "Via WhatsApp",
    description:
      "O agendamento e enviado para o WhatsApp do cliente da empresa para confirmacao.",
  },
  {
    value: "google_whatsapp",
    label: "Google Agenda + WhatsApp",
    description:
      "Igual ao WhatsApp, porem tambem e marcado no Google Agenda da empresa.",
  },
  {
    value: "plataforma_completa",
    label: "Plataforma completa",
    description:
      "Toda confirmacao vai para a plataforma, o cliente recebe a mensagem no WhatsApp e a confirmacao e manual.",
  },
] as const;

function SchedulingModelSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hoveredValue, setHoveredValue] = React.useState("");
  const selectedOption = schedulingOptions.find((option) => option.value === value);
  const activeOption =
    schedulingOptions.find((option) => option.value === hoveredValue) || selectedOption;

  return (
    <div className="relative">
      <button
        type="button"
        id="schedulingModel"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-[rgba(110,126,170,0.3)] bg-white px-3 py-2 text-left text-sm font-medium text-slate-800 shadow-[0_8px_22px_rgba(42,61,130,0.05)] focus-visible:border-[#6A63FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4D58F6] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        onBlur={(event) => {
          if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) {
            setIsOpen(false);
            setHoveredValue("");
          }
        }}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{selectedOption?.label || "Selecione um modelo..."}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#4D58F6] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-30 rounded-xl border border-[rgba(77,88,246,0.18)] bg-white p-1 shadow-[0_22px_55px_rgba(42,61,130,0.18)]">
          <div role="listbox" aria-labelledby="schedulingModel" className="space-y-1">
            {schedulingOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                title={option.description}
                className="group relative flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-[rgba(77,88,246,0.1)] hover:text-[#1C2040] focus-visible:bg-[rgba(77,88,246,0.1)] focus-visible:outline-none"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setHoveredValue("");
                }}
                onFocus={() => setHoveredValue(option.value)}
                onMouseEnter={() => setHoveredValue(option.value)}
              >
                <span className="font-medium">{option.label}</span>
                <Info className="h-4 w-4 shrink-0 text-[#4D58F6] opacity-70 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>

          {activeOption ? (
            <div className="mt-2 rounded-lg border border-[rgba(77,88,246,0.14)] bg-[rgba(247,249,255,0.96)] px-3 py-2 text-xs leading-relaxed text-slate-600">
              {activeOption.description}
            </div>
          ) : null}
        </div>
      ) : null}

      {selectedOption ? (
        <p className="mt-2 rounded-lg bg-[rgba(247,249,255,0.88)] px-3 py-2 text-xs leading-relaxed text-slate-500">
          {selectedOption.description}
        </p>
      ) : null}
    </div>
  );
}

export function SchedulingConfigForm({ data, updateData }: Props) {
  const moneyOptions: { value: PriceUnit; label: string }[] = [
    { value: "BRL", label: "Real" },
    { value: "USD", label: "Dolar" },
    { value: "PERCENT", label: "%" },
  ];

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
          <SchedulingModelSelector
            value={data.schedulingModel}
            onChange={(schedulingModel) => updateData({ schedulingModel })}
          />
        </div>

        <div className="space-y-4 border-t border-[rgba(77,88,246,0.12)] pt-4">
          <h4 className="text-sm font-semibold text-slate-800">
            Politica de cancelamento e reagendamento
          </h4>

          <div className="space-y-2">
            <Label htmlFor="cancellationFine" className="flex items-center gap-1">
              Valor da multa para cancelamento <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-[minmax(0,1fr)_150px] gap-3">
              <Input
                id="cancellationFine"
                placeholder="Ex: 50,00"
                inputMode="decimal"
                value={data.cancellationFineAmount}
                onChange={(e) => updateData({ cancellationFineAmount: e.target.value })}
                required
              />
              <Select
                value={data.cancellationFineUnit}
                onChange={(e) =>
                  updateData({ cancellationFineUnit: e.target.value as PriceUnit })
                }
              >
                {moneyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
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
            <div className="grid grid-cols-[minmax(0,1fr)_150px] gap-3">
              <Input
                id="upfrontCost"
                placeholder="Ex: 50"
                inputMode="decimal"
                value={data.upfrontCostAmount}
                onChange={(e) => updateData({ upfrontCostAmount: e.target.value })}
                required
              />
              <Select
                value={data.upfrontCostUnit}
                onChange={(e) =>
                  updateData({ upfrontCostUnit: e.target.value as PriceUnit })
                }
              >
                {moneyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
