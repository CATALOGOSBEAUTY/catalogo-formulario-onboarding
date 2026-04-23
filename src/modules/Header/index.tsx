import { SistematizeLogo } from "@/src/components/branding/SistematizeLogo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(77,88,246,0.16)] bg-white/88 shadow-[0_16px_45px_rgba(72,88,160,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <div className="min-w-0">
          <SistematizeLogo
            className="gap-3 sm:gap-4"
            iconClassName="h-11 w-11 sm:h-12 sm:w-12"
            wordmarkClassName="text-[2rem] sm:text-[2.55rem]"
            subtitle="Catalogo e onboarding"
          />
        </div>
        <div className="hidden rounded-full border border-[rgba(77,88,246,0.24)] bg-[rgba(247,249,255,0.94)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-700 shadow-[0_18px_45px_rgba(37,136,245,0.12)] md:block">
          Operacao digital estruturada
        </div>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(77,88,246,0.48)] to-transparent" />
    </header>
  );
}
