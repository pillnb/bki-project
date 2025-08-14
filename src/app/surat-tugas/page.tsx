"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "../dashboard/pegawai/Navbar";
import { PlusCircle, Trash2, Download, Eye, CheckCircle, Clock, FileText, XCircle, Upload, User } from 'lucide-react';

// Tipe data untuk pegawai yang diambil dari API
type Pegawai = {
  nup: string;
  nama_pegawai: string;
};

// Tipe data untuk baris inspektor yang dipilih
type InspectorRow = {
  id: number; // Untuk key unik di React
  pegawaiNup: string; // NUP pegawai yang dipilih
};

// PERBAIKAN 1: Menyesuaikan tipe data status dengan skema baru
type StatusSuratTugas = 'DRAFT' | 'MENUNGGU_LEAD' | 'MENUNGGU_KOORDINATOR' | 'MENUNGGU_SM' | 'MENUNGGU_KACAB' | 'DISETUJUI' | 'BERJALAN' | 'SELESAI' | 'DITOLAK';

// Tipe data untuk surat tugas yang sudah diajukan
type SuratTugasItem = {
  id: string;
  nomor_surat?: string;
  klien: string;
  pekerjaan: string;
  proyek?: {
    klien?: string;
    namaProyek?: string;
    lokasi_pekerjaan?: string[];
  };
  status: StatusSuratTugas;
  status_pekerjaan?: string;
  no_service_order?: string;
  spi?: string;
  wbs?: string;
  bidang_pekerjaan?: string;
  peralatan_inspeksi?: string[];
  kebutuhan_material?: string[];
  lokasi_pekerjaan?: string[];
  tanggal_berangkat?: string;
  tanggal_kembali?: string;
  transportasi_operasional?: boolean;
  transportasi_ditanggung_klien?: boolean;
  transportasi_asal_tujuan?: boolean;
  transportasi_dinas?: boolean;
  tiket?: boolean;
  penginapan?: boolean;
  createdAt: string;
  updatedAt: string;
  leadInspector?: string; // NUP lead inspector
  ttd_lead_inspector?: string; // Path file tanda tangan
  timInspektor: Array<{
      nama_pegawai: string;
      nup: string;
  }>;
};

