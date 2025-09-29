// src/components/superadmin/pegawai-detail/JobSection.tsx
"use client";
import type { PegawaiDetail } from "./types";
import { Briefcase } from "lucide-react";

export function JobSection({
  form,
  isEditing,
  onField,
}: {
  form: PegawaiDetail;
  isEditing: boolean;
  onField: (k: keyof PegawaiDetail, v: any) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-8 border border-blue-100">
      <h2 className="text-lg font-bold text-blue-900 mb-6 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-blue-400" />
        Data Pekerjaan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan</label>
          {isEditing ? (
            <input
              type="text"
              value={form.jabatan ?? ""}
              onChange={(e) => onField("jabatan", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{form.jabatan || "-"}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status Pegawai</label>
          {isEditing ? (
            <select
              value={form.status_pegawai ?? ""}
              onChange={(e) => onField("status_pegawai", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="">Pilih Status</option>
              <option value="KOMERBA">KOMERBA</option>
              <option value="PKWTT">PKWTT</option>
              <option value="PKWT">PKWT</option>
              <option value="FREELANCE">FREELANCE</option>
            </select>
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{form.status_pegawai || "-"}</div>
          )}
        </div>
      </div>
    </div>
  );
}