import * as React from "react"
import { cn } from "@/src/lib/utils"

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
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-bold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-800 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider",
          {
            "bg-rose-900 text-white hover:bg-rose-950 shadow-lg shadow-rose-100 hover:shadow-md": variant === "default",
            "border border-slate-200 bg-white text-rose-900 hover:bg-rose-50/50 hover:text-rose-950 hover:border-rose-200": variant === "outline",
            "hover:bg-slate-100 text-slate-600 hover:text-slate-900": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-100 hover:shadow-md": variant === "destructive",
            "px-6 py-3 text-sm": size === "default",
            "px-3 py-1.5 text-xs": size === "sm",
            "px-8 py-4 text-base": size === "lg",
            "h-10 w-10 p-0 flex items-center justify-center": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
