export function Footer() {
  return (
    <footer className="w-full bg-slate-100 px-4 sm:px-8 py-3 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 border-t border-slate-200 mt-auto">
      <div>© {new Date().getFullYear()} BeautySync - Sincronize beleza, gestão e resultado</div>
      <div className="flex gap-4 italic mt-2 sm:mt-0">* Todos os dados são processados de acordo com a LGPD</div>
    </footer>
  );
}
