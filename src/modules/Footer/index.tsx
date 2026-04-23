import { SistematizeLogo } from "@/src/components/branding/SistematizeLogo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SistematizeLogo
            className="gap-3"
            iconClassName="h-9 w-9"
            wordmarkClassName="text-[1.7rem]"
          />
          <p className="max-w-md text-[11px] text-slate-500">
            (c) {new Date().getFullYear()} Sistematize. Estrutura digital para catalogos, onboarding e operacao comercial.
          </p>
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Dados tratados em conformidade com a LGPD
        </div>
      </div>
    </footer>
  );
}
