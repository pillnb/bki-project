"use client";
import React, { useState } from "react";

interface KualifikasiFormProps {
  onSubmit: (data: {
    kualifikasi: string;
    penyelenggara: string;
    nomor_sertifikat: string;
    tanggal_awal: string;
    tanggal_akhir: string;
    masa_berlaku: string;
    lokasi: string;
    keterangan_utilisasi: string;
    tahun: number;
    status_override?: string;
  }) => void;
  onCancel: () => void;
}

export default function KualifikasiForm({ onSubmit, onCancel }: KualifikasiFormProps) {
  const [formData, setFormData] = useState({
    kualifikasi: "",
    penyelenggara: "",
    nomor_sertifikat: "",
    tanggal_awal: "",
    tanggal_akhir: "",
    masa_berlaku: "",
    lokasi: "",
    keterangan_utilisasi: "",
    tahun: new Date().getFullYear().toString(),
    status_override: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const required = ["kualifikasi", "penyelenggara", "nomor_sertifikat", "tanggal_awal", "tanggal_akhir", "masa_berlaku", "lokasi", "tahun"];
    for (const key of required) {
      if (!formData[key as keyof typeof formData]) {
        alert(`Kolom '${key.replace(/_/g, " ")}' tidak boleh kosong.`);
        return;
      }
    }
    onSubmit({
      ...formData,
      tahun: parseInt(formData.tahun, 10),
      status_override: formData.status_override || undefined,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nama Kualifikasi" required>
          <input name="kualifikasi" value={formData.kualifikasi} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" />
        </Field>
        <Field label="Penyelenggara" required>
          <input name="penyelenggara" value={formData.penyelenggara} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nomor Sertifikat" required>
          <input name="nomor_sertifikat" value={formData.nomor_sertifikat} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" />
        </Field>
        <Field label="Tahun" required>
          <input name="tahun" type="number" value={formData.tahun} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Tanggal Awal Pelatihan" required>
          <input name="tanggal_awal" type="date" value={formData.tanggal_awal} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" />
        </Field>
        <Field label="Tanggal Akhir Pelatihan" required>
          <input name="tanggal_akhir" type="date" value={formData.tanggal_akhir} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" />
        </Field>
      </div>
      <Field label="Tanggal Kadaluarsa (Expired)" required>
        <input name="masa_berlaku" type="date" value={formData.masa_berlaku} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Lokasi (Kota)" required>
          <input name="lokasi" value={formData.lokasi} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" />
        </Field>
        <Field label="Keterangan Utilisasi">
          <input name="keterangan_utilisasi" value={formData.keterangan_utilisasi} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" />
        </Field>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-semibold" onClick={onCancel}>
          Batal
        </button>
        <button type="submit" className="px-4 py-2 rounded bg-blue-900 text-white font-semibold">
          Simpan
        </button>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}