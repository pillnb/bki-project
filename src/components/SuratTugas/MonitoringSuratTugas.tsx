"use client";

import React, { useEffect, useState } from "react";
import ProgressTracker from "./ProgressTracker";
import UploadTandaTangan from "./UploadTandaTangan";
import { CheckCircle, Download, Eye, User, MapPin } from 'lucide-react';

import {
  SuratTugasItem,
  StatusSuratTugas,
} from "./types";
import {
  safeStr,
  getLeadInspectorNup,
  getInspectorNameByNup,
  formatDateId,
} from "./helpers";

export default function MonitoringSuratTugas() {
  const [suratTugasList, setSuratTugasList] = useState<SuratTugasItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<SuratTugasItem | null>(
    null
  );
  const [showDetail, setShowDetail] = useState(false);
  const [currentUserNup, setCurrentUserNup] = useState<string | null>(null);

  const fetchSuratTugasList = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/surat-tugas");
      const data = await res.json().catch(() => []);
      const list: unknown = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];
      setSuratTugasList((list as SuratTugasItem[]) ?? []);
    } catch {
      setSuratTugasList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return;
      const me = await res.json();
      setCurrentUserNup((me?.nup as string) ?? null);
    } catch {}
  };

  useEffect(() => {
    fetchSuratTugasList();
    fetchCurrentUser();
  }, []);

  const getStatusBadge = (status: StatusSuratTugas) => {
    const map: Record<StatusSuratTugas, { color: string; label: string }> = {
      DRAFT: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      MENUNGGU_LEAD: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Menunggu Approve Team Leader",
      },
      MENUNGGU_KOORDINATOR: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Menunggu Approve Koordinator Bidang",
      },
      MENUNGGU_SM: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Menunggu Approve SM",
      },
      MENUNGGU_KACAB: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Menunggu Kacab",
      },
      DISETUJUI: { color: "bg-teal-100 text-teal-800", label: "Disetujui" },
      BERJALAN: { color: "bg-indigo-100 text-indigo-800", label: "Berjalan" },
      SELESAI: { color: "bg-green-100 text-green-800", label: "Selesai" },
      DITOLAK: { color: "bg-red-100 text-red-800", label: "Ditolak" },
    };
    const cfg = map[status];
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}
      >
        {cfg.label}
      </span>
    );
  };

  const canDownload = (status: StatusSuratTugas) =>
    ["DISETUJUI", "BERJALAN", "SELESAI"].includes(status);

  const canDownloadDraft = (status: StatusSuratTugas) =>
    [
      "MENUNGGU_LEAD",
      "MENUNGGU_KOORDINATOR",
      "MENUNGGU_SM",
      "MENUNGGU_KACAB",
      "DISETUJUI",
      "BERJALAN",
      "SELESAI",
    ].includes(status);

  const isLeadInspector = (surat: SuratTugasItem) => {
    const nup = getLeadInspectorNup(surat.leadInspector);
    return !!currentUserNup && !!nup && currentUserNup === nup;
  };

  const canUploadSignature = (surat: SuratTugasItem) =>
    isLeadInspector(surat) &&
    [
      "MENUNGGU_LEAD",
      "MENUNGGU_KOORDINATOR",
      "MENUNGGU_SM",
      "MENUNGGU_KACAB",
      "DISETUJUI",
      "BERJALAN",
    ].includes(surat.status) &&
    !surat.ttd_lead_inspector;

  const handleDownloadPDF = async (id: string) => {
    try {
      const res = await fetch(`/api/surat-tugas/${id}/pdf`);
      if (!res.ok) throw new Error("download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `surat-tugas-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  const handleDownloadDraftPDF = async (id: string) => {
    try {
      const res = await fetch(`/api/surat-tugas/${id}/pdf-draft`);
      if (!res.ok) throw new Error("download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `draft-surat-tugas-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  return (
    <div className="mt-8 border-t border-gray-300 pt-8">
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
        </div>
      ) : (
        <div className="space-y-4">
          {suratTugasList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Belum ada permohonan surat tugas yang diajukan
            </div>
          ) : (
            suratTugasList.map((surat) => {
              const leadNup = getLeadInspectorNup(surat.leadInspector);
              const leadName = getInspectorNameByNup(
                leadNup,
                surat.timInspektor
              );
              const leadText = leadName || leadNup || "-";

              return (
                <div
                  key={surat.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {safeStr(surat.proyek?.klien || surat.klien, "-")}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {safeStr(
                          surat.proyek?.namaProyek || surat.pekerjaan,
                          "-"
                        )}
                      </p>
                      {surat.proyek?.lokasi && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                          <p className="text-xs text-gray-500">
                            {surat.proyek.lokasi}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Diajukan: {formatDateId(surat.createdAt)}
                      </p>
                      {safeStr(surat.nomor_surat) && (
                        <p className="text-xs text-gray-500 mt-1">
                          Nomor Surat: {safeStr(surat.nomor_surat)}
                        </p>
                      )}

                      {leadText !== "-" && (
                        <div className="flex items-center gap-1 mt-1">
                          <User size={12} className="text-blue-600" />
                          <p className="text-xs text-blue-600">
                            Lead Inspector: {leadText}
                          </p>
                        </div>
                      )}

                      {safeStr(surat.ttd_lead_inspector) && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle size={12} className="text-green-600" />
                          <p className="text-xs text-green-600">
                            Tanda tangan lead inspector sudah diupload
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(surat.status)}
                      <button
                        onClick={() => {
                          setSelectedSurat(surat);
                          setShowDetail(true);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="Lihat Detail"
                      >
                        <Eye size={16} />
                      </button>

                      {canDownloadDraft(surat.status) && (
                        <button
                          onClick={() => handleDownloadDraftPDF(surat.id)}
                          className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded"
                          title="Download PDF Draft"
                        >
                          <Download size={16} />
                        </button>
                      )}

                      {canDownload(surat.status) && (
                        <button
                          onClick={() => handleDownloadPDF(surat.id)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                          title="Download PDF Final"
                        >
                          <Download size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <ProgressTracker
                    status={surat.status}
                    createdAt={surat.createdAt}
                  />

                  <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                    <div>
                      Inspektor:{" "}
                      {surat.timInspektor?.length
                        ? surat.timInspektor
                            .map((i) => i.nama_pegawai || i.nup)
                            .join(", ")
                        : "Inspektor tidak tersedia"}
                    </div>
                    {surat.tanggal_berangkat && surat.tanggal_kembali && (
                      <div>
                        {formatDateId(surat.tanggal_berangkat)} -{" "}
                        {formatDateId(surat.tanggal_kembali)}
                      </div>
                    )}
                    {surat.tanggal_berangkat && !surat.tanggal_kembali && (
                      <div>
                        {formatDateId(surat.tanggal_berangkat)} - (belum
                        ditentukan)
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {showDetail && selectedSurat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detail Surat Tugas
                </h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Informasi Dasar */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                  Informasi Dasar
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Klien
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {safeStr(
                        selectedSurat.proyek?.klien || selectedSurat.klien,
                        "-"
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(selectedSurat.status)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pekerjaan
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {safeStr(
                        selectedSurat.proyek?.namaProyek ||
                          selectedSurat.pekerjaan,
                        "-"
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Lokasi Pekerjaan
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {safeStr(selectedSurat.proyek?.lokasi, "-")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nomor Identifikasi */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                  Nomor Identifikasi
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {safeStr(selectedSurat.no_service_order) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nomor Service Order
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {safeStr(selectedSurat.no_service_order)}
                      </p>
                    </div>
                  )}
                  {safeStr(selectedSurat.spi) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        SPI
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {safeStr(selectedSurat.spi)}
                      </p>
                    </div>
                  )}
                  {safeStr(selectedSurat.wbs) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        WBS
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {safeStr(selectedSurat.wbs)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bidang Pekerjaan */}
              {safeStr(selectedSurat.bidang_pekerjaan) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">
                    Bidang Pekerjaan
                  </h4>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedSurat.bidang_pekerjaan === "Energi"
                          ? "bg-blue-100 text-blue-800"
                          : selectedSurat.bidang_pekerjaan === "Industri"
                          ? "bg-green-100 text-green-800"
                          : selectedSurat.bidang_pekerjaan === "Marine"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {safeStr(selectedSurat.bidang_pekerjaan)}
                    </span>
                  </div>
                </div>
              )}

              {/* Peralatan Inspeksi */}
              {Array.isArray(selectedSurat.peralatan_inspeksi) &&
                selectedSurat.peralatan_inspeksi.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">
                      Peralatan Inspeksi
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedSurat.peralatan_inspeksi.map((peralatan, i) => (
                        <li key={i} className="text-sm text-gray-900">
                           {safeStr(peralatan, "-")}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Kebutuhan Material */}
              {Array.isArray(selectedSurat.kebutuhan_material) &&
                selectedSurat.kebutuhan_material.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">
                      Kebutuhan Material
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedSurat.kebutuhan_material.map((m, i) => (
                         <li key={i} className="text-sm text-gray-900">
                           {safeStr(m, "-")}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Jadwal */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                  Jadwal Pekerjaan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tanggal Berangkat
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedSurat.tanggal_berangkat
                        ? formatDateId(selectedSurat.tanggal_berangkat)
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tanggal Kembali
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedSurat.tanggal_kembali
                        ? formatDateId(selectedSurat.tanggal_kembali)
                        : "Belum ditentukan"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tim Inspektor */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                  Tim Inspektor
                </h4>
                <div className="space-y-3">
                  {Array.isArray(selectedSurat.timInspektor) &&
                  selectedSurat.timInspektor.length > 0 ? (
                    selectedSurat.timInspektor.map((insp, i) => {
                      const nama = insp?.nama_pegawai || "Nama tidak tersedia";
                      const nup = insp?.nup || "NUP tidak tersedia";
                      const isLead =
                        getLeadInspectorNup(selectedSurat.leadInspector) ===
                        insp?.nup;
                      return (
                        <div
                          key={`${nup}-${i}`}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-semibold">
                               {nama.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {nama}
                              </p>
                              <p className="text-xs text-gray-500">NUP: {nup}</p>
                            </div>
                          </div>
                          {isLead && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                              Lead Inspector
                            </span>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-500">Tidak ada tim inspektor.</div>
                  )}
                </div>
              </div>

              {/* Progress */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                  Status Progress
                </h4>
                <ProgressTracker
                  status={selectedSurat.status}
                  createdAt={selectedSurat.createdAt}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                {canDownloadDraft(selectedSurat.status) && (
                  <button
                    onClick={() => handleDownloadDraftPDF(selectedSurat.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Download size={16} />
                    Download Draft PDF
                  </button>
                )}
                {canDownload(selectedSurat.status) && (
                  <button
                    onClick={() => handleDownloadPDF(selectedSurat.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download size={16} />
                    Download Surat Tugas (PDF)
                  </button>
                )}
              </div>

              {canUploadSignature(selectedSurat) && (
                <div className="border-t border-gray-200 pt-4">
                  <UploadTandaTangan
                    suratId={selectedSurat.id}
                    onUploadSuccess={() => {
                      fetchSuratTugasList();
                      setShowDetail(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}