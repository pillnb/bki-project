// src/components/superadmin/pegawai-detail/ContactSection.tsx
"use client";
import type { PegawaiDetail } from "./types";
import { Phone } from "lucide-react";

export function ContactSection({
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
        <Phone className="w-5 h-5 text-blue-400" />
        Data Kontak
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">No. Telepon</label>
          {isEditing ? (
            <input
              type="text"
              value={form.no_telepon ?? ""}
              onChange={(e) => onField("no_telepon", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{form.no_telepon || "-"}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          {isEditing ? (
            <input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => onField("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-black">{form.email || "-"}</div>
          )}
        </div>
      </div>
    </div>
  );
}