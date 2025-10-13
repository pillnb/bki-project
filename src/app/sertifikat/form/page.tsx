// app/sertifikat/form/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  KOMPETENSI_OPTIONS,
  PASAR_OPTIONS,
  KODE_PRODUKSI_M,
  KODE_PRODUKSI_E,
  KODE_E_MULTIPAGE,
  KODE_PRODUKSI_M_OPTIONS,
  KODE_PRODUKSI_E_OPTIONS,
} from "@/lib/constants/sertifikatConstants";

export default function SertifikatFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nomorKontrak: "",
    kompetensi: "",
    pasar: "",
    kodeProduksiM: "",
    kodeProduksiE: "",
    jumlahHalaman: "",
    linkLaporan: "",
  });

  const [pengaju, setPengaju] = useState<{ nup: string; nama_pegawai: string; jabatan?: string | null; email?: string | null } | null>(null);

  useEffect(() => {
    // fetch current pengaju info
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/sertifikat/me');
        if (!res.ok) return;
        const j = await res.json();
        if (mounted && j.data) setPengaju(j.data);
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false };
  }, []);

  // Show halaman field jika pilih kode E tertentu
  const showHalamanField =
    formData.kodeProduksiE && KODE_E_MULTIPAGE.includes(formData.kodeProduksiE);

  // Reset kode M jika pilih kode E, dan sebaliknya
  useEffect(() => {
    if (formData.kodeProduksiM && formData.kodeProduksiE) {
      setFormData((prev) => ({ ...prev, kodeProduksiM: "" }));
    }
  }, [formData.kodeProduksiE]);

  useEffect(() => {
    if (formData.kodeProduksiE && formData.kodeProduksiM) {
      setFormData((prev) => ({ ...prev, kodeProduksiE: "" }));
    }
  }, [formData.kodeProduksiM]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        nomorKontrak: formData.nomorKontrak,
        kompetensi: formData.kompetensi,
        pasar: formData.pasar,
        kodeProduksiM: formData.kodeProduksiM || null,
        kodeProduksiE: formData.kodeProduksiE || null,
        jumlahHalaman: formData.jumlahHalaman
          ? parseInt(formData.jumlahHalaman)
          : null,
        linkLaporan: formData.linkLaporan,
      };

      console.log("Submitting payload:", payload); // Debug

      const res = await fetch("/api/sertifikat/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Tampilkan semua error dari validasi
        if (data.errors && Array.isArray(data.errors)) {
          setError(data.errors.join("\n"));
        } else {
          setError(data.error || "Submit gagal");
        }
        console.error("Validation errors:", data); // Debug
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/sertifikat/my-submissions");
      }, 2000);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Terjadi kesalahan koneksi");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Berhasil!</h2>
          <p className="text-gray-600">
            Pengajuan sertifikat berhasil disubmit
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {pengaju && (
          <div className="bg-white rounded-xl shadow p-4 mb-6 border border-blue-50">
            <div className="text-sm text-gray-600">Sedang login sebagai</div>
            <div className="flex items-center justify-between mt-2">
              <div>
                <div className="font-semibold text-black">{pengaju.nama_pegawai}</div>
                <div className="text-xs text-gray-500">{pengaju.nup} • {pengaju.jabatan}</div>
                <div className="text-xs text-gray-500">{pengaju.email}</div>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Form Pengajuan Sertifikat
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nomor Kontrak */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor PO/WO/SO/KONTRAK <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nomorKontrak}
                onChange={(e) =>
                  setFormData({ ...formData, nomorKontrak: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                required
                disabled={loading}
                />
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kompetensi <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.kompetensi}
                onChange={(e) =>
                  setFormData({ ...formData, kompetensi: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                required
                disabled={loading}
              >
                <option value="">Pilih Kompetensi</option>
                {KOMPETENSI_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Pasar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pasar <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.pasar}
                onChange={(e) =>
                  setFormData({ ...formData, pasar: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                required
                disabled={loading}
              >
                <option value="">Pilih Pasar</option>
                {PASAR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Kode Produksi M */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Produksi (M)
              </label>
              <select
                value={formData.kodeProduksiM}
                onChange={(e) =>
                  setFormData({ ...formData, kodeProduksiM: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                disabled={loading || !!formData.kodeProduksiE}
              >
                <option value="">Pilih Kode Produksi M</option>
                {KODE_PRODUKSI_M_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Kode Produksi E */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Produksi (E)
              </label>
              <select
                value={formData.kodeProduksiE}
                onChange={(e) =>
                  setFormData({ ...formData, kodeProduksiE: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                disabled={loading || !!formData.kodeProduksiM}
              >
                <option value="">Pilih Kode Produksi E</option>
                {KODE_PRODUKSI_E_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Jumlah Halaman (conditional) */}
            {showHalamanField && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Halaman <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={formData.jumlahHalaman}
                  onChange={(e) =>
                    setFormData({ ...formData, jumlahHalaman: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  required
                  disabled={loading}
                  placeholder="Masukkan jumlah halaman (1-200)"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Kode produksi {formData.kodeProduksiE} memerlukan jumlah
                  halaman
                </p>
              </div>
            )}

            {/* Link Laporan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link Laporan Inspeksi <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.linkLaporan}
                onChange={(e) =>
                  setFormData({ ...formData, linkLaporan: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                required
                disabled={loading}
                placeholder="https://drive.google.com/..."
              />
              <p className="text-xs text-gray-600 mt-1">
                Link Google Drive atau Google Docs
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-semibold mb-1">Error Validasi:</p>
                <div className="text-sm whitespace-pre-line">{error}</div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push("/sertifikat/my-submissions")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition"
                disabled={loading}
              >
                Lihat Pengajuan Saya
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Mengirim..." : "Submit Pengajuan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}