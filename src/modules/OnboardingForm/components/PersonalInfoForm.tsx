import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Label } from "@/src/components/ui/Label";
import { OnboardingFormState } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

export const formatCPFOrCNPJ = (value: string) => {
  const v = value.replace(/\D/g, "");
  if (v.length <= 11) {
    return v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2");
  }

  return v
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})/, "$1-$2")
    .substring(0, 18);
};

export const formatPhoneBR = (value: string) => {
  const v = value.replace(/\D/g, "");
  if (v.length <= 10) {
    return v
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return v
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 15);
};

export const formatCEP = (value: string) => {
  const v = value.replace(/\D/g, "");
  return v.replace(/(\d{5})(\d{1,3})/, "$1-$2").substring(0, 9);
};

export function PersonalInfoForm({ data, updateData }: Props) {
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(37,136,245,0.14)_0%,rgba(142,34,255,0.16)_100%)] text-[10px] text-[#3640D7]">
            01
          </span>
          IDENTIFICACAO BASICA
        </CardTitle>
        <CardDescription>
          Precisamos dos seus dados basicos para estruturar sua experiencia digital na area da estetica.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-1">
              Nome completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="Ex: Maria Silva"
              value={data.fullName}
              onChange={(e) => updateData({ fullName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf" className="flex items-center gap-1">
              CPF / CNPJ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={data.cpf}
              onChange={(e) => updateData({ cpf: formatCPFOrCNPJ(e.target.value) })}
              pattern="(^\d{3}\.\d{3}\.\d{3}-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$)"
              title="Digite um CPF ou CNPJ valido"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              E-mail profissional <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="contato@empresa.com"
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              title="Digite um e-mail valido com @ e dominio"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="commercialContact" className="flex items-center gap-1">
              WhatsApp comercial <span className="text-red-500">*</span>
            </Label>
            <Input
              id="commercialContact"
              placeholder="(11) 99999-9999"
              value={data.commercialContact}
              onChange={(e) => updateData({ commercialContact: formatPhoneBR(e.target.value) })}
              pattern="^\(\d{2}\)\s\d{4,5}-\d{4}$"
              title="Digite um numero no formato (XX) XXXXX-XXXX"
              required
            />
          </div>

          <div className="md:col-span-2 border-t border-[rgba(77,88,246,0.12)] pt-4">
            <div className="mb-4 flex items-center gap-2">
              <Label className="mb-0 uppercase tracking-widest text-[#4D58F6]">
                Localizacao do estabelecimento
              </Label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="addressZipcode" className="flex items-center gap-1">
                  CEP <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="addressZipcode"
                  placeholder="00000-000"
                  value={data.addressZipcode}
                  onChange={(e) => updateData({ addressZipcode: formatCEP(e.target.value) })}
                  pattern="^\d{5}-\d{3}$"
                  title="Digite um CEP valido no formato XXXXX-XXX"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="addressStreet" className="flex items-center gap-1">
                  Rua / Avenida <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="addressStreet"
                  placeholder="Ex: Av. Paulista"
                  value={data.addressStreet}
                  onChange={(e) => updateData({ addressStreet: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="addressNumber" className="flex items-center gap-1">
                  Numero <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="addressNumber"
                  placeholder="Ex: 1000"
                  value={data.addressNumber}
                  onChange={(e) => updateData({ addressNumber: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="addressNeighborhood" className="flex items-center gap-1">
                  Bairro <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="addressNeighborhood"
                  placeholder="Ex: Bela Vista"
                  value={data.addressNeighborhood}
                  onChange={(e) => updateData({ addressNeighborhood: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
