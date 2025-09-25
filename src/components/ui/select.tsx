"use client";
import * as React from "react";
import { cn } from "./cn";

type Option = { value: string; label: React.ReactNode };

type SelectCtx = {
  value?: string;
  setValue?: (v: string) => void;
  onValueChange?: (v: string) => void;
  register?: (opt: Option) => void;
  options: Option[];
};

const Ctx = React.createContext<SelectCtx>({ options: [] });

export function Select({
  value,
  onValueChange,
  children,
}: {
  value?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
}) {
  const [internal, setInternal] = React.useState(value);
  const [options, setOptions] = React.useState<Option[]>([]);

  React.useEffect(() => setInternal(value), [value]);

  const register = React.useCallback((opt: Option) => {
    setOptions((prev) => {
      // hindari duplikasi value
      if (prev.some((p) => p.value === opt.value)) return prev;
      return [...prev, opt];
    });
  }, []);

  return (
    <Ctx.Provider
      value={{
        value: internal,
        setValue: setInternal,
        onValueChange,
        register,
        options,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function SelectTrigger({
  className,
  children,
  id,
}: React.HTMLAttributes<HTMLDivElement> & { id?: string }) {
  const { value, setValue, onValueChange, options } = React.useContext(Ctx);

  return (
    <div className={cn("relative", className)} id={id}>
      {/* Visual trigger */}
      <div className="h-10 px-3 rounded-xl border border-slate-300 bg-white flex items-center justify-between">
        {children}
        <svg
          className="w-4 h-4 text-slate-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.104l3.71-3.873a.75.75 0 111.08 1.04l-4.24 4.43a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" />
        </svg>
      </div>

      {/* Native select overlay — seluruh area trigger bisa diklik */}
      <select
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        value={value}
        onChange={(e) => {
          setValue?.(e.target.value);
          onValueChange?.(e.target.value);
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {/* option text harus string */}
            {typeof opt.label === "string" ? opt.label : String(opt.value)}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value, options } = React.useContext(Ctx);
  const current = options.find((o) => o.value === value)?.label;
  return (
    <span className={cn(!value && "text-slate-400")}>
      {current ?? placeholder ?? "Select"}
    </span>
  );
}

/**
 * Kompat untuk API lama. Kita pakai ini hanya sebagai tempat
 * naruh <SelectItem/>, gak render dropdown apa-apa.
 */
export function SelectContent({ children }: { children: React.ReactNode }) {
  return <div className="hidden">{children}</div>;
}

export function SelectItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const { register } = React.useContext(Ctx);
  React.useEffect(() => {
    register?.({ value, label: children });
  }, [value, children, register]);
  // Tidak render apa-apa; opsi di-register ke context
  return null;
}