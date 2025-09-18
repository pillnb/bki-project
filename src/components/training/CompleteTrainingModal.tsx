"use client";

import React, { useRef, useState } from "react";
import { CompleteFormData } from "./types";
import { validateFile } from "./utils";
import { toast } from "sonner";

export default function CompleteTrainingModal({
  open,
  onClose,
  onSubmit,
  defaultValues,
  namaPegawai,
  nup,
  namaTraining,
  penyelenggara,
  tahun,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CompleteFormData, fileUrl: string) => Promise<void>;
  defaultValues: CompleteFormData;
  namaPegawai: string;
  nup: string;
  namaTraining: string;
  penyelenggara: string;
  tahun: string;
}) {
  const [form, setForm] = useState<CompleteFormData>(defaultValues);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => setForm(defaultValues), [defaultValues]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFileError("");
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const validationError = validateFile(file);
    if (validationError) {
      setFileError(validationError);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPreviewUrl(null);
      return;
    }
    setForm((prev) => ({ ...prev, file }));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFileError("");
    if (!form.file) {
      setFileError("File sertifikat wajib diupload");
      return;
    }

    // --- UPLOAD FILE TO GOOGLE DRIVE ---
    try {
      const fd = new FormData();
      fd.append("file", form.file);
  fd.append("nup", nup);
  fd.append("namaPegawai", namaPegawai);
  fd.append("namaTraining", namaTraining);
  fd.append("penyelenggara", penyelenggara);
  fd.append("tahun", tahun);

      const uploadRes = await fetch("/api/drive/upload-certificate", {
        method: "POST",
        body: fd,
      });
      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err?.error || "Gagal upload sertifikat ke Google Drive");
      }
      const uploadData = await uploadRes.json();
      const fileUrl = uploadData.webViewLink || uploadData.webContentLink;
      if (!fileUrl) throw new Error("URL file sertifikat dari Google Drive tidak ditemukan");

      // PATCH ke /api/training dengan fileUrl
  await onSubmit(form, fileUrl);
    } catch (err: unknown) {
      setFileError((err as Error)?.message || "Gagal upload sertifikat");
      toast.success("Sertifikat berhasil diupload");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-black">Selesaikan Training</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">
              Tanggal Selesai Aktual <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.tanggalSelesaiAktual}
              onChange={(e) => setForm((p) => ({ ...p, tanggalSelesaiAktual: e.target.value }))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">
              Nomor Sertifikat <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.noSertifikat}
              onChange={(e) => setForm((p) => ({ ...p, noSertifikat: e.target.value }))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">
              Tanggal Kadaluarsa <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.tanggalKadaluarsa}
              onChange={(e) => setForm((p) => ({ ...p, tanggalKadaluarsa: e.target.value }))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">
              Upload Sertifikat <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.png,.jpg,.jpeg"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleFileChange}
            />
            <p className="text-xs text-gray-500 mt-1">Format: PDF, PNG, JPG, JPEG. Maksimal 5MB</p>
          </div>
          {fileError && <div className="text-red-500 text-sm mb-4">{fileError}</div>}
          {!!previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-600 hover:underline text-sm"
            >
              Preview file yang dipilih
            </a>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                setFileError("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Selesaikan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}