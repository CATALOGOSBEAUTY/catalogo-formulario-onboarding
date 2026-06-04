import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Step01_ResponsibleData } from "./components/Step01_ResponsibleData";
import { Step02_CommercialContact } from "./components/Step02_CommercialContact";
import { Step03_Location } from "./components/Step03_Location";
import { Step04_GoalAndPain } from "./components/Step04_GoalAndPain";
import { Step05_TargetAudience } from "./components/Step05_TargetAudience";
import { Step06_MarketPosition } from "./components/Step06_MarketPosition";
import { Step07_ProjectType } from "./components/Step07_ProjectType";
import { Step08_ScopeAndFeatures } from "./components/Step08_ScopeAndFeatures";
import { Step09_VisualIdentity } from "./components/Step09_VisualIdentity";
import { Step10_VoiceAndInfra } from "./components/Step10_VoiceAndInfra";
import { Step11_ContentAndFiles } from "./components/Step12_ContentAndFiles";
import type { OnboardingFormState } from "./types";
import { INITIAL_FORM_STATE } from "./types";
import { Button } from "@/src/components/ui/Button";
import { submitOnboardingForm } from "./api";
import { getStepValidationError } from "./validation";
import { getWhatsAppUrl } from "./whatsapp";

const TOTAL_STEPS = 11;

const STEP_LABELS = [
  "Responsável",
  "Contato",
  "Local",
  "Objetivo",
  "Público",
  "Mercado",
  "Projeto",
  "Escopo",
  "Visual",
  "Voz",
  "Anexos",
];

function StepContent({
  step,
  data,
  updateData,
}: {
  step: number;
  data: OnboardingFormState;
  updateData: (fields: Partial<OnboardingFormState>) => void;
}) {
  switch (step) {
    case 1: return <Step01_ResponsibleData data={data} updateData={updateData} />;
    case 2: return <Step02_CommercialContact data={data} updateData={updateData} />;
    case 3: return <Step03_Location data={data} updateData={updateData} />;
    case 4: return <Step04_GoalAndPain data={data} updateData={updateData} />;
    case 5: return <Step05_TargetAudience data={data} updateData={updateData} />;
    case 6: return <Step06_MarketPosition data={data} updateData={updateData} />;
    case 7: return <Step07_ProjectType data={data} updateData={updateData} />;
    case 8: return <Step08_ScopeAndFeatures data={data} updateData={updateData} />;
    case 9: return <Step09_VisualIdentity data={data} updateData={updateData} />;
    case 10: return <Step10_VoiceAndInfra data={data} updateData={updateData} />;
    case 11: return <Step11_ContentAndFiles data={data} updateData={updateData} />;
    default: return null;
  }
}

