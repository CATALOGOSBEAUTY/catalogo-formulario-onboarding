import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { PersonalInfoForm } from "./components/PersonalInfoForm";
import { StrategicContextForm } from "./components/StrategicContextForm";
import { ProjectScopeForm } from "./components/ProjectScopeForm";
import { DesignBrandingForm } from "./components/DesignBrandingForm";
import { BudgetTimelineForm } from "./components/BudgetTimelineForm";
import type { OnboardingFormState } from "./types";
import { Button } from "@/src/components/ui/Button";
import { submitOnboardingForm } from "./api";
import { getStepValidationError } from "./validation";

const INITIAL_STATE: OnboardingFormState = {
  // Passo 1
  fullName: "",
  companyName: "",
  companySector: "",
  cpfCnpj: "",
  email: "",
  commercialContact: "",
  currentWebsiteUrl: "",
  isRemote: false,
  addressZipcode: "",
  addressStreet: "",
  addressNumber: "",
  addressNeighborhood: "",
  addressCity: "",
  addressState: "",
  // Passo 2
  primaryGoal: "",
  currentPainPoint: "",
  targetAudience: "",
  audienceAgeRange: [],
  audienceDigitalBehavior: [],
  competitors: "",
  competitorLikes: "",
  uniqueValueProposition: "",
  hasSocialMedia: false,
  socialMediaHandles: "",
  // Passo 3
  projectType: "",
  projectDescription: "",
  needsCms: false,
  needsContactForm: true,
  needsWhatsApp: true,
  needsSeo: true,
  siteLanguages: ["Portugues"],
  analyticsRequired: [],
  trackingPixels: [],
  landingPageCta: "",
  hasProductVideo: false,
  leadCaptureMethod: "",
  leadDestination: "",
  websitePages: [],
  hasPortfolio: false,
  needsTestimonials: false,
  needsAboutPage: true,
  productVolume: "",
  ecommercePlatform: "",
  paymentGateways: [],
  salesModels: [],
  needsShippingIntegration: false,
  needsCoupons: false,
  needsProductReviews: false,
  platformType: "",
  platformUserTypes: [],
  platformFeatures: [],
  needsMobileApp: false,
  revenueModel: "",
  hasLegacySystem: false,
  // Passo 4
  brandingStatus: "",
  designStyle: [],
  brandVoice: [],
  designReferences: "",
  hasDomain: false,
  websiteUrl: "",
  hasHosting: false,
  hostingProvider: "",
  needsSeoConsulting: false,
  needsWcagCompliance: false,
  needsPostLaunchSupport: false,
  // Passo 5
  decisionMaker: "",
  hasCriticalDeadline: false,
  criticalDeadlineReason: "",
  deliveryTimeline: "",
  projectBudget: "",
  contentStatus: "",
  preferredContactChannel: "",
  meetingFrequency: "",
  filesBranding: [],
  filesReferences: [],
};

const STEP_LABELS = [
  "Identidade",
  "Estrategia",
  "Escopo",
  "Design",
  "Budget",
];

export function OnboardingForm() {
  const [data, setData] = useState<OnboardingFormState>(INITIAL_STATE);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitStage, setSubmitStage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitWarning, setSubmitWarning] = useState("");
  const totalSteps = 5;

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

    if (currentStep < totalSteps) {
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
          Recebemos os dados do seu projeto. Nossa equipe vai analisar o escopo
          e entrar em contato para dar sequencia a proposta comercial.
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
    <div className="relative z-10 mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[rgba(77,88,246,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(234,240,255,0.55)_100%)] px-5 pb-12 pt-6 shadow-[0_30px_90px_rgba(49,67,136,0.08)]">
      <div className="mb-8">
        <div className="mb-3 flex justify-between px-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
          <span>Passo {currentStep} de {totalSteps}</span>
          <span className="text-[#3E49F1]">
            {Math.round((currentStep / totalSteps) * 100)}% concluido
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(77,88,246,0.16)] shadow-[inset_0_1px_2px_rgba(61,78,140,0.08)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ ease: "easeInOut", duration: 0.4 }}
            className="h-full bg-[linear-gradient(90deg,#2388F5_0%,#8E22FF_100%)]"
          />
        </div>
        <div className="mt-2 flex justify-between px-1">
          {STEP_LABELS.map((label, index) => (
            <span
              key={label}
              className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${
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
              <StrategicContextForm data={data} updateData={updateData} />
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
              <ProjectScopeForm data={data} updateData={updateData} />
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
              <DesignBrandingForm data={data} updateData={updateData} />
            </motion.div>
          ) : null}

          {currentStep === 5 ? (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
            >
              <BudgetTimelineForm data={data} updateData={updateData} />
            </motion.div>
          ) : null}
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

          {currentStep < totalSteps ? (
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
