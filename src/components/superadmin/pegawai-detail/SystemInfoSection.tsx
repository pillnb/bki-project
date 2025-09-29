// src/components/superadmin/pegawai-detail/SystemInfoSection.tsx
"use client";
import type { PegawaiDetail } from "./types";
import { Calendar } from "lucide-react";

export function SystemInfoSection({
  form,
  isEditing,
  onField,
  fmtDate,
}: {
  form: PegawaiDetail;
  isEditing: boolean;
  onField: (k: keyof PegawaiDetail, v: any) => void;
  fmtDate: (v?: string) => string;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-8 border border-blue-100">
      <h2 className="text-lg font-bold text-blue-900 mb-6 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-400" />
        Informasi Sistem
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Dibuat</label>
          <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{fmtDate(form.created_at)}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Terakhir Diperbarui</label>
          <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{fmtDate(form.updated_at)}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CV Terakhir Dibuat</label>
          <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">
            {form.cv_generated_at ? fmtDate(form.cv_generated_at) : "Belum pernah"}
          </div>
        </div>
      </div>
    </div>
  );
}
