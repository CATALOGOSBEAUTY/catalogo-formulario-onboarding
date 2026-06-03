import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/Card";
import { Label } from "@/src/components/ui/Label";
import { Input } from "@/src/components/ui/Input";
import { Select } from "@/src/components/ui/Select";
import { Textarea } from "@/src/components/ui/Textarea";
import type { OnboardingFormState, BrandingStatus, DesignStyle } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

const BRANDING_STATUS_CARDS: { value: BrandingStatus; label: string; description: string; icon: string }[] = [
  {
    value: "ready",
    label: "Identidade Completa",
    description: "Logotipo, paleta de cores e tipografia completos e prontos para uso.",
    icon: "✅",
  },
  {
    value: "partial",
    label: "Parcialmente Pronta",
    description: "Tenho o logotipo mas preciso definir paleta de cores e tipografia.",
    icon: "🎨",
  },
  {
    value: "none",
    label: "Criar do Zero",
    description: "Nao possuo identidade visual — preciso da criacao completa do logotipo e da marca.",
    icon: "🆕",
  },
];

const DESIGN_STYLE_CARDS: { value: DesignStyle; label: string; description: string; icon: string }[] = [
  { value: "minimalist", label: "Minimalista / Clean", description: "Muito espaco em branco, tipografia sofisticada.", icon: "⬜" },
  { value: "tech", label: "Dark Mode / Futurista", description: "Fundo escuro, gradientes neon, glassmorphism.", icon: "🌙" },
  { value: "corporate", label: "Corporativo / Sobrio", description: "Azul, cinza, estrutura tradicional de alta credibilidade.", icon: "💼" },
  { value: "creative", label: "Criativo / Colorido", description: "Gradientes, ilustracoes 3D, animacoes expressivas.", icon: "🎭" },
  { value: "luxury", label: "Premium / Luxo", description: "Dourado, preto, tipografia serifada, fotografia premium.", icon: "👑" },
  { value: "warm", label: "Acolhedor / Humanizado", description: "Tons terra, fotos de pessoas, linguagem proxima.", icon: "🤝" },
];

const BRAND_VOICE_OPTIONS = [
  "Profissional e Tecnico",
  "Descontraido e Proximo",
  "Inspirador e Motivacional",
  "Autoritario e Especialista",
  "Jovem e Moderno",
  "Seguro e Confiavel",
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

export function DesignBrandingForm({ data, updateData }: Props) {
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
        <CardTitle>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(37,136,245,0.14)_0%,rgba(142,34,255,0.16)_100%)] text-[10px] text-[#3640D7]">
            04
          </span>
          DESIGN, BRANDING E INFRAESTRUTURA
        </CardTitle>
        <CardDescription>
          Sua identidade visual e infraestrutura tecnica atual definem o ponto de partida do projeto.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Branding Status */}
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

        {/* Design Style */}
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

        {/* Brand Voice */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Tom de voz da marca (2 a 4) <span className="text-red-500">*</span>
          </Label>
          <CheckboxGroup
            id="brandVoice"
            options={BRAND_VOICE_OPTIONS}
            selected={data.brandVoice}
            onChange={(brandVoice) => {
              if (brandVoice.length <= 4) {
                updateData({ brandVoice });
              }
            }}
          />
        </div>

        {/* Design References */}
        <div className="space-y-2">
          <Label htmlFor="designReferences" className="flex items-center gap-1">
            Sites de referencia que admira
          </Label>
          <Textarea
            id="designReferences"
            placeholder="Cole URLs de sites que voce admira e explique o que gosta em cada um."
            rows={3}
            value={data.designReferences}
            onChange={(e) => updateData({ designReferences: e.target.value })}
          />
        </div>

        {/* Domain & Hosting */}
        <div className="border-t border-[rgba(77,88,246,0.12)] pt-4 space-y-4">
          <h4 className="text-sm font-semibold text-slate-800">Infraestrutura tecnologica</h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hasDomain" className="flex items-center gap-1">
                Possui dominio registrado? <span className="text-red-500">*</span>
              </Label>
              <Select
                id="hasDomain"
                value={data.hasDomain ? "yes" : "no"}
                onChange={(e) =>
                  updateData(
                    e.target.value === "yes"
                      ? { hasDomain: true }
                      : { hasDomain: false, websiteUrl: "" },
                  )
                }
                required
              >
                <option value="no">Nao</option>
                <option value="yes">Sim</option>
              </Select>
            </div>

            {data.hasDomain ? (
              <div className="space-y-2">
                <Label htmlFor="websiteUrl" className="flex items-center gap-1">
                  URL do dominio <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="websiteUrl"
                  placeholder="https://www.seusite.com.br"
                  value={data.websiteUrl}
                  onChange={(e) => updateData({ websiteUrl: e.target.value })}
                  required
                />
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hasHosting" className="flex items-center gap-1">
                Possui hospedagem ativa? <span className="text-red-500">*</span>
              </Label>
              <Select
                id="hasHosting"
                value={data.hasHosting ? "yes" : "no"}
                onChange={(e) =>
                  updateData(
                    e.target.value === "yes"
                      ? { hasHosting: true }
                      : { hasHosting: false, hostingProvider: "" },
                  )
                }
                required
              >
                <option value="no">Nao</option>
                <option value="yes">Sim</option>
              </Select>
            </div>

            {data.hasHosting ? (
              <div className="space-y-2">
                <Label htmlFor="hostingProvider" className="flex items-center gap-1">
                  Provedor de hospedagem <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="hostingProvider"
                  placeholder="Ex: AWS, Vercel, HostGator, Locaweb..."
                  value={data.hostingProvider}
                  onChange={(e) => updateData({ hostingProvider: e.target.value })}
                  required
                />
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
