import React from "react";
import { formatDate } from "./utils";
import type { DataDiri } from "./types";

export default function DataDiriCard({ data }: { data: DataDiri }) {
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState<DataDiri>(data);

  const handleEditClick = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setForm(data);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/cv-generator", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nup: form.nup, ...form }),
      });
      if (!res.ok) {
        alert("Gagal update data diri");
        return;
      }
      const updated = await res.json();
      setEditing(false);
      setForm(updated);
    } catch (err) {
      alert("Gagal update data diri");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-blue-900">Data Diri</h3>
        {!editing && (
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            onClick={handleEditClick}
          >
            Edit
          </button>
        )}
      </div>
      {data ? (
        editing ? (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <Field label="NUP">
              <input name="nup" value={form.nup || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" disabled />
            </Field>
            <Field label="Status/Jabatan Pegawai">
              <input name="status_pegawai" value={form.status_pegawai || form.jabatan || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </Field>
            <Field label="Nama Lengkap">
              <input name="nama_pegawai" value={form.nama_pegawai || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </Field>
            <Field label="Email">
              <input name="email" value={form.email || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </Field>
            <Field label="Tempat Lahir">
              <input name="tempat_lahir" value={form.tempat_lahir || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </Field>
            <Field label="Tanggal Lahir">
              <input
                name="tanggal_lahir"
                type="date"
                value={
                  form.tanggal_lahir
                    ? typeof form.tanggal_lahir === "string"
                      ? form.tanggal_lahir.slice(0, 10)
                      : form.tanggal_lahir instanceof Date
                        ? form.tanggal_lahir.toISOString().slice(0, 10)
                        : ""
                    : ""
                }
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              />
            </Field>
            <Field label="Agama">
              <input name="agama" value={form.agama || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </Field>
            <Field label="Kewarganegaraan">
              <input name="warga_negara" value={form.warga_negara || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </Field>
            <Field label="Jenjang Pendidikan">
              <input name="jenjang_pend" value={form.jenjang_pend || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </Field>
            <Field label="Pendidikan">
              <input name="pendidikan" value={form.pendidikan || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </Field>
            <Field label="Tahun Pendidikan">
              <input name="tahun_pend" type="number" value={form.tahun_pend != null ? form.tahun_pend : ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
            </Field>
            <div className="col-span-2 flex justify-end gap-2 mt-4">
              <button type="button" className="px-4 py-2 text-gray-600 border border-gray-300 rounded" onClick={handleCancel}>Batal</button>
              <button type="submit" className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800">Simpan</button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Info label="NUP" value={data.nup || "-"} />
            <Info label="Status/Jabatan Pegawai" value={data.status_pegawai || data.jabatan || "-"} />
            <Info label="Nama Lengkap" value={data.nama_pegawai || "-"} />
            <Info label="Email" value={data.email || "-"} />
            <Info label="Tempat Lahir" value={data.tempat_lahir || "-"} />
            <Info label="Tanggal Lahir" value={formatDate(data.tanggal_lahir)} />
            <Info label="Agama" value={data.agama || "-"} />
            <Info label="Kewarganegaraan" value={data.warga_negara || "-"} />
            <Info label="Jenjang Pendidikan" value={data.jenjang_pend || "-"} />
            <Info label="Pendidikan" value={data.pendidikan || "-"} />
            <Info label="Tahun Pendidikan" value={data.tahun_pend != null ? data.tahun_pend : "-"} />
          </div>
        )
      ) : (
        <div className="text-gray-500">Tidak ada data diri.</div>
      )}
    </div>
  );
}


function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      {children}
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