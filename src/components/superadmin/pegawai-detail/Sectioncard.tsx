// src/components/superadmin/pegawai-detail/SectionCard.tsx
"use client";
import { ReactNode } from "react";

export function SectionCard({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow p-8 border border-blue-100">
      <h2 className="text-lg font-bold text-blue-900 mb-6 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}