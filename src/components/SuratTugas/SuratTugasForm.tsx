"use client";

import React, { useEffect, useState } from "react";

import { PlusCircle, Trash2 } from 'lucide-react';

import {
  InspectorRow,
  Pegawai,
} from "./types";

export default function SuratTugasForm({
  onSubmitted,
}: {
  onSubmitted: () => void;
}) {
  const [allPegawai, setAllPegawai] = useState<Pegawai[]>([]);
  const [formData, setFormData] = useState<{
    klien: string;
    pekerjaan: string;
    status_pekerjaan: string;
    no_service_order: string;
    spi: string;
    wbs: string;
    bidang_pekerjaan: string;
    peralatan_inspeksi: string[];
    peralatan_sewa: string;
    kebutuhan_material: string[];
    lokasi_pekerjaan: string[];
    tanggal_berangkat: string;
    tanggal_kembali: string;
    transportasi_operasional: boolean;
    transportasi_ditanggung_klien: boolean;
    transportasi_asal_tujuan: boolean;
    transportasi_dinas: boolean;
    tiket: boolean;
    penginapan: boolean;
    leadInspector: string;
  }>({
    klien: "",
    pekerjaan: "",
    status_pekerjaan: "",
    no_service_order: "",
    spi: "",
    wbs: "",
    bidang_pekerjaan: "",
    peralatan_inspeksi: [],
    peralatan_sewa: "",
    kebutuhan_material: [""],
    lokasi_pekerjaan: [""],
    tanggal_berangkat: "",
    tanggal_kembali: "",
    transportasi_operasional: false,
    transportasi_ditanggung_klien: false,
    transportasi_asal_tujuan: false,
    transportasi_dinas: false,
    tiket: false,
    penginapan: false,
    leadInspector: "",
  });
  const [inspectors, setInspectors] = useState<InspectorRow[]>([
    { id: 1, pegawaiNup: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/pegawai", { cache: "no-store" });
        const data = await res.json().catch(() => []);
        setAllPegawai(Array.isArray(data) ? data : []);
      } catch {
        setSubmitMessage("Error: Gagal memuat data pegawai.");
      }
    })();
  }, []);

  const getAvailablePegawai = (currentId: number) => {
    const selectedNups = inspectors
      .filter((i) => i.id !== currentId)
      .map((i) => i.pegawaiNup)
      .filter(Boolean);
    return allPegawai.filter((p) => !selectedNups.includes(p.nup));
  };

  const getAvailableLeadInspectors = () => {
    const selectedNups = inspectors.map((i) => i.pegawaiNup).filter(Boolean);
    return allPegawai.filter((p) => selectedNups.includes(p.nup));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleBidangChange = (val: string) =>
    setFormData((prev) => ({ ...prev, bidang_pekerjaan: val }));

  const handleArrayChange = (
    name: keyof typeof formData,
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev[name])
        ? ([...prev[name]] as string[])
        : [];
      arr[index] = value;
      return { ...prev, [name]: arr };
    });
  };

  const addArrayItem = (name: keyof typeof formData) =>
    setFormData((prev) => ({
      ...prev,
      [name]: [...((prev[name] as string[]) ?? []), ""],
    }));

  const removeArrayItem = (name: keyof typeof formData, index: number) =>
    setFormData((prev) => ({
      ...prev,
      [name]: ((prev[name] as string[]) ?? []).filter((_, i) => i !== index),
    }));

  const addInspector = () => {
    const newId = Math.max(...inspectors.map((i) => i.id), 0) + 1;
    setInspectors((prev) => [...prev, { id: newId, pegawaiNup: "" }]);
  };

  const removeInspector = (id: number) => {
    if (inspectors.length <= 1) return;
    setInspectors((prev) => prev.filter((i) => i.id !== id));
    const removed = inspectors.find((i) => i.id === id);
    if (removed && formData.leadInspector === removed.pegawaiNup) {
      setFormData((prev) => ({ ...prev, leadInspector: "" }));
    }
  };

  const updateInspector = (id: number, pegawaiNup: string) => {
    setInspectors((prev) =>
      prev.map((i) => (i.id === id ? { ...i, pegawaiNup } : i))
    );
    if (formData.leadInspector && formData.leadInspector === pegawaiNup) {
      setFormData((prev) => ({ ...prev, leadInspector: "" }));
    }
  };

  const handlePeralatanChange = (checked: boolean, item: string) => {
    setFormData((prev) => ({
      ...prev,
      peralatan_inspeksi: checked
        ? [...prev.peralatan_inspeksi, item]
        : prev.peralatan_inspeksi.filter((p) => p !== item),
    }));
  };

  const validateForm = () => {
    if (!formData.klien || !formData.pekerjaan || !formData.tanggal_berangkat) {
      setSubmitMessage("Error: Harap isi semua field yang wajib.");
      return false;
    }
    const selectedInspectors = inspectors.filter((i) => i.pegawaiNup);
    if (selectedInspectors.length === 0) {
      setSubmitMessage("Error: Pilih minimal satu inspektor.");
      return false;
    }
    if (!formData.leadInspector) {
      setSubmitMessage("Error: Pilih lead inspector dari tim inspektor.");
      return false;
    }
    const selectedNups = selectedInspectors.map((i) => i.pegawaiNup);
    if (!selectedNups.includes(formData.leadInspector)) {
      setSubmitMessage(
        "Error: Lead inspector harus merupakan bagian dari tim inspektor."
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const selectedInspectors = inspectors.filter((i) => i.pegawaiNup);
      const payload = {
        ...formData,
        pegawaiNupList: selectedInspectors.map((i) => i.pegawaiNup),
        kebutuhan_material: (formData.kebutuhan_material ?? []).filter(
          Boolean
        ),
        lokasi_pekerjaan: (formData.lokasi_pekerjaan ?? []).filter(Boolean),
      };

      const res = await fetch("/api/surat-tugas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Gagal membuat surat tugas");
      }

      setSubmitMessage("Surat tugas berhasil diajukan!");

      // reset
      setFormData({
        klien: "",
        pekerjaan: "",
        status_pekerjaan: "",
        no_service_order: "",
        spi: "",
        wbs: "",
        bidang_pekerjaan: "",
        peralatan_inspeksi: [],
        peralatan_sewa: "",
        kebutuhan_material: [""],
        lokasi_pekerjaan: [""],
        tanggal_berangkat: "",
        tanggal_kembali: "",
        transportasi_operasional: false,
        transportasi_ditanggung_klien: false,
        transportasi_asal_tujuan: false,
        transportasi_dinas: false,
        tiket: false,
        penginapan: false,
        leadInspector: "",
      });
      setInspectors([{ id: 1, pegawaiNup: "" }]);
      onSubmitted();
    } catch (e) {
      setSubmitMessage(
        `Error: ${e instanceof Error ? e.message : "Terjadi kesalahan"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusPekerjaanOptions = [
    { value: "belum_mulai", label: "Belum Mulai" },
    { value: "berjalan", label: "Berjalan" },
    { value: "telah_selesai", label: "Telah Selesai" },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Klien */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Klien <span className="text-red-500">*</span>
          </label>
          <input
            name="klien"
            value={formData.klien}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="Nama klien"
            required
          />
        </div>

        {/* Status Pekerjaan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status Pekerjaan <span className="text-red-500">*</span>
          </label>
          <select
            name="status_pekerjaan"
            value={formData.status_pekerjaan}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            required
          >
            <option value="">Pilih status pekerjaan</option>
            {statusPekerjaanOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pekerjaan */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pekerjaan <span className="text-red-500">*</span>
          </label>
          <textarea
            name="pekerjaan"
            value={formData.pekerjaan}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="Deskripsi pekerjaan"
            required
          />
        </div>

        {/* No SO / SPI / WBS */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No. Service Order
              </label>
              <div className="flex">
                <span className="text-black bg-gray-100 border border-gray-300 rounded-l px-2 py-2 select-none whitespace-nowrap">
                  100-00
                </span>
                <input
                  name="no_service_order"
                  value={formData.no_service_order}
                  onChange={handleChange}
                  className="flex-1 border-b-2 border-gray-300 p-2 focus:border-blue-500 outline-none text-black rounded-r"
                  placeholder="Nomor service order"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SPI
              </label>
              <input
                name="spi"
                value={formData.spi}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                placeholder="SPI"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WBS
              </label>
              <input
                name="wbs"
                value={formData.wbs}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                placeholder="WBS"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bidang */}
      <div className="border-t border-b border-gray-300 py-6 mt-6">
        <h3 className="font-semibold text-black mb-2">
          Bidang Pekerjaan <span className="text-red-600">*</span>
        </h3>
        <div className="flex gap-6">
          {["Energi", "Industri", "Marine"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-black">
              <input
                type="radio"
                name="bidang_pekerjaan"
                checked={formData.bidang_pekerjaan === opt}
                onChange={() => handleBidangChange(opt)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* Peralatan Inspeksi */}
      <div className="border-b border-gray-300 py-6">
        <h3 className="font-semibold text-black mb-2">
          Peralatan Inspeksi <span className="text-red-600">*</span>
        </h3>
        <div className="flex gap-6 flex-wrap">
          {["Cabang lokal", "Pinjam cabang lain", "Sewa pihak ke-3"].map(
            (opt) => (
              <label key={opt} className="flex items-center gap-2 text-black">
                <input
                  type="checkbox"
                  checked={formData.peralatan_inspeksi.includes(opt)}
                  onChange={(e) => handlePeralatanChange(e.target.checked, opt)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                {opt}
              </label>
            )
          )}
          {formData.peralatan_inspeksi.includes("Sewa pihak ke-3") && (
            <input
              name="peralatan_sewa"
              value={formData.peralatan_sewa || ""}
              onChange={handleChange}
              placeholder="Nama vendor sewa..."
              className="border border-gray-300 p-2 rounded ml-4 text-black"
            />
          )}
        </div>
      </div>

      {/* Kebutuhan Material */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kebutuhan Peralatan/Material
        </label>
        {formData.kebutuhan_material.map((item, i) => (
          <div key={`km-${i}`} className="flex items-center space-x-2 mb-2">
            <input
              value={item}
              onChange={(e) =>
                handleArrayChange("kebutuhan_material", i, e.target.value)
              }
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder={`Peralatan/Material ${i + 1}`}
            />
            {formData.kebutuhan_material.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem("kebutuhan_material", i)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("kebutuhan_material")}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <PlusCircle size={18} />
          <span>Tambah Material</span>
        </button>
      </div>

      {/* Lokasi Pekerjaan */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lokasi Pekerjaan
        </label>
        {formData.lokasi_pekerjaan.map((item, i) => (
          <div key={`lok-${i}`} className="flex items-center space-x-2 mb-2">
            <input
              value={item}
              onChange={(e) =>
                handleArrayChange("lokasi_pekerjaan", i, e.target.value)
              }
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder={`Lokasi ${i + 1}`}
            />
            {formData.lokasi_pekerjaan.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem("lokasi_pekerjaan", i)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("lokasi_pekerjaan")}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <PlusCircle size={18} />
          <span>Tambah Lokasi</span>
        </button>
      </div>

      {/* Tim Inspektor */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tim Inspektor <span className="text-red-500">*</span>
        </label>
        {inspectors.map((inspector) => (
          <div key={inspector.id} className="flex items-center space-x-2 mb-3">
            <select
              value={inspector.pegawaiNup}
              onChange={(e) => updateInspector(inspector.id, e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="">Pilih Inspektor</option>
              {getAvailablePegawai(inspector.id).map((p) => (
                <option key={p.nup} value={p.nup}>
                  {p.nama_pegawai} ({p.nup})
                </option>
              ))}
            </select>
            {inspectors.length > 1 && (
              <button
                type="button"
                onClick={() => removeInspector(inspector.id)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addInspector}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <PlusCircle size={18} />
          <span>Tambah Inspektor</span>
        </button>
      </div>

      {/* Lead Inspector */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lead Inspector <span className="text-red-500">*</span>
        </label>
        <select
          name="leadInspector"
          value={formData.leadInspector}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          required
        >
          <option value="">Pilih Lead Inspector dari Tim</option>
          {getAvailableLeadInspectors().map((p) => (
            <option key={p.nup} value={p.nup}>
              {p.nama_pegawai} ({p.nup})
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Lead inspector harus dipilih dari anggota tim inspektor yang sudah
          ditambahkan di atas.
        </p>
      </div>

      {/* Tanggal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal Berangkat <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="tanggal_berangkat"
            value={formData.tanggal_berangkat}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal Kembali
          </label>
          <input
            type="date"
            name="tanggal_kembali"
            value={formData.tanggal_kembali}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
          <p className="text-xs text-gray-500 mt-1">
            Kosongkan jika belum pasti. Bisa diupdate nanti saat menyelesaikan
            tugas.
          </p>
        </div>
      </div>

      {/* Transportasi & Akomodasi */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Transportasi & Akomodasi
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {[
              ["transportasi_operasional", "Transportasi Operasional"],
              ["transportasi_ditanggung_klien", "Transportasi Ditanggung Klien"],
              ["transportasi_asal_tujuan", "Transportasi Asal-Tujuan"],
            ].map(([name, label]) => (
              <label key={name} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={name}
                  checked={(formData as Record<string, unknown>)[name] as boolean}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-black"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
          <div className="space-y-2">
            {[
              ["transportasi_dinas", "Transportasi Dinas"],
              ["tiket", "Tiket"],
              ["penginapan", "Penginapan"],
            ].map(([name, label]) => (
              <label key={name} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={name}
                  checked={(formData as Record<string, unknown>)[name] as boolean}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-black"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {submitMessage && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            submitMessage.startsWith("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {submitMessage}
        </div>
      )}

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Mengajukan..." : "Ajukan Surat Tugas"}
        </button>
      </div>
    </form>
  );
}