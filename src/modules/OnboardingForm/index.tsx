import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { PersonalInfoForm } from "./components/PersonalInfoForm";
import { BusinessServicesForm } from "./components/BusinessServicesForm";
import { SchedulingConfigForm } from "./components/SchedulingConfigForm";
import { MediaTechForm } from "./components/MediaTechForm";
import type { OnboardingFormState } from "./types";
import { Button } from "@/src/components/ui/Button";
import { submitOnboardingForm } from "./api";

const INITIAL_STATE: OnboardingFormState = {
  fullName: "",
  cpf: "",
  email: "",
  commercialContact: "",
  addressZipcode: "",
  addressStreet: "",
  addressNumber: "",
  addressNeighborhood: "",
  services: [],
  professionals: [],
  schedulingModel: "",
  cancellationFine: "",
  rescheduleDetails: "",
  upfrontCost: "",
  photosProcedures: null,
  photosFacade: null,
  hasDomain: "no",
  websiteUrl: "",
  hostingProvider: "",
};

export function OnboardingForm() {
  const [data, setData] = useState<OnboardingFormState>(INITIAL_STATE);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitWarning, setSubmitWarning] = useState("");
  const totalSteps = 4;

  const updateData = (fields: Partial<OnboardingFormState>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    if (data.services.length === 0) {
      setSubmitError("Adicione pelo menos um servico antes de enviar.");
      setCurrentStep(2);
      return;
    }

    if (data.professionals.length === 0) {
      setSubmitError("Adicione pelo menos um profissional antes de enviar.");
      setCurrentStep(2);
      return;
    }

    if (!data.photosProcedures?.length || !data.photosFacade?.length) {
      setSubmitError("Envie as fotos obrigatorias antes de concluir.");
      return;
    }

    setIsSubmitting(true);
    setSubmitWarning("");

    submitOnboardingForm(data)
      .then((response) => {
        setSubmitWarning(response.warning || "");
        setIsSubmitted(true);
      })
      .catch((error: unknown) => {
        setSubmitError(
          error instanceof Error ? error.message : "Falha ao enviar formulario.",
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-16 px-4 flex flex-col items-center justify-center text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-2 shadow-sm border border-green-100"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold tracking-tight text-slate-800"
        >
          Solicitacao recebida!
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 max-w-lg leading-relaxed"
        >
          Recebemos seus dados com sucesso. Nossa equipe vai processar o cadastro
          e acompanhar o envio automatico para o WhatsApp da empresa.
        </motion.p>

        {submitWarning ? (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="max-w-lg rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            {submitWarning}
          </motion.p>
        ) : null}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-8"
        >
          <Button onClick={() => window.location.reload()} variant="outline">
            Voltar ao inicio
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full relative z-10 max-w-3xl mx-auto overflow-hidden pb-12">
      <div className="mb-8">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">
          <span>Passo {currentStep} de {totalSteps}</span>
          <span className="text-[#4D58F6]">
            {Math.round((currentStep / totalSteps) * 100)}% concluido
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(77,88,246,0.12)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ ease: "easeInOut", duration: 0.4 }}
            className="h-full bg-[linear-gradient(90deg,#2388F5_0%,#8E22FF_100%)]"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait" initial={false}>
          {currentStep === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
            >
              <PersonalInfoForm data={data} updateData={updateData} />
            </motion.div>
          ) : null}

          {currentStep === 2 ? (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
            >
              <BusinessServicesForm data={data} updateData={updateData} />
            </motion.div>
          ) : null}

          {currentStep === 3 ? (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
            >
              <SchedulingConfigForm data={data} updateData={updateData} />
            </motion.div>
          ) : null}

          {currentStep === 4 ? (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
            >
              <MediaTechForm data={data} updateData={updateData} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {submitError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        ) : null}

        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
            className={currentStep === 1 ? "opacity-0 pointer-events-none" : ""}
          >
            Voltar
          </Button>

          {currentStep < totalSteps ? (
            <Button type="submit">Proximo passo</Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar solicitacao de cadastro"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
