// app/sertifikat/my-submissions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SertifikatData } from '@/lib/constants/sertifikatConstants';
import { groupSubmissionsByParentId, getTotalPages } from '@/lib/utils/sertifikatGrouping';


// Helper: parsing nomor seperti .../2025-03-06 (page=03, total=06)
function parseSuffix(nomor: string | null | undefined) {
  if (!nomor) return null;
  const m = nomor.match(/-(\d+)-(\d+)$/);
  if (!m) return null;
  return { page: Number(m[1]), total: Number(m[2]) };
}

export default function MySubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<SertifikatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pengaju, setPengaju] = useState<{ nup: string; nama_pegawai: string; jabatan?: string | null; email?: string | null } | null>(null);
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SertifikatData | null>(null);
  const [formState, setFormState] = useState({
    nomorKontrak: '', kompetensi: '', pasar: '', kodeProduksiM: '', kodeProduksiE: '', jumlahHalaman: '' as any, linkLaporan: ''
  });
  const [resubmitProcessing, setResubmitProcessing] = useState(false);

  useEffect(() => {
    fetchSubmissions();
    (async () => {
      try {
        const res = await fetch('/api/sertifikat/me');
        if (!res.ok) return;
        const j = await res.json();
        if (j.data) setPengaju(j.data);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/sertifikat/my-submissions');
      
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/sertifikat/login');
          return;
        }
        throw new Error('Failed to fetch');
      }

      const data = await res.json();
      setSubmissions(data.data);
    } catch (err) {
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    const labels = {
      PENDING_APPROVAL: 'Menunggu Persetujuan',
      APPROVED: 'Disetujui',
      REJECTED: 'Ditolak'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Memuat data...</div>
      </div>
    );
  }

  const grouped = groupSubmissionsByParentId(submissions);

  return (
    <>
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Pengajuan Sertifikat Saya
          </h1>
          <button
            onClick={() => router.push('/sertifikat/form')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            + Buat Pengajuan Baru
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {grouped.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Belum ada pengajuan
            </h3>
            <p className="text-gray-600 mb-6">
              Buat pengajuan sertifikat pertama Anda
            </p>
            <button
              onClick={() => router.push('/sertifikat/form')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Buat Pengajuan
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map((group, idx) => {
              const first = group[0];
              const isMultiPage = group.length > 1;
              const suffix = parseSuffix(first.nomorSertifikat);
              const totalPages = suffix?.total || group.length;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {first.nomorKontrak}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {first.kodeProduksiM || first.kodeProduksiE} -{' '}
                        {first.kompetensi} - {first.pasar}
                      </p>
                    </div>
                    {getStatusBadge(first.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">Tanggal Pengajuan:</span>
                      <p className="font-semibold text-black">
                        {new Date(first.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    {(isMultiPage || first.status === 'PENDING_APPROVAL') && (
                      <div>
                        <span className="text-gray-600 ">Total Halaman:</span>
                        <p className="font-semibold text-black">{totalPages}</p>
                      </div>
                    )}
                  </div>

                  {first.status === 'APPROVED' && first.nomorSertifikat && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Nomor Sertifikat:
                      </p>

                      <div className="space-y-2">
                        {group.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-gray-200">
                            <p className="text-xs font-mono text-gray-800 break-all flex-1 mr-4">
                              {item.nomorSertifikat}
                            </p>
                            {item.qrCodeUrl && (
                              <a 
                                href={item.qrCodeUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                                QR Code
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {first.status === 'REJECTED' && first.keterangan && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-red-700 mb-1">
                        Alasan Penolakan:
                      </p>
                      <p className="text-sm text-gray-700">{first.keterangan}</p>
                    </div>
                  )}

                  {first.status === 'REJECTED' && (
                    <div className="pt-4 border-t border-gray-200 flex gap-3">
                      <button onClick={() => {
                        // open resubmit modal prefilled with first record
                        setEditingItem(first);
                        setFormState({
                          nomorKontrak: first.nomorKontrak || '',
                          kompetensi: first.kompetensi || '',
                          pasar: first.pasar || '',
                          kodeProduksiM: first.kodeProduksiM || '',
                          kodeProduksiE: first.kodeProduksiE || '',
                          jumlahHalaman: first.jumlahHalaman ? String(first.jumlahHalaman) : '',
                          linkLaporan: first.linkLaporan || ''
                        });
                        setShowResubmitModal(true);
                      }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">Ajukan Ulang</button>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href={first.linkLaporan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
                    >
                      <span>Lihat Laporan Inspeksi</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    {/* Resubmit Modal */}
    {showResubmitModal && editingItem && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Ajukan Ulang Pengajuan</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nomor PO/WO/SO/KONTRAK</label>
              <input value={formState.nomorKontrak} onChange={(e) => setFormState(s => ({ ...s, nomorKontrak: e.target.value }))} className="w-full px-3 py-2 border rounded-md text-black" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Kompetensi (L##)</label>
              <input value={formState.kompetensi} onChange={(e) => setFormState(s => ({ ...s, kompetensi: e.target.value }))} className="w-full px-3 py-2 border rounded-md text-black" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Pasar (P#)</label>
              <input value={formState.pasar} onChange={(e) => setFormState(s => ({ ...s, pasar: e.target.value }))} className="w-full px-3 py-2 border rounded-md text-black" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Jumlah Halaman</label>
              <input value={formState.jumlahHalaman} onChange={(e) => setFormState(s => ({ ...s, jumlahHalaman: e.target.value }))} className="w-full px-3 py-2 border rounded-md text-black" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Kode Produksi (M)</label>
              <input value={formState.kodeProduksiM} onChange={(e) => setFormState(s => ({ ...s, kodeProduksiM: e.target.value }))} className="w-full px-3 py-2 border rounded-md text-black" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Kode Produksi (E)</label>
              <input value={formState.kodeProduksiE} onChange={(e) => setFormState(s => ({ ...s, kodeProduksiE: e.target.value }))} className="w-full px-3 py-2 border rounded-md text-black" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Link Laporan (Google Drive)</label>
              <input value={formState.linkLaporan} onChange={(e) => setFormState(s => ({ ...s, linkLaporan: e.target.value }))} className="w-full px-3 py-2 border rounded-md text-black" />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowResubmitModal(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg">Batal</button>
            <button onClick={async () => {
              // submit update
              setResubmitProcessing(true);
              try {
                const payload = {
                  nomorKontrak: formState.nomorKontrak,
                  kompetensi: formState.kompetensi,
                  pasar: formState.pasar,
                  kodeProduksiM: formState.kodeProduksiM || null,
                  kodeProduksiE: formState.kodeProduksiE || null,
                  jumlahHalaman: formState.jumlahHalaman ? Number(formState.jumlahHalaman) : null,
                  linkLaporan: formState.linkLaporan
                };

                const res = await fetch(`/api/sertifikat/update/${editingItem!.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });

                if (!res.ok) {
                  const j = await res.json().catch(() => ({}));
                  alert(j.error || 'Gagal mengajukan ulang');
                  setResubmitProcessing(false);
                  return;
                }

                // success
                setShowResubmitModal(false);
                setEditingItem(null);
                await fetchSubmissions();
                alert('Pengajuan berhasil diajukan ulang');
              } catch (e) {
                console.error('Resubmit error', e);
                alert('Terjadi kesalahan');
              } finally {
                setResubmitProcessing(false);
              }
            }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold">{resubmitProcessing ? 'Mengirim...' : 'Ajukan Ulang'}</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}