"use client";
import * as React from "react";
import { cn } from "./cn";

export function Badge({
  className,
  variant = "secondary",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "secondary" | "default";
}) {
  const styles =
    variant === "secondary"
      ? "bg-slate-100 text-slate-900"
      : "bg-blue-600 text-white";
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md",
        styles,
        className
      )}
      {...props}
    />
  );
}
