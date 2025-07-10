"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "../dashboard/pegawai/Navbar";
import { PlusCircle, Trash2, Download, Eye, CheckCircle, Clock, FileText } from 'lucide-react';

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

// Tipe data untuk status surat tugas
type StatusSuratTugas = 'DIAJUKAN' | 'MENUNGGU_APPROVAL' | 'SELESAI' | 'DITOLAK';

// Tipe data untuk surat tugas yang sudah diajukan
type SuratTugasItem = {
  id: string;
  nomor_surat?: string;
  klien: string;
  pekerjaan: string;
  status: StatusSuratTugas;
  tanggal_berangkat?: string;
  tanggal_kembali?: string;
  createdAt: string;
  updatedAt: string;
  pegawai_surat_tugas: Array<{
    pegawai: {
      nama_pegawai: string;
      nup: string;
    };
  }>;
};

// Component untuk Progress Tracker
const ProgressTracker = ({ status, createdAt }: { status: StatusSuratTugas, createdAt?: string }) => {
  const steps = [
    { key: 'DIAJUKAN', label: 'Diajukan', icon: FileText },
    { key: 'MENUNGGU_APPROVAL', label: 'Menunggu Approval', icon: Clock },
    { key: 'SELESAI', label: 'Selesai', icon: CheckCircle }
  ];

  const getStepIndex = (status: StatusSuratTugas) => {
    switch (status) {
      case 'DIAJUKAN': return 0;
      case 'MENUNGGU_APPROVAL': return 1;
      case 'SELESAI': return 2;
      case 'DITOLAK': return -1;
      default: return 0;
    }
  };

  const currentStepIndex = getStepIndex(status);

  // Format tanggal & jam untuk keterangan (selalu WITA/GMT+8, dua baris)
  let diajukanTanggal = '';
  let diajukanJam = '';
  if (createdAt) {
    const tgl = new Date(createdAt);
    // Konversi ke WITA (GMT+8)
    const utc = tgl.getTime() + (tgl.getTimezoneOffset() * 60000);
    const wita = new Date(utc + 8 * 60 * 60000);
    const pad = (n: number) => n.toString().padStart(2, '0');
    diajukanTanggal = `Diajukan pada ${pad(wita.getDate())}.${pad(wita.getMonth()+1)}.${wita.getFullYear().toString().slice(2)}`;
    diajukanJam = `pukul ${pad(wita.getHours())}.${pad(wita.getMinutes())} WITA`;
  }

  return (
    <div className="flex items-center w-full max-w-2xl mx-auto mb-6">
      {steps.map((step, index) => {
        const isActive = index <= currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                {isCompleted ? (
                  <CheckCircle size={20} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className={`mt-2 text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{step.label}</span>
              {/* Keterangan tanggal diajukan di bawah step Diajukan, dua baris */}
              {index === 0 && createdAt && (
                <div className="flex flex-col items-center mt-1">
                  <span className="text-[10px] text-gray-500 leading-tight">{diajukanTanggal}</span>
                  <span className="text-[10px] text-gray-500 leading-tight">{diajukanJam}</span>
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 mt-[-20px] ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Component untuk monitoring surat tugas
const MonitoringSuratTugas = () => {
  const [suratTugasList, setSuratTugasList] = useState<SuratTugasItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<SuratTugasItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const fetchSuratTugasList = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/surat-tugas');
      if (!response.ok) throw new Error('Gagal memuat data surat tugas');
      const data = await response.json();
      setSuratTugasList(data);
    } catch (error) {
      console.error('Error fetching surat tugas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuratTugasList();
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

  const getStatusBadge = (status: StatusSuratTugas) => {
    const statusConfig = {
      DIAJUKAN: { color: 'bg-blue-100 text-blue-800', label: 'Diajukan' },
      MENUNGGU_APPROVAL: { color: 'bg-yellow-100 text-yellow-800', label: 'Menunggu Approval' },
      SELESAI: { color: 'bg-green-100 text-green-800', label: 'Selesai' },
      DITOLAK: { color: 'bg-red-100 text-red-800', label: 'Ditolak' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
          Status Tidak Dikenal
        </span>
      );
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
            <div className="text-center py-8 text-gray-500">
              Belum ada permohonan surat tugas yang diajukan
            </div>
          ) : (
            suratTugasList.map((surat) => (
              <div key={surat.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{surat.klien}</h3>
                    <p className="text-sm text-gray-600 mt-1">{surat.pekerjaan}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Diajukan: {formatDate(surat.createdAt)}
                    </p>
                    {surat.nomor_surat && (
                      <p className="text-xs text-gray-500 mt-1">
                        Nomor Surat: {surat.nomor_surat}
                      </p>
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
                    {surat.status === 'SELESAI' && (
                      <button
                        onClick={() => handleDownloadPDF(surat.id)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                <ProgressTracker status={surat.status} createdAt={surat.createdAt} />
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-600">
                      Inspektor: {surat.pegawai_surat_tugas.map(p => p.pegawai.nama_pegawai).join(', ')}
                    </div>
                    {surat.tanggal_berangkat && surat.tanggal_kembali && (
                      <div className="text-gray-600">
                        {formatDate(surat.tanggal_berangkat)} - {formatDate(surat.tanggal_kembali)}
                      </div>
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
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Detail Surat Tugas</h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Klien</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedSurat.klien}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedSurat.status)}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Pekerjaan</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedSurat.pekerjaan}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Berangkat</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSurat.tanggal_berangkat ? formatDate(selectedSurat.tanggal_berangkat) : '-'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Kembali</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSurat.tanggal_kembali ? formatDate(selectedSurat.tanggal_kembali) : '-'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Inspektor</label>
                  <div className="mt-1 space-y-1">
                    {selectedSurat.pegawai_surat_tugas.map((p, index) => (
                      <p key={index} className="text-sm text-gray-900">
                        {index + 1}. {p.pegawai.nama_pegawai} ({p.pegawai.nup})
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <ProgressTracker status={selectedSurat.status} createdAt={selectedSurat.createdAt} />
              </div>
              
              {selectedSurat.status === 'SELESAI' && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => handleDownloadPDF(selectedSurat.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Download size={16} />
                    Download Surat Tugas (PDF)
                  </button>
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
  // Helper untuk memfilter pegawai yang sudah dipilih di inspektor lain
  const getAvailablePegawai = (currentId: number) => {
    // Ambil semua NUP yang sudah dipilih di inspektor lain
    const selectedNups = inspectors.filter(i => i.id !== currentId).map(i => i.pegawaiNup).filter(Boolean);
    return allPegawai.filter(p => !selectedNups.includes(p.nup));
  };
  // State untuk menyimpan daftar pegawai dari database
  const [allPegawai, setAllPegawai] = useState<Pegawai[]>([]);
  // State untuk form
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
  }>({
    klien: '',
    pekerjaan: '',
    status_pekerjaan: '',
    no_service_order: '',
    spi: '',
    wbs: '',
    bidang_pekerjaan: '',
    peralatan_inspeksi: [],
    peralatan_sewa: '',
    kebutuhan_material: [''],
    lokasi_pekerjaan: [''],
    tanggal_berangkat: '',
    tanggal_kembali: '',
    transportasi_operasional: false,
    transportasi_ditanggung_klien: false,
    transportasi_asal_tujuan: false,
    transportasi_dinas: false,
    tiket: false,
    penginapan: false,
  });
  // Dynamic field for inspektor
  const [inspectors, setInspectors] = useState<InspectorRow[]>([{ id: 1, pegawaiNup: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  // State untuk refresh monitoring setelah submit
  const [refreshMonitoring, setRefreshMonitoring] = useState(0);

  // Mengambil data pegawai saat komponen dimuat
  useEffect(() => {
    const fetchPegawai = async () => {
      try {
        const response = await fetch('/api/pegawai', { cache: 'no-store' });
        if (!response.ok) throw new Error('Gagal memuat data pegawai');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0 && data[0].nup && data[0].nama_pegawai) {
          setAllPegawai(data);
        } else {
          setAllPegawai([]);
        }
      } catch (error) {
        console.error(error);
        setAllPegawai([]);
        setSubmitMessage('Error: Gagal memuat data pegawai.');
      }
    };
    fetchPegawai();
  }, []);
  
  // Handler untuk input biasa dan checkbox
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Handler bidang pekerjaan (radio)
  const handleBidangChange = (val: string) => {
    setFormData(prev => ({ ...prev, bidang_pekerjaan: val }));
  };

  // Handler peralatan inspeksi (checkbox multiselect)
  const handlePeralatanInspeksi = (val: string, checked: boolean) => {
    setFormData(prev => {
      let arr = Array.isArray(prev.peralatan_inspeksi) ? [...prev.peralatan_inspeksi] : [];
      if (checked) {
        arr.push(val);
      } else {
        arr = arr.filter((v) => v !== val);
      }
      return { ...prev, peralatan_inspeksi: arr };
    });
  };

  // Handler kebutuhan material (dynamic)
  const handleMaterialChange = (idx: number, value: string) => {
    setFormData(prev => {
      const arr = [...prev.kebutuhan_material];
      arr[idx] = value;
      return { ...prev, kebutuhan_material: arr };
    });
  };
  const addMaterial = () => setFormData(prev => ({ ...prev, kebutuhan_material: [...prev.kebutuhan_material, ''] }));
  const removeMaterial = (idx: number) => setFormData(prev => ({ ...prev, kebutuhan_material: prev.kebutuhan_material.filter((_, i) => i !== idx) }));

  // Handler lokasi pekerjaan (dynamic)
  const handleLokasiChange = (idx: number, value: string) => {
    setFormData(prev => {
      const arr = [...prev.lokasi_pekerjaan];
      arr[idx] = value;
      return { ...prev, lokasi_pekerjaan: arr };
    });
  };
  const addLokasi = () => setFormData(prev => ({ ...prev, lokasi_pekerjaan: [...prev.lokasi_pekerjaan, ''] }));
  const removeLokasi = (idx: number) => setFormData(prev => ({ ...prev, lokasi_pekerjaan: prev.lokasi_pekerjaan.filter((_, i) => i !== idx) }));
  
  // Handler untuk dropdown inspektor
  const handleInspectorChange = (id: number, nup: string) => {
    setInspectors(prev => prev.map(inspector => 
      inspector.id === id ? { ...inspector, pegawaiNup: nup } : inspector
    ));
  };

  const handleAddInspector = () => {
    if (inspectors.length < 6) {
      setInspectors([...inspectors, { id: Date.now(), pegawaiNup: '' }]);
    }
  };

  const handleRemoveInspector = (id: number) => {
    if (inspectors.length > 1) {
      setInspectors(inspectors.filter(inspector => inspector.id !== id));
    }
  };

  // Perbaikan untuk bagian validasi dan submit di frontend (page.tsx)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitMessage(null);
  setIsSubmitting(true);

  // Validasi field wajib lain
  if (!formData.klien.trim()) {
    setSubmitMessage('Error: Field "Klien" wajib diisi.');
    setIsSubmitting(false);
    return;
  }
  if (!formData.pekerjaan.trim()) {
    setSubmitMessage('Error: Field "Pekerjaan" wajib diisi.');
    setIsSubmitting(false);
    return;
  }
  if (!formData.lokasi_pekerjaan.filter(l => l && l.trim() !== '').length) {
    setSubmitMessage('Error: Field "Lokasi Pekerjaan" wajib diisi.');
    setIsSubmitting(false);
    return;
  }
  const pegawaiNupList = inspectors.map(i => i.pegawaiNup).filter(nup => nup !== '');
  if (pegawaiNupList.length === 0) {
    setSubmitMessage('Error: Pilih minimal satu inspektor.');
    setIsSubmitting(false);
    return;
  }

  // PERBAIKAN: Validasi "isi salah satu" 
  const no_service_order = formData.no_service_order.trim();
  const spi = formData.spi.trim();
  const wbs = formData.wbs.trim();

  // Validasi: SO dianggap terisi jika ada minimal 1 digit angka
  const soClean = no_service_order.replace(/[^0-9]/g, '');
  const filledFields = [];
  if (soClean.length > 0) filledFields.push('SO');
  if (spi.length > 0) filledFields.push('SPI');
  if (wbs.length > 0) filledFields.push('WBS');

  if (filledFields.length === 0) {
    setSubmitMessage('Error: Salah satu dari No Service Order, SPI, atau WBS wajib diisi. Silakan isi minimal satu.');
    setIsSubmitting(false);
    return;
  }
  if (filledFields.length > 1) {
    setSubmitMessage('Error: Hanya boleh mengisi salah satu dari No Service Order, SPI, atau WBS. Kosongkan dua lainnya.');
    setIsSubmitting(false);
    return;
  }

  // PERBAIKAN: Prepare data untuk dikirim ke backend
  let noServiceOrderFinal = '';
  if (no_service_order.length > 0) {
    noServiceOrderFinal = `100-00${no_service_order}`;
  }

  // PERBAIKAN: Mapping payload dengan field names yang benar (snake_case)
  const payload = {
    klien: formData.klien,
    pekerjaan: formData.pekerjaan,
    status_pekerjaan: formData.status_pekerjaan,
    no_service_order: noServiceOrderFinal || null, // Kirim string lengkap atau null
    spi: spi || null, // Kirim string atau null
    wbs: wbs || null, // Kirim string atau null
    bidang_pekerjaan: formData.bidang_pekerjaan,
    peralatan_inspeksi: formData.peralatan_inspeksi,
    kebutuhan_material: formData.kebutuhan_material.filter(m => m && m.trim() !== ''),
    lokasi_pekerjaan: formData.lokasi_pekerjaan.filter(l => l && l.trim() !== ''),
    tanggal_berangkat: formData.tanggal_berangkat,
    tanggal_kembali: formData.tanggal_kembali,
    transportasi_operasional: formData.transportasi_operasional,
    transportasi_ditanggung_klien: formData.transportasi_ditanggung_klien,
    transportasi_asal_tujuan: formData.transportasi_asal_tujuan,
    transportasi_dinas: formData.transportasi_dinas,
    tiket: formData.tiket,
    penginapan: formData.penginapan,
    pegawaiNupList,
    status: 'MENUNGGU_APPROVAL', // Set status langsung ke MENUNGGU_APPROVAL
  };

  console.log('Payload being sent:', payload); // Debug log

  try {
    const response = await fetch('/api/surat-tugas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Gagal mengajukan surat tugas.');
    }
    setSubmitMessage('Permohonan Surat Tugas berhasil diajukan!');
    // Reset form
      setFormData({
        klien: '',
        pekerjaan: '',
        status_pekerjaan: '',
        no_service_order: '',
        spi: '',
        wbs: '',
        bidang_pekerjaan: '',
        peralatan_inspeksi: [],
        peralatan_sewa: '',
        kebutuhan_material: [''],
        lokasi_pekerjaan: [''],
        tanggal_berangkat: '',
        tanggal_kembali: '',
        transportasi_operasional: false,
        transportasi_ditanggung_klien: false,
        transportasi_asal_tujuan: false,
        transportasi_dinas: false,
        tiket: false,
        penginapan: false,
      });
      setInspectors([{ id: 1, pegawaiNup: '' }]);
      
      // Refresh monitoring
      setRefreshMonitoring(prev => prev + 1);
      
    } catch (error: any) {
      setSubmitMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e9f1fa] flex flex-col items-center">
      <Navbar />
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 mt-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-blue-900">ANALISA PERMINTAAN JASA DAN PERMOHONAN SURAT TUGAS</h1>
        <hr className="border-t-2 border-black mb-8" />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bagian Atas */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label htmlFor="klien" className="text-sm font-semibold text-black mb-1">Klien <span className="text-red-600">*</span></label>
              <input id="klien" name="klien" value={formData.klien} onChange={handleChange} className="w-full border-b-2 border-gray-300 p-2 focus:border-blue-500 outline-none text-black" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="pekerjaan" className="text-sm font-semibold text-black mb-1">Pekerjaan <span className="text-red-600">*</span></label>
              <input id="pekerjaan" name="pekerjaan" value={formData.pekerjaan} onChange={handleChange} className="w-full border-b-2 border-gray-300 p-2 focus:border-blue-500 outline-none text-black" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="status_pekerjaan" className="text-sm font-semibold text-black mb-1">Status Pekerjaan <span className="text-red-600">*</span></label>
              <input id="status_pekerjaan" name="status_pekerjaan" value={formData.status_pekerjaan} onChange={handleChange} className="w-full border-b-2 border-gray-300 p-2 focus:border-blue-500 outline-none text-black" />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm font-semibold text-black mb-1">No Service Order / SPI / WBS <span className="text-red-600">*</span> <span className="font-normal">(isi salah satu)</span></label>
              <div className="flex flex-col gap-2 md:flex-row md:gap-2 w-full">
                <div className="flex items-center flex-shrink-0" style={{ minWidth: '220px' }}>
                  <span className="text-black bg-gray-100 border border-gray-300 rounded-l px-2 py-2 select-none whitespace-nowrap">100-00</span>
                  <input
                    name="no_service_order"
                    value={formData.no_service_order}
                    onChange={e => {
                      const cleanValue = e.target.value.replace(/[^0-9]/g, '');
                      setFormData(prev => ({ ...prev, no_service_order: cleanValue }));
                    }}
                    className="w-full border-b-2 border-gray-300 p-2 focus:border-blue-500 outline-none text-black rounded-r"
                    placeholder="..."
                    style={{ borderLeft: 'none' }}
                  />
                </div>
                <input
                  name="spi"
                  value={formData.spi}
                  onChange={handleChange}
                  placeholder="SPI"
                  className="w-full border-b-2 border-gray-300 p-2 focus:border-blue-500 outline-none text-black"
                />
                <input
                  name="wbs"
                  value={formData.wbs}
                  onChange={handleChange}
                  placeholder="WBS"
                  className="w-full border-b-2 border-gray-300 p-2 focus:border-blue-500 outline-none text-black"
                />
              </div>
              <div className="text-xs text-black mt-1">* Isi salah satu: No Service Order, SPI, atau WBS</div>
            </div>
          </div>

          {/* Bidang Pekerjaan */}
          <div className="border-t border-b border-gray-300 py-6">
            <h3 className="font-semibold text-black mb-2">Bidang Pekerjaan <span className="text-red-600">*</span></h3>
            <div className="flex gap-6">
              {['Energi', 'Industri', 'Marine'].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-black">
                  <input type="radio" name="bidang_pekerjaan" checked={formData.bidang_pekerjaan === opt} onChange={() => handleBidangChange(opt)} />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Peralatan Inspeksi */}
          <div className="border-b border-gray-300 py-6">
            <h3 className="font-semibold text-black mb-2">Peralatan Inspeksi <span className="text-red-600">*</span></h3>
            <div className="flex gap-6 flex-wrap">
              {['Cabang lokal', 'Pinjam cabang lain', 'Sewa pihak ke-3'].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-black">
                  <input type="checkbox" checked={formData.peralatan_inspeksi.includes(opt)} onChange={e => handlePeralatanInspeksi(opt, e.target.checked)} />
                  {opt}
                </label>
              ))}
              {formData.peralatan_inspeksi.includes('Sewa pihak ke-3') && (
                <input name="peralatan_sewa" value={formData.peralatan_sewa || ''} onChange={handleChange} placeholder="Nama vendor sewa..." className="border border-gray-300 p-2 rounded ml-4 text-black" />
              )}
            </div>
          </div>

          {/* Kebutuhan Material (dynamic) */}
          <div className="border-b border-gray-300 py-6">
            <h3 className="font-semibold text-black mb-2">Kebutuhan Peralatan/Material <span className="text-red-600">*</span></h3>
            {formData.kebutuhan_material.map((val, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  value={val || ''}
                  onChange={e => handleMaterialChange(idx, e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded text-black"
                  placeholder={`Kebutuhan #${idx+1}`}
                />
                {formData.kebutuhan_material.length > 1 && (
                  <button type="button" onClick={() => removeMaterial(idx)} className="text-red-500 hover:text-red-700 font-bold">-</button>
                )}
                {idx === formData.kebutuhan_material.length - 1 && (
                  <button type="button" onClick={addMaterial} className="text-blue-600 hover:text-blue-800 font-bold">+</button>
                )}
              </div>
            ))}
          </div>

          {/* Inspektor dan Lokasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-300 pb-6">
            <div>
              <h3 className="font-semibold text-black mb-2">Inspektor <span className="text-red-600">*</span></h3>
              {inspectors.map((inspector, index) => (
                <div key={inspector.id} className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-black">{index + 1}.</span>
                  <select
                    className="flex-grow border border-gray-300 p-2 text-sm rounded text-black"
                    value={inspector.pegawaiNup}
                    onChange={(e) => handleInspectorChange(inspector.id, e.target.value)}
                  >
                    <option value="">-- Pilih Pegawai --</option>
                    {getAvailablePegawai(inspector.id).length > 0 ? (
                      getAvailablePegawai(inspector.id).map((p) => (
                        <option key={p.nup} value={p.nup}>{p.nama_pegawai} ({p.nup})</option>
                      ))
                    ) : (
                      <option value="" disabled>Data pegawai tidak tersedia</option>
                    )}
                  </select>
                  {index > 0 && (
                    <button type="button" onClick={() => handleRemoveInspector(inspector.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
              {inspectors.length < 6 && (
                <button type="button" onClick={handleAddInspector} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-2 text-sm font-semibold">
                  <PlusCircle size={18} />
                  Tambah Inspektor
                </button>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-black mb-2">Lokasi Pekerjaan <span className="text-red-600">*</span></h3>
              <input
                name="lokasi_pekerjaan"
                value={formData.lokasi_pekerjaan[0] || ''}
                onChange={e => handleLokasiChange(0, e.target.value)}
                className="w-full border border-gray-300 p-2 rounded text-black"
                placeholder="Lokasi pekerjaan"
              />
            </div>
          </div>

          {/* Tanggal dan Transportasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
            <div>
              <h3 className="font-semibold text-black mb-2">Tanggal <span className="text-red-600">*</span></h3>
              <div className="flex gap-4">
                <div className="flex flex-col w-full">
                  <label htmlFor="tanggal_berangkat" className="text-xs text-black mb-1">Tanggal Berangkat <span className="text-red-600">*</span></label>
                  <input type="date" id="tanggal_berangkat" name="tanggal_berangkat" value={formData.tanggal_berangkat} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-black"/>
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="tanggal_kembali" className="text-xs text-black mb-1">Tanggal Kembali <span className="text-red-600">*</span></label>
                  <input type="date" id="tanggal_kembali" name="tanggal_kembali" value={formData.tanggal_kembali} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded text-black"/>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-2">Transportasi & Akomodasi</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" name="transportasi_operasional" checked={formData.transportasi_operasional} onChange={handleChange} />
                  Kendaraan operasional
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" name="transportasi_ditanggung_klien" checked={formData.transportasi_ditanggung_klien} onChange={handleChange} />
                  Ditanggung klien
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" name="transportasi_asal_tujuan" checked={formData.transportasi_asal_tujuan} onChange={handleChange} />
                  Transport asal & tujuan
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" name="transportasi_dinas" checked={formData.transportasi_dinas} onChange={handleChange} />
                  Transport dalam dinas
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" name="tiket" checked={formData.tiket} onChange={handleChange} />
                  Tiket
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" name="penginapan" checked={formData.penginapan} onChange={handleChange} />
                  Penginapan
                </label>
              </div>
            </div>
          </div>
          
          {/* ... Bagian di atas sudah digantikan, tidak perlu double ... */}
          
          {/* Tombol Aksi */}
          <div className="flex justify-end pt-4">
            <button type="submit" className="px-8 py-3 rounded bg-blue-900 text-white font-bold hover:bg-blue-800 shadow" disabled={isSubmitting}>
              {isSubmitting ? 'Mengajukan...' : 'Ajukan Permohonan'}
            </button>
          </div>
        </form>

        {submitMessage && (
          <div className={`mt-6 p-4 rounded text-center ${submitMessage.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {submitMessage}
          </div>
        )}

        {/* Monitoring Surat Tugas (refresh otomatis setelah submit) */}
      </div>
      {/* Monitoring Surat Tugas dipisah, tampil di bawah card form */}
      <div className="w-full max-w-5xl" id="monitoring-surat-tugas">
        <MonitoringSuratTugas key={refreshMonitoring} />
      </div>
    </div>
  );
}