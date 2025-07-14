"use client";
import React, { useState } from "react";

interface PengalamanFormProps {
  onSubmit: (data: {
    pengalaman_kerja: string;
    perusahaan: string;
    tahun: number;
    lokasi: string;
  }) => void;
  onCancel: () => void;
}

export default function PengalamanForm({ onSubmit, onCancel }: PengalamanFormProps) {
  const [pengalaman, setPengalaman] = useState("");
  const [perusahaan, setPerusahaan] = useState("");
  const [tahun, setTahun] = useState("");
  const [lokasi, setLokasi] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault();
        if (!pengalaman || !perusahaan || !tahun || !lokasi) return;
        onSubmit({
          pengalaman_kerja: pengalaman,
          perusahaan,
          tahun: parseInt(tahun, 10),
          lokasi,
        });
      }}
    >
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Nama Pengalaman <span className="text-red-600">*</span>
        </label>
        <input
          className="w-full border rounded px-3 py-2 text-black"
          value={pengalaman}
          onChange={e => setPengalaman(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Perusahaan <span className="text-red-600">*</span>
        </label>
        <input
          className="w-full border rounded px-3 py-2 text-black"
          value={perusahaan}
          onChange={e => setPerusahaan(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Tahun <span className="text-red-600">*</span>
        </label>
        <input
          className="w-full border rounded px-3 py-2 text-black"
          type="number"
          value={tahun}
          onChange={e => setTahun(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Lokasi (Kota) <span className="text-red-600">*</span>
        </label>
        <input
          className="w-full border rounded px-3 py-2 text-black"
          value={lokasi}
          onChange={e => setLokasi(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-semibold" onClick={onCancel}>Batal</button>
        <button type="submit" className="px-4 py-2 rounded bg-blue-900 text-white font-semibold">Simpan</button>
      </div>
    </form>
  );
}