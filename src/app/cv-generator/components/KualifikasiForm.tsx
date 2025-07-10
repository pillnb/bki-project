"use client";
import React, { useState } from "react";

// Interface disesuaikan, 'status' tidak lagi diinput oleh user
interface KualifikasiFormProps {
  onSubmit: (data: {
    kualifikasi: string;
    penyelenggara: string;
    nomor_sertifikat: string;
    tanggal_awal: string;
    tanggal_akhir: string;
    masa_berlaku: string;
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
    keterangan_utilisasi: "",
    tahun: new Date().getFullYear().toString(),
    status_override: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked ? value : "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi hanya field wajib (keterangan_utilisasi tidak wajib)
    const requiredFields = [
      "kualifikasi",
      "penyelenggara",
      "nomor_sertifikat",
      "tanggal_awal",
      "tanggal_akhir",
      "masa_berlaku",
      "tahun",
    ];
    for (const key of requiredFields) {
      if (!formData[key as keyof typeof formData]) {
        alert(`Kolom '${key.replace(/_/g, ' ')}' tidak boleh kosong.`);
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
        <div>
          <label htmlFor="kualifikasi" className="block text-sm font-medium text-black mb-1">
            Nama Kualifikasi <span className="text-red-600">*</span>
          </label>
          <input id="kualifikasi" name="kualifikasi" value={formData.kualifikasi} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" required />
        </div>
        <div>
          <label htmlFor="penyelenggara" className="block text-sm font-medium text-black mb-1">
            Penyelenggara <span className="text-red-600">*</span>
          </label>
          <input id="penyelenggara" name="penyelenggara" value={formData.penyelenggara} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nomor_sertifikat" className="block text-sm font-medium text-black mb-1">
            Nomor Sertifikat <span className="text-red-600">*</span>
          </label>
          <input id="nomor_sertifikat" name="nomor_sertifikat" value={formData.nomor_sertifikat} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" required />
        </div>
        <div>
          <label htmlFor="tahun" className="block text-sm font-medium text-black mb-1">
            Tahun <span className="text-red-600">*</span>
          </label>
          <input id="tahun" name="tahun" type="number" value={formData.tahun} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tanggal_awal" className="block text-sm font-medium text-black mb-1">
            Tanggal Awal Pelatihan <span className="text-red-600">*</span>
          </label>
          <input id="tanggal_awal" name="tanggal_awal" type="date" value={formData.tanggal_awal} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" required />
        </div>
        <div>
          <label htmlFor="tanggal_akhir" className="block text-sm font-medium text-black mb-1">
            Tanggal Akhir Pelatihan <span className="text-red-600">*</span>
          </label>
          <input id="tanggal_akhir" name="tanggal_akhir" type="date" value={formData.tanggal_akhir} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" required />
        </div>
      </div>
      <div>
        <label htmlFor="masa_berlaku" className="block text-sm font-medium text-black mb-1">
          Tanggal Kadaluarsa (Expired) <span className="text-red-600">*</span>
        </label>
        <input id="masa_berlaku" name="masa_berlaku" type="date" value={formData.masa_berlaku} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" required />
      </div>
      <div>
        <label htmlFor="keterangan_utilisasi" className="block text-sm font-medium text-black mb-1">Keterangan Utilisasi</label>
        <input id="keterangan_utilisasi" name="keterangan_utilisasi" value={formData.keterangan_utilisasi} onChange={handleChange} className="w-full border rounded px-3 py-2 text-black" />
      </div>
      {/* Status Kualifikasi dihapus sesuai permintaan */}
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-semibold" onClick={onCancel}>Batal</button>
        <button type="submit" className="px-4 py-2 rounded bg-blue-900 text-white font-semibold">Simpan</button>
      </div>
    </form>
  );
}