import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full rounded-xl border border-[rgba(110,126,170,0.3)] bg-white px-3 py-2 text-sm text-slate-900 shadow-[0_8px_22px_rgba(42,61,130,0.05)] transition-[border-color,box-shadow,background-color] placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4D58F6] focus-visible:border-[#6A63FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 file:mr-4 file:rounded-full file:border-0 file:bg-[rgba(37,136,245,0.14)] file:px-4 file:py-1.5 file:text-[10px] file:font-bold file:uppercase file:tracking-[0.18em] file:text-[#2736B8] hover:file:bg-[rgba(77,88,246,0.18)]",
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
