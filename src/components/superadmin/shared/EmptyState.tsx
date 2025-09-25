"use client";
export default function EmptyState({
  title = "Tidak ada data",
  desc,
}: {
  title?: string;
  desc?: string;
}) {
  return (
    <div className="text-center py-10 text-slate-500">
      <div className="text-sm font-medium">{title}</div>
      {desc ? <div className="text-xs mt-1">{desc}</div> : null}
    </div>
  );
}