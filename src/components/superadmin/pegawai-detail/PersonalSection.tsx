// src/components/superadmin/pegawai-detail/PersonalSection.tsx
"use client";
import type { PegawaiDetail } from "./types";
import { User as UserIcon } from "lucide-react";

export function PersonalSection({
  form,
  isEditing,
  onField,
  fmtDate,
}: {
  form: PegawaiDetail;
  isEditing: boolean;
  onField: (name: keyof PegawaiDetail, value: any) => void;
  fmtDate: (v?: string) => string;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-8 border border-blue-100">
      <h2 className="text-lg font-bold text-blue-900 mb-6 flex items-center gap-2">
        <UserIcon className="w-5 h-5 text-blue-400" />
        Data Pribadi
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NUP editable */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">NUP</label>
          {isEditing ? (
            <input
              type="text"
              value={form.nup ?? ""}
              onChange={(e) => onField("nup", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{form.nup}</div>
          )}
        </div>

        {/* NIK */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">NIK</label>
          {isEditing ? (
            <input
              type="text"
              value={form.nik ?? ""}
              onChange={(e) => onField("nik", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{form.nik}</div>
          )}
        </div>

        {/* Nama */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
          {isEditing ? (
            <input
              type="text"
              value={form.nama_pegawai ?? ""}
              onChange={(e) => onField("nama_pegawai", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{form.nama_pegawai}</div>
          )}
        </div>

        {/* Tempat Lahir */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tempat Lahir</label>
          {isEditing ? (
            <input
              type="text"
              value={form.tempat_lahir ?? ""}
              onChange={(e) => onField("tempat_lahir", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{form.tempat_lahir || "-"}</div>
          )}
        </div>

        {/* Tanggal Lahir */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
          {isEditing ? (
            <input
              type="date"
              value={form.tanggal_lahir ? form.tanggal_lahir.split("T")[0] : ""}
              onChange={(e) => onField("tanggal_lahir", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{fmtDate(form.tanggal_lahir)}</div>
          )}
        </div>

        {/* Warga negara */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kewarganegaraan</label>
          {isEditing ? (
            <input
              type="text"
              value={form.warga_negara ?? ""}
              onChange={(e) => onField("warga_negara", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{form.warga_negara || "-"}</div>
          )}
        </div>

        {/* Agama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Agama</label>
          {isEditing ? (
            <select
              value={form.agama ?? ""}
              onChange={(e) => onField("agama", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="">Pilih Agama</option>
              <option value="Islam">Islam</option>
              <option value="Kristen">Kristen</option>
              <option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddha">Buddha</option>
              <option value="Konghucu">Konghucu</option>
            </select>
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{form.agama || "-"}</div>
          )}
        </div>

        {/* Alamat */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
          {isEditing ? (
            <textarea
              rows={3}
              value={form.alamat ?? ""}
              onChange={(e) => onField("alamat", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{form.alamat || "-"}</div>
          )}
        </div>
      </div>
    </div>
  );
}