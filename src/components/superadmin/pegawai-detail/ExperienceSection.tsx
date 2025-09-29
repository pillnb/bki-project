// src/components/superadmin/pegawai-detail/ExperienceSection.tsx
"use client";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import type { PegawaiDetail } from "./types";

type Props = {
  form: PegawaiDetail;
  isEditing: boolean;
  add: () => void;
  remove: (idx: number) => void;
  update: (idx: number, field: any, value: any) => void;
};

export function ExperienceSection({
  form,
  isEditing,
  add,
  remove,
  update,
}: Props) {
  const list = form.pengalaman_kerja ?? [];

  return (
    <div className="bg-white rounded-xl shadow p-8 border border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-400" />
          Pengalaman Kerja
        </h2>
        {isEditing && (
          <button
            onClick={add}
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        )}
      </div>

      <div className="space-y-6">
        {list.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Belum ada data pengalaman kerja</p>
            {isEditing && (
              <button
                onClick={add}
                className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
              >
                Klik untuk menambah
              </button>
            )}
          </div>
        ) : (
          list.map((exp, index) => (
            <div
              key={exp.id || index}
              className="border border-gray-200 rounded-lg p-4"
            >
              {isEditing && (
                <div className="flex justify-end mb-3">
                  <button
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Posisi/Jabatan
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={exp.pengalaman_kerja}
                      onChange={(e) =>
                        update(index, "pengalaman_kerja", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-black font-medium">
                      {exp.pengalaman_kerja}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Perusahaan
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={exp.perusahaan}
                      onChange={(e) =>
                        update(index, "perusahaan", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-black">
                      {exp.perusahaan}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={exp.lokasi}
                      onChange={(e) => update(index, "lokasi", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-black">
                      {exp.lokasi}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tahun Mulai
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={exp.tahun_awal || ""}
                      onChange={(e) =>
                        update(
                          index,
                          "tahun_awal",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-black">
                      {exp.tahun_awal || "-"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tahun Selesai
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={exp.tahun_akhir || ""}
                      onChange={(e) =>
                        update(
                          index,
                          "tahun_akhir",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-black">
                      {exp.tahun_akhir ? exp.tahun_akhir : "Sekarang"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}