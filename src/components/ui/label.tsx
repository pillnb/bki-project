"use client";
import * as React from "react";
import { cn } from "@/components/ui/cn";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-sm font-medium text-slate-700", className)}
      {...props}
    />
  );
}