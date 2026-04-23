import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        className={cn(
          "w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-800 disabled:cursor-not-allowed disabled:opacity-50 appearance-none font-medium text-slate-700",
          className
        )}
        ref={ref}
        {...props}
      >
        {props.children}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }
