import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Label } from "@/src/components/ui/Label";
import { Select } from "@/src/components/ui/Select";
import type { OnboardingFormState } from "../types";
import { formatCPFOrCNPJ, formatPhoneBR, formatCEP, formatAddressNumber } from "../numberFormatting";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

interface CepLookupResponse {
  erro?: boolean;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
}

export interface AddressLookupResult {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export async function lookupAddressByCep(
  cep: string,
  fetchImpl: typeof fetch = fetch,
): Promise<AddressLookupResult | null> {
  const digits = cep.replace(/\D/g, "");

  if (digits.length !== 8) {
    return null;
  }

  const response = await fetchImpl(`https://viacep.com.br/ws/${digits}/json/`);

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as CepLookupResponse;

  if (payload.erro) {
    return null;
  }

  return {
    street: payload.logradouro || "",
    neighborhood: payload.bairro || "",
    city: payload.localidade || "",
    state: payload.uf || "",
  };
}

const SECTOR_OPTIONS = [
  "Saude e Clinicas",
  "Educacao e Cursos Online",
  "E-commerce e Varejo",
  "Imobiliario",
  "Advocacia e Juridico",
  "Financas e Contabilidade",
  "Alimentacao e Gastronomia",
  "Beleza e Estetica",
  "Tecnologia e SaaS",
  "Servicos e Consultoria",
  "Outro",
];

export function PersonalInfoForm({ data, updateData }: Props) {
  React.useEffect(() => {
    if (data.isRemote) {
      return;
    }

    const cepDigits = data.addressZipcode.replace(/\D/g, "");

    if (cepDigits.length !== 8) {
      return;
    }

    let isActive = true;

    lookupAddressByCep(data.addressZipcode)
      .then((address) => {
        if (!isActive || !address) {
          return;
        }

        updateData({
          addressStreet: address.street || data.addressStreet,
          addressNeighborhood: address.neighborhood || data.addressNeighborhood,
          addressCity: address.city || data.addressCity,
          addressState: address.state || data.addressState,
        });
      })
      .catch(() => {
        // CEP lookup is a convenience. Manual address entry remains available.
      });

    return () => {
      isActive = false;
    };
  }, [data.addressZipcode, data.isRemote]);

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(37,136,245,0.14)_0%,rgba(142,34,255,0.16)_100%)] text-[10px] text-[#3640D7]">
            01
          </span>
          IDENTIDADE COMERCIAL
        </CardTitle>
        <CardDescription>
          Dados do responsavel e da empresa para iniciar o briefing do seu projeto digital.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-1">
              Nome do responsavel <span className="text-red-500">*</span>
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
            <Label htmlFor="companyName" className="flex items-center gap-1">
              Razao Social / Nome Fantasia <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              placeholder="Ex: Studio Digital Ltda"
              value={data.companyName}
              onChange={(e) => updateData({ companyName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companySector" className="flex items-center gap-1">
              Segmento de atuacao <span className="text-red-500">*</span>
            </Label>
            <Select
              id="companySector"
              value={data.companySector}
              onChange={(e) => updateData({ companySector: e.target.value })}
              required
            >
              <option value="" disabled>
                Selecione...
              </option>
              {SECTOR_OPTIONS.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpfCnpj" className="flex items-center gap-1">
              CPF / CNPJ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cpfCnpj"
              placeholder="000.000.000-00"
              value={data.cpfCnpj}
              onChange={(e) => updateData({ cpfCnpj: formatCPFOrCNPJ(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              E-mail corporativo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="contato@empresa.com"
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="commercialContact" className="flex items-center gap-1">
              WhatsApp de contato <span className="text-red-500">*</span>
            </Label>
            <Input
              id="commercialContact"
              placeholder="(11) 99999-9999"
              value={data.commercialContact}
              onChange={(e) => updateData({ commercialContact: formatPhoneBR(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="currentWebsiteUrl" className="flex items-center gap-1">
              Site atual (se ja tiver)
            </Label>
            <Input
              id="currentWebsiteUrl"
              placeholder="https://www.seusite.com.br"
              value={data.currentWebsiteUrl}
              onChange={(e) => updateData({ currentWebsiteUrl: e.target.value })}
            />
          </div>

          <div className="md:col-span-2 border-t border-[rgba(77,88,246,0.12)] pt-4">
            <div className="mb-4 flex items-center justify-between">
              <Label className="mb-0 uppercase tracking-widest text-[#4D58F6]">
                Localizacao da empresa
              </Label>
              <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={data.isRemote}
                  onChange={(e) =>
                    updateData({
                      isRemote: e.target.checked,
                      ...(e.target.checked
                        ? {
                            addressZipcode: "",
                            addressStreet: "",
                            addressNumber: "",
                            addressNeighborhood: "",
                            addressCity: "",
                            addressState: "",
                          }
                        : {}),
                    })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-[#4D58F6] focus:ring-[#4D58F6]"
                />
                Empresa 100% remota (sem escritorio fisico)
              </label>
            </div>

            {!data.isRemote ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="addressZipcode" className="flex items-center gap-1">
                    CEP <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="addressZipcode"
                    placeholder="00000-000"
                    inputMode="numeric"
                    value={data.addressZipcode}
                    onChange={(e) => updateData({ addressZipcode: formatCEP(e.target.value) })}
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
                    inputMode="numeric"
                    value={data.addressNumber}
                    onChange={(e) => updateData({ addressNumber: formatAddressNumber(e.target.value) })}
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

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="addressCity" className="flex items-center gap-1">
                    Cidade <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="addressCity"
                    placeholder="Ex: Sao Paulo"
                    value={data.addressCity}
                    onChange={(e) => updateData({ addressCity: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="addressState" className="flex items-center gap-1">
                    Estado <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="addressState"
                    placeholder="Ex: SP"
                    value={data.addressState}
                    onChange={(e) =>
                      updateData({ addressState: e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 2) })
                    }
                    maxLength={2}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[rgba(77,88,246,0.2)] bg-[rgba(245,247,255,0.82)] py-4 text-center text-sm text-slate-500">
                Empresa remota — endereco nao e necessario.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
