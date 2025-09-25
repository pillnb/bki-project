"use client";
export default function LoadingState({
  text = "Loading...",
}: {
  text?: string;
}) {
  return <div className="text-center py-10 text-slate-500 text-sm">{text}</div>;
}