import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-800 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow file:border-0 file:bg-transparent file:text-[10px] file:font-bold file:uppercase file:text-rose-900 placeholder:text-slate-400",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
