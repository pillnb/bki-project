"use client";
import * as React from "react";
import { cn } from "./cn";

export function Pagination({ children }: { children: React.ReactNode }) {
  return <nav>{children}</nav>;
}
export function PaginationContent({ children }: { children: React.ReactNode }) {
  return <ul className="flex items-center gap-2">{children}</ul>;
}
export function PaginationItem({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}
export function PaginationPrevious({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={cn("h-9 px-3 rounded-lg border border-slate-300 hover:bg-slate-50", className)}>
      Prev
    </button>
  );
}
export function PaginationNext({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={cn("h-9 px-3 rounded-lg border border-slate-300 hover:bg-slate-50", className)}>
      Next
    </button>
  );
}