// PERBAIKAN 2: Memperbarui komponen ProgressTracker
const ProgressTracker = ({ status, createdAt }: { status: StatusSuratTugas, createdAt?: string }) => {
  const steps = [
    { key: 'DIAJUKAN', label: 'Diajukan', icon: FileText },
    { key: 'PROSES_APPROVAL', label: 'Proses Approval', icon: Clock },
    { key: 'DISETUJUI_BERJALAN', label: 'Disetujui & Berjalan', icon: Clock },
    { key: 'SELESAI', label: 'Selesai', icon: CheckCircle }
  ];

  const getStepIndex = (currentStatus: StatusSuratTugas) => {
    switch (currentStatus) {
      case 'DRAFT':
      case 'MENUNGGU_LEAD':
        return 0;
      case 'MENUNGGU_KOORDINATOR':
      case 'MENUNGGU_SM':
      case 'MENUNGGU_KACAB':
        return 1;
      case 'DISETUJUI':
      case 'BERJALAN':
        return 2;
      case 'SELESAI':
        return 3;
      case 'DITOLAK':
        return -1; // Status ditolak akan ditangani secara khusus
      default:
        return 0;
    }
  };

  const currentStepIndex = getStepIndex(status);

  // Format tanggal & jam
  let diajukanTanggal = '';
  let diajukanJam = '';
  if (createdAt) {
    const tgl = new Date(createdAt);
    const wita = new Date(tgl.getTime() + (tgl.getTimezoneOffset() * 60000) + (8 * 3600000));
    const pad = (n: number) => n.toString().padStart(2, '0');
    diajukanTanggal = `Diajukan pada ${pad(wita.getDate())}.${pad(wita.getMonth() + 1)}.${wita.getFullYear().toString().slice(2)}`;
    diajukanJam = `pukul ${pad(wita.getHours())}.${pad(wita.getMinutes())} WITA`;
  }

  if (status === 'DITOLAK') {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
        <XCircle className="text-red-500 mr-3" size={24} />
        <div className="text-red-700">
            <span className="font-bold">Permohonan Ditolak.</span>
            <p className="text-xs">Silakan hubungi atasan untuk informasi lebih lanjut.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center w-full max-w-2xl mx-auto mb-6">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                {isCompleted ? <CheckCircle size={20} /> : <step.icon size={20} />}
              </div>
              <span className={`mt-2 text-xs font-medium ${isCompleted || isCurrent ? 'text-blue-600' : 'text-gray-400'}`}>{step.label}</span>
              {index === 0 && createdAt && (
                <div className="flex flex-col items-center mt-1">
                  <span className="text-[10px] text-gray-500 leading-tight">{diajukanTanggal}</span>
                  <span className="text-[10px] text-gray-500 leading-tight">{diajukanJam}</span>
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 mt-[-20px] ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Component untuk upload tanda tangan
const UploadTandaTangan = ({ suratId, onUploadSuccess }: { suratId: string, onUploadSuccess: () => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setUploadMessage(null);
      } else {
        setUploadMessage('Error: File harus berupa gambar (JPG, PNG, dll.)');
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadMessage(null);

    try {
      const formData = new FormData();
      formData.append('signature', selectedFile);

      const response = await fetch(`/api/surat-tugas/${suratId}/upload-signature`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal mengupload tanda tangan');
      }

      setUploadMessage('Tanda tangan berhasil diupload!');
      setSelectedFile(null);
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading signature:', error);
      setUploadMessage('Error: Gagal mengupload tanda tangan');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <h4 className="font-medium text-gray-900 mb-3">Upload Tanda Tangan Lead Inspector</h4>
      <div className="space-y-3">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        {selectedFile && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">File: {selectedFile.name}</span>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              <Upload size={14} />
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        )}
        {uploadMessage && (
          <div className={`text-sm p-2 rounded ${uploadMessage.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {uploadMessage}
          </div>
        )}
      </div>
    </div>
  );
};

// Component untuk monitoring surat tugas
const MonitoringSuratTugas = () => {
  // Fungsi edit surat tugas (placeholder, bisa diganti modal/form edit)
  const handleEditSurat = (surat: SuratTugasItem) => {
    alert('Fitur edit surat tugas belum diimplementasikan.');
  };
  const [suratTugasList, setSuratTugasList] = useState<SuratTugasItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<SuratTugasItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentUserNup, setCurrentUserNup] = useState<string | null>(null);

  const fetchSuratTugasList = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/surat-tugas');
      if (!response.ok) throw new Error('Gagal memuat data surat tugas');
      const data = await response.json();
      // Pastikan suratTugasList selalu array
      console.log('Data from API:', data);
      if (Array.isArray(data)) {
        setSuratTugasList(data);
      } else if (Array.isArray(data.data)) {
        setSuratTugasList(data.data);
      } else {
        setSuratTugasList([]);
      }
    } catch (error) {
      console.error('Error fetching surat tugas:', error);
      setSuratTugasList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setCurrentUserNup(userData.nup);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  useEffect(() => {
    fetchSuratTugasList();
    fetchCurrentUser();
  }, []);

  const handleDownloadPDF = async (suratId: string) => {
    try {
      const response = await fetch(`/api/surat-tugas/${suratId}/pdf`);
      if (!response.ok) throw new Error('Gagal mengunduh PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `surat-tugas-${suratId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Gagal mengunduh PDF');
    }
  };

  const handleDownloadDraftPDF = async (suratId: string) => {
    try {
      const response = await fetch(`/api/surat-tugas/${suratId}/pdf-draft`);
      if (!response.ok) throw new Error('Gagal mengunduh PDF draft');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `draft-surat-tugas-${suratId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading draft PDF:', error);
      alert('Gagal mengunduh PDF draft');
    }
  };

  // PERBAIKAN 3: Memperbarui getStatusBadge untuk semua status baru
  const getStatusBadge = (status: StatusSuratTugas) => {
    const statusConfig: Record<StatusSuratTugas, { color: string; label: string }> = {
      DRAFT: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      MENUNGGU_LEAD: { color: 'bg-yellow-100 text-yellow-800', label: 'Menunggu Lead' },
      MENUNGGU_KOORDINATOR: { color: 'bg-yellow-100 text-yellow-800', label: 'Menunggu Koordinator' },
      MENUNGGU_SM: { color: 'bg-yellow-100 text-yellow-800', label: 'Menunggu SM' },
      MENUNGGU_KACAB: { color: 'bg-yellow-100 text-yellow-800', label: 'Menunggu Kacab' },
      DISETUJUI: { color: 'bg-teal-100 text-teal-800', label: 'Disetujui' },
      BERJALAN: { color: 'bg-indigo-100 text-indigo-800', label: 'Berjalan' },
      SELESAI: { color: 'bg-green-100 text-green-800', label: 'Selesai' },
      DITOLAK: { color: 'bg-red-100 text-red-800', label: 'Ditolak' }
    };

    const config = statusConfig[status];
    if (!config) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">Tidak Dikenal</span>;
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // PERBAIKAN 5: Mengizinkan download jika status sudah disetujui
  const canDownload = (status: StatusSuratTugas) => {
    return ['DISETUJUI', 'BERJALAN', 'SELESAI'].includes(status);
  };

  const canDownloadDraft = (status: StatusSuratTugas) => {
    return ['MENUNGGU_LEAD', 'MENUNGGU_KOORDINATOR', 'MENUNGGU_SM', 'MENUNGGU_KACAB', 'DISETUJUI', 'BERJALAN', 'SELESAI'].includes(status);
  };

  const isLeadInspector = (surat: SuratTugasItem) => {
    return currentUserNup && surat.leadInspector === currentUserNup;
  };

  const canUploadSignature = (surat: SuratTugasItem) => {
    return isLeadInspector(surat) && ['MENUNGGU_LEAD', 'MENUNGGU_KOORDINATOR', 'MENUNGGU_SM', 'MENUNGGU_KACAB', 'DISETUJUI', 'BERJALAN'].includes(surat.status) && !surat.ttd_lead_inspector;
  };

  // PERBAIKAN: Helper function untuk mendapatkan nama inspector berdasarkan NUP
  const getInspectorName = (nup: string, timInspektor: Array<{ nama_pegawai: string; nup: string }>) => {
    if (!Array.isArray(timInspektor)) return nup;
    const inspector = timInspektor.find(p => p.nup === nup);
    return inspector ? inspector.nama_pegawai : nup;
  };

  // PERBAIKAN: Helper function untuk mendapatkan string nama semua inspector
  const getInspectorNames = (timInspektor: Array<{ nama_pegawai: string; nup: string }> | undefined) => {
    if (!Array.isArray(timInspektor) || timInspektor.length === 0) return '';
    return timInspektor.map(p => typeof p === 'object' && p.nama_pegawai ? p.nama_pegawai : 'Nama tidak tersedia').join(', ');
  };

  return (
    <div className="mt-8 border-t border-gray-300 pt-8">
      <h2 className="text-xl font-bold text-blue-900 mb-6">Monitoring Permohonan Surat Tugas</h2>
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {suratTugasList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Belum ada permohonan surat tugas yang diajukan</div>
          ) : (
            suratTugasList.map((surat) => (
              <div key={surat.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{surat.klien}</h3>
                    <p className="text-sm text-gray-600 mt-1">{surat.pekerjaan}</p>
                    <p className="text-xs text-gray-500 mt-1">Diajukan: {formatDate(surat.createdAt)}</p>
                    {surat.nomor_surat && (
                      <p className="text-xs text-gray-500 mt-1">Nomor Surat: {surat.nomor_surat}</p>
                    )}
                    {surat.leadInspector && (
                      <div className="flex items-center gap-1 mt-1">
                        <User size={12} className="text-blue-600" />
                        <p className="text-xs text-blue-600">Lead Inspector: {getInspectorName(surat.leadInspector, surat.timInspektor)}</p>
                      </div>
                    )}
                    {surat.ttd_lead_inspector && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle size={12} className="text-green-600" />
                        <p className="text-xs text-green-600">Tanda tangan lead inspector sudah diupload</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(surat.status)}
                    <button 
                      onClick={() => { setSelectedSurat(surat); setShowDetail(true); }} 
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
                <ProgressTracker status={surat.status} createdAt={surat.createdAt} />
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-600">Inspektor: {getInspectorNames(surat.timInspektor)}</div>
                    {surat.tanggal_berangkat && surat.tanggal_kembali && (
                      <div className="text-gray-600">{formatDate(surat.tanggal_berangkat)} - {formatDate(surat.tanggal_kembali)}</div>
                    )}
                    {surat.tanggal_berangkat && !surat.tanggal_kembali && (
                      <div className="text-gray-600">{formatDate(surat.tanggal_berangkat)} - (belum ditentukan)</div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Modal Detail */}
      {showDetail && selectedSurat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Detail Surat Tugas</h3>
                <div className="flex items-center gap-2">
                  {selectedSurat.status === 'DRAFT' && (
                    <button
                      className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      onClick={() => handleEditSurat(selectedSurat)}
                    >
                      Edit
                    </button>
                  )}
                  <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Informasi Dasar */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Informasi Dasar</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Klien</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSurat.proyek?.klien || selectedSurat.klien}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedSurat.status)}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Pekerjaan</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSurat.proyek?.namaProyek || selectedSurat.pekerjaan}</p>
                  </div>
                  {selectedSurat.status_pekerjaan && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Status Pekerjaan</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedSurat.status_pekerjaan}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Nomor Identifikasi */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Nomor Identifikasi</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedSurat.no_service_order && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nomor Service Order</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedSurat.no_service_order}</p>
                    </div>
                  )}
                  {selectedSurat.spi && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">SPI</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedSurat.spi}</p>
                    </div>
                  )}
                  {selectedSurat.wbs && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">WBS</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedSurat.wbs}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bidang Pekerjaan */}
              {selectedSurat.bidang_pekerjaan && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Bidang Pekerjaan</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedSurat.bidang_pekerjaan === 'Energi' ? 'bg-blue-100 text-blue-800' :
                      selectedSurat.bidang_pekerjaan === 'Industri' ? 'bg-green-100 text-green-800' :
                      selectedSurat.bidang_pekerjaan === 'Marine' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedSurat.bidang_pekerjaan}
                    </span>
                  </div>
                </div>
              )}

              {/* Peralatan Inspeksi */}
              {selectedSurat.peralatan_inspeksi && selectedSurat.peralatan_inspeksi.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Peralatan Inspeksi</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedSurat.peralatan_inspeksi.map((peralatan, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-900">{peralatan}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kebutuhan Material */}
              {selectedSurat.kebutuhan_material && selectedSurat.kebutuhan_material.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Kebutuhan Material</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedSurat.kebutuhan_material.map((material, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-900">{material}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lokasi Pekerjaan */}
              {selectedSurat.lokasi_pekerjaan && selectedSurat.lokasi_pekerjaan.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Lokasi Pekerjaan</h4>
                  <div className="space-y-2">
                    {selectedSurat.lokasi_pekerjaan.map((lokasi, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span className="text-sm text-gray-900">{lokasi}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transportasi & Akomodasi */}
              {(() => {
                const transportasiAkomodasi = [
                  { label: 'Transportasi Operasional', value: !!selectedSurat.transportasi_operasional },
                  { label: 'Transportasi Ditanggung Klien', value: !!selectedSurat.transportasi_ditanggung_klien },
                  { label: 'Transportasi Asal-Tujuan', value: !!selectedSurat.transportasi_asal_tujuan },
                  { label: 'Transportasi Dinas', value: !!selectedSurat.transportasi_dinas },
                  { label: 'Tiket', value: !!selectedSurat.tiket },
                  { label: 'Penginapan', value: !!selectedSurat.penginapan },
                ];
                const aktif = transportasiAkomodasi.filter(item => item.value);
                if (aktif.length === 0) return null;
                return (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">Transportasi & Akomodasi</h4>
                    <ul className="list-disc pl-6 text-sm text-gray-900">
                      {aktif.map((item, idx) => (
                        <li key={idx}>{item.label}</li>
                      ))}
                    </ul>
                  </div>
                );
              })()}

              {/* Jadwal */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Jadwal Pekerjaan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tanggal Berangkat</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedSurat.tanggal_berangkat ? formatDate(selectedSurat.tanggal_berangkat) : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tanggal Kembali</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedSurat.tanggal_kembali ? formatDate(selectedSurat.tanggal_kembali) : 'Belum ditentukan'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tim Inspektor */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Tim Inspektor</h4>
                <div className="space-y-3">
                  {Array.isArray(selectedSurat.timInspektor) && selectedSurat.timInspektor.length > 0 ? (
                    selectedSurat.timInspektor.map((inspector, index) => {
                      // PERBAIKAN: Pastikan inspector adalah objek yang valid
                      const inspectorData = typeof inspector === 'object' && inspector !== null ? inspector : null;
                      const nama = inspectorData?.nama_pegawai || 'Nama tidak tersedia';
                      const nup = inspectorData?.nup || 'NUP tidak tersedia';
                      
                      return (
                        <div key={`${nup}-${index}`} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-800">{index + 1}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{nama}</p>
                              <p className="text-xs text-gray-500">NUP: {nup}</p>
                            </div>
                          </div>
                          {selectedSurat.leadInspector === nup && (
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

              {/* Progress Tracker */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Status Progress</h4>
                <ProgressTracker status={selectedSurat.status} createdAt={selectedSurat.createdAt} />
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                {canDownloadDraft(selectedSurat.status) && (
                  <button 
                    onClick={() => handleDownloadDraftPDF(selectedSurat.id)} 
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                  >
                    <Download size={16} />
                    Download Draft PDF
                  </button>
                )}
                {canDownload(selectedSurat.status) && (
                  <button 
                    onClick={() => handleDownloadPDF(selectedSurat.id)} 
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    <Download size={16} />
                    Download Surat Tugas (PDF)
                  </button>
                )}
              </div>

              {/* Upload Signature */}
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
};

export default function SuratTugasPage() {
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
    leadInspector: string; // NUP lead inspector
  }>({
    klien: '', pekerjaan: '', status_pekerjaan: '', no_service_order: '', spi: '', wbs: '',
    bidang_pekerjaan: '', peralatan_inspeksi: [], peralatan_sewa: '', kebutuhan_material: [''],
    lokasi_pekerjaan: [''], tanggal_berangkat: '', tanggal_kembali: '', transportasi_operasional: false,
    transportasi_ditanggung_klien: false, transportasi_asal_tujuan: false, transportasi_dinas: false,
    tiket: false, penginapan: false, leadInspector: '',
  });
  const [inspectors, setInspectors] = useState<InspectorRow[]>([{ id: 1, pegawaiNup: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [refreshMonitoring, setRefreshMonitoring] = useState(0);

  useEffect(() => {
    const fetchPegawai = async () => {
      try {
        const response = await fetch('/api/pegawai', { cache: 'no-store' });
        if (!response.ok) throw new Error('Gagal memuat data pegawai');
        const data = await response.json();
        setAllPegawai(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setSubmitMessage('Error: Gagal memuat data pegawai.');
      }
    };
    fetchPegawai();
  }, []);

  const getAvailablePegawai = (currentId: number) => {
    const selectedNups = inspectors.filter(i => i.id !== currentId).map(i => i.pegawaiNup).filter(Boolean);
    return allPegawai.filter(p => !selectedNups.includes(p.nup));
  };

  // Get available lead inspectors (only from selected inspectors)
  const getAvailableLeadInspectors = () => {
    const selectedNups = inspectors.map(i => i.pegawaiNup).filter(Boolean);
    return allPegawai.filter(p => selectedNups.includes(p.nup));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormData(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleBidangChange = (val: string) => setFormData(prev =>({ ...prev, bidang_pekerjaan: val }));

  const handleArrayChange = (name: keyof typeof formData, index: number, value: string) => {
    setFormData(prev => {
      const array = [...(prev[name] as string[])];
      array[index] = value;
      return { ...prev, [name]: array };
    });
  };

  const addArrayItem = (name: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [name]: [...(prev[name] as string[]), '']
    }));
  };

  const removeArrayItem = (name: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: (prev[name] as string[]).filter((_, i) => i !== index)
    }));
  };

  const addInspector = () => {
    const newId = Math.max(...inspectors.map(i => i.id), 0) + 1;
    setInspectors(prev => [...prev, { id: newId, pegawaiNup: '' }]);
  };

  const removeInspector = (id: number) => {
    if (inspectors.length > 1) {
      setInspectors(prev => prev.filter(i => i.id !== id));
      // Reset lead inspector if removed
      const removedInspector = inspectors.find(i => i.id === id);
      if (removedInspector && formData.leadInspector === removedInspector.pegawaiNup) {
        setFormData(prev => ({ ...prev, leadInspector: '' }));
      }
    }
  };

  const updateInspector = (id: number, pegawaiNup: string) => {
    setInspectors(prev => prev.map(i => i.id === id ? { ...i, pegawaiNup } : i));
    // Reset lead inspector if changed
    if (formData.leadInspector === pegawaiNup) {
      setFormData(prev => ({ ...prev, leadInspector: '' }));
    }
  };

  const handlePeralatanChange = (checked: boolean, item: string) => {
    setFormData(prev => ({
      ...prev,
      peralatan_inspeksi: checked 
        ? [...prev.peralatan_inspeksi, item]
        : prev.peralatan_inspeksi.filter(p => p !== item)
    }));
  };

  const validateForm = () => {
    if (!formData.klien || !formData.pekerjaan || !formData.tanggal_berangkat) {
      setSubmitMessage('Error: Harap isi semua field yang wajib.');
      return false;
    }
    
    const selectedInspectors = inspectors.filter(i => i.pegawaiNup);
    if (selectedInspectors.length === 0) {
      setSubmitMessage('Error: Pilih minimal satu inspektor.');
      return false;
    }

    if (!formData.leadInspector) {
      setSubmitMessage('Error: Pilih lead inspector dari tim inspektor.');
      return false;
    }

    const selectedNups = selectedInspectors.map(i => i.pegawaiNup);
    if (!selectedNups.includes(formData.leadInspector)) {
      setSubmitMessage('Error: Lead inspector harus merupakan bagian dari tim inspektor.');
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
      const selectedInspectors = inspectors.filter(i => i.pegawaiNup);
      
      const payload = {
        ...formData,
        pegawaiNupList: selectedInspectors.map(i => i.pegawaiNup),
        kebutuhan_material: formData.kebutuhan_material.filter(Boolean),
        lokasi_pekerjaan: formData.lokasi_pekerjaan.filter(Boolean)
      };

      const response = await fetch('/api/surat-tugas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal membuat surat tugas');
      }

      setSubmitMessage('Surat tugas berhasil diajukan!');
      
      // Reset form
      setFormData({
        klien: '', pekerjaan: '', status_pekerjaan: '', no_service_order: '', spi: '', wbs: '',
        bidang_pekerjaan: '', peralatan_inspeksi: [], peralatan_sewa: '', kebutuhan_material: [''],
        lokasi_pekerjaan: [''], tanggal_berangkat: '', tanggal_kembali: '', transportasi_operasional: false,
        transportasi_ditanggung_klien: false, transportasi_asal_tujuan: false, transportasi_dinas: false,
        tiket: false, penginapan: false, leadInspector: '',
      });
      setInspectors([{ id: 1, pegawaiNup: '' }]);
      
      // Refresh monitoring
      setRefreshMonitoring(prev => prev + 1);

    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage(`Error: ${error instanceof Error ? error.message : 'Terjadi kesalahan'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const peralatanOptions = [
    'UT', 'RT', 'MT', 'PT', 'VT', 'Hardness Test', 'PMI', 'Dimensional',
    'Welding Inspection', 'NDE Level III Evaluation', 'Coating Inspection',
    'Cathodic Protection', 'Material Testing', 'Pressure Test'
  ];

  const bidangOptions = [
    'Oil & Gas', 'Petrochemical', 'Power Plant', 'Manufacturing', 
    'Infrastructure', 'Marine', 'Aerospace', 'Other'
  ];

  const statusPekerjaanOptions = [
    { value: 'belum_mulai', label: 'Belum Mulai' },
    { value: 'berjalan', label: 'Berjalan' },
    { value: 'telah_selesai', label: 'Telah Selesai' }
  ];

  return (
    <div className="min-h-screen bg-[#e9f1fa]">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-8">Permohonan Surat Tugas Inspeksi</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Klien */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Klien <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
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
                {statusPekerjaanOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
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

            {/* Baris No SO, SPI, dan WBS */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* No Service Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">No. Service Order</label>
                  <div className="flex">
                    <span className="text-black bg-gray-100 border border-gray-300 rounded-l px-2 py-2 select-none whitespace-nowrap">
                      100-00
                    </span>
                    <input
                      type="text"
                      name="no_service_order"
                      value={formData.no_service_order}
                      onChange={handleChange}
                      className="flex-1 border-b-2 border-gray-300 p-2 focus:border-blue-500 outline-none text-black rounded-r"
                      placeholder="Nomor service order"
                    />
                  </div>
                </div>
                {/* SPI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SPI</label>
                  <input
                    type="text"
                    name="spi"
                    value={formData.spi}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="SPI"
                  />
                </div>
                {/* WBS */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WBS</label>
                  <input
                    type="text"
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

            {/* Bidang Pekerjaan */}
            <div className="border-t border-b border-gray-300 py-6 mt-6">
              <h3 className="font-semibold text-black mb-2">
                Bidang Pekerjaan <span className="text-red-600">*</span>
              </h3>
              <div className="flex gap-6">
                {['Energi', 'Industri', 'Marine'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-black cursor-pointer">
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
                {['Cabang lokal', 'Pinjam cabang lain', 'Sewa pihak ke-3'].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-black cursor-pointer">
                    <input
                    type="checkbox"
                    checked={formData.peralatan_inspeksi.includes(opt)}
                    onChange={e => handlePeralatanChange(e.target.checked, opt)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />{' '}
                    {opt}
                </label>
                ))}
                {formData.peralatan_inspeksi.includes('Sewa pihak ke-3') && (
                <input
                    name="peralatan_sewa"
                    value={formData.peralatan_sewa || ''}
                    onChange={handleChange}
                    placeholder="Nama vendor sewa..."
                    className="border border-gray-300 p-2 rounded ml-4 text-black"
                />
                )}
            </div>
            </div>

          {/* Kebutuhan Material */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Kebutuhan Peralatan/Material</label>
            {formData.kebutuhan_material.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('kebutuhan_material', index, e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder={`Peralatan/Material ${index + 1}`}
                />
                {formData.kebutuhan_material.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('kebutuhan_material', index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('kebutuhan_material')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <PlusCircle size={18} />
              <span>Tambah Material</span>
            </button>
          </div>

          {/* Lokasi Pekerjaan */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Pekerjaan</label>
            {formData.lokasi_pekerjaan.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('lokasi_pekerjaan', index, e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder={`Lokasi ${index + 1}`}
                />
                {formData.lokasi_pekerjaan.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('lokasi_pekerjaan', index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('lokasi_pekerjaan')}
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
                  {getAvailablePegawai(inspector.id).map(pegawai => (
                    <option key={pegawai.nup} value={pegawai.nup}>
                      {pegawai.nama_pegawai} ({pegawai.nup})
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
              {getAvailableLeadInspectors().map(pegawai => (
                <option key={pegawai.nup} value={pegawai.nup}>
                  {pegawai.nama_pegawai} ({pegawai.nup})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Lead inspector harus dipilih dari anggota tim inspektor yang sudah ditambahkan di atas.
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
                Kosongkan jika belum pasti. Bisa diupdate nanti saat menyelesaikan tugas.
              </p>
            </div>
          </div>

          {/* Transportasi & Akomodasi */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Transportasi & Akomodasi</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="transportasi_operasional"
                    checked={formData.transportasi_operasional}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-black"
                  />
                  <span className="text-sm text-gray-700">Transportasi Operasional</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="transportasi_ditanggung_klien"
                    checked={formData.transportasi_ditanggung_klien}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-black"
                  />
                  <span className="text-sm text-gray-700">Transportasi Ditanggung Klien</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="transportasi_asal_tujuan"
                    checked={formData.transportasi_asal_tujuan}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-black"
                  />
                  <span className="text-sm text-gray-700">Transportasi Asal-Tujuan</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="transportasi_dinas"
                    checked={formData.transportasi_dinas}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-black"
                  />
                  <span className="text-sm text-gray-700">Transportasi Dinas</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="tiket"
                    checked={formData.tiket}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-black"
                  />
                  <span className="text-sm text-gray-700">Tiket</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="penginapan"
                    checked={formData.penginapan}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-black"
                  />
                  <span className="text-sm text-gray-700">Penginapan</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <div className={`mt-6 p-4 rounded-lg ${submitMessage.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {submitMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Mengajukan...' : 'Ajukan Surat Tugas'}
            </button>
          </div>
        </form>

        {/* Monitoring Component */}
        <MonitoringSuratTugas key={refreshMonitoring} />
      </div>
    </div>
  );
}