"use client";
import * as React from "react";
import { cn } from "./cn";

type Variant = "default" | "outline" | "destructive" | "ghost";
type Size = "sm" | "md" | "lg";

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
  }
>(function Button(
  { className, variant = "default", size = "md", ...props },
  ref
) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-xl transition-colors disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<Variant, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-slate-300 text-slate-900 hover:bg-slate-50",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-slate-900 hover:bg-slate-100",
  };
  const sizes: Record<Size, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
  };
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