export function OnboardingForm() {
  const [data, setData] = useState<OnboardingFormState>(INITIAL_FORM_STATE);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitStage, setSubmitStage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitWarning, setSubmitWarning] = useState("");

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

    const stepError = getStepValidationError(currentStep, data);
    if (stepError) {
      setSubmitError(stepError);
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    setIsSubmitting(true);
    setSubmitProgress(0);
    setSubmitStage("Preparando envio dos arquivos...");
    setSubmitWarning("");

    submitOnboardingForm(data, {
      onProgress: (progress) => {
        setSubmitProgress(progress);
        setSubmitStage(
          progress < 100
            ? `Carregando arquivos... ${progress}%`
            : "Processando envio final...",
        );
      },
    })
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
        if (!isSubmitted) {
          setSubmitStage("");
        }
      });
  };

  if (isSubmitted) {
    const whatsappUrl = getWhatsAppUrl(data);
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
          Briefing recebido com sucesso!
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 max-w-lg leading-relaxed"
        >
          Recebemos os dados do seu projeto. Para agilizar o seu atendimento, envie as informações diretamente para nosso WhatsApp clicando no botão abaixo.
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
          className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-center w-full"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-xl font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] px-6 py-3 text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_18px_45px_rgba(16,185,129,0.26)] hover:shadow-[0_16px_35px_rgba(16,185,129,0.22)]"
          >
            <svg
              className="mr-2 h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.493 4.904 1.495 5.482.004 9.948-4.414 9.95-9.847.002-2.632-1.019-5.105-2.876-6.966-1.857-1.863-4.325-2.889-6.96-2.891-5.485 0-9.953 4.418-9.956 9.852-.001 1.834.501 3.626 1.455 5.207L1.936 21.07l4.711-1.916zM17.472 14.382c-.32-.16-1.89-.933-2.185-1.041-.295-.108-.51-.16-.724.162-.214.32-.828 1.042-.997 1.233-.169.19-.338.213-.658.054-.32-.16-1.35-.497-2.57-1.583-.95-.847-1.59-1.893-1.777-2.214-.187-.32-.02-.492.14-.65.144-.143.32-.374.48-.562.16-.188.214-.32.32-.534.107-.213.054-.4-.027-.56-.08-.16-.724-1.745-.992-2.392-.262-.63-.53-.54-.724-.55-.187-.01-.402-.01-.617-.01-.215 0-.564.08-.86.4-.295.32-1.127 1.101-1.127 2.684 0 1.583 1.153 3.111 1.313 3.325.16.213 2.269 3.465 5.5 4.86.768.332 1.368.53 1.837.678.772.245 1.474.21 2.03.127.619-.092 1.89-.773 2.155-1.48.265-.708.265-1.314.187-1.44-.08-.127-.295-.214-.615-.374z" />
            </svg>
            Enviar via WhatsApp
          </a>

          <Button onClick={() => window.location.reload()} variant="outline">
            Voltar ao inicio
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[rgba(77,88,246,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(234,240,255,0.55)_100%)] px-5 pb-12 pt-6 shadow-[0_30px_90px_rgba(49,67,136,0.08)]">
      <div className="mb-8">
        <div className="mb-3 flex justify-between px-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
          <span>Passo {currentStep} de {TOTAL_STEPS}</span>
          <span className="text-[#3E49F1]">
            {Math.round((currentStep / TOTAL_STEPS) * 100)}% concluido
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(77,88,246,0.16)] shadow-[inset_0_1px_2px_rgba(61,78,140,0.08)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            transition={{ ease: "easeInOut", duration: 0.4 }}
            className="h-full bg-[linear-gradient(90deg,#2388F5_0%,#8E22FF_100%)]"
          />
        </div>
        <div className="mt-2 flex justify-between px-1 overflow-x-auto gap-1">
          {STEP_LABELS.map((label, index) => (
            <span
              key={label}
              className={`whitespace-nowrap text-[8px] font-bold uppercase tracking-wider transition-colors ${
                index + 1 <= currentStep ? "text-[#4D58F6]" : "text-slate-400"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`step${currentStep}`}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25 }}
          >
            <StepContent step={currentStep} data={data} updateData={updateData} />
          </motion.div>
        </AnimatePresence>

        {submitError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        ) : null}

        {isSubmitting ? (
          <div className="space-y-3 rounded-2xl border border-[rgba(77,88,246,0.14)] bg-white/75 px-4 py-4 shadow-[0_12px_32px_rgba(42,61,130,0.05)]">
            <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#4D58F6]">
              <span>{submitStage || "Enviando formulario..."}</span>
              <span>{submitProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[rgba(77,88,246,0.12)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${submitProgress}%` }}
                transition={{ ease: "easeInOut", duration: 0.25 }}
                className="h-full bg-[linear-gradient(90deg,#2388F5_0%,#8E22FF_100%)]"
              />
            </div>
            <p className="text-xs text-slate-500">
              Os arquivos estao sendo carregados e enviados junto com o briefing.
            </p>
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

          {currentStep < TOTAL_STEPS ? (
            <Button type="submit">Proximo passo</Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? submitStage || "Enviando..." : "Enviar briefing do projeto"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
