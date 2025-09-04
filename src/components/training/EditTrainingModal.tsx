"use client";

import React from "react";
import { X, Save, Loader2 } from "lucide-react";
import type { Training } from "./types";
import { mapApiTrainingToClient, formatDateInput } from "./utils";
import { validateFile } from "./utils";

type Props = {
  open: boolean;
  onClose: () => void;
  training: Training | null;
  /** dipanggil saat PATCH/PUT sukses; kirim balik Training hasil mapping */
  onSaved: (t: Training) => void;
  nup: string;
  namaPegawai: string;
};

export default function EditTrainingModal({
  open,
  onClose,
  training,
  onSaved,
  nup,
  namaPegawai,
}: Props) {
  const [saving, setSaving] = React.useState(false);

  // form states mengikuti field di tipe Training
  const [nama, setNama] = React.useState("");
  const [penyelenggara, setPenyelenggara] = React.useState("");
  const [tanggalMulai, setTanggalMulai] = React.useState("");
  const [tanggalSelesaiEstimasi, setTanggalSelesaiEstimasi] = React.useState("");
  const [tanggalSelesaiAktual, setTanggalSelesaiAktual] = React.useState("");
  const [tanggalKadaluarsa, setTanggalKadaluarsa] = React.useState("");
  const [noSertifikat, setNoSertifikat] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState("");
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open || !training) return;
    // isi nilai default dari training
    setNama(training.nama || "");
    setPenyelenggara(training.penyelenggara || "");
    setTanggalMulai(training.tanggalMulai || "");
    setTanggalSelesaiEstimasi(training.tanggalSelesaiEstimasi || "");
    setTanggalSelesaiAktual(training.tanggalSelesaiAktual || "");
    setTanggalKadaluarsa(training.tanggalKadaluarsa || "");
    setNoSertifikat(training.noSertifikat || "");
    setFile(null);
    setFileError("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }, [open, training]);

  if (!open || !training) return null;

  const submit = async () => {
    try {
      setSaving(true);
      let uploadedFileUrl: string | undefined = undefined;
      if (file) {
        // Upload file ke Google Drive
        const fd = new FormData();
        fd.append("file", file);
        fd.append("nup", nup || "");
        fd.append("namaPegawai", namaPegawai || "");
        fd.append("namaTraining", nama);
        fd.append("penyelenggara", penyelenggara);
        fd.append("tahun", String(training.tahun || ""));
        const uploadRes = await fetch("/api/drive/upload-certificate", {
          method: "POST",
          body: fd,
        });
        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => ({}));
          throw new Error(err?.error || "Gagal upload sertifikat ke Google Drive");
        }
        const uploadData = await uploadRes.json();
        uploadedFileUrl = uploadData.webViewLink || uploadData.webContentLink;
        if (!uploadedFileUrl) throw new Error("URL file sertifikat dari Google Drive tidak ditemukan");
      }

      // PATCH ke /api/training
      const res = await fetch("/api/training", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_pelatihan: training.id,
          data: {
            nama_pelatihan: nama,
            penyelenggara,
            tanggal_awal: tanggalMulai || null,
            tanggal_akhir: (tanggalSelesaiAktual || tanggalSelesaiEstimasi || null),
            masa_berlaku: tanggalKadaluarsa || null,
            nomor_sertifikat: noSertifikat || null,
            ...(uploadedFileUrl ? { file_url: uploadedFileUrl } : {}),
          },
        }),
      });

      if (!res.ok) {
        let msg = "Gagal menyimpan perubahan training";
        try {
          const j = await res.json();
          msg = j?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      const updated = await res.json();
      const mapped = mapApiTrainingToClient(updated);
      onSaved(mapped);
    } catch (e: any) {
      alert(e?.message || "Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  // handler file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    const err = validateFile(f);
    if (err) {
      setFileError(err);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <div className="text-xs font-semibold text-blue-500">Edit Training</div>
            <div className="text-lg font-bold text-blue-900">{nama || "(Tanpa Judul)"}</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-blue-900 hover:bg-blue-50"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* body */}
        <div className="grid gap-4 px-5 py-5 md:grid-cols-2">
          <Field label="Nama Training">
            <input
              className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </Field>

          <Field label="Penyelenggara">
            <input
              className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
              value={penyelenggara}
              onChange={(e) => setPenyelenggara(e.target.value)}
            />
          </Field>


          <Field label="Tanggal Mulai">
            <input
              type="date"
              className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
              value={formatDateInput(tanggalMulai)}
              onChange={(e) => setTanggalMulai(e.target.value)}
            />
          </Field>

          <Field label="Tanggal Selesai (Estimasi)">
            <input
              type="date"
              className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
              value={formatDateInput(tanggalSelesaiEstimasi)}
              onChange={(e) => setTanggalSelesaiEstimasi(e.target.value)}
            />
          </Field>

          <Field label="Tanggal Selesai (Aktual)">
            <input
              type="date"
              className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
              value={formatDateInput(tanggalSelesaiAktual)}
              onChange={(e) => setTanggalSelesaiAktual(e.target.value)}
            />
          </Field>

          <Field label="Tanggal Kadaluarsa Sertifikat">
            <input
              type="date"
              className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
              value={formatDateInput(tanggalKadaluarsa)}
              onChange={(e) => setTanggalKadaluarsa(e.target.value)}
            />
          </Field>

          <Field label="No. Sertifikat">
            <input
              className="w-full rounded-lg border border-blue-200 px-3 py-2 text-blue-900 outline-none focus:ring-2 focus:ring-blue-300"
              value={noSertifikat}
              onChange={(e) => setNoSertifikat(e.target.value)}
            />
          </Field>

          <Field label="Upload Sertifikat">
            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf,image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-blue-900 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-900 file:px-3 file:py-2 file:text-white hover:file:bg-blue-800"
            />
            <p className="text-xs text-gray-500 mt-1">Format: PDF, PNG, JPG, JPEG. Maksimal 5MB</p>
            {fileError && <div className="text-red-500 text-sm mt-1">{fileError}</div>}
            {!!previewUrl && (
              <a href={previewUrl} target="_blank" rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-600 hover:underline text-sm">
                Preview file yang dipilih
              </a>
            )}
          </Field>
        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-2 border-t px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-blue-900 hover:bg-blue-50"
          >
            Batal
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-900">
        {label}
      </div>
      {children}
    </div>
  );
}