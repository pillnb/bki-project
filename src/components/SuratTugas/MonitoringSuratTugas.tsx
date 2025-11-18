"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, FileText } from "lucide-react";

import SuratCard from "./SuratCard";
import ProgressTracker from "./ProgressTracker";

import type { SuratTugasItem, StatusSuratTugas } from "./types";
import {
  safeStr,
  getLeadInspectorNup,
  getInspectorNameByNup,
  formatDateId,
} from "./helpers";

// ================== KOMPONEN UTAMA ==================
export default function MonitoringSuratTugas() {
  // data
  const [suratTugasList, setSuratTugasList] = useState<SuratTugasItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // user session
  const [currentUserNup, setCurrentUserNup] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // download state
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadType, setDownloadType] = useState<"pdf" | "docx" | null>(null);

  // detail modal state
  const [selectedSurat, setSelectedSurat] = useState<SuratTugasItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // edit tanggal di modal
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [editDates, setEditDates] = useState({ tanggal_berangkat: "", tanggal_kembali: "" });
  const [isSavingDates, setIsSavingDates] = useState(false);

  // ------------------ fetchers ------------------
  const fetchSuratTugasList = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/surat-tugas");
      const data = await res.json().catch(() => []);
      let list: SuratTugasItem[] = [];
      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data?.data)) list = data.data;

      setSuratTugasList(list);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data surat tugas");
      setSuratTugasList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("api/me");
      if (!res.ok) return;
      const me = await res.json();
      setCurrentUserNup((me?.nup as string) ?? null);
      setCurrentUserId(typeof me?.id === "number" ? me.id : null);
    } catch (e) {
      console.error("Error fetching current user:", e);
    }
  };

  useEffect(() => {
    fetchSuratTugasList();
    fetchCurrentUser();
  }, []);

  // ------------------ download handlers ------------------
  const handleDownloadPDF = async (id: string, filename?: string) => {
    if (downloadingId) {
      toast.warning("Download sedang berlangsung, sabar.");
      return;
    }
    setDownloadingId(id);
    setDownloadType("pdf");
    try {
      const res = await fetch(`/api/surat-tugas/${id}/download/pdf`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `Draft Surat Tugas - ${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("PDF berhasil diunduh");
    } catch (e) {
      console.error(e);
      toast.error("Gagal mengunduh PDF");
    } finally {
      setDownloadingId(null);
      setDownloadType(null);
    }
  };

  const handleDownloadDocx = async (id: string, filename?: string) => {
    if (downloadingId) {
      toast.warning("Download sedang berlangsung, sabar.");
      return;
    }
    setDownloadingId(id);
    setDownloadType("docx");
    try {
      const res = await fetch(`/api/surat-tugas/${id}/download`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `surat-tugas-${id}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("DOCX berhasil diunduh");
    } catch (e) {
      console.error(e);
      toast.error("Gagal mengunduh DOCX");
    } finally {
      setDownloadingId(null);
      setDownloadType(null);
    }
  };

  // ------------------ jadwal edit (modal) ------------------
  const canExtendDates = (_: SuratTugasItem): boolean => true;

  const handleStartEditDates = () => {
    if (!selectedSurat) return;
    const toInput = (s: string | null | undefined) => {
      if (!s) return "";
      const d = new Date(s);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split("T")[0];
    };
    setEditDates({
      tanggal_berangkat: toInput(selectedSurat.tanggal_berangkat),
      tanggal_kembali: toInput(selectedSurat.tanggal_kembali),
    });
    setIsEditingDates(true);
  };

  const handleCancelEditDates = () => {
    setIsEditingDates(false);
    setEditDates({ tanggal_berangkat: "", tanggal_kembali: "" });
  };

  const handleSaveDates = async () => {
    if (!selectedSurat) return;
    if (!editDates.tanggal_berangkat) {
      toast.error("Tanggal berangkat harus diisi");
      return;
    }
    if (editDates.tanggal_kembali && editDates.tanggal_berangkat > editDates.tanggal_kembali) {
      toast.error("Tanggal kembali tidak boleh lebih awal dari tanggal berangkat");
      return;
    }
    setIsSavingDates(true);
    try {
      const res = await fetch(`/api/surat-tugas/${selectedSurat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tanggal_berangkat: editDates.tanggal_berangkat,
          tanggal_kembali: editDates.tanggal_kembali || null,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || `HTTP ${res.status}`);
      }
      const updated = (await res.json()) as Partial<SuratTugasItem>;

      // update list + selected
      setSuratTugasList((prev) => prev.map((s) => (s.id === selectedSurat.id ? { ...s, ...updated } : s)));
      setSelectedSurat((prev) => (prev ? { ...prev, ...updated } : null));

      setIsEditingDates(false);
      toast.success("Jadwal berhasil diperbarui");
    } catch (e) {
      console.error(e);
      toast.error("Gagal memperbarui jadwal");
    } finally {
      setIsSavingDates(false);
    }
  };

  // ------------------ UI utama ------------------
  return (
    <div className="mt-8 border-t border-gray-300 pt-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4" />
          <p className="text-gray-600">Memuat data surat tugas...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {suratTugasList.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Surat Tugas</h3>
              <p className="text-gray-600">Belum ada permohonan surat tugas yang diajukan</p>
            </div>
          ) : (
            suratTugasList.map((surat) => (
              <SuratCard
                key={surat.id}
                surat={surat}
                currentUserNup={currentUserNup || ""}
                onOpenDetail={(s) => {
                  setSelectedSurat(s);
                  setShowDetail(true);
                }}
                onDownloadPDF={(id) => handleDownloadPDF(id)}
                onDownloadDocx={(id) => handleDownloadDocx(id)}
                isDownloading={downloadingId === surat.id}
                downloadType={downloadType}
                onApproved={async (id) => {
                  try {
                    // BE endpoint
                    const res = await fetch(`/api/surat-tugas/${id}/approve`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ actorNup: currentUserNup }),
                    });
                    if (!res.ok) throw new Error("Approve gagal");
                    toast.success("Surat disetujui");
                    fetchSuratTugasList(); // refresh list
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Approve gagal");
                  }
                }}
              />
            ))
          )}
        </div>
      )}

      {/* ================== MODAL DETAIL ================== */}
      {showDetail && selectedSurat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* header */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Detail Surat Tugas</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {safeStr(selectedSurat.proyek?.klien || selectedSurat.klien, "Klien tidak tersedia")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDetail(false);
                    setIsEditingDates(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-50 rounded-full p-2"
                  aria-label="Tutup"
                >
                  <span className="text-2xl font-bold">&times;</span>
                </button>
              </div>
            </div>

            {/* content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Informasi Dasar */}
                <Section title="Informasi Dasar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Klien">
                      {safeStr(selectedSurat.proyek?.klien || selectedSurat.klien, "-")}
                    </Field>
                    <Field label="Status">
                      <InlineStatus status={selectedSurat.status} />
                    </Field>
                    <Field label="Pekerjaan">
                      {safeStr(selectedSurat.proyek?.namaProyek || selectedSurat.pekerjaan, "-")}
                    </Field>
                    <Field label="Lokasi Pekerjaan">
                      {safeStr(selectedSurat.proyek?.lokasi, "-")}
                    </Field>
                  </div>
                </Section>

                {/* Nomor Identifikasi */}
                {(selectedSurat.no_service_order || selectedSurat.spi || selectedSurat.wbs) && (
                  <Section title="Nomor Identifikasi">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {safeStr(selectedSurat.no_service_order) && (
                        <Field label="Nomor Service Order">{safeStr(selectedSurat.no_service_order)}</Field>
                      )}
                      {safeStr(selectedSurat.spi) && <Field label="SPI">{safeStr(selectedSurat.spi)}</Field>}
                      {safeStr(selectedSurat.wbs) && <Field label="WBS">{safeStr(selectedSurat.wbs)}</Field>}
                    </div>
                  </Section>
                )}

                {/* Bidang Pekerjaan */}
                {safeStr(selectedSurat.bidang_pekerjaan) && (
                  <Section title="Bidang Pekerjaan">
                    <span className={badgeByBidang(selectedSurat.bidang_pekerjaan || "")}>
                      {safeStr(selectedSurat.bidang_pekerjaan)}
                    </span>
                  </Section>
                )}

                {/* Peralatan Inspeksi */}
                {Array.isArray(selectedSurat.peralatan_inspeksi) &&
                  selectedSurat.peralatan_inspeksi.length > 0 && (
                    <Section title="Peralatan Inspeksi">
                      <ul className="list-disc list-inside space-y-1">
                        {selectedSurat.peralatan_inspeksi.map((x, i) => (
                          <li key={i} className="text-sm text-gray-900">
                            {safeStr(x, "-")}
                          </li>
                        ))}
                      </ul>
                    </Section>
                  )}

                {/* Kebutuhan Material */}
                {Array.isArray(selectedSurat.kebutuhan_material) &&
                  selectedSurat.kebutuhan_material.length > 0 && (
                    <Section title="Kebutuhan Material">
                      <ul className="list-disc list-inside space-y-1">
                        {selectedSurat.kebutuhan_material.map((m, i) => (
                          <li key={i} className="text-sm text-gray-900">
                            {safeStr(m, "-")}
                          </li>
                        ))}
                      </ul>
                    </Section>
                  )}

                {/* Jadwal + edit */}
                <Section
                  title={
                    <div className="flex items-center justify-between">
                      <span>Jadwal Pekerjaan</span>
                      {canExtendDates(selectedSurat) && !isEditingDates && (
                        <button
                          onClick={handleStartEditDates}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                          title="Update jadwal pekerjaan"
                        >
                          <Calendar size={16} />
                          Extend
                        </button>
                      )}
                    </div>
                  }
                >
                  {isEditingDates ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanggal Berangkat *
                          </label>
                          <input
                            type="date"
                            value={editDates.tanggal_berangkat}
                            onChange={(e) =>
                              setEditDates((p) => ({ ...p, tanggal_berangkat: e.target.value }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanggal Kembali
                          </label>
                          <input
                            type="date"
                            value={editDates.tanggal_kembali}
                            onChange={(e) =>
                              setEditDates((p) => ({ ...p, tanggal_kembali: e.target.value }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={handleSaveDates}
                          disabled={isSavingDates || !editDates.tanggal_berangkat}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          {isSavingDates ? "Menyimpan..." : "Simpan"}
                        </button>
                        <button
                          onClick={handleCancelEditDates}
                          disabled={isSavingDates}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                        >
                          Batal
                        </button>
                      </div>

                      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                        <p className="font-medium text-blue-700 mb-1">Tips:</p>
                        <ul className="space-y-1">
                          <li>• Tanggal berangkat wajib diisi</li>
                          <li>• Tanggal kembali tidak boleh lebih awal dari tanggal berangkat</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Tanggal Berangkat">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span>
                            {selectedSurat.tanggal_berangkat
                              ? formatDateId(selectedSurat.tanggal_berangkat)
                              : "-"}
                          </span>
                        </div>
                      </Field>
                      <Field label="Tanggal Kembali">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span>
                            {selectedSurat.tanggal_kembali
                              ? formatDateId(selectedSurat.tanggal_kembali)
                              : "Belum ditentukan"}
                          </span>
                        </div>
                      </Field>
                    </div>
                  )}
                </Section>

                {/* Progress visual */}
                <Section title="Status Progress">
                  <ProgressTracker status={selectedSurat.status} createdAt={selectedSurat.createdAt} />
                </Section>

                {/* Tim inspektor */}
                <Section title="Tim Inspektor">
                  <div className="space-y-3">
                    {Array.isArray(selectedSurat.timInspektor) && selectedSurat.timInspektor.length > 0 ? (
                      selectedSurat.timInspektor.map((insp, i) => {
                        const nama = insp?.nama_pegawai || "Nama tidak tersedia";
                        const nup = insp?.nup || "NUP tidak tersedia";
                        const isLead =
                          getLeadInspectorNup(selectedSurat.leadInspector) === insp?.nup;

                        return (
                          <div
                            key={`${nup}-${i}`}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {nama.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{nama}</p>
                                <p className="text-xs text-gray-500">NUP: {nup}</p>
                              </div>
                            </div>
                            {isLead && (
                              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full font-medium">
                                Lead Inspector
                              </span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M12 12a5 5 0 10-5-5a5 5 0 005 5m0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5"
                          />
                        </svg>
                        <p>Tidak ada tim inspektor.</p>
                      </div>
                    )}
                  </div>
                </Section>
              </div>
            </div>

            {/* footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Dibuat: {formatDateId(selectedSurat.createdAt)}</span>
                  {selectedSurat.nomor_surat && (
                    <>
                      <span>•</span>
                      <span>No. Surat: {selectedSurat.nomor_surat}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowDetail(false);
                      setIsEditingDates(false);
                    }}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Tutup
                  </button>

                  {/* tombol download versi detail */}
                  <button
                    onClick={() => handleDownloadPDF(selectedSurat.id)}
                    disabled={downloadingId === selectedSurat.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <FileText size={18} />
                    {downloadingId === selectedSurat.id && downloadType === "pdf"
                      ? "Downloading PDF..."
                      : "Download PDF"}
                  </button>

                  <button
                    onClick={() => handleDownloadDocx(selectedSurat.id)}
                    disabled={downloadingId === selectedSurat.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zm0 2.5L18.5 9H14z" />
                    </svg>
                    {downloadingId === selectedSurat.id && downloadType === "docx"
                      ? "Downloading DOCX..."
                      : "Download DOCX"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================== KOMponen KECIL (modal) ==================
function Section({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="text-md font-semibold text-gray-800 mb-3">{title}</h4>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 text-sm text-gray-900">{children}</div>
    </div>
  );
}

function InlineStatus({ status }: { status: StatusSuratTugas }) {
  const statusConfig: Record<StatusSuratTugas, { color: string; label: string }> = {
    DRAFT: { color: "bg-gray-100 text-gray-800", label: "Draft" },
    MENUNGGU_LEAD: { color: "bg-yellow-100 text-yellow-800", label: "Menunggu Approve Team Leader" },
    MENUNGGU_KOORDINATOR: { color: "bg-yellow-100 text-yellow-800", label: "Menunggu Approve Koordinator Bidang" },
    MENUNGGU_SM: { color: "bg-yellow-100 text-yellow-800", label: "Menunggu Approve SM" },
    MENUNGGU_KACAB: { color: "bg-yellow-100 text-yellow-800", label: "Menunggu Kacab" },
    DISETUJUI: { color: "bg-teal-100 text-teal-800", label: "Disetujui" },
    BERJALAN: { color: "bg-indigo-100 text-indigo-800", label: "Berjalan" },
    SELESAI: { color: "bg-green-100 text-green-800", label: "Selesai" },
    DITOLAK: { color: "bg-red-100 text-red-800", label: "Ditolak" },
  };
  const cfg = statusConfig[status];
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>{cfg.label}</span>;
}

function badgeByBidang(b: string) {
  if (b === "Energi") return "px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800";
  if (b === "Industri") return "px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800";
  if (b === "Marine") return "px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800";
  return "px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800";
}
