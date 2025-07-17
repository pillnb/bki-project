"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Calendar, User, Briefcase, Award, Building, Download, FileText, File, Loader2 } from 'lucide-react';

interface Kualifikasi {
  id_pelatihan: number;
  nama_pelatihan: string;
  penyelenggara: string;
  nomor_sertifikat: string;
  tahun: number;
  tanggal_awal: string;
  tanggal_akhir: string;
  masa_berlaku: string;
  status: string;
  keterangan_utilisasi: string;
  lokasi: string;
}

// ✅ PERBAIKAN: Interface pengalaman_kerja yang sesuai dengan API response
interface PengalamanKerja {
  id: number;
  pengalaman_kerja: string; // nama pengalaman/posisi
  perusahaan: string;
  tahun: number;
  lokasi: string;
}

interface Pegawai {
  id: number;
  nup: string;
  nama_pegawai: string;
  email: string;
  no_telepon: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  agama: string;
  warga_negara: string;
  jabatan: string;
  departemen: string;
  status_pegawai: string;
  tanggal_bergabung: string;
  kualifikasi: Kualifikasi[];
  pengalaman_kerja: PengalamanKerja[];
  username: string;
  status: string;
  created_at: string;
  updated_at: string;
  nik?: string;
  jenjang_pend?: string;
  pendidikan?: string;
  tahun_pend?: number | null;
  password?: string;
}

