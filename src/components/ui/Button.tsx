import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4D58F6] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[linear-gradient(135deg,#2388F5_0%,#8E22FF_100%)] text-white shadow-[0_18px_45px_rgba(77,88,246,0.26)] hover:brightness-105 hover:shadow-[0_16px_35px_rgba(77,88,246,0.22)]": variant === "default",
            "border border-[rgba(77,88,246,0.16)] bg-white/85 text-[#3640D7] hover:border-[rgba(77,88,246,0.28)] hover:bg-[rgba(239,243,255,0.88)] hover:text-[#1C2040]": variant === "outline",
            "text-slate-500 hover:bg-[rgba(77,88,246,0.08)] hover:text-[#1C2040]": variant === "ghost",
            "bg-red-600 text-white shadow-lg shadow-red-100 hover:bg-red-700 hover:shadow-md": variant === "destructive",
            "px-6 py-3 text-sm": size === "default",
            "px-3 py-1.5 text-xs": size === "sm",
            "px-8 py-4 text-base": size === "lg",
            "flex h-10 w-10 items-center justify-center p-0": size === "icon",
          },
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
