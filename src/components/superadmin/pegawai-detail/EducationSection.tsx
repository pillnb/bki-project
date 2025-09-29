// src/components/superadmin/pegawai-detail/EducationSection.tsx
"use client";
import type { PegawaiDetail } from "./types";
import { GraduationCap } from "lucide-react";

export function EducationSection({
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
        <GraduationCap className="w-5 h-5 text-blue-400" />
        Data Pendidikan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Jenjang Pendidikan</label>
          {isEditing ? (
            <select
              value={form.jenjang_pend ?? ""}
              onChange={(e) => onField("jenjang_pend", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="">Pilih Jenjang</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
              <option value="D3">D3</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{form.jenjang_pend || "-"}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pendidikan</label>
          {isEditing ? (
            <input
              type="text"
              value={form.pendidikan ?? ""}
              onChange={(e) => onField("pendidikan", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{form.pendidikan || "-"}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Kelulusan</label>
          {isEditing ? (
            <input
              type="number"
              value={form.tahun_pend ?? ""}
              onChange={(e) => onField("tahun_pend", Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{form.tahun_pend || "-"}</div>
          )}
        </div>
      </div>
    </div>
  );
}