interface DeleteModalProps {
  isOpen: boolean;
  pegawai: any;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteModal({ isOpen, pegawai, onClose, onConfirm }: DeleteModalProps) {
  if (!isOpen || !pegawai) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Konfirmasi Penghapusan</h3>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin menghapus data pegawai <strong>{pegawai.nama_pegawai}</strong>? 
              Tindakan ini tidak dapat diurungkan.
            </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}



export default function DetailPegawai() {
  const params = useParams();
  const router = useRouter();
  const nup = Array.isArray(params?.nup) ? params.nup[0] : params?.nup;
  const [pegawai, setPegawai] = useState<Pegawai | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    pegawai: null as Pegawai | null
  });

  const [activityLog, setActivityLog] = useState<{suratTugas: any[]; training: any[]}>({ suratTugas: [], training: [] });

  // State for CV Generator
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'docx'>('pdf');

  const handleDownload = async (format: 'pdf' | 'docx') => {
  if (!pegawai) return;
  setIsDownloading(true);
  setShowDropdown(false);
  
  try {
    let endpoint = '';
    let filename = `CV-${pegawai.nup}`;
    
    if (format === 'docx') {
      endpoint = '/api/cv/generate';
      filename += '.docx';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nup, format }),
      });
      
      if (!res.ok) throw new Error('Gagal generate CV');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } else {
      endpoint = `/api/cv/generate-pdf/${nup}`;
      filename += '.pdf';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format }),
      });
      
      if (!res.ok) throw new Error('Gagal generate CV');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
  } catch (err) {
    alert('Gagal download CV!');
  } finally {
    setIsDownloading(false);
  }
};

  useEffect(() => {
    if (!nup) return;
    setLoading(true);
    setError(null);
    fetch(`/api/pegawai/${nup}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Data pegawai tidak ditemukan');
        const data = await res.json();
        
        // ✅ PERBAIKAN: Debug log untuk melihat struktur data
        console.log('Data dari API:', data);
        console.log('Pengalaman kerja:', data.pengalaman_kerja);
        
        // Ensure kualifikasi and pengalaman_kerja are always arrays
        setPegawai({
          ...data,
          kualifikasi: Array.isArray(data.kualifikasi) ? data.kualifikasi : [],
          pengalaman_kerja: Array.isArray(data.pengalaman_kerja) ? data.pengalaman_kerja : [],
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    
      // Fetch activity log (surat tugas & training)
    fetch(`/api/pegawai/${nup}/activity-log`)
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setActivityLog(data);
      })
      .catch(() => {});
  }, [nup]);


  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = () => {
    setDeleteModal({
      isOpen: true,
      pegawai: pegawai
    });
  };

  const confirmDelete = async () => {
    if (!pegawai) return;
    try {
      // Call API to delete pegawai
      const res = await fetch(`/api/pegawai/${pegawai.nup}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus data pegawai');
      alert('Data pegawai berhasil dihapus!');
      setDeleteModal({ isOpen: false, pegawai: null });
      router.push('/dashboard/admin');
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menghapus data!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-blue-900 font-bold text-lg">Memuat data pegawai...</div>
      </div>
    );
  }
  if (error || !pegawai) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-red-600 font-bold text-lg mb-4">{error || 'Data pegawai tidak ditemukan.'}</div>
        <Link href="/dashboard/admin" className="px-4 py-2 bg-blue-900 text-white rounded-lg font-bold">Kembali ke Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-white shadow border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/admin"
                className="p-2 hover:bg-blue-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-blue-900" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Detail Pegawai</h1>
                <p className="text-gray-600">Informasi lengkap data pegawai</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/admin/edit-pegawai/${pegawai.nup}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-bold shadow"
              >
                <Edit className="w-4 h-4" />
                Edit Data
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold shadow"
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow p-8 mb-8 border border-blue-100">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-blue-900">{pegawai.nama_pegawai}</h2>
              <p className="text-lg text-gray-600">{pegawai.jabatan}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-400 font-bold">NUP</div>
              <div className="text-lg font-bold text-blue-900">{pegawai.nup}</div>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  pegawai.status_pegawai === 'KOMERBA' ? 'bg-green-100 text-green-800' :
                  pegawai.status_pegawai === 'PKWTT' ? 'bg-yellow-100 text-yellow-800' :
                  pegawai.status_pegawai === 'PKWT' ? 'bg-yellow-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {pegawai.status_pegawai}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Informasi Pribadi */}
            <div className="bg-white rounded-xl shadow p-8 border border-blue-100">
              <h3 className="text-lg font-bold text-blue-900 mb-4">Data Diri</h3>
              <div className="flex flex-col gap-2">
                <div>
                  <div className="text-xs text-gray-500 mb-1">NUP</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{pegawai.nup}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Status/Jabatan Pegawai</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{pegawai.status_pegawai || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Nama Lengkap</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{pegawai.nama_pegawai}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Email</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{pegawai.email || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Tempat Lahir</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{pegawai.tempat_lahir || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Tanggal Lahir</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{formatDate(pegawai.tanggal_lahir)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Kewarganegaraan</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{pegawai.warga_negara || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Agama</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{pegawai.agama || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">No. Telepon</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{pegawai.no_telepon || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Alamat</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{pegawai.alamat || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Jenjang Pendidikan</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{pegawai.jenjang_pend || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Pendidikan</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{pegawai.pendidikan || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Tahun Pendidikan</div>
                  <div className="bg-blue-50 rounded px-3 py-2 mb-2 text-black">{pegawai.tahun_pend || '-'}</div>
                </div>
              </div>
            </div>
            {/* Kualifikasi & Keahlian */}
            <div className="bg-white rounded-xl shadow p-8 border border-blue-100">
              <h3 className="text-lg font-bold text-blue-900 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-400" />
                Kualifikasi & Keahlian
              </h3>
              <div className="space-y-6">
                {(pegawai.kualifikasi?.length ?? 0) === 0 ? (
                  <span className="text-sm text-blue-400">(Belum ada data)</span>
                ) : (
                  (pegawai.kualifikasi || []).map((kual, index) => (
                    <div key={kual.id_pelatihan} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-blue-900">{kual.nama_pelatihan}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-blue-400">{kual.tahun}</span>
                          <div className="whitespace-nowrap">
                            {kual.status === "ON_GOING" && <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-800 font-semibold text-xs whitespace-nowrap">On Going</span>}
                            {kual.status === "VALID" && <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 font-semibold text-xs whitespace-nowrap">Valid</span>}
                            {kual.status === "EXPIRED" && <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-800 font-semibold text-xs whitespace-nowrap">Expired</span>}
                            {!["ON_GOING","VALID","EXPIRED"].includes(kual.status) && <span className="inline-block whitespace-nowrap">{kual.status}</span>}
                          </div>
                        </div>
                      </div>
                      <p className="text-blue-600 font-bold mb-2">{kual.penyelenggara}</p>
                      <p className="text-blue-900 text-sm leading-relaxed">{kual.lokasi || '-'}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* ✅ PERBAIKAN: Pengalaman Kerja section dengan field yang benar */}
            <div className="bg-white rounded-xl shadow p-8 border border-blue-100">
              <h3 className="text-lg font-bold text-blue-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                Pengalaman Kerja
              </h3>
              <div className="space-y-6">
                {(pegawai.pengalaman_kerja?.length ?? 0) === 0 ? (
                  <span className="text-sm text-blue-400">(Belum ada data)</span>
                ) : (
                  (pegawai.pengalaman_kerja || []).map((exp, index) => (
                    <div key={exp.id || index} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-blue-900">{exp.pengalaman_kerja}</h4>
                        <span className="text-sm text-blue-400">{exp.tahun || '-'}</span>
                      </div>
                      <p className="text-blue-600 font-bold mb-2">{exp.perusahaan}</p>
                      <p className="text-blue-900 text-sm leading-relaxed">{exp.lokasi || '-'}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-8 border border-blue-100">
              <h3 className="text-lg font-bold text-blue-900 mb-6">Aksi Cepat</h3>
              <div className="space-y-3">
              {/* CV Generator Button */}
              <div className="relative inline-block w-full">
                <div className="flex">
                  <button
                    onClick={() => handleDownload(downloadFormat)}
                    disabled={isDownloading}
                    className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white px-4 py-2 rounded-l-lg transition-colors font-semibold w-full"
                  >
                    {isDownloading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {isDownloading ? 'Generating...' : `Download ${downloadFormat.toUpperCase()}`}
                  </button>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    disabled={isDownloading}
                    className="bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white px-2 py-2 rounded-r-lg border-l border-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setDownloadFormat('docx');
                          handleDownload('docx');
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-black">Download CV as DOCX</span>
                      </button>
                      <button
                        onClick={() => {
                          setDownloadFormat('pdf');
                          handleDownload('pdf');
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                      >
                        <File className="w-4 h-4 text-red-600" />
                        <span className="text-black">Download CV as PDF</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
                <button
                  onClick={() => window.print()}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold shadow"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Cetak Data
                </button>
                <button
                  onClick={() => {
                    const mailtoLink = `mailto:${pegawai.email}?subject=Dari%20HR%20Department`;
                    window.open(mailtoLink, '_blank');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition font-bold shadow"
                >
                  <Mail className="w-4 h-4" />
                  Kirim Email
                </button>
                <button
                  onClick={() => {
                    const phoneNumber = pegawai.no_telepon.replace(/\D/g, '');
                    const whatsappLink = `https://wa.me/${phoneNumber}`;
                    window.open(whatsappLink, '_blank');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-bold shadow"
                >
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </button>
              </div>
            </div>
            {/* Activity Log */}
            <div className="bg-white rounded-xl shadow p-8 border border-blue-100">
              <h3 className="text-lg font-bold text-blue-900 mb-6">Log Aktivitas</h3>
              <div className="space-y-4">
                {/* 1. Data diupdate (kualifikasi/pengalaman kerja) */}
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-blue-900 font-bold">Data kualifikasi/pengalaman kerja diupdate</p>
                    <p className="text-xs text-blue-400">{formatDate(pegawai.updated_at)}</p>
                  </div>
                </div>
                {/* 2. Surat Tugas yang diajukan */}
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-blue-900 font-bold">Surat Tugas yang diajukan</p>
                    {activityLog.suratTugas.length === 0 ? (
                      <p className="text-xs text-blue-400">(Belum ada data)</p>
                    ) : (
                      <ul className="text-xs text-blue-900 list-disc ml-4">
                        {activityLog.suratTugas.map((st, idx) => (
                          <li key={st.id || idx}>
                            {st.nomor_surat ? `No. ${st.nomor_surat}` : 'Surat Tugas'} - {st.status ? st.status : ''} {st.createdAt ? `(${formatDate(st.createdAt)})` : ''}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {/* 3. Training berjalan */}
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-blue-900 font-bold">Training berjalan</p>
                    {activityLog.training.length === 0 ? (
                      <p className="text-xs text-blue-400">(Belum ada data)</p>
                    ) : (
                      <ul className="text-xs text-blue-900 list-disc ml-4">
                        {activityLog.training.map((tr, idx) => (
                          <li key={tr.id_pelatihan || idx}>
                            {tr.nama_pelatihan || 'Pelatihan'} - {tr.penyelenggara || ''} {tr.tanggal_awal ? `(${formatDate(tr.tanggal_awal)})` : ''}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        pegawai={deleteModal.pegawai}
        onClose={() => setDeleteModal({ isOpen: false, pegawai: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
}