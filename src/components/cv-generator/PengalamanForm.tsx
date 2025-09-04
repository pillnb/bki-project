"use client";
import React, { useState } from "react";

interface PengalamanFormProps {
  onSubmit: (data: {
    pengalaman_kerja: string;
    perusahaan: string;
    tahun_awal: number;
    tahun_akhir: number;
    lokasi: string;
  }) => void;
  onCancel: () => void;
}

export default function PengalamanForm({ onSubmit, onCancel }: PengalamanFormProps) {
  const [pengalaman, setPengalaman] = useState("");
  const [perusahaan, setPerusahaan] = useState("");
  const [tahun, setTahun] = useState("");
  const [lokasi, setLokasi] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pengalaman || !perusahaan || !tahun || !lokasi) {
      alert("Semua kolom wajib diisi");
      return;
    }
    const tahunNum = parseInt(tahun, 10);
    onSubmit({
      pengalaman_kerja: pengalaman,
      perusahaan,
      tahun_awal: tahunNum,
      tahun_akhir: tahunNum,
      lokasi,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Field label="Nama Pengalaman" required>
        <input className="w-full border rounded px-3 py-2 text-black" value={pengalaman} onChange={e => setPengalaman(e.target.value)} />
      </Field>
      <Field label="Perusahaan" required>
        <input className="w-full border rounded px-3 py-2 text-black" value={perusahaan} onChange={e => setPerusahaan(e.target.value)} />
      </Field>
      <Field label="Tahun" required>
        <input className="w-full border rounded px-3 py-2 text-black" type="number" value={tahun} onChange={e => setTahun(e.target.value)} />
      </Field>
      <Field label="Lokasi (Kota)" required>
        <input className="w-full border rounded px-3 py-2 text-black" value={lokasi} onChange={e => setLokasi(e.target.value)} />
      </Field>

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