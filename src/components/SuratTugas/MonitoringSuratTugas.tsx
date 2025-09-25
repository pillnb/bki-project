"use client";

import React, { useEffect, useState } from "react";
import ProgressTracker from "./ProgressTracker";
import UploadTandaTangan from "./UploadTandaTangan";
import { CheckCircle, Eye, User, MapPin, FileText, File, Download, Edit2, Save, X, Calendar } from 'lucide-react';
import { toast } from "sonner";

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
  // ===== STATE MANAGEMENT =====
  const [suratTugasList, setSuratTugasList] = useState<SuratTugasItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<SuratTugasItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentUserNup, setCurrentUserNup] = useState<string | null>(null);
  
  // ===== DOWNLOAD STATE MANAGEMENT =====
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadType, setDownloadType] = useState<'pdf' | 'docx' | null>(null);

  // ===== NEW: EXTEND DATE STATE MANAGEMENT =====
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [editDates, setEditDates] = useState({
    tanggal_berangkat: '',
    tanggal_kembali: ''
  });
  const [isSavingDates, setIsSavingDates] = useState(false);

  // ===== DATA FETCHING FUNCTIONS =====
  const fetchSuratTugasList = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/surat-tugas");
      const data = await res.json().catch(() => []);
      
      // FIXED: Simplified nested ternary logic
      let list: SuratTugasItem[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data?.data)) {
        list = data.data;
      }
      
      setSuratTugasList(list);
    } catch (error) {
      console.error("Error fetching surat tugas:", error);
      setSuratTugasList([]);
      toast.error("Gagal memuat data surat tugas");
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
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    fetchSuratTugasList();
    fetchCurrentUser();
  }, []);

  // ===== NEW: EXTEND DATE FUNCTIONS =====
  const handleStartEditDates = () => {
    if (!selectedSurat) return;
    
    // Convert existing dates to YYYY-MM-DD format for input[type="date"]
    const formatDateForInput = (dateString: string | null | undefined) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      } catch {
        return '';
      }
    };
    
    setEditDates({
      tanggal_berangkat: formatDateForInput(selectedSurat.tanggal_berangkat),
      tanggal_kembali: formatDateForInput(selectedSurat.tanggal_kembali)
    });
    setIsEditingDates(true);
  };

  const handleCancelEditDates = () => {
    setIsEditingDates(false);
    setEditDates({
      tanggal_berangkat: '',
      tanggal_kembali: ''
    });
  };

  const handleSaveDates = async () => {
    if (!selectedSurat) return;

    // Validasi tanggal
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
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tanggal_berangkat: editDates.tanggal_berangkat,
          tanggal_kembali: editDates.tanggal_kembali || null
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const updatedSurat = await res.json();
      
      // Update state
      setSuratTugasList(prev => 
        prev.map(s => s.id === selectedSurat.id ? { ...s, ...updatedSurat } : s)
      );
      setSelectedSurat(prev => prev ? { ...prev, ...updatedSurat } : null);
      
      setIsEditingDates(false);
      toast.success("Jadwal berhasil diperbarui");
      
    } catch (error) {
      console.error("Error updating dates:", error);
      toast.error("Gagal memperbarui jadwal. Silakan coba lagi.");
    } finally {
      setIsSavingDates(false);
    }
  };

  // Helper function to check if user can extend dates
  const canExtendDates = (surat: SuratTugasItem): boolean => {
    // Allow extending for all statuses
    return true;
  };

  // ===== STATUS AND PERMISSION FUNCTIONS =====
  const getStatusBadge = (status: StatusSuratTugas) => {
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
    
    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const canDownload = (status: StatusSuratTugas): boolean => 
    true; // Allow download for all statuses

  const isLeadInspector = (surat: SuratTugasItem): boolean => {
    const nup = getLeadInspectorNup(surat.leadInspector);
    return !!currentUserNup && !!nup && currentUserNup === nup;
  };

  const canUploadSignature = (surat: SuratTugasItem): boolean =>
    isLeadInspector(surat) &&
    ["MENUNGGU_LEAD", "MENUNGGU_KOORDINATOR", "MENUNGGU_SM", "MENUNGGU_KACAB", "DISETUJUI", "BERJALAN"].includes(surat.status) &&
    !surat.ttd_lead_inspector;

  // ===== ENHANCED DOWNLOAD HANDLERS =====
  const handleDownloadPDF = async (id: string, filename?: string) => {
    if (downloadingId) {
      toast.warning("Download sedang berlangsung, mohon tunggu...");
      return;
    }

    setDownloadingId(id);
    setDownloadType('pdf');
    
    try {
      const res = await fetch(`/api/surat-tugas/${id}/download/pdf`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `Draft Surat Tugas - ${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Surat Tugas (PDF) berhasil diunduh");
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Gagal mengunduh Surat Tugas (PDF). Silakan coba lagi.");
    } finally {
      setDownloadingId(null);
      setDownloadType(null);
    }
  };

  const handleDownloadDocx = async (id: string, filename?: string) => {
    if (downloadingId) {
      toast.warning("Download sedang berlangsung, mohon tunggu...");
      return;
    }

    setDownloadingId(id);
    setDownloadType('docx');
    
    try {
      const res = await fetch(`/api/surat-tugas/${id}/download`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `surat-tugas-${id}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Surat Tugas (DOCX) berhasil diunduh");
    } catch (error) {
      console.error("DOCX download error:", error);
      toast.error("Gagal mengunduh Surat Tugas (DOCX). Silakan coba lagi.");
    } finally {
      setDownloadingId(null);
      setDownloadType(null);
    }
  };

  // ===== REUSABLE DOWNLOAD COMPONENT =====
  const DownloadButtons = ({ 
    surat, 
    variant = 'compact' 
  }: { 
    surat: SuratTugasItem; 
    variant?: 'compact' | 'detailed' 
  }) => {
    const isDownloading = downloadingId === surat.id;
    const baseButtonClass = "flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    
    if (variant === 'compact') {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleDownloadPDF(surat.id)}
            disabled={isDownloading}
            className={`${baseButtonClass} bg-red-50 text-red-700 hover:bg-red-100 text-sm`}
            title="Download PDF - Format untuk viewing dan printing"
            aria-label="Download Surat Tugas dalam format PDF"
          >
            <FileText size={16} className="text-red-600" />
            {isDownloading && downloadType === 'pdf' && (
              <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            )}
          </button>
          
          <button
            onClick={() => handleDownloadDocx(surat.id)}
            disabled={isDownloading}
            className={`${baseButtonClass} bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm`}
            title="Download DOCX - Format untuk editing"
            aria-label="Download Surat Tugas dalam format DOCX"
          >
            <File size={16} className="text-blue-600" />
            {isDownloading && downloadType === 'docx' && (
              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleDownloadPDF(surat.id)}
          disabled={isDownloading}
          className={`${baseButtonClass} bg-red-600 text-white hover:bg-red-700`}
        >
          <FileText size={18} />
          <span>
            {isDownloading && downloadType === 'pdf' 
              ? 'Downloading PDF...' 
              : 'Download PDF'
            }
          </span>
          {isDownloading && downloadType === 'pdf' && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
        </button>
        
        <button
          onClick={() => handleDownloadDocx(surat.id)}
          disabled={isDownloading}
          className={`${baseButtonClass} bg-blue-600 text-white hover:bg-blue-700`}
        >
          <File size={18} />
          <span>
            {isDownloading && downloadType === 'docx' 
              ? 'Downloading DOCX...' 
              : 'Download DOCX'
            }
          </span>
          {isDownloading && downloadType === 'docx' && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
        </button>
      </div>
    );
  };

  // ===== MAIN RENDER =====
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
            suratTugasList.map((surat) => {
              const leadNup = getLeadInspectorNup(surat.leadInspector);
              const leadName = getInspectorNameByNup(leadNup, surat.timInspektor);
              const leadText = leadName || leadNup || "-";

              return (
                <div
                  key={surat.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {safeStr(surat.proyek?.klien || surat.klien, "Klien tidak tersedia")}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {safeStr(surat.proyek?.namaProyek || surat.pekerjaan, "Pekerjaan tidak tersedia")}
                      </p>
                      
                      {surat.proyek?.lokasi && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                          <p className="text-xs text-gray-500 truncate">
                            {surat.proyek.lokasi}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Diajukan: {formatDateId(surat.createdAt)}</span>
                        {safeStr(surat.nomor_surat) && (
                          <span>Nomor: {safeStr(surat.nomor_surat)}</span>
                        )}
                      </div>

                      {leadText !== "-" && (
                        <div className="flex items-center gap-1 mt-2">
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

                    <div className="flex items-center gap-3 ml-4">
                      {getStatusBadge(surat.status)}
                      
                      <button
                        onClick={() => {
                          setSelectedSurat(surat);
                          setShowDetail(true);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                        aria-label="Lihat detail surat tugas"
                      >
                        <Eye size={16} />
                      </button>

                      <DownloadButtons surat={surat} variant="compact" />
                    </div>
                  </div>

                  <ProgressTracker
                    status={surat.status}
                    createdAt={surat.createdAt}
                  />

                  <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                    <div className="mb-1">
                      <span className="font-medium">Inspektor:</span>{" "}
                      {surat.timInspektor?.length
                        ? surat.timInspektor
                            .map((i) => i.nama_pegawai || i.nup)
                            .join(", ")
                        : "Inspektor tidak tersedia"}
                    </div>
                    
                    {(surat.tanggal_berangkat || surat.tanggal_kembali) && (
                      <div>
                        <span className="font-medium">Jadwal:</span>{" "}
                        {surat.tanggal_berangkat && surat.tanggal_kembali ? (
                          <>
                            {formatDateId(surat.tanggal_berangkat)} - {formatDateId(surat.tanggal_kembali)}
                          </>
                        ) : surat.tanggal_berangkat ? (
                          <>
                            {formatDateId(surat.tanggal_berangkat)} - (belum ditentukan)
                          </>
                        ) : (
                          "Belum dijadwalkan"
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ===== ENHANCED DETAIL MODAL =====  */}
      {showDetail && selectedSurat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Detail Surat Tugas
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {safeStr(selectedSurat.proyek?.klien || selectedSurat.klien, "Klien tidak tersedia")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDetail(false);
                    setIsEditingDates(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-full p-2 transition-colors"
                  aria-label="Tutup detail"
                >
                  <span className="text-2xl font-bold">&times;</span>
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
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
                        {safeStr(selectedSurat.proyek?.klien || selectedSurat.klien, "-")}
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
                        {safeStr(selectedSurat.proyek?.namaProyek || selectedSurat.pekerjaan, "-")}
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
                {(selectedSurat.no_service_order || selectedSurat.spi || selectedSurat.wbs) && (
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
                )}

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

                {/* ===== ENHANCED JADWAL SECTION WITH EXTEND FEATURE ===== */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-semibold text-gray-800">
                      Jadwal Pekerjaan
                    </h4>
                    {canExtendDates(selectedSurat) && !isEditingDates && (
                      <button
                        onClick={handleStartEditDates}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        title="Extend/Update jadwal pekerjaan"
                      >
                        <Calendar size={16} />
                        Extend
                      </button>
                    )}
                  </div>
                  
                  {isEditingDates ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanggal Berangkat *
                          </label>
                          <input
                            type="date"
                            value={editDates.tanggal_berangkat}
                            onChange={(e) => setEditDates(prev => ({
                              ...prev,
                              tanggal_berangkat: e.target.value
                            }))}
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
                            onChange={(e) => setEditDates(prev => ({
                              ...prev,
                              tanggal_kembali: e.target.value
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={handleSaveDates}
                          disabled={isSavingDates || !editDates.tanggal_berangkat}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Save size={16} />
                          {isSavingDates ? 'Menyimpan...' : 'Simpan'}
                          {isSavingDates && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          )}
                        </button>
                        <button
                          onClick={handleCancelEditDates}
                          disabled={isSavingDates}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                        >
                          <X size={16} />
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
                    // Display Mode
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tanggal Berangkat
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <p className="text-sm text-gray-900">
                            {selectedSurat.tanggal_berangkat
                              ? formatDateId(selectedSurat.tanggal_berangkat)
                              : "-"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tanggal Kembali
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <p className="text-sm text-gray-900">
                            {selectedSurat.tanggal_kembali
                              ? formatDateId(selectedSurat.tanggal_kembali)
                              : "Belum ditentukan"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
                        const isLead = getLeadInspectorNup(selectedSurat.leadInspector) === insp?.nup;
                        
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
                                <p className="text-sm font-medium text-gray-900">
                                  {nama}
                                </p>
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
                        <User className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>Tidak ada tim inspektor.</p>
                      </div>
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

                {/* Upload Signature Section */}
                {canUploadSignature(selectedSurat) && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-amber-800 mb-3">
                      Upload Tanda Tangan Lead Inspector
                    </h4>
                    <UploadTandaTangan
                      suratId={selectedSurat.id}
                      onUploadSuccess={() => {
                        fetchSuratTugasList();
                        setShowDetail(false);
                        toast.success("Tanda tangan berhasil diupload!");
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer with Actions */}
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
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Tutup
                  </button>
                  
                  <DownloadButtons surat={selectedSurat} variant="detailed" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}