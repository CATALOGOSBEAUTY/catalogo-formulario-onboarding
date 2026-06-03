import React from "react";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Label } from "@/src/components/ui/Label";
import { StepHeader } from "./shared";
import type { OnboardingFormState } from "../types";
import { formatPhoneBR } from "../numberFormatting";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

export function Step02_CommercialContact({ data, updateData }: Props) {
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <StepHeader stepNumber={2} title="CONTATO COMERCIAL" description="Como podemos entrar em contato com voce." />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              E-mail corporativo <span className="text-red-500">*</span>
            </Label>
            <Input id="email" type="email" placeholder="contato@empresa.com" value={data.email} onChange={(e) => updateData({ email: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commercialContact" className="flex items-center gap-1">
              WhatsApp de contato <span className="text-red-500">*</span>
            </Label>
            <Input id="commercialContact" placeholder="(11) 99999-9999" value={data.commercialContact} onChange={(e) => updateData({ commercialContact: formatPhoneBR(e.target.value) })} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="currentWebsiteUrl">Site atual (se ja tiver)</Label>
            <Input id="currentWebsiteUrl" placeholder="https://www.seusite.com.br" value={data.currentWebsiteUrl} onChange={(e) => updateData({ currentWebsiteUrl: e.target.value })} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
