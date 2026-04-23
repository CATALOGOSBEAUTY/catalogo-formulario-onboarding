import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full rounded-xl border border-[rgba(148,163,184,0.22)] bg-white/80 px-3 py-2 text-sm text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-shadow placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4D58F6] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 file:mr-4 file:rounded-full file:border-0 file:bg-[rgba(37,136,245,0.1)] file:px-4 file:py-1.5 file:text-[10px] file:font-bold file:uppercase file:tracking-[0.18em] file:text-[#3640D7] hover:file:bg-[rgba(77,88,246,0.12)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
