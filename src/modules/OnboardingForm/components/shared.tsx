import React from "react";

export function CheckboxGroup({
  options,
  selected,
  onChange,
  id,
  columns = 2,
}: {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  id: string;
  columns?: number;
}) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((v) => v !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className={`grid grid-cols-1 gap-2 ${columns === 2 ? "sm:grid-cols-2" : columns === 3 ? "sm:grid-cols-3" : ""}`} id={id}>
      {options.map((option) => (
        <label
          key={option}
          className="group flex cursor-pointer items-start gap-2.5 rounded-xl border border-[rgba(77,88,246,0.12)] bg-white/80 px-3 py-2.5 text-xs font-medium text-slate-700 transition-all hover:border-[rgba(77,88,246,0.28)] hover:bg-[rgba(245,247,255,0.9)] has-[:checked]:border-[rgba(77,88,246,0.36)] has-[:checked]:bg-[rgba(237,240,255,0.92)] has-[:checked]:text-[#1C2040]"
        >
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => toggle(option)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-slate-300 text-[#4D58F6] focus:ring-[#4D58F6]"
          />
          <span className="leading-relaxed">{option}</span>
        </label>
      ))}
    </div>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
  id,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[rgba(77,88,246,0.12)] bg-white/80 px-4 py-3 text-xs font-medium text-slate-700 transition-all hover:border-[rgba(77,88,246,0.28)]"
    >
      <span>{label}</span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-[#4D58F6] focus:ring-[#4D58F6]"
      />
    </label>
  );
}

export function StepHeader({
  stepNumber,
  title,
  description,
}: {
  stepNumber: number;
  title: string;
  description: string;
}) {
  const num = String(stepNumber).padStart(2, "0");
  return (
    <>
      <div className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-slate-800">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(37,136,245,0.14)_0%,rgba(142,34,255,0.16)_100%)] text-[10px] text-[#3640D7]">
          {num}
        </span>
        {title}
      </div>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </>
  );
}
