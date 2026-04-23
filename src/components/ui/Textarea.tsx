import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-slate-50 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-800 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-slate-400",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
