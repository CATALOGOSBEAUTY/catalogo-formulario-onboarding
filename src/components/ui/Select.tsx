import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        className={cn(
          "w-full appearance-none rounded-xl border border-[rgba(110,126,170,0.3)] bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-[0_8px_22px_rgba(42,61,130,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4D58F6] focus-visible:border-[#6A63FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      >
        {props.children}
      </select>
    );
  },
);
Select.displayName = "Select";

export { Select };
