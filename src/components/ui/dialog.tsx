"use client";
import * as React from "react";
import { cn } from "@/components/ui/cn";

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      onClick={() => onOpenChange(false)}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DialogHeader({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 border-b border-slate-100", className)}>
      {children}
    </div>
  );
}
export function DialogTitle({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-base font-semibold", className)}>{children}</div>
  );
}
export function DialogContent({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 space-y-4", className)}>{children}</div>;
}
export function DialogFooter({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-4 border-t border-slate-100 flex justify-end gap-2",
        className
      )}
    >
      {children}
    </div>
  );
}