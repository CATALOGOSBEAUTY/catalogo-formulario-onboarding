import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/Card";
import { Label } from "@/src/components/ui/Label";
import { Input } from "@/src/components/ui/Input";
import { Select } from "@/src/components/ui/Select";
import type { OnboardingFormState, DeliveryTimeline, ProjectBudget } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

const TIMELINE_CARDS: { value: DeliveryTimeline; label: string; description: string; icon: string }[] = [
  { value: "urgent", label: "Urgente", description: "Menos de 30 dias. Deploy acelerado, escopo pode ser reduzido.", icon: "⚡" },
  { value: "standard", label: "Padrao", description: "30 a 90 dias. Ciclo padrao de mercado, qualidade equilibrada.", icon: "📅" },
  { value: "structured", label: "Estruturado", description: "3 a 6 meses. Projeto com sprints bem definidos.", icon: "🏗️" },
  { value: "flexible", label: "Flexivel", description: "Sem data definida. A qualidade tem prioridade sobre o prazo.", icon: "🕐" },
];

const BUDGET_CARDS: { value: ProjectBudget; label: string; description: string; icon: string }[] = [
  { value: "tier_1", label: "R$ 2.000 a R$ 5.000", description: "Landing Pages simples, sites estaticos.", icon: "💰" },
  { value: "tier_2", label: "R$ 5.000 a R$ 15.000", description: "Sites institucionais completos, lojas basicas.", icon: "💰💰" },
  { value: "tier_3", label: "R$ 15.000 a R$ 30.000", description: "E-commerces robustos, plataformas MVP.", icon: "💰💰💰" },
  { value: "tier_4", label: "R$ 30.000 a R$ 80.000", description: "Plataformas SaaS com integracoes complexas.", icon: "💎" },
  { value: "tier_5", label: "Acima de R$ 80.000", description: "Sistemas de grande escala, produtos de tecnologia.", icon: "🚀" },
];

const DECISION_MAKER_OPTIONS = [
  "Sou eu mesmo",
  "Meu socio/parceiro",
  "Diretor ou Gerente acima de mim",
  "Conselho / Diretoria Colegiada",
];

const CONTENT_STATUS_OPTIONS = [
  "Temos todo o conteudo pronto (textos, fotos, videos)",
  "Temos parte do conteudo e precisamos de apoio",
  "Nao temos nada pronto — precisamos de criacao completa",
];

const CONTACT_CHANNEL_OPTIONS = [
  "WhatsApp",
  "E-mail",
  "Reuniao via Google Meet / Zoom",
  "Plataforma de Gestao (Notion, ClickUp, Asana)",
];

