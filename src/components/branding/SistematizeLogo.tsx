import * as React from "react";
import { cn } from "@/src/lib/utils";

interface SistematizeLogoProps {
  className?: string;
  iconClassName?: string;
  wordmarkClassName?: string;
  lockup?: "horizontal" | "stacked" | "symbol";
  subtitle?: string;
}

export function SistematizeLogo({
  className,
  iconClassName,
  wordmarkClassName,
  lockup = "horizontal",
  subtitle,
}: SistematizeLogoProps) {
  const gradientId = React.useId();
  const accentId = React.useId();
  const isSymbolOnly = lockup === "symbol";
  const isStacked = lockup === "stacked";

  const icon = (
    <svg
      viewBox="0 0 180 180"
      className={cn("h-14 w-14 shrink-0", iconClassName)}
      role="img"
      aria-label="Logo Sistematize"
    >
      <defs>
        <linearGradient id={gradientId} x1="26" x2="154" y1="22" y2="162" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2388F5" />
          <stop offset="0.55" stopColor="#4958F6" />
          <stop offset="1" stopColor="#8E22FF" />
        </linearGradient>
        <linearGradient id={accentId} x1="118" x2="158" y1="132" y2="176" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7B28FF" />
          <stop offset="1" stopColor="#B116FF" />
        </linearGradient>
      </defs>
      <rect x="28" y="18" width="42" height="42" rx="11" fill="#2388F5" />
      <rect x="94" y="18" width="62" height="62" rx="12" fill={`url(#${gradientId})`} />
      <path
        d="M40 82h42c6.6 0 12-5.4 12-12V58c0-6.6 5.4-12 12-12h19c6.6 0 12 5.4 12 12v31c0 6.6-5.4 12-12 12h-25c-6.6 0-12 5.4-12 12v15c0 6.6 5.4 12 12 12h13c6.6 0 12 5.4 12 12v33c0 6.6-5.4 12-12 12H40c-6.6 0-12-5.4-12-12V94c0-6.6 5.4-12 12-12Z"
        fill={`url(#${gradientId})`}
      />
      <rect x="78" y="102" width="60" height="24" rx="8" fill={`url(#${gradientId})`} />
      <rect x="122" y="138" width="36" height="36" rx="9" fill={`url(#${accentId})`} />
    </svg>
  );

  if (isSymbolOnly) {
    return <span className={cn("inline-flex", className)}>{icon}</span>;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center text-left",
        isStacked ? "flex-col gap-4" : "gap-4",
        className,
      )}
      aria-label="Marca Sistematize"
    >
      {icon}
      <span className={cn("flex min-w-0 flex-col", isStacked && "items-center text-center")}>
        <span
          className={cn(
            "font-black lowercase leading-none tracking-[-0.08em] text-[#16181D]",
            isStacked ? "text-[2.8rem]" : "text-[2.35rem]",
            wordmarkClassName,
          )}
        >
          sistematize
        </span>
        {subtitle ? (
          <span className="mt-1 block max-w-[min(72vw,34rem)] text-[9px] font-semibold uppercase leading-relaxed tracking-[0.14em] text-slate-500 sm:text-[10px]">
            {subtitle}
          </span>
        ) : null}
      </span>
    </div>
  );
}
