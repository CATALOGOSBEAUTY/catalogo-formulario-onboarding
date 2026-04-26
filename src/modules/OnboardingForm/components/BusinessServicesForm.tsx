import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Label } from "@/src/components/ui/Label";
import { Select } from "@/src/components/ui/Select";
import { Button } from "@/src/components/ui/Button";
import { CurrencyUnit, DurationUnit, OnboardingFormState, ServiceItem } from "../types";

interface Props {
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}

function createEmptyService(): ServiceItem {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return {
    id,
    name: "",
    professionalName: "",
    durationValue: "",
    durationUnit: "minutes",
    valueAmount: "",
    valueUnit: "BRL",
  };
}

export function BusinessServicesForm({ data, updateData }: Props) {
  const addService = () => {
    updateData({
      services: [...data.services, createEmptyService()],
    });
  };

  const addServiceBatch = () => {
    updateData({
      services: [
        ...data.services,
        ...Array.from({ length: 10 }, () => createEmptyService()),
      ],
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
          Cadastre cada servico junto com o profissional vinculado, a duracao e o valor.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Seus servicos</h4>
              <p className="mt-1 text-xs text-slate-500">
                {data.services.length} servicos adicionados. O formulario aceita mais de 100 servicos.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={addServiceBatch}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar 10
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={addService}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar servico
              </Button>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {data.services.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-xl border border-dashed border-[rgba(77,88,246,0.2)] bg-[rgba(245,247,255,0.82)] py-6 text-center text-sm text-slate-500"
              >
                Nenhum servico adicionado. Clique no botao acima para vincular servico, profissional e valor.
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

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        Profissional vinculado <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Ex: Joao Souza"
                        value={service.professionalName}
                        onChange={(e) =>
                          updateService(service.id, { professionalName: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid grid-cols-[minmax(0,1fr)_170px] gap-3">
                      <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-xs">
                          Duracao media <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="Ex: 45"
                          inputMode="decimal"
                          value={service.durationValue}
                          onChange={(e) =>
                            updateService(service.id, { durationValue: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-xs">
                          Unidade <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={service.durationUnit}
                          onChange={(e) =>
                            updateService(service.id, {
                              durationUnit: e.target.value as DurationUnit,
                            })
                          }
                        >
                          <option value="minutes">Minutos</option>
                          <option value="hours">Horas</option>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-[minmax(0,1fr)_150px] gap-3">
                      <div className="space-y-1">
                      <Label className="flex items-center gap-1 text-xs">
                        Valor <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Ex: 50,00"
                        inputMode="decimal"
                        value={service.valueAmount}
                        onChange={(e) =>
                          updateService(service.id, { valueAmount: e.target.value })
                        }
                        required
                      />
                    </div>

                      <div className="space-y-1">
                        <Label className="flex items-center gap-1 text-xs">
                          Moeda <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={service.valueUnit}
                          onChange={(e) =>
                            updateService(service.id, {
                              valueUnit: e.target.value as CurrencyUnit,
                            })
                          }
                        >
                          <option value="BRL">Real</option>
                          <option value="USD">Dolar</option>
                        </Select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>

        <div className="space-y-5 border-t border-[rgba(77,88,246,0.12)] pt-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Fluxo operacional</h4>
            <p className="mt-1 text-xs text-slate-500">
              Informe o volume de agendamentos e o nivel atual de cancelamentos e reagendamentos.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="appointmentFlow" className="flex items-center gap-1 text-xs">
                Fluxo de pessoas que agendam <span className="text-red-500">*</span>
              </Label>
              <Select
                id="appointmentFlow"
                value={data.appointmentFlow}
                onChange={(e) => updateData({ appointmentFlow: e.target.value })}
                required
              >
                <option value="" disabled>
                  Selecione...
                </option>
                <option value="Baixo - ate 10 agendamentos por dia">
                  Baixo - ate 10 por dia
                </option>
                <option value="Medio - 11 a 30 agendamentos por dia">
                  Medio - 11 a 30 por dia
                </option>
                <option value="Alto - 31 a 80 agendamentos por dia">
                  Alto - 31 a 80 por dia
                </option>
                <option value="Muito alto - mais de 80 agendamentos por dia">
                  Muito alto - mais de 80 por dia
                </option>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="cancellationLevel" className="flex items-center gap-1 text-xs">
                Nivel de cancelamento <span className="text-red-500">*</span>
              </Label>
              <Select
                id="cancellationLevel"
                value={data.cancellationLevel}
                onChange={(e) => updateData({ cancellationLevel: e.target.value })}
                required
              >
                <option value="" disabled>
                  Selecione...
                </option>
                <option value="Baixo">Baixo</option>
                <option value="Medio">Medio</option>
                <option value="Alto">Alto</option>
                <option value="Critico">Critico</option>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="rescheduleLevel" className="flex items-center gap-1 text-xs">
                Nivel de reagendamento <span className="text-red-500">*</span>
              </Label>
              <Select
                id="rescheduleLevel"
                value={data.rescheduleLevel}
                onChange={(e) => updateData({ rescheduleLevel: e.target.value })}
                required
              >
                <option value="" disabled>
                  Selecione...
                </option>
                <option value="Baixo">Baixo</option>
                <option value="Medio">Medio</option>
                <option value="Alto">Alto</option>
                <option value="Critico">Critico</option>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