const MEETING_FREQUENCY_OPTIONS = [
  "Reunioes semanais de alinhamento",
  "Reunioes quinzenais",
  "Reunioes apenas em marcos do projeto",
  "Prefiro comunicacao assincrona (sem reunioes frequentes)",
];

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function SelectedFilesList({ title, files }: { title: string; files: File[] }) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[rgba(77,88,246,0.14)] bg-white/80 p-4 shadow-[0_10px_30px_rgba(42,61,130,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4D58F6]">{title}</p>
      <div className="mt-3 space-y-2">
        {files.map((file) => (
          <div
            key={`${file.name}-${file.size}-${file.lastModified}`}
            className="flex items-center justify-between rounded-xl border border-[rgba(77,88,246,0.08)] bg-[rgba(246,248,255,0.86)] px-3 py-2 text-xs text-slate-600"
          >
            <span className="max-w-[75%] truncate font-medium text-slate-700">{file.name}</span>
            <span>{formatFileSize(file.size)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BudgetTimelineForm({ data, updateData }: Props) {
  const totalFiles = data.filesBranding.length + data.filesReferences.length;

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(37,136,245,0.14)_0%,rgba(142,34,255,0.16)_100%)] text-[10px] text-[#3640D7]">
            05
          </span>
          CRONOGRAMA, BUDGET E ANEXOS
        </CardTitle>
        <CardDescription>
          Alinhe expectativas comerciais e envie materiais de apoio para o projeto.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Decision Maker & Deadline */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="decisionMaker" className="flex items-center gap-1">
              Quem decide sobre o projeto? <span className="text-red-500">*</span>
            </Label>
            <Select
              id="decisionMaker"
              value={data.decisionMaker}
              onChange={(e) => updateData({ decisionMaker: e.target.value })}
              required
            >
              <option value="" disabled>Selecione...</option>
              {DECISION_MAKER_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hasCriticalDeadline" className="flex items-center gap-1">
              Existe data critica de lancamento?
            </Label>
            <Select
              id="hasCriticalDeadline"
              value={data.hasCriticalDeadline ? "yes" : "no"}
              onChange={(e) =>
                updateData({
                  hasCriticalDeadline: e.target.value === "yes",
                  criticalDeadlineReason: e.target.value === "yes" ? data.criticalDeadlineReason : "",
                })
              }
            >
              <option value="no">Nao</option>
              <option value="yes">Sim</option>
            </Select>
          </div>
        </div>

        {data.hasCriticalDeadline ? (
          <div className="space-y-2">
            <Label htmlFor="criticalDeadlineReason" className="flex items-center gap-1">
              Motivo do prazo critico <span className="text-red-500">*</span>
            </Label>
            <Input
              id="criticalDeadlineReason"
              placeholder="Ex: Lancamento do produto em 15/07, campanha de Black Friday..."
              value={data.criticalDeadlineReason}
              onChange={(e) => updateData({ criticalDeadlineReason: e.target.value })}
              required
            />
          </div>
        ) : null}

        {/* Timeline Cards */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Prazo estimado de entrega <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE_CARDS.map((card) => (
              <button
                key={card.value}
                type="button"
                onClick={() => updateData({ deliveryTimeline: card.value })}
                className={`group flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition-all ${
                  data.deliveryTimeline === card.value
                    ? "border-[rgba(77,88,246,0.42)] bg-[rgba(237,240,255,0.92)] shadow-[0_8px_24px_rgba(77,88,246,0.12)]"
                    : "border-[rgba(77,88,246,0.12)] bg-white/80 hover:border-[rgba(77,88,246,0.28)]"
                }`}
              >
                <span className="text-base">{card.icon}</span>
                <span className="text-xs font-bold text-slate-800">{card.label}</span>
                <p className="text-[10px] leading-relaxed text-slate-500">{card.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Budget Cards */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Faixa de investimento estimada <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BUDGET_CARDS.map((card) => (
              <button
                key={card.value}
                type="button"
                onClick={() => updateData({ projectBudget: card.value })}
                className={`group flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition-all ${
                  data.projectBudget === card.value
                    ? "border-[rgba(77,88,246,0.42)] bg-[rgba(237,240,255,0.92)] shadow-[0_8px_24px_rgba(77,88,246,0.12)]"
                    : "border-[rgba(77,88,246,0.12)] bg-white/80 hover:border-[rgba(77,88,246,0.28)]"
                }`}
              >
                <span className="text-xs font-bold text-slate-800">{card.label}</span>
                <p className="text-[10px] leading-relaxed text-slate-500">{card.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Content Status & Communication */}
        <div className="border-t border-[rgba(77,88,246,0.12)] pt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contentStatus" className="flex items-center gap-1">
                Status do conteudo textual <span className="text-red-500">*</span>
              </Label>
              <Select
                id="contentStatus"
                value={data.contentStatus}
                onChange={(e) => updateData({ contentStatus: e.target.value })}
                required
              >
                <option value="" disabled>Selecione...</option>
                {CONTENT_STATUS_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredContactChannel" className="flex items-center gap-1">
                Canal de comunicacao preferido <span className="text-red-500">*</span>
              </Label>
              <Select
                id="preferredContactChannel"
                value={data.preferredContactChannel}
                onChange={(e) => updateData({ preferredContactChannel: e.target.value })}
                required
              >
                <option value="" disabled>Selecione...</option>
                {CONTACT_CHANNEL_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetingFrequency" className="flex items-center gap-1">
              Frequencia de reunioes preferida <span className="text-red-500">*</span>
            </Label>
            <Select
              id="meetingFrequency"
              value={data.meetingFrequency}
              onChange={(e) => updateData({ meetingFrequency: e.target.value })}
              required
            >
              <option value="" disabled>Selecione...</option>
              {MEETING_FREQUENCY_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
            </Select>
          </div>
        </div>

        {/* File Uploads */}
        <div className="border-t border-[rgba(77,88,246,0.12)] pt-4 space-y-4">
          <h4 className="text-sm font-semibold text-slate-800">Materiais de apoio</h4>

          <div className="space-y-2">
            <Label htmlFor="filesBranding" className="flex items-center gap-1">
              Arquivos de branding e identidade <span className="text-red-500">*</span>
            </Label>
            <Input
              id="filesBranding"
              type="file"
              multiple
              accept="image/*,.pdf,.ai,.eps,.svg"
              onChange={(e) => updateData({ filesBranding: Array.from(e.target.files || []) })}
              className="file:bg-[rgba(37,136,245,0.1)] file:text-[#3640D7] hover:file:bg-[rgba(77,88,246,0.14)]"
            />
            <p className="text-xs text-slate-500">
              Logos, manuais de marca, paletas de cores. Total atual: {data.filesBranding.length}.
            </p>
            <SelectedFilesList title="Arquivos de branding prontos para envio" files={data.filesBranding} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filesReferences" className="flex items-center gap-1">
              Referencias visuais e wireframes
            </Label>
            <Input
              id="filesReferences"
              type="file"
              multiple
              accept="image/*,.pdf,.fig"
              onChange={(e) => updateData({ filesReferences: Array.from(e.target.files || []) })}
              className="file:bg-[rgba(37,136,245,0.1)] file:text-[#3640D7] hover:file:bg-[rgba(77,88,246,0.14)]"
            />
            <p className="text-xs text-slate-500">
              Prints de layouts, wireframes, PDFs de escopo. Maximo total de 10 arquivos. Atual: {totalFiles}.
            </p>
            <SelectedFilesList title="Referencias prontas para envio" files={data.filesReferences} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
