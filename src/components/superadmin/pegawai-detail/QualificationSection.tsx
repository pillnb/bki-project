// src/components/superadmin/pegawai-detail/QualificationSection.tsx
"use client";
import { Award, Plus, Trash2 } from "lucide-react";
import type { PegawaiDetail } from "./types";

type Props = {
  form: PegawaiDetail;
  isEditing: boolean;
  add: () => void;
  remove: (idx: number) => void;
  update: (idx: number, field: any, value: any) => void;
  fmtDate: (v?: string) => string;
};

export function QualificationSection({
  form,
  isEditing,
  add,
  remove,
  update,
  fmtDate,
}: Props) {
  const list = form.kualifikasi ?? [];

  return (
    <div className="bg-white rounded-xl shadow p-8 border border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-400" />
          Kualifikasi & Pelatihan
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
            <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Belum ada data kualifikasi</p>
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
          list.map((kual, index) => (
            <div
              key={kual.id_pelatihan || index}
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
                    Nama Pelatihan
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={kual.nama_pelatihan}
                      onChange={(e) =>
                        update(index, "nama_pelatihan", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-black font-medium">
                      {kual.nama_pelatihan}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penyelenggara
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={kual.penyelenggara}
                      onChange={(e) =>
                        update(index, "penyelenggara", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-black">
                      {kual.penyelenggara}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tahun
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={kual.tahun || ""}
                      onChange={(e) =>
                        update(index, "tahun", parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-black">
                      {kual.tahun || "-"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Sertifikat
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={kual.nomor_sertifikat}
                      onChange={(e) =>
                        update(index, "nomor_sertifikat", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-black">
                      {kual.nomor_sertifikat}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  {isEditing ? (
                    <select
                      value={kual.status}
                      onChange={(e) => update(index, "status", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    >
                      <option value="VALID">Valid</option>
                      <option value="EXPIRED">Expired</option>
                      <option value="ON_GOING">On Going</option>
                    </select>
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          kual.status === "VALID"
                            ? "bg-green-100 text-green-800"
                            : kual.status === "EXPIRED"
                            ? "bg-red-100 text-red-800"
                            : kual.status === "ON_GOING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {kual.status}
                      </span>
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
                      value={kual.lokasi}
                      onChange={(e) => update(index, "lokasi", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-black">
                      {kual.lokasi}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Mulai
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={
                        kual.tanggal_awal ? kual.tanggal_awal.split("T")[0] : ""
                      }
                      onChange={(e) =>
                        update(index, "tanggal_awal", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-black">
                      {fmtDate(kual.tanggal_awal)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Selesai
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={
                        kual.tanggal_akhir
                          ? kual.tanggal_akhir.split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        update(index, "tanggal_akhir", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-black">
                      {fmtDate(kual.tanggal_akhir)}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keterangan Utilisasi
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={kual.keterangan_utilisasi}
                      onChange={(e) =>
                        update(index, "keterangan_utilisasi", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-black">
                      {kual.keterangan_utilisasi || "-"}
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