"use client";

import React, { useState } from "react";
import { AddFormData } from "./types";
import { validateDateRange } from "./utils";
import { validateFile } from "./utils";
import { MATRIX_CATEGORIES } from './constants';
import { toast } from "sonner";

export default function AddTrainingModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddFormData) => Promise<void>;
}) {
  const [addForm, setAddForm] = useState<AddFormData>({
    nama: "",
    penyelenggara: "",
    tanggalMulai: "",
    tanggalSelesaiEstimasi: "",
    tahun: "",
    sudahSelesai: false,
    tanggalSelesaiAktual: "",
    noSertifikat: "",
    file: null,
    matrixCategory: "",
    tanggalKadaluarsa: "",
  });

  const [dateError, setDateError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- handler file:
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setAddForm(p => ({ ...p, file: null }));
      setPreviewUrl(null);
      return;
    }
    const err = validateFile(f);
    if (err) {
      setFileError(err);
      e.currentTarget.value = "";
      setAddForm(p => ({ ...p, file: null }));
      setPreviewUrl(null);
      return;
    }
    setAddForm(p => ({ ...p, file: f }));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
  };

  // --- START PERBAIKAN ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDateError(""); // Reset error setiap kali submit
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Validasi 1: Tanggal Selesai Estimasi
    let validationError = validateDateRange(addForm.tanggalMulai, addForm.tanggalSelesaiEstimasi);
    if (validationError) {
      setDateError(validationError);
      setIsSubmitting(false);
      return; // Hentikan jika ada error
    }
    
    // Validasi 2: Tanggal Selesai Aktual (jika checkbox dicentang)
    if (addForm.sudahSelesai) {
        validationError = validateDateRange(addForm.tanggalMulai, addForm.tanggalSelesaiAktual);
        if (validationError) {
            setDateError(validationError);
            setIsSubmitting(false);
            return; // Hentikan jika ada error
        }
        // Validasi 3: Tanggal Kadaluarsa vs Tanggal Selesai Aktual
        validationError = validateDateRange(addForm.tanggalSelesaiAktual, addForm.tanggalKadaluarsa);
        if (validationError) {
            // Ubah pesan error agar lebih spesifik
            setDateError("Tanggal kadaluarsa tidak boleh sebelum tanggal selesai aktual.");
            setIsSubmitting(false);
            return;
        }
    }

    // Jika semua validasi lolos, lanjutkan submit
    await onSubmit(addForm);
    toast.success("Training berhasil ditambahkan");
    setIsSubmitting(false);
    onClose(); // Tutup modal setelah berhasil
  };
  // --- END PERBAIKAN ---

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4 text-black">Tambah Training</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">
              Nama Training <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={addForm.nama}
              onChange={(e) => setAddForm((p) => ({ ...p, nama: e.target.value }))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">
              Penyelenggara <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={addForm.penyelenggara}
              onChange={(e) => setAddForm((p) => ({ ...p, penyelenggara: e.target.value }))}
            />
          </div>
          <div className="mb-4">
              <label htmlFor="matrixCategory" className="block text-sm font-medium text-black mb-1">
                  Kategori Sertifikasi
              </label>
              <select
                  id="matrixCategory"
                  name="matrixCategory"
                  value={addForm.matrixCategory || ''}
                  onChange={(e) => setAddForm(p => ({ ...p, matrixCategory: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                  <option value="">-- Pilih Kategori --</option>
                  {MATRIX_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                  ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Pilih kategori jika sertifikat ini relevan untuk matriks personel.</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">
              Tanggal Mulai <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={addForm.tanggalMulai}
              onChange={(e) => setAddForm((p) => ({ ...p, tanggalMulai: e.target.value }))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">
              Tanggal Selesai Estimasi <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={addForm.tanggalSelesaiEstimasi}
              onChange={(e) =>
                setAddForm((p) => ({ ...p, tanggalSelesaiEstimasi: e.target.value }))
              }
            />
          </div>
           {dateError && <div className="text-red-500 text-sm -mt-2 mb-2">{dateError}</div>}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">
              Tahun Training <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={addForm.tahun}
              onChange={(e) => setAddForm((p) => ({ ...p, tahun: e.target.value }))}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Apakah training sudah selesai?</label>
            <div className="flex gap-4 text-black">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="sudahSelesai"
                  checked={!!addForm.sudahSelesai}
                  onChange={() => setAddForm(p => ({ ...p, sudahSelesai: true }))}
                />
                <span>Ya</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="sudahSelesai"
                  checked={!addForm.sudahSelesai}
                  onChange={() => setAddForm(p => ({ ...p, sudahSelesai: false, tanggalSelesaiAktual: "", noSertifikat: "", file: null }))}
                />
                <span>Tidak</span>
              </label>
            </div>
          </div>

          {addForm.sudahSelesai && (
            <div className="space-y-4 border-t pt-4 mt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-black">
                  Tanggal Selesai Aktual <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  required={addForm.sudahSelesai}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={addForm.tanggalSelesaiAktual}
                  onChange={(e) => setAddForm(p => ({ ...p, tanggalSelesaiAktual: e.target.value }))}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-black">
                  Nomor Sertifikat <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required={addForm.sudahSelesai}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={addForm.noSertifikat}
                  onChange={(e) => setAddForm(p => ({ ...p, noSertifikat: e.target.value }))}
                />
              </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-black">
                    Tanggal Kadaluarsa Sertifikat <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    required={addForm.sudahSelesai}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={addForm.tanggalKadaluarsa || ""}
                    onChange={e => setAddForm(p => ({ ...p, tanggalKadaluarsa: e.target.value }))}
                  />
                </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-black">
                    Upload Sertifikat <span className="text-red-600">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  required={addForm.sudahSelesai}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-gray-500 mt-1">Format: PDF, PNG, JPG, JPEG. Maksimal 5MB</p>
                {fileError && <div className="text-red-500 text-sm mt-1">{fileError}</div>}
                {!!previewUrl && (
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-600 hover:underline text-sm">
                    Preview file yang dipilih
                  </a>
                )}
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 border-t pt-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}