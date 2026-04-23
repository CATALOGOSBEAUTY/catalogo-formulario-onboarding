import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Label } from "@/src/components/ui/Label";
import { Button } from "@/src/components/ui/Button";
import { OnboardingFormState, ServiceItem, ProfessionalItem } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

export function BusinessServicesForm({ data, updateData }: Props) {
  const addService = () => {
    updateData({
      services: [...data.services, { id: Date.now().toString(), name: "", duration: "", value: "" }],
    });
  };

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    updateData({
      services: data.services.map((service) => (service.id === id ? { ...service, ...updates } : service)),
    });
  };

  const removeService = (id: string) => {
    updateData({ services: data.services.filter((service) => service.id !== id) });
  };

  const addProfessional = () => {
    updateData({
      professionals: [
        ...data.professionals,
        { id: Date.now().toString(), name: "", role: "", serviceConfig: "" },
      ],
    });
  };

  const updateProfessional = (id: string, updates: Partial<ProfessionalItem>) => {
    updateData({
      professionals: data.professionals.map((professional) =>
        professional.id === id ? { ...professional, ...updates } : professional,
      ),
    });
  };

  const removeProfessional = (id: string) => {
    updateData({ professionals: data.professionals.filter((professional) => professional.id !== id) });
  };

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(37,136,245,0.14)_0%,rgba(142,34,255,0.16)_100%)] text-[10px] text-[#3640D7]">
            02
          </span>
          SERVICOS E EQUIPE
        </CardTitle>
        <CardDescription>
          Cadastre os servicos oferecidos e os profissionais da sua empresa.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800">Seus servicos</h4>
            <Button type="button" variant="outline" size="sm" onClick={addService}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar servico
            </Button>
          </div>

          <AnimatePresence mode="popLayout">
            {data.services.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-xl border border-dashed border-[rgba(77,88,246,0.2)] bg-[rgba(245,247,255,0.82)] py-6 text-center text-sm text-slate-500"
              >
                Nenhum servico adicionado. Clique no botao acima para adicionar.
              </motion.div>
            ) : null}

            <div className="space-y-4">
              {data.services.map((service, index) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className="group relative space-y-4 rounded-xl border border-[rgba(77,88,246,0.14)] bg-white/82 p-5 transition-colors hover:border-[rgba(77,88,246,0.28)]"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Servico #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      onClick={() => removeService(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <Label className="flex items-center gap-1 text-xs">
                        Nome do servico <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Ex: Corte de cabelo"
                        value={service.name}
                        onChange={(e) => updateService(service.id, { name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="flex items-center gap-1 text-xs">
                        Duracao media <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Ex: 45 min"
                        value={service.duration}
                        onChange={(e) => updateService(service.id, { duration: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="flex items-center gap-1 text-xs">
                        Valor <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="R$ 0,00"
                        value={service.value}
                        onChange={(e) => updateService(service.id, { value: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>

        <div className="my-6 h-px w-full border-t border-[rgba(77,88,246,0.12)]" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800">Equipe / Profissionais</h4>
            <Button type="button" variant="outline" size="sm" onClick={addProfessional}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar profissional
            </Button>
          </div>

          <AnimatePresence mode="popLayout">
            {data.professionals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-xl border border-dashed border-[rgba(77,88,246,0.2)] bg-[rgba(245,247,255,0.82)] py-6 text-center text-sm text-slate-500"
              >
                Nenhum profissional adicionado.
              </motion.div>
            ) : null}

            <div className="space-y-4">
              {data.professionals.map((professional, index) => (
                <motion.div
                  key={professional.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className="group relative space-y-4 rounded-xl border border-[rgba(77,88,246,0.14)] bg-white/82 p-5 transition-colors hover:border-[rgba(77,88,246,0.28)]"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Profissional #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      onClick={() => removeProfessional(professional.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <Label className="flex items-center gap-1 text-xs">
                        Nome <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Ex: Joao Souza"
                        value={professional.name}
                        onChange={(e) => updateProfessional(professional.id, { name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="flex items-center gap-1 text-xs">
                        Cargo / Funcao <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Ex: Barbeiro senior"
                        value={professional.role}
                        onChange={(e) => updateProfessional(professional.id, { role: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="flex items-center gap-1 text-xs">
                        Servicos / Valores <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Ex: Corte: R$50 | Barba: R$30"
                        value={professional.serviceConfig}
                        onChange={(e) => updateProfessional(professional.id, { serviceConfig: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
