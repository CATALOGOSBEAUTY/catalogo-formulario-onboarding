import React from "react";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import { Label } from "@/src/components/ui/Label";
import { StepHeader } from "./shared";
import type { OnboardingFormState, BrandingStatus, DesignStyle } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

const BRANDING_STATUS_CARDS: { value: BrandingStatus; label: string; description: string; icon: string }[] = [
  { value: "ready", label: "Identidade Completa", description: "Logotipo, paleta de cores e tipografia completos e prontos.", icon: "✅" },
  { value: "partial", label: "Parcialmente Pronta", description: "Tenho o logotipo mas preciso definir paleta e tipografia.", icon: "🎨" },
  { value: "none", label: "Criar do Zero", description: "Nao possuo identidade visual — preciso da criacao completa.", icon: "🆕" },
];

const DESIGN_STYLE_CARDS: { value: DesignStyle; label: string; description: string; icon: string }[] = [
  { value: "minimalist", label: "Minimalista / Clean", description: "Espaco em branco, tipografia sofisticada.", icon: "⬜" },
  { value: "tech", label: "Dark Mode / Futurista", description: "Fundo escuro, gradientes neon, glassmorphism.", icon: "🌙" },
  { value: "corporate", label: "Corporativo / Sobrio", description: "Azul, cinza, alta credibilidade.", icon: "💼" },
  { value: "creative", label: "Criativo / Colorido", description: "Gradientes, ilustracoes 3D, animacoes.", icon: "🎭" },
  { value: "luxury", label: "Premium / Luxo", description: "Dourado, preto, tipografia serifada.", icon: "👑" },
  { value: "warm", label: "Acolhedor / Humanizado", description: "Tons terra, fotos de pessoas, proximidade.", icon: "🤝" },
];

export function Step09_VisualIdentity({ data, updateData }: Props) {
  const toggleDesignStyle = (style: DesignStyle) => {
    const current = data.designStyle;
    if (current.includes(style)) {
      updateData({ designStyle: current.filter((s) => s !== style) });
    } else if (current.length < 3) {
      updateData({ designStyle: [...current, style] });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <StepHeader stepNumber={9} title="IDENTIDADE VISUAL" description="Estagio atual da sua marca e o estilo visual desejado." />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Estagio da identidade visual <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {BRANDING_STATUS_CARDS.map((card) => (
              <button
                key={card.value}
                type="button"
                onClick={() => updateData({ brandingStatus: card.value })}
                className={`group flex flex-col items-start gap-1.5 rounded-2xl border p-4 text-left transition-all ${
                  data.brandingStatus === card.value
                    ? "border-[rgba(77,88,246,0.42)] bg-[rgba(237,240,255,0.92)] shadow-[0_8px_24px_rgba(77,88,246,0.12)]"
                    : "border-[rgba(77,88,246,0.12)] bg-white/80 hover:border-[rgba(77,88,246,0.28)]"
                }`}
              >
                <span className="text-lg">{card.icon}</span>
                <span className="text-xs font-bold text-slate-800">{card.label}</span>
                <p className="text-[10px] leading-relaxed text-slate-500">{card.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Estilo visual desejado (ate 3) <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DESIGN_STYLE_CARDS.map((card) => {
              const isSelected = data.designStyle.includes(card.value);
              const isDisabled = !isSelected && data.designStyle.length >= 3;
              return (
                <button
                  key={card.value}
                  type="button"
                  onClick={() => !isDisabled && toggleDesignStyle(card.value)}
                  disabled={isDisabled}
                  className={`group flex flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition-all ${
                    isSelected
                      ? "border-[rgba(77,88,246,0.42)] bg-[rgba(237,240,255,0.92)] shadow-[0_8px_24px_rgba(77,88,246,0.12)]"
                      : isDisabled
                        ? "cursor-not-allowed border-[rgba(77,88,246,0.06)] bg-white/40 opacity-50"
                        : "border-[rgba(77,88,246,0.12)] bg-white/80 hover:border-[rgba(77,88,246,0.28)]"
                  }`}
                >
                  <span className="text-base">{card.icon}</span>
                  <span className="text-xs font-bold text-slate-800">{card.label}</span>
                  <p className="text-[10px] leading-relaxed text-slate-500">{card.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
