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
      services: data.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  const removeService = (id: string) => {
    updateData({ services: data.services.filter((s) => s.id !== id) });
  };

  const addProfessional = () => {
    updateData({
      professionals: [...data.professionals, { id: Date.now().toString(), name: "", role: "", serviceConfig: "" }],
    });
  };

  const updateProfessional = (id: string, updates: Partial<ProfessionalItem>) => {
    updateData({
      professionals: data.professionals.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    });
  };

  const removeProfessional = (id: string) => {
    updateData({ professionals: data.professionals.filter((p) => p.id !== id) });
  };

  return (
    <Card className="w-full mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>
          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] shrink-0">02</span>
          SERVIÇOS E EQUIPE
        </CardTitle>
        <CardDescription>Cadastre os serviços oferecidos e os profissionais da sua empresa.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Services Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800">Seus Serviços</h4>
            <Button type="button" variant="outline" size="sm" onClick={addService}>
              <Plus className="w-4 h-4 mr-2" /> Adicionar Serviço
            </Button>
          </div>
          
          <AnimatePresence mode="popLayout">
            {data.services.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-sm text-slate-500 py-6 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50"
              >
                Nenhum serviço adicionado. Clique no botão acima para adicionar.
              </motion.div>
            )}

            <div className="space-y-4">
              {data.services.map((service, index) => (
                <motion.div 
                  key={service.id} 
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className="p-5 border border-slate-200 rounded-xl bg-slate-50/30 space-y-4 relative group hover:border-slate-300 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Serviço #{index + 1}</span>
                    <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 transition-colors" onClick={() => removeService(service.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs flex items-center gap-1">Nome do Serviço <span className="text-red-500">*</span></Label>
                      <Input 
                        placeholder="Ex: Corte de Cabelo" 
                        value={service.name} 
                        onChange={(e) => updateService(service.id, { name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs flex items-center gap-1">Duração Média <span className="text-red-500">*</span></Label>
                      <Input 
                        placeholder="Ex: 45 min" 
                        value={service.duration}
                        onChange={(e) => updateService(service.id, { duration: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs flex items-center gap-1">Valor <span className="text-red-500">*</span></Label>
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

        <div className="border-t border-slate-100 w-full h-px my-6" />

        {/* Professionals Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800">Equipe / Profissionais</h4>
            <Button type="button" variant="outline" size="sm" onClick={addProfessional}>
              <Plus className="w-4 h-4 mr-2" /> Adicionar Profissional
            </Button>
          </div>

          <AnimatePresence mode="popLayout">
            {data.professionals.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-sm text-slate-500 py-6 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50"
              >
                Nenhum profissional adicionado.
              </motion.div>
            )}

            <div className="space-y-4">
              {data.professionals.map((prof, index) => (
                <motion.div 
                  key={prof.id} 
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className="p-5 border border-slate-200 rounded-xl bg-slate-50/30 space-y-4 relative group hover:border-slate-300 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Profissional #{index + 1}</span>
                    <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 transition-colors" onClick={() => removeProfessional(prof.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs flex items-center gap-1">Nome <span className="text-red-500">*</span></Label>
                      <Input 
                        placeholder="Ex: João Souza" 
                        value={prof.name}
                        onChange={(e) => updateProfessional(prof.id, { name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs flex items-center gap-1">Cargo / Função <span className="text-red-500">*</span></Label>
                      <Input 
                        placeholder="Ex: Barbeiro Sênior" 
                        value={prof.role}
                        onChange={(e) => updateProfessional(prof.id, { role: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs flex items-center gap-1">Serviços / Valores <span className="text-red-500">*</span></Label>
                      <Input 
                        placeholder="Ex: Corte: R$50 | Barba: R$30" 
                        value={prof.serviceConfig}
                        onChange={(e) => updateProfessional(prof.id, { serviceConfig: e.target.value })}
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
