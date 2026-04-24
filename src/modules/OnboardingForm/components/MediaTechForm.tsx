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

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function SelectedFilesList({
  title,
  files,
}: {
  title: string;
  files: File[];
}) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[rgba(77,88,246,0.14)] bg-white/80 p-4 shadow-[0_10px_30px_rgba(42,61,130,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4D58F6]">
        {title}
      </p>
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

export function MediaTechForm({ data, updateData }: Props) {
  const totalImages = data.photosProcedures.length + data.photosFacade.length;

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(37,136,245,0.14)_0%,rgba(142,34,255,0.16)_100%)] text-[10px] text-[#3640D7]">
            04
          </span>
          MIDIA E TECNOLOGIA
        </CardTitle>
        <CardDescription>
          Envie suas fotos e nos conte sobre a sua estrutura tecnologica atual.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-800">Fotos e arquivos</h4>

          <div className="space-y-2">
            <Label htmlFor="photosProcedures" className="flex items-center gap-1">
              Fotos dos procedimentos (antes e depois) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="photosProcedures"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                updateData({ photosProcedures: Array.from(e.target.files || []) })
              }
              className="file:bg-[rgba(37,136,245,0.1)] file:text-[#3640D7] hover:file:bg-[rgba(77,88,246,0.14)]"
              required
            />
            <p className="text-xs text-slate-500">
              Envie imagens dos procedimentos. Total atual: {data.photosProcedures.length}.
            </p>
            <SelectedFilesList
              title="Imagens dos procedimentos prontas para envio"
              files={data.photosProcedures}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photosFacade" className="flex items-center gap-1">
              Fotos da fachada e do ambiente interno <span className="text-red-500">*</span>
            </Label>
            <Input
              id="photosFacade"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                updateData({ photosFacade: Array.from(e.target.files || []) })
              }
              className="file:bg-[rgba(37,136,245,0.1)] file:text-[#3640D7] hover:file:bg-[rgba(77,88,246,0.14)]"
              required
            />
            <p className="text-xs text-slate-500">
              Voce pode enviar ate 10 imagens no total entre os dois campos. Total atual: {totalImages}.
            </p>
            <SelectedFilesList
              title="Imagens da fachada prontas para envio"
              files={data.photosFacade}
            />
          </div>
        </div>

        <div className="border-t border-[rgba(77,88,246,0.12)]" />

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-800">Area tecnologica</h4>

          <div className="space-y-2">
            <Label htmlFor="hasDomain" className="flex items-center gap-1">
              Voce possui dominio? <span className="text-red-500">*</span>
            </Label>
            <Select
              id="hasDomain"
              value={data.hasDomain}
              onChange={(e) =>
                updateData(
                  e.target.value === "yes"
                    ? { hasDomain: "yes" }
                    : { hasDomain: "no", websiteUrl: "", hostingProvider: "" },
                )
              }
              required
            >
              <option value="no">Nao</option>
              <option value="yes">Sim</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="websiteUrl" className="flex items-center gap-1">
              Ja tem algum site? Informe o link <span className="text-red-500">*</span>
            </Label>
            <Input
              id="websiteUrl"
              placeholder="https://www.seusite.com.br"
              value={data.websiteUrl}
              onChange={(e) => updateData({ websiteUrl: e.target.value })}
              disabled={data.hasDomain === "no"}
              required={data.hasDomain === "yes"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hostingProvider" className="flex items-center gap-1">
              Em qual provedor o site esta hospedado? <span className="text-red-500">*</span>
            </Label>
            <Input
              id="hostingProvider"
              placeholder="Ex: HostGator, Locaweb, Vercel..."
              value={data.hostingProvider}
              onChange={(e) => updateData({ hostingProvider: e.target.value })}
              disabled={data.hasDomain === "no"}
              required={data.hasDomain === "yes"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
