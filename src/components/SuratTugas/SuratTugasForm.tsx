"use client";

import { toast } from 'sonner';
import React, { useEffect, useState, useMemo } from "react";
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  InspectorRow,
  Pegawai,
} from "./types";
import { daftarCabang } from "./utils";
import SearchableSelect from './SearchableSelect';
import type { ComboboxOption } from './SearchableSelect';

export default function SuratTugasForm({
  onSubmitted,
}: {
  onSubmitted: () => void;
}) {
  const [allPegawai, setAllPegawai] = useState<Pegawai[]>([]);
  const [pegawaiLoading, setPegawaiLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<{
    klien: string;
    pekerjaan: string;
    no_service_order: string;
    spi: string;
    wbs: string;
    bidang_pekerjaan: string;
    peralatan_inspeksi: string[];
    pihak_ketiga: string;
    cabang_pinjam: string;
    kebutuhan_material: string[];
    lokasi_pekerjaan: string;
    tanggal_berangkat: string;
    tanggal_kembali: string;
    transportasi_operasional: boolean;
    nomor_plat_kendaraan: string;
    transportasi_ditanggung_klien: boolean;
    transportasi_asal_tujuan: boolean;
    transportasi_dinas: boolean;
    tiket: boolean;
    penginapan: boolean;
    leadInspector: string;
  }>({
    klien: "",
    pekerjaan: "",
    no_service_order: "",
    spi: "",
    wbs: "",
    bidang_pekerjaan: "",
    peralatan_inspeksi: [],
    pihak_ketiga: "",
    cabang_pinjam: "",
    kebutuhan_material: [""],
    lokasi_pekerjaan: "",
    tanggal_berangkat: "",
    tanggal_kembali: "",
    transportasi_operasional: false,
    nomor_plat_kendaraan: "", 
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

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/pegawai", { cache: "no-store" });
        if (!res.ok) throw new Error("Gagal memuat data pegawai");
        const data: Pegawai[] = await res.json().catch(() => []);
        
        const allowedStatus = ["PKWT", "PKWTT", "KOMERBA"];
        const filteredPegawai = data.filter(p => p.status_pegawai && allowedStatus.includes(p.status_pegawai));
        
        setAllPegawai(Array.isArray(filteredPegawai) ? filteredPegawai : []);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Terjadi kesalahan server");
      } finally {
        setPegawaiLoading(false);
      }
    })();
  }, []);

  const pegawaiOptions: ComboboxOption[] = useMemo(() => {
    return allPegawai.map(p => ({
      value: p.nup,
      label: `${p.nama_pegawai} (${p.nup})`
    }));
  }, [allPegawai]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    
    setFormData((prev) => {
      const newState = {
        ...prev,
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
      };
  
      if (name === "transportasi_operasional" && !(e.target as HTMLInputElement).checked) {
        newState.nomor_plat_kendaraan = "";
      }
  
      return newState;
    });
  };

  const handleBidangChange = (val: string) =>
    setFormData((prev) => ({ ...prev, bidang_pekerjaan: val }));

  const handleArrayChange = (name: "kebutuhan_material", index: number, value: string) => {
    setFormData((prev) => {
      const newArr = [...prev[name]];
      newArr[index] = value;
      return { ...prev, [name]: newArr };
    });
  };

  const addArrayItem = (name: "kebutuhan_material") =>
    setFormData((prev) => ({
      ...prev,
      [name]: [...prev[name], ""],
    }));

  const removeArrayItem = (name: "kebutuhan_material", index: number) =>
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index),
    }));

  const addInspector = () => {
    const newId = (inspectors.length > 0 ? Math.max(...inspectors.map((i) => i.id)) : 0) + 1;
    setInspectors((prev) => [...prev, { id: newId, pegawaiNup: "" }]);
  };

  const removeInspector = (id: number) => {
    if (inspectors.length <= 1) return;
    const removed = inspectors.find((i) => i.id === id);
    setInspectors((prev) => prev.filter((i) => i.id !== id));
    if (removed && formData.leadInspector === removed.pegawaiNup) {
      setFormData((prev) => ({ ...prev, leadInspector: "" }));
    }
  };

  const updateInspector = (id: number, pegawaiNup: string) => {
    const oldNup = inspectors.find(i => i.id === id)?.pegawaiNup;
    setInspectors((prev) =>
      prev.map((i) => (i.id === id ? { ...i, pegawaiNup } : i))
    );
    if (formData.leadInspector && formData.leadInspector === oldNup) {
      setFormData((prev) => ({ ...prev, leadInspector: "" }));
    }
  };

  const handlePeralatanChange = (checked: boolean, item: string) => {
    setFormData((prev) => {
        const newPeralatanInspeksi = checked
            ? [...prev.peralatan_inspeksi, item]
            : prev.peralatan_inspeksi.filter((p) => p !== item);

        return {
            ...prev,
            peralatan_inspeksi: newPeralatanInspeksi,
            cabang_pinjam: newPeralatanInspeksi.includes("Pinjam cabang lain") ? prev.cabang_pinjam : "",
            pihak_ketiga: newPeralatanInspeksi.includes("Sewa pihak ke-3") ? prev.pihak_ketiga : "",
        };
    });
  };

  const validateForm = () => {
    if (!formData.klien || !formData.pekerjaan || !formData.tanggal_berangkat) {
      toast.error("Harap isi semua field yang wajib diisi (*).");
      return false;
    }
    const selectedInspectors = inspectors.filter((i) => i.pegawaiNup);
    if (selectedInspectors.length === 0) {
      toast.error("Pilih minimal satu inspektor.");
      return false;
    }
    if (!formData.leadInspector) {
      toast.error("Pilih lead inspector dari tim inspektor.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const selectedInspectors = inspectors.filter((i) => i.pegawaiNup);
      const { leadInspector, ...restOfFormData } = formData;

      const payload = {
        ...restOfFormData,
        leadInspectorNup: leadInspector,
        pegawaiNupList: selectedInspectors.map((i) => i.pegawaiNup),
        kebutuhan_material: formData.kebutuhan_material.filter(Boolean),
      };

      const res = await fetch("/api/surat-tugas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Gagal membuat surat tugas");
      }

      toast.success("Surat tugas berhasil diajukan!");
      onSubmitted();

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Terjadi kesalahan";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Klien */}
        <div className="md:col-span-2">
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
              <div className="md:col-span-3">
                <p className="text-xs italic text-gray-500">
                  *hanya perlu isi salah satu antara No. Service Order / SPI / WBS
                </p>
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
        </div>
        
        {formData.peralatan_inspeksi.includes("Pinjam cabang lain") && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Cabang</label>
            <select
              name="cabang_pinjam"
              value={formData.cabang_pinjam}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
            >
              <option value="">Pilih Cabang</option>
              {daftarCabang.map((cabang, index) => (
                <option key={index} value={`${cabang.tipe} - ${cabang.kota}`}>
                  {cabang.tipe} - {cabang.kota}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.peralatan_inspeksi.includes("Sewa pihak ke-3") && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Vendor</label>
            <input
              name="pihak_ketiga"
              value={formData.pihak_ketiga}
              onChange={handleChange}
              placeholder="Nama vendor sewa..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
            />
          </div>
        )}
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
          Lokasi Pekerjaan <span className="text-red-500">*</span>
        </label>
        <input
          name="lokasi_pekerjaan"
          value={formData.lokasi_pekerjaan}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          placeholder="Contoh: Balikpapan, Kalimantan Timur"
          required
        />
      </div>

      {/* Tim Inspektor */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tim Inspektor <span className="text-red-500">*</span>
        </label>
        {inspectors.map((inspector) => (
          <div key={inspector.id} className="flex items-center space-x-2 mb-3">
            <div className="flex-1">
              <SearchableSelect
                isLoading={pegawaiLoading}
                value={inspector.pegawaiNup}
                onChange={(value) => updateInspector(inspector.id, value)}
                options={pegawaiOptions.filter(p => 
                    !inspectors
                        .filter(i => i.id !== inspector.id)
                        .map(i => i.pegawaiNup)
                        .includes(p.value)
                )}
                placeholder="Ketik untuk mencari inspektor..."
              />
            </div>
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
        <SearchableSelect
          isLoading={pegawaiLoading}
          value={formData.leadInspector}
          onChange={(value) => setFormData(prev => ({ ...prev, leadInspector: value }))}
          options={pegawaiOptions.filter(p => 
              inspectors.map(i => i.pegawaiNup).includes(p.value)
          )}
          placeholder="Ketik untuk mencari Lead Inspector..."
        />
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
            Kosongkan jika belum pasti.
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
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="transportasi_operasional"
                checked={formData.transportasi_operasional}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-black"
              />
              <span className="text-sm text-gray-700">Transportasi Operasional</span>
            </label>

            {formData.transportasi_operasional && (
                <div className="pl-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Plat Kendaraan <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="nomor_plat_kendaraan"
                    value={formData.nomor_plat_kendaraan}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    placeholder="Contoh: B 1234 XYZ"
                    required
                />
                </div>
            )}            
            {[
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

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting || pegawaiLoading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Mengajukan..." : "Ajukan Surat Tugas"}
        </button>
      </div>
    </form>
  );
}