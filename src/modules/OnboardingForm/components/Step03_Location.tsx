import React from "react";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Label } from "@/src/components/ui/Label";
import { StepHeader } from "./shared";
import type { OnboardingFormState } from "../types";
import { formatCEP, formatAddressNumber } from "../numberFormatting";
import { lookupAddressByCep } from "../cepLookup";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

export function Step03_Location({ data, updateData }: Props) {
  React.useEffect(() => {
    if (data.isRemote) return;
    const digits = data.addressZipcode.replace(/\D/g, "");
    if (digits.length !== 8) return;
    let active = true;
    lookupAddressByCep(data.addressZipcode)
      .then((addr) => {
        if (!active || !addr) return;
        updateData({
          addressStreet: addr.street || data.addressStreet,
          addressNeighborhood: addr.neighborhood || data.addressNeighborhood,
          addressCity: addr.city || data.addressCity,
          addressState: addr.state || data.addressState,
        });
      })
      .catch(() => {});
    return () => { active = false; };
  }, [data.addressZipcode, data.isRemote]);

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <StepHeader stepNumber={3} title="LOCALIZAÇÃO" description="Onde sua empresa esta sediada." />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="mb-0 uppercase tracking-widest text-[#4D58F6]">Localizacao da empresa</Label>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
            <input
              type="checkbox"
              checked={data.isRemote}
              onChange={(e) =>
                updateData({
                  isRemote: e.target.checked,
                  ...(e.target.checked ? { addressZipcode: "", addressStreet: "", addressNumber: "", addressNeighborhood: "", addressCity: "", addressState: "" } : {}),
                })
              }
              className="h-4 w-4 rounded border-slate-300 text-[#4D58F6] focus:ring-[#4D58F6]"
            />
            Empresa 100% remota
          </label>
        </div>

        {!data.isRemote ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="addressZipcode" className="flex items-center gap-1">CEP <span className="text-red-500">*</span></Label>
              <Input id="addressZipcode" placeholder="00000-000" inputMode="numeric" value={data.addressZipcode} onChange={(e) => updateData({ addressZipcode: formatCEP(e.target.value) })} required />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="addressStreet" className="flex items-center gap-1">Rua / Avenida <span className="text-red-500">*</span></Label>
              <Input id="addressStreet" placeholder="Ex: Av. Paulista" value={data.addressStreet} onChange={(e) => updateData({ addressStreet: e.target.value })} required />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="addressNumber" className="flex items-center gap-1">Numero <span className="text-red-500">*</span></Label>
              <Input id="addressNumber" placeholder="Ex: 1000" inputMode="numeric" value={data.addressNumber} onChange={(e) => updateData({ addressNumber: formatAddressNumber(e.target.value) })} required />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="addressNeighborhood" className="flex items-center gap-1">Bairro <span className="text-red-500">*</span></Label>
              <Input id="addressNeighborhood" placeholder="Ex: Bela Vista" value={data.addressNeighborhood} onChange={(e) => updateData({ addressNeighborhood: e.target.value })} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="addressCity" className="flex items-center gap-1">Cidade <span className="text-red-500">*</span></Label>
              <Input id="addressCity" placeholder="Ex: Sao Paulo" value={data.addressCity} onChange={(e) => updateData({ addressCity: e.target.value })} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="addressState" className="flex items-center gap-1">Estado <span className="text-red-500">*</span></Label>
              <Input id="addressState" placeholder="Ex: SP" value={data.addressState} onChange={(e) => updateData({ addressState: e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 2) })} maxLength={2} required />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[rgba(77,88,246,0.2)] bg-[rgba(245,247,255,0.82)] py-4 text-center text-sm text-slate-500">
            Empresa remota — endereco nao e necessario.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
