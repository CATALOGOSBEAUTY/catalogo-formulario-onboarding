import React from "react";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Label } from "@/src/components/ui/Label";
import { Select } from "@/src/components/ui/Select";
import { StepHeader } from "./shared";
import type { OnboardingFormState } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

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
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function SelectedFilesList({ title, files }: { title: string; files: File[] }) {
  if (files.length === 0) return null;
  return (
    <div className="rounded-2xl border border-[rgba(77,88,246,0.14)] bg-white/80 p-4 shadow-[0_10px_30px_rgba(42,61,130,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4D58F6]">{title}</p>
      <div className="mt-3 space-y-2">
        {files.map((file) => (
          <div key={`${file.name}-${file.size}-${file.lastModified}`} className="flex items-center justify-between rounded-xl border border-[rgba(77,88,246,0.08)] bg-[rgba(246,248,255,0.86)] px-3 py-2 text-xs text-slate-600">
            <span className="max-w-[75%] truncate font-medium text-slate-700">{file.name}</span>
            <span>{formatFileSize(file.size)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Step12_ContentAndFiles({ data, updateData }: Props) {
  const totalFiles = data.filesBranding.length + data.filesReferences.length;

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <StepHeader stepNumber={12} title="CONTEÚDO E ANEXOS" description="Status do conteudo, canal de comunicacao e materiais de apoio." />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contentStatus" className="flex items-center gap-1">
              Status do conteudo <span className="text-red-500">*</span>
            </Label>
            <Select id="contentStatus" value={data.contentStatus} onChange={(e) => updateData({ contentStatus: e.target.value })} required>
              <option value="" disabled>Selecione...</option>
              {CONTENT_STATUS_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredContactChannel" className="flex items-center gap-1">
              Canal preferido <span className="text-red-500">*</span>
            </Label>
            <Select id="preferredContactChannel" value={data.preferredContactChannel} onChange={(e) => updateData({ preferredContactChannel: e.target.value })} required>
              <option value="" disabled>Selecione...</option>
              {CONTACT_CHANNEL_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meetingFrequency" className="flex items-center gap-1">
            Frequencia de reunioes <span className="text-red-500">*</span>
          </Label>
          <Select id="meetingFrequency" value={data.meetingFrequency} onChange={(e) => updateData({ meetingFrequency: e.target.value })} required>
            <option value="" disabled>Selecione...</option>
            {MEETING_FREQUENCY_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
          </Select>
        </div>

        <div className="border-t border-[rgba(77,88,246,0.12)] pt-4 space-y-4">
          <h4 className="text-sm font-semibold text-slate-800">Materiais de apoio</h4>
          <div className="space-y-2">
            <Label htmlFor="filesBranding" className="flex items-center gap-1">
              Arquivos de branding <span className="text-red-500">*</span>
            </Label>
            <Input id="filesBranding" type="file" multiple accept="image/*,.pdf,.ai,.eps,.svg" onChange={(e) => updateData({ filesBranding: Array.from(e.target.files || []) })} className="file:bg-[rgba(37,136,245,0.1)] file:text-[#3640D7] hover:file:bg-[rgba(77,88,246,0.14)]" />
            <p className="text-xs text-slate-500">Logos, manuais de marca. Total: {data.filesBranding.length}.</p>
            <SelectedFilesList title="Arquivos de branding" files={data.filesBranding} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filesReferences">Referencias visuais e wireframes</Label>
            <Input id="filesReferences" type="file" multiple accept="image/*,.pdf,.fig" onChange={(e) => updateData({ filesReferences: Array.from(e.target.files || []) })} className="file:bg-[rgba(37,136,245,0.1)] file:text-[#3640D7] hover:file:bg-[rgba(77,88,246,0.14)]" />
            <p className="text-xs text-slate-500">Maximo 10 arquivos total. Atual: {totalFiles}.</p>
            <SelectedFilesList title="Referencias" files={data.filesReferences} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
