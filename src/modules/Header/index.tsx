import { Infinity } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded flex items-center justify-center text-rose-900 font-bold border border-rose-100 bg-rose-50 shadow-sm">
          <Infinity className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">
          Beauty<span className="text-rose-900">Sync</span>
        </h1>
      </div>
      <div className="text-xs font-medium text-slate-400 uppercase tracking-widest hidden md:block">
        Formulário de Onboarding de Parceiro
      </div>
    </header>
  );
}
