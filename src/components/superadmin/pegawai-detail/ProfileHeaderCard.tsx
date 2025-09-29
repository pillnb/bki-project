// src/components/superadmin/pegawai-detail/ProfileHeaderCard.tsx
"use client";
import { User } from "lucide-react";
import type { PegawaiDetail } from "./types";

export function ProfileHeaderCard({ pegawai }: { pegawai: PegawaiDetail }) {
  return (
    <div className="bg-white rounded-xl shadow p-8 border border-blue-100">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-12 h-12 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-blue-900">{pegawai.nama_pegawai}</h2>
          <p className="text-lg text-gray-600">{pegawai.jabatan}</p>
          <div className="flex gap-4 mt-2">
            <span className="text-sm text-blue-400 font-bold">NUP: {pegawai.nup}</span>
            <span className="text-sm text-blue-400 font-bold">NIK: {pegawai.nik}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex flex-wrap gap-2">
            {(pegawai.role ?? []).map((role) => (
              <span
                key={role}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800"
              >
                {role}
              </span>
            ))}
          </div>
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                pegawai.status_pegawai === "KOMERBA"
                  ? "bg-green-100 text-green-800"
                  : pegawai.status_pegawai === "PKWTT"
                  ? "bg-yellow-100 text-yellow-800"
                  : pegawai.status_pegawai === "PKWT"
                  ? "bg-orange-100 text-orange-800"
                  : pegawai.status_pegawai === "FREELANCE"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {pegawai.status_pegawai}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}