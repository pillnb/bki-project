import React from "react";
import { formatDate } from "./utils";
import type { DataDiri } from "./types";

export default function DataDiriCard({ data }: { data: DataDiri }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h3 className="text-lg font-bold text-blue-900 mb-4">Data Diri</h3>
      {data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Info label="NUP" value={data.nup || "-"} />
          <Info label="Status/Jabatan Pegawai" value={data.status_pegawai || data.jabatan || "-"} />
          <Info label="Nama Lengkap" value={data.nama_pegawai || "-"} />
          <Info label="Email" value={data.email || "-"} />
          <Info label="Tempat Lahir" value={data.tempat_lahir || "-"} />
          <Info label="Tanggal Lahir" value={formatDate(data.tanggal_lahir)} />
          <Info label="Agama" value={data.agama || "-"} />
          <Info label="Kewarganegaraan" value={data.warga_negara || "-"} />
        </div>
      ) : (
        <div className="text-gray-500">Tidak ada data diri.</div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{value}</div>
    </div>
  );